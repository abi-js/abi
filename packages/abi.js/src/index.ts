import 'buno.js';
import { path } from 'buno.js';
import {
  type Config,
  type UserConfig,
  defaultConfig,
  defineConfig,
} from './config';
import type { Handler, Pattern, Resolver } from './server';
import { ActionRouter, FileRouter } from './server';

export class Application {
  #config: Config;
  #routesHandler: ActionRouter;
  #assetsHandler: FileRouter;

  constructor(config: UserConfig = defaultConfig) {
    this.fetch = this.fetch.bind(this);
    this.#config = defineConfig(config);
    this.#routesHandler = new ActionRouter();

    const assets = path.join(this.#config.root, this.#config.assets);
    this.#assetsHandler = new FileRouter(assets);
  }

  get(pattern: Pattern, resolver: Resolver): this {
    this.#routesHandler.get(pattern, resolver);
    return this;
  }

  post(pattern: Pattern, resolver: Resolver): this {
    this.#routesHandler.post(pattern, resolver);
    return this;
  }

  put(pattern: Pattern, resolver: Resolver): this {
    this.#routesHandler.put(pattern, resolver);
    return this;
  }

  delete(pattern: Pattern, resolver: Resolver): this {
    this.#routesHandler.delete(pattern, resolver);
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
