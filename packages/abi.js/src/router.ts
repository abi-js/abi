import { DELETE, GET, HEAD, type Method, PATCH, POST, PUT } from './method';
import { type Path, type Pattern, type Resolver, Route } from './route';

export type Routes = Map<Method, Set<Route>>;

export class Router {
  #routes: Routes;

  constructor() {
    this.handle = this.handle.bind(this);
    this.#routes = new Set<Route>();
  }

  public addRoute(method: Method, pattern: Pattern, resolver: Resolver): Route {
    const route = Route(pattern, resolver);
    this.#routes.has(method)
      ? this.#routes.get(method)!.add(route)
      : this.#routes.set(method, new Set([route]));
    return route;
  }

  public getRoute(method: string, path: Path): Route | null {
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

  public get(pattern: Pattern, resolver: Resolver): Route {
    return this.addRoute(GET, pattern, resolver);
  }

  public head(pattern: Pattern, resolver: Resolver): Route {
    return this.addRoute(HEAD, pattern, resolver);
  }

  public post(pattern: Pattern, resolver: Resolver): Route {
    return this.addRoute(POST, pattern, resolver);
  }

  public put(pattern: Pattern, resolver: Resolver): Route {
    return this.addRoute(PUT, pattern, resolver);
  }

  public patch(pattern: Pattern, resolver: Resolver): Route {
    return this.addRoute(PATCH, pattern, resolver);
  }

  public delete(pattern: Pattern, resolver: Resolver): Route {
    return this.addRoute(DELETE, pattern, resolver);
  }
}
