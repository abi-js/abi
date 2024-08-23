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

  const server = createServer((req: IncomingMessage, res: ServerResponse) => {
    const data: Uint8Array[] = [];

    req
      .on('error', (err) => {
        throw new Error(err);
      })
      .on('data', (chunk) => {
        data.push(chunk);
      })
      .on('end', async () => {
        const body = Buffer.concat(data);
        const method = req.method?.toUpperCase() || 'GET';
        const request = new Request(req.url || '/', {
          method,
          headers: Object.entries(req.headers).reduce(
            (headers, [key, value]) => {
              if (Array.isArray(value)) {
                for (const v of value) {
                  headers.append(key, v);
                }
              } else if (value !== undefined) {
                headers.set(key, value);
              }
              return headers;
            },
            new Headers(),
          ),
          body: method in ['GET', 'HEAD'] ? null : body,
        });

        const response = await handler(request);
        res.writeHead(200, Object.fromEntries(response.headers.entries()));
        res.end(response.body);
      });
  });

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
