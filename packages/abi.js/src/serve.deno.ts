import { getServeOptionsAndHandler } from './helpers';
import type { Address, ServeHandler, ServeOptions } from './types';

function serve(handler: ServeHandler): void;
function serve(portOrHost: number | string, handler: ServeHandler): void;
function serve(options: ServeOptions, handler: ServeHandler): void;
function serve<T extends ServeOptions | ServeHandler>(
  optionsOrHandler: T,
  handler?: T extends ServeOptions ? ServeHandler : never,
): Address {
  const [_options, _handler] = getServeOptionsAndHandler(
    optionsOrHandler,
    handler,
  );

  const server = Deno.serve({
    port: _options.port,
    hostname: _options.hostname,
    handler: _handler,
  });

  return { port: server.port, hostname: server.hostname };
}

export { serve };
