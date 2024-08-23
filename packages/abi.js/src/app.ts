import 'buno.js';
import {
  type Config,
  type UserConfig,
  defaultConfig,
  defineConfig,
} from './config';
import { DELETE, GET, HEAD, PATCH, POST, PUT } from './method';
import { get_extension_type } from './mime';
import type { Pattern, Resolver } from './route';
import { Router } from './router';
import { type Handler, Server } from './server';
import { fileExists, joinPath, pathinfo, readFile } from './utils';

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

      return this.#send(filename);
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

      return this.#send(filename);
    });
  }

  fetch(request: Request): Promise<Response> {
    this.use((request: Request): Response => {
      const url = new URL(request.url);
      const pathname = decodeURIComponent(url.pathname);
      const route = this.#router.get(request.method, pathname);
      if (route) {
        console.log(`Handle ${request.method} ${pathname}`);
        return route.resolve(request);
      }

      return this.#abort(404, `Route ${request.method} ${pathname} not found.`);
    });

    return this.#server.fetch(request);
  }

  #send(filename: string): Response {
    if (fileExists(filename)) {
      const { isFile, extension, realname, size } = pathinfo(filename);
      const type = get_extension_type(extension);
      if (isFile) {
        console.log(`Serve static file ${realname}`);
        return new Response(readFile(realname), {
          headers: {
            'Content-Type': type,
            'Content-Length': size.toString(),
          },
        });
      }
    }

    return this.#abort(404, `File ${filename} not found`);
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
