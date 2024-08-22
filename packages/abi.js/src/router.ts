import type { Method } from './method';
import { type Path, type Pattern, type Resolver, Route } from './route';

export type Routes = Map<Method, Set<Route>>;

export class Router {
  #routes: Routes;

  constructor() {
    this.#routes = new Map<Method, Set<Route>>();
  }

  public add(
    method: Method,
    pattern: Pattern,
    resolver: Resolver,
    ...resolvers: Resolver[]
  ): this {
    const _resolvers = [resolver, ...resolvers];

    let routes = new Set<Route>();
    for (const _resolver of _resolvers) {
      routes.add(new Route(pattern, _resolver));
    }

    const _routes = this.#routes.get(method);
    if (_routes) {
      routes = _routes.union(routes);
    }

    this.#routes.set(method, routes);

    return this;
  }

  public get(method: string, path: Path): Route | null {
    for (const [_method, routes] of this.#routes) {
      if (_method === method) {
        for (const route of routes) {
          if (route.matches(path)) {
            return route;
          }
        }
      }
    }
    return null;
  }
}
