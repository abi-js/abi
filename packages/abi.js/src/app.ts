import 'buno.js';
import {
  type Config,
  type UserConfig,
  defaultConfig,
  defineConfig,
} from './config';
import { Context } from './context';
import { DELETE, GET, HEAD, type Method, PATCH, POST, PUT } from './method';
import { Router } from './router';
import { joinPath } from './runtime';
import { sendFile } from './send';
import { Server } from './server';
import type {
  Address,
  ServeHandler as Handler,
  Hostname,
  Pattern,
  Port,
  Resolver,
} from './types';

export class Application {
  #config: Config;
  #router: Router;
  #server: Server;

  constructor(config: UserConfig = defaultConfig) {
    this.fetch = this.fetch.bind(this);
    this.#config = defineConfig(config);
    this.#router = new Router();
    this.#server = new Server(this.#config.root, this.#config.assets);
  }

  context(request: Request): Context {
    return new Context(request);
  }

  use(handler: Handler, ...handlers: Handler[]): this {
    this.#server.pipe(handler, ...handlers);
    return this;
  }

  get(pattern: Pattern, resolver: Resolver, ...resolvers: Resolver[]): this {
    this.#router.add(GET, pattern, resolver, ...resolvers);
    return this;
  }

  head(pattern: Pattern, resolver: Resolver, ...resolvers: Resolver[]): this {
    this.#router.add(HEAD, pattern, resolver, ...resolvers);
    return this;
  }

  post(pattern: Pattern, resolver: Resolver, ...resolvers: Resolver[]): this {
    this.#router.add(POST, pattern, resolver, ...resolvers);
    return this;
  }

  put(pattern: Pattern, resolver: Resolver, ...resolvers: Resolver[]): this {
    this.#router.add(PUT, pattern, resolver, ...resolvers);
    return this;
  }

  patch(pattern: Pattern, resolver: Resolver, ...resolvers: Resolver[]): this {
    this.#router.add(PATCH, pattern, resolver, ...resolvers);
    return this;
  }

  delete(pattern: Pattern, resolver: Resolver, ...resolvers: Resolver[]): this {
    this.#router.add(DELETE, pattern, resolver, ...resolvers);
    return this;
  }

  on(
    method: Method,
    pattern: Pattern,
    resolver: Resolver,
    ...resolvers: Resolver[]
  ): this {
    this.#router.add(method, pattern, resolver, ...resolvers);
    return this;
  }

  serve(path: string, base?: string): this {
    return this.use((request: Request): Response => {
      const context = this.context(request);
      const urlPathname = context.pathname;

      if (base && !urlPathname.startsWith(base)) {
        return context.abort(400);
      }

      const filename = joinPath(this.#config.root, path);

      return this.#send(filename, request);
    });
  }

  handle(root: string, base?: string): this {
    return this.use((request: Request): Response => {
      const context = this.context(request);
      const urlPathname = context.pathname;

      if (base && !urlPathname.startsWith(base)) {
        return context.abort(400);
      }

      const filename = base
        ? urlPathname.replace(base, root)
        : joinPath(root, urlPathname);

      return this.#send(filename, request);
    });
  }

  routes(): Handler {
    return (request: Request): Response => {
      const context = this.context(request);
      const pathname = context.pathname;
      const route = this.#router.get(context.method, pathname);
      if (route) {
        context.log(`Handle ${context.method} ${pathname}`);
        return route.resolve(request);
      }

      return context.abort(
        404,
        `Route ${context.method} ${pathname} not found.`,
      );
    };
  }

  useRoutes(): this {
    this.use(this.routes());

    return this;
  }

  run(): void {
    this.start();
  }

  start(): void {
    this.useRoutes();
    this.#server.start();
  }

  fetch(request: Request): Promise<Response> {
    this.useRoutes();
    return this.#server.fetch(request);
  }

  listen(port: Port): void;
  listen(hostname: Hostname): void;
  listen(port: Port, hostname: Hostname): void;
  listen(address: Address): void;
  listen(arg1?: any, arg2?: any): void {
    this.useRoutes();
    this.#server.listen(arg1, arg2);
  }

  #send(filename: string, request: Request): Response {
    return sendFile(filename, request);
  }
}

export function app(config: UserConfig): Application {
  return new Application(config);
}
