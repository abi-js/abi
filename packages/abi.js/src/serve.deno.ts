import { toServeOptions } from './helpers.ts';
import type {
  Address,
  Hostname,
  Port,
  ServeHandler,
  ServeOptions,
} from './types.ts';

function serve(handler: ServeHandler): Address;
function serve(port: Port, handler: ServeHandler): Address;
function serve(hostname: Hostname, handler: ServeHandler): Address;
function serve(port: Port, hostname: Hostname, handler: ServeHandler): Address;
function serve(address: Address, handler: ServeHandler): Address;
function serve(options: ServeOptions): Address;
function serve(arg1: any, arg2?: any, arg3?: any): Address {
  const options = toServeOptions(arg1, arg2, arg3);

  const server = Deno.serve(options);

  return { port: server.addr.port, hostname: server.addr.hostname };
}

export { serve };
