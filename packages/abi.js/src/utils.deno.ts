import {
  basename,
  dirname,
  extname,
  isAbsolute,
  normalize,
} from 'jsr:@std/path';
import type { PathInfo } from './types.ts';

export function pathinfo(name: string): PathInfo {
  return {
    ...Deno.lstatSync(name),
    name,
    realname: Deno.realPathSync(name),
    normalname: normalize(name),
    isAbsolute: isAbsolute(name),
    extension: extname(name),
    basename: basename(name),
    dirname: dirname(name),
  };
}

export { existsSync as fileExists } from 'jsr:@std/fs';
export const cwd = Deno.cwd();
export function readFile(path: string): string | ReadableStream | Uint8Array {
  return Deno.readFileSync(path);
}
