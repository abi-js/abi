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

export function isServeOptions(options: any): options is ServeOptions {
  return isPort(options) || isHostname(options) || isAddress(options);
}

function getServeOptionsAndHandler(
  handler: ServeHandler,
): [Required<Address>, ServeHandler];
function getServeOptionsAndHandler(
  portOrHost: number | string,
  handler: ServeHandler,
): [Required<Address>, ServeHandler];
function getServeOptionsAndHandler(
  options: ServeOptions,
  handler: ServeHandler,
): [Required<Address>, ServeHandler];
function getServeOptionsAndHandler<T extends ServeOptions | ServeHandler>(
  optionsOrHandler: T,
  handler: T extends ServeOptions ? ServeHandler : never,
): [Required<Address>, ServeHandler] {
  let _options: Required<ServeOptions>;
  let _handler: ServeHandler;

  if (isServeOptions(optionsOrHandler)) {
    if (isPort(optionsOrHandler)) {
      _options = { port: optionsOrHandler, hostname: defaultHost };
    } else if (isHostname(optionsOrHandler)) {
      _options = { port: defaultPort, hostname: optionsOrHandler };
    } else {
      _options = {
        port: optionsOrHandler.port ?? defaultPort,
        hostname: optionsOrHandler.hostname ?? defaultHost,
      };
    }
    _handler = handler;
  } else {
    _handler = optionsOrHandler;
    _options = { port: defaultPort, hostname: defaultHost };
  }

  return [_options, _handler];
}

export { getServeOptionsAndHandler };
