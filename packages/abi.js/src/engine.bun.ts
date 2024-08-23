import { serialize as _serialize } from 'bun:jsc';
export const serialize = (data: any) =>
  _serialize(data, { binaryType: 'nodebuffer' });
export { deserialize } from 'bun:jsc';
export { inflateSync, deflateSync } from 'bun';
