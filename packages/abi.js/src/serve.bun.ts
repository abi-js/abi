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

  const server = Bun.serve({
    port,
    hostname,
    fetch: handler,
  });

  return { port: server.port, hostname: server.hostname };
}

export { serve };
