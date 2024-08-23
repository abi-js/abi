import type { Engine } from './types';

export const engine: Engine = 'V8';

export { serialize, deserialize } from 'node:v8';
export { inflateSync, deflateSync } from 'node:zlib';
