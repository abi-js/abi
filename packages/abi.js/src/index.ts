import 'buno.js';
import { join } from 'node:path';
import type { Handler, Pattern, Resolver } from './base/routing';
import { FileSystem } from './bun/fs';
import { ActionRouter, FileRouter } from './bun/routing';

export class Application {
  #routesHandler: ActionRouter;
  #assetsHandler: FileRouter;

  constructor() {
    this.fetch = this.fetch.bind(this);
    this.#routesHandler = new ActionRouter();

    const assets_path = join(process.cwd(), 'assets');
    const assets = new FileSystem(assets_path);
    this.#assetsHandler = new FileRouter(assets);
  }

  onGet(pattern: Pattern, resolver: Resolver): this {
    this.#routesHandler.onGet(pattern, resolver);
    return this;
  }

  onPost(pattern: Pattern, resolver: Resolver): this {
    this.#routesHandler.onPost(pattern, resolver);
    return this;
  }

  onPut(pattern: Pattern, resolver: Resolver): this {
    this.#routesHandler.onPut(pattern, resolver);
    return this;
  }

  onDelete(pattern: Pattern, resolver: Resolver): this {
    this.#routesHandler.onDelete(pattern, resolver);
    return this;
  }

  async fetch(request: Request): Promise<Response> {
    const handlers: Handler[] = [
      this.#routesHandler.handle,
      this.#assetsHandler.handle,
    ];

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

export function app(): Application {
  return new Application();
}

export { Application as Abi, app as abi };

const _app = app();

export default _app;
