import 'buno.js';
import { path } from 'buno.js';
import {
  type Config,
  type UserConfig,
  defaultConfig,
  defineConfig,
} from './config';
import type { Handler, Pattern, Resolver } from './core/routing';
import { FileSystem } from './fs';
import { ActionRouter, FileRouter } from './routing';

export class Application {
  #config: Config;
  #routesHandler: ActionRouter;
  #assetsHandler: FileRouter;

  constructor(config: UserConfig = defaultConfig) {
    this.fetch = this.fetch.bind(this);
    this.#config = defineConfig(config);
    this.#routesHandler = new ActionRouter();

    const assets_path = path.join(
      this.#config.root,
      this.#config.assets,
    );
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

export function app(config: UserConfig): Application {
  return new Application(config);
}

export { Application as Abi, app as abi, type UserConfig as AbiConfig };

const _app = app(defaultConfig);

export default _app;
