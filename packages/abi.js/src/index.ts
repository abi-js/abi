import 'buno.js';
import {
  type Config,
  type UserConfig,
  defaultConfig,
  defineConfig,
} from './config';
import type { Pattern, Resolver } from './route';
import { Server } from './server';

export class Application {
  #config: Config;
  #server: Server;

  constructor(config: UserConfig = defaultConfig) {
    this.fetch = this.fetch.bind(this);
    this.#config = defineConfig(config);
    this.#server = new Server(this.#config.root, this.#config.assets);
  }

  use(handler: Handler): this {
    this.#server.pipe(handler);
    return this;
  }

  get(pattern: Pattern, resolver: Resolver): this {
    this.#server.get(pattern, resolver);
    return this;
  }

  head(pattern: Pattern, resolver: Resolver): this {
    this.#server.head(pattern, resolver);
    return this;
  }

  post(pattern: Pattern, resolver: Resolver): this {
    this.#server.post(pattern, resolver);
    return this;
  }

  put(pattern: Pattern, resolver: Resolver): this {
    this.#server.put(pattern, resolver);
    return this;
  }

  patch(pattern: Pattern, resolver: Resolver): this {
    this.#server.patch(pattern, resolver);
    return this;
  }

  delete(pattern: Pattern, resolver: Resolver): this {
    this.#server.delete(pattern, resolver);
    return this;
  }

  fetch(request: Request): Promise<Response> {
    return this.#server.fetch(request);
  }
}

export function app(config: UserConfig): Application {
  return new Application(config);
}

export { Application as Abi, app as abi, type UserConfig as AbiConfig };

const _app = app(defaultConfig);

export default _app;
