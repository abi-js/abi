import 'buno.js';
import container from './container';
import { Context } from './context';
import { match } from './matcher';
import type { Options, Pattern, Resolver, Result } from './types';

export class Route {
  protected options: Options = {};
  #pattern: Pattern;
  #resolver: Resolver;

  constructor(pattern: Pattern, resolver: Resolver) {
    this.#pattern = pattern;
    this.#resolver = resolver;
  }

  get pattern(): string {
    return this.#pattern;
  }

  get resolver(): Resolver {
    return this.#resolver;
  }

  static from(pattern: Pattern, resolver: Resolver): Route {
    return new Route(pattern, resolver);
  }

  public matches(subject: string): boolean {
    const options = match(subject, this.pattern);
    if (options !== false) {
      this.options = options;

      return true;
    }
    this.options = {};

    return false;
  }

  public resolve(request: Request): Response {
    const context = new Context(request);
    const options = this.options;
    const result = container({ request, options }).call<Result>(
      this.resolver,
      options,
    );
    return context.render(result);
  }
}
