import { serve } from './serve';
import type { ServeHandler, ServeOptions } from './types';

export class Server {
  #handlers = new Set<ServeHandler>();

  constructor(
    protected root: string,
    protected assets = '',
  ) {
    this.fetch = this.fetch.bind(this);
  }

  pipe(handler: ServeHandler, ...handlers: ServeHandler[]): this {
    this.#handlers.add(handler);
    for (const _handler of handlers) {
      this.#handlers.add(_handler);
    }
    return this;
  }

  async fetch(request: Request): Promise<Response> {
    for (const handler of this.#handlers) {
      const response = await handler(request);

      if (response.ok) {
        return response;
      }
    }

    return this.error(`Cannot ${request.method} ${request.url}`);
  }

  listen(options?: ServeOptions): void {
    options ? serve(options, this.fetch) : serve(this.fetch);
  }

  error<T>(err: T): Response {
    console.log(`Unexpected server error: ${err}`);

    return new Response('Error 500: Server error.', {
      status: 500,
    });
  }
}
