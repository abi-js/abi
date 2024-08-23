import { defaultHost, defaultPort } from './defaults';
import type {
  Address,
  Hostname,
  Port,
  ServeHandler,
  ServeOptions,
} from './types';

export function isPort(port: any): port is Port {
  return typeof port === 'number';
}

export function isHostname(host: any): host is Hostname {
  return typeof host === 'string';
}

export function isAddress(address: any): address is Address {
  return (
    typeof address === 'object' &&
    'port' in address &&
    'hostname' in address &&
    isPort(address.port) &&
    isHostname(address.hostname)
  );
}

export function isHandler(handler: any): handler is ServeHandler {
  return typeof handler === 'function';
}

export function hasHandler(options: any): options is { handler: ServeHandler } {
  return 'handler' in options && isHandler(options.handler);
}

export function isServeOptions(options: any): options is ServeOptions {
  return isAddress(options) && hasHandler(options);
}

function toServeOptions(handler: ServeHandler): ServeOptions;
function toServeOptions(port: Port, handler: ServeHandler): ServeOptions;
function toServeOptions(
  hostname: Hostname,
  handler: ServeHandler,
): ServeOptions;
function toServeOptions(
  port: Port,
  hostname: Hostname,
  handler: ServeHandler,
): ServeOptions;
function toServeOptions(address: Address, handler: ServeHandler): ServeOptions;
function toServeOptions(options: ServeOptions): ServeOptions;
function toServeOptions(arg1: any, arg2?: any, arg3?: any): ServeOptions {
  let options: ServeOptions;

  if (typeof arg1 === 'function') {
    options = { port: defaultPort, hostname: defaultHost, handler: arg1 };
  } else if (isPort(arg1) && isHandler(arg2)) {
    options = { port: arg1, hostname: defaultHost, handler: arg2 };
  } else if (isHostname(arg1) && isHandler(arg2)) {
    options = { port: defaultPort, hostname: arg1, handler: arg2 };
  } else if (isPort(arg1) && isHostname(arg2) && isHandler(arg3)) {
    options = { port: arg1, hostname: arg2, handler: arg3 };
  } else if (isAddress(arg1) && isHandler(arg2)) {
    options = {
      port: arg1.port,
      hostname: arg1.hostname,
      handler: arg2,
    };
  } else if (isServeOptions(arg1)) {
    options = arg1;
  } else {
    throw new Error('Invalid arguments for serve function');
  }

  return options;
}

export { toServeOptions };
