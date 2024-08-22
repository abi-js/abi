import container from './container';
import { get_extension_type } from './mime';

export type QueryType = 'string' | 'number';
export type QueryValue = string | number;
export type Index = number;
export type Name = string;
export type Key = Index | Name;
export type Argument = { index: Index; value: QueryValue };
export type Parameter = { name: Name; type: QueryType; value: QueryValue };
export type Option = { key: Key; value: QueryValue };
export type Arguments = Record<Index, QueryValue>;
export type Parameters = Record<Name, QueryValue>;
export type Options = Record<Key, QueryValue>;

export type Result = boolean | number | string | object | Response;
export type Path = string;
export type Pattern = string;
export type Resolver = (...args: any[]) => Result;

export class Route {
  protected options: Options = {};

  constructor(
    protected pattern: Pattern,
    protected resolver: Resolver<T>,
  ) {}

  static from(pattern: Pattern, resolver: Resolver): Route {
    return new Route(context, pattern, resolver);
  }

  public matches(subject: string): boolean {
    let pattern = this.normalizedPattern();
    subject = this.normalize(subject);
    if (pattern === subject) {
      return true;
    }

    const params: Parameter[] = [];

    const re =
      /\:([a-z]+)(?:\s*\<\s*(num(?:ber)|str(?:ing))\s*\>)?(?:\s*\=\s*(\w+))?/;
    pattern = pattern.replace('(', '(?:');
    while (re.test(pattern)) {
      const m = re.exec(pattern)!;
      const search = m[0];
      const type = m[2] in ['number', 'num'] ? 'number' : 'string';
      const value = type === 'number' ? Number(m[3]) : m[3];
      const param: Parameter = {
        name: m[1],
        type,
        value,
      };
      params.push(param);
      const replace = `(${
        param.type === 'number' ? '[0-9]+' : '[^\\/\\[\\]]+'
      })${value === undefined ? '' : '?'}`;
      pattern = pattern.replace(search, replace);
    }

    pattern = pattern.replace('/', '\\/');
    pattern = `^${pattern}$`;

    const matches = subject.match(pattern);
    if (matches) {
      let i = 0;
      for (const param of params) {
        let value = matches[i + 1] || param.value;
        if (param.type === 'number') {
          value = Number(value);
        }
        this.options[i++] = value;
        this.options[param.name] = value;
      }
      return true;
    }

    return false;
  }

  protected normalize(subject: string): string {
    subject = subject.trim();
    if (subject.startsWith('/')) {
      subject = subject.substring(1);
    }
    if (subject.endsWith('/')) {
      subject = subject.substring(0, subject.length - 1);
    }
    return subject;
  }

  protected normalizedPattern(): string {
    return this.normalize(this.pattern);
  }

  public resolve(request: Request): Response {
    const options = this.options;
    const result = container({ request, options }).call<Result>(
      this.resolver,
      options,
    );
    return this.render(result);
  }

  public render(result: Result): Response {
    if (result instanceof Response) {
      return result;
    }

    if (typeof result === 'string') {
      return new Response(result);
    }

    if (typeof result === 'number') {
      return new Response('', {
        status: result,
      });
    }

    return new Response(JSON.stringify(result), {
      headers: {
        'Content-Type': get_extension_type('json'),
      },
    });
  }
}
