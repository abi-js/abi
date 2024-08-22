export type Handler = (request: Request) => Response | Promise<Response>;

export class Server {
  #handlers = new Set<Handler>();

  constructor(
    protected root: string,
    protected assets = '',
  ) {
    this.fetch = this.fetch.bind(this);
  }

  pipe(handler: Handler, ...handlers: Handler[]): this {
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

  async error<T>(err: T): Promise<Response> {
    console.log(`Unexpected server error: ${err}`);

    return new Response('Error 500: Server error.', {
      status: 500,
    });
  }
}
