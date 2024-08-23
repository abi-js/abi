import {
  type IncomingMessage,
  type ServerResponse,
  createServer,
} from 'node:http';
import { toServeOptions } from './helpers';
import type {
  Address,
  Hostname,
  Port,
  ServeHandler,
  ServeOptions,
} from './types';

function serve(handler: ServeHandler): Address;
function serve(port: Port, handler: ServeHandler): Address;
function serve(hostname: Hostname, handler: ServeHandler): Address;
function serve(port: Port, hostname: Hostname, handler: ServeHandler): Address;
function serve(address: Address, handler: ServeHandler): Address;
function serve(options: ServeOptions): Address;
function serve(arg1: any, arg2?: any, arg3?: any): Address {
  const { port, hostname, handler } = toServeOptions(arg1, arg2, arg3);
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

      const response = await handler(request);
      res.writeHead(200, Object.fromEntries(response.headers.entries()));
      res.end(response.body);
    },
  );

  server.listen(port, hostname);
  const address = server.address();

  return address && typeof address === 'object'
    ? {
        port: address.port,
        hostname: address.address,
      }
    : { port, hostname };
}

export { serve };
