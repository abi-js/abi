import type { Method } from './method';
import type { Logger } from './types';

export class Context {
  constructor(
    readonly request: Request,
    readonly logger: Logger = console,
  ) {}

  get url(): URL {
    return new URL(this.request.url);
  }

  get method(): Method {
    return this.request.method;
  }

  get pathname(): string {
    return decodeURIComponent(this.url.pathname);
  }

  respond(
    body?: BodyInit | null,
    headers?: HeadersInit,
    status?: number,
    statusText?: string,
  ): Response {
    return new Response(body, { status, statusText, headers });
  }

  redirect(location: string | URL, status?: number): Response {
    return Response.redirect(location, status);
  }

  json<T>(): T;
  json<T>(body?: T, init?: ResponseInit): Response;
  json(arg1?: any, arg2?: any): any {
    if (arg1 === undefined && arg2 === undefined) {
      return this.request.json();
    }

    return new Response(JSON.stringify(arg1), arg2);
  }

  abort(code = 500, message?: string, headers?: HeadersInit): Response {
    const err = `Error ${code}${message ? `: ${message}` : ''}`;

    this.logger.error(err);

    return this.respond(err, headers, code);
  }

  log(...args: any[]) {
    this.logger.log(...args);
  }

  warn(...args: any[]) {
    this.logger.warn(...args);
  }

  error(...args: any[]) {
    this.logger.error(...args);
  }
}
