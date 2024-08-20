import type { FileSystemContract } from './fs';
import { Method } from './method';
import { get_extension_type } from './mime';
import reflex from './reflex';

export type Handler = (request: Request) => Response | Promise<Response>;

export abstract class Router implements RouterContract {
  abstract handle: Handler;
}

export interface FileRouterContract extends RouterContract {
  get fs(): FileSystemContract;
  set fs(fs: FileSystemContract);
}

export interface RouterContract {
  handle: Handler;
}

export abstract class BaseFileRouter implements FileRouterContract {
  public constructor(public fs: FileSystemContract) {
    this.handle = this.handle.bind(this);
  }
  abstract handle(request: Request): Response;
}

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

export type Result = number | string | object | Response;
export type Pattern = string;
export type Actions = Record<Method, Action[]>;
export type Resolver = (...args: any[]) => Result;

export class Action {
  protected options: Options = {};

  constructor(
    protected pattern: Pattern,
    protected resolver: Resolver,
  ) {}

  public matches(subject: string): boolean {
    let pattern = this.normalizedPattern();
    subject = this.normalize(subject);
    if (pattern === subject) {
      return true;
    }

    const params: Parameter[] = [];

    const re = /\[([a-z]+)(?:\s*:\s*(number|string))?(?:\s*\=\s*(\w+))?\]/;
    pattern = pattern.replace('(', '(?:');
    while (re.test(pattern)) {
      const m = re.exec(pattern)!;
      const search = m[0];
      const type = m[2] === 'number' ? 'number' : 'string';
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
    const result = reflex({ request, options }).call<Result>(
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

export interface ActionRouterContract extends RouterContract {
  add(method: Method, action: Action): this;

  on(method: Method, pattern: Pattern, resolver: Resolver): this;

  fetch(pattern: Pattern, resolver: Resolver): this;

  get(pattern: Pattern, resolver: Resolver): this;

  post(pattern: Pattern, resolver: Resolver): this;

  put(pattern: Pattern, resolver: Resolver): this;

  delete(pattern: Pattern, resolver: Resolver): this;
}

export abstract class BaseActionRouter {
  protected actions: Actions = {
    [Method.get]: [],
    [Method.head]: [],
    [Method.post]: [],
    [Method.put]: [],
    [Method.delete]: [],
    [Method.acl]: [],
    [Method.baseline_control]: [],
    [Method.bind]: [],
    [Method.checkin]: [],
    [Method.checkout]: [],
    [Method.connect]: [],
    [Method.copy]: [],
    [Method.label]: [],
    [Method.link]: [],
    [Method.lock]: [],
    [Method.merge]: [],
    [Method.mkactivity]: [],
    [Method.mkcalendar]: [],
    [Method.mkcol]: [],
    [Method.mkredirectref]: [],
    [Method.mkworkspace]: [],
    [Method.move]: [],
    [Method.options]: [],
    [Method.orderpatch]: [],
    [Method.patch]: [],
    [Method.pri]: [],
    [Method.propfind]: [],
    [Method.proppatch]: [],
    [Method.rebind]: [],
    [Method.report]: [],
    [Method.search]: [],
    [Method.trace]: [],
    [Method.unbind]: [],
    [Method.uncheckout]: [],
    [Method.unlink]: [],
    [Method.unlock]: [],
    [Method.update]: [],
    [Method.updateredirectref]: [],
    [Method.version_control]: [],
  };

  constructor() {
    this.handle = this.handle.bind(this);
  }

  public add(method: Method, action: Action): this {
    this.actions[method].push(action);
    return this;
  }

  public on(method: Method, pattern: Pattern, resolver: Resolver) {
    this.add(method, new Action(pattern, resolver));
    return this;
  }

  public fetch(pattern: Pattern, resolver: Resolver): this {
    for (const method in this.actions) {
      this.on(method as Method, pattern, resolver);
    }
    return this;
  }

  public get(pattern: Pattern, resolver: Resolver): this {
    return this.on(Method.get, pattern, resolver);
  }

  public head(pattern: Pattern, resolver: Resolver): this {
    return this.on(Method.head, pattern, resolver);
  }

  public post(pattern: Pattern, resolver: Resolver): this {
    return this.on(Method.post, pattern, resolver);
  }

  public put(pattern: Pattern, resolver: Resolver): this {
    return this.on(Method.put, pattern, resolver);
  }

  public patch(pattern: Pattern, resolver: Resolver): this {
    return this.on(Method.patch, pattern, resolver);
  }

  public delete(pattern: Pattern, resolver: Resolver): this {
    return this.on(Method.delete, pattern, resolver);
  }

  public find(method: string, action: string): Action | null {
    for (const [_method, actions] of Object.entries(this.actions)) {
      if (_method.toString() === method) {
        for (const _action of actions) {
          if (_action.matches(action)) {
            return _action;
          }
        }
      }
    }
    return null;
  }

  abstract handle(request: Request): Response;
}
