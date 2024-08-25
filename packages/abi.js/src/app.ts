import 'buno.js';
import {
  type Config,
  type UserConfig,
  defaultConfig,
  defineConfig,
} from './config';
import { DELETE, GET, HEAD, PATCH, POST, PUT } from './method';
import type { Pattern, Resolver } from './route';
import { Router } from './router';
import { joinPath } from './runtime';
import { sendFile } from './send';
import { Server } from './server';
import type { Address, ServeHandler as Handler, Hostname, Port } from './types';

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

  use(handler: Handler): this {
    this.#server.pipe(handler);
    return this;
  }

  get(pattern: Pattern, resolver: Resolver): this {
    this.#router.add(GET, pattern, resolver);
    return this;
  }

  head(pattern: Pattern, resolver: Resolver): this {
    this.#router.add(HEAD, pattern, resolver);
    return this;
  }

  post(pattern: Pattern, resolver: Resolver): this {
    this.#router.add(POST, pattern, resolver);
    return this;
  }

  put(pattern: Pattern, resolver: Resolver): this {
    this.#router.add(PUT, pattern, resolver);
    return this;
  }

  patch(pattern: Pattern, resolver: Resolver): this {
    this.#router.add(PATCH, pattern, resolver);
    return this;
  }

  delete(pattern: Pattern, resolver: Resolver): this {
    this.#router.add(DELETE, pattern, resolver);
    return this;
  }

  serve(path: string, base?: string): this {
    return this.use((request: Request): Response => {
      const url = new URL(request.url);
      const urlPathname = decodeURIComponent(url.pathname);

      if (base && !urlPathname.startsWith(base)) {
        return this.#abort(400);
      }

      const filename = joinPath(this.#config.root, path);

      return this.#send(filename, request);
    });
  }

  handle(root: string, base?: string): this {
    return this.use((request: Request): Response => {
      const url = new URL(request.url);
      const urlPathname = decodeURIComponent(url.pathname);

      if (base && !urlPathname.startsWith(base)) {
        return this.#abort(400);
      }

      const filename = base
        ? urlPathname.replace(base, root)
        : joinPath(root, urlPathname);

      return this.#send(filename, request);
    });
  }

  routes(): Handler {
    return (request: Request): Response => {
      const url = new URL(request.url);
      const pathname = decodeURIComponent(url.pathname);
      const route = this.#router.get(request.method, pathname);
      if (route) {
        console.log(`Handle ${request.method} ${pathname}`);
        return route.resolve(request);
      }

      return this.#abort(404, `Route ${request.method} ${pathname} not found.`);
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

  #abort(code = 500, message?: string): Response {
    const err = `Error ${code}${message ? `: ${message}` : ''}`;
    console.error(err);

    return new Response(err, {
      status: code,
    });
  }
}

export function app(config: UserConfig): Application {
  return new Application(config);
}
