import {
  type IncomingMessage,
  type ServerResponse,
  createServer,
} from 'node:http';
import { getServeOptionsAndHandler } from './helpers';
import type { ListenAddress, ServeHandler, ServeOptions } from './types';

function serve(handler: ServeHandler): void;
function serve(portOrHost: number | string, handler: ServeHandler): void;
function serve(options: ServeOptions, handler: ServeHandler): void;
function serve<T extends ServeOptions | ServeHandler>(
  optionsOrHandler: T,
  handler?: T extends ServeOptions ? ServeHandler : never,
): ListenAddress {
  const [_options, _handler] = getServeOptionsAndHandler(
    optionsOrHandler,
    handler,
  );
  const server = createServer(
    async (req: IncomingMessage, res: ServerResponse) => {
      const request = new Request(req.url || '/', {
        method: req.method || 'GET',
        headers: new Headers(req.headers as Record<string, string>),
        body: new Promise<Buffer>((resolve) => {
          const chunks: Buffer[] = [];
          req.on('data', (chunk) => chunks.push(chunk));
          req.on('end', () => resolve(Buffer.concat(chunks)));
        }),
      });

      const response = await _handler(request);
      res.writeHead(200, Object.fromEntries(response.headers.entries()));
      res.end(response.body);
    },
  );

  server.listen(_options.port, _options.hostname);
  const address = server.address();

  return address && typeof address === 'object'
    ? {
        port: address.port,
        hostname: address.address,
      }
    : { port: _port, hostname: _hostname };
}

export { serve };
