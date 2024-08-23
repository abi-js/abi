import { cwd } from './runtime';
import type { Config, Hostname, Port } from './types';

export const defaultRoot = cwd;
export const defaultPort: Port = 3000;
export const defaultHost: Hostname = '0.0.0.0';
export const defaultHostname: Hostname = 'localhost';

export const defaultConfig: Config = {
  root: cwd,
  port: defaultPort,
  hostname: defaultHost,
  assets: 'assets',
  routes: 'routes',
  errors: 'errors',
} as const;
