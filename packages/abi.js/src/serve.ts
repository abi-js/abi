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
        throw err;
      })
      .on('data', (chunk) => {
        data.push(chunk);
      })
      .on('end', async () => {
        const body = Buffer.concat(data);
        const method = req.method?.toUpperCase() || 'GET';
        const url = new URL(req.url || '/', `http://${hostname}:${port}`);
        const requestOptions: RequestInit = {
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
        };

        if (!(method === 'GET' || method === 'HEAD')) {
          requestOptions.body = body;
        }

        const request = new Request(url.toString(), requestOptions);
        const response = await handler(request);

        if (response.body instanceof ReadableStream) {
          const reader = response.body.getReader();
          const streamData: Uint8Array[] = [];

          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              break;
            }
            streamData.push(value);
          }

          const finalBuffer = Buffer.concat(streamData);
          res.writeHead(200, Object.fromEntries(response.headers.entries()));
          res.end(finalBuffer);
        } else {
          res.writeHead(200, Object.fromEntries(response.headers.entries()));
          res.end(response.body);
        }
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
