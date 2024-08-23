export * from './engine.ts';
import { basename, dirname, extname, isAbsolute, normalize } from '@std/path';
import type { PathInfo, Runtime } from './types.ts';

export const runtime: Runtime = 'Deno';

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

export { join as joinPath } from '@std/path';
export { existsSync as fileExists } from '@std/fs';
export const cwd = Deno.cwd();
export function readFile(path: string): string | ReadableStream | Uint8Array {
  return Deno.readFileSync(path);
}
export function writeFile(path: string, data: string): void {
  Deno.writeFileSync(path, new TextEncoder().encode(data));
}
