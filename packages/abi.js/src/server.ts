import { path } from 'buno.js';
import type { Method } from './method';
import { get_extension_type } from './mime';
import type { Pattern, Resolver } from './route';
import { Router } from './router';
import { fileExists, pathinfo, readFile } from './utils';

export type Handler = (request: Request) => Response | Promise<Response>;

export class Server extends Router {
  #middlewares: Handler[] = [];

  constructor(
    protected root: string,
    protected assets = '',
  ) {
    super();
    this.run = this.run.bind(this);
    this.fetch = this.fetch.bind(this);
  }

  request(method: Method, pattern: Pattern, resolver: Resolver): this {
    this.addRoute(method, pattern, resolver);
    return this;
  }

  pipe(handler: Handler): this {
    this.#middlewares.push(handler);
    return this;
  }

  run(request: Request): Response {
    const url = new URL(request.url);
    const pathname = decodeURIComponent(url.pathname);
    const route = this.getRoute(request.method, pathname);
    if (route) {
      console.log(`Handle action ${pathname}`);
      return route.resolve(request);
    }

    return new Response(`Action ${pathname} not found`, {
      status: 404,
    });
  }

  handle(request: Request): Response {
    const url = new URL(request.url);
    const pathname = path.join(
      this.root,
      this.assets,
      decodeURIComponent(url.pathname),
    );

    if (fileExists(pathname)) {
      const fileinfo = pathinfo(pathname);
      if (fileinfo.isFile) {
        console.log(`Serve static file ${fileinfo.realname}`);
        return new Response(readFile(fileinfo.realname), {
          headers: {
            'Content-Type': get_extension_type(fileinfo.extension),
          },
        });
      }
    }

    return new Response(`File ${pathname} not found`, {
      status: 404,
    });
  }

  async fetch(request: Request): Promise<Response> {
    const handlers: Handler[] = [...this.#middlewares, this.run];

    for (const handler of handlers) {
      const response = await handler(request);

      if (response.ok) {
        return response;
      }
    }

    return new Response('Error 404', {
      status: 404,
    });
  }
}
