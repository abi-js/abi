import { serialize as _serialize } from 'bun:jsc';
import type { Engine } from './types';

export const engine: Engine = 'JSC';

export const serialize = (data: any) =>
  _serialize(data, { binaryType: 'nodebuffer' });
export { deserialize } from 'bun:jsc';
export { inflateSync, deflateSync } from 'bun';
