export * from './engine';
import { lstatSync, realpathSync } from 'node:fs';
import { basename, dirname, extname, isAbsolute, normalize } from 'node:path';
import type { PathInfo } from './types';

export function pathinfo(name: string): PathInfo {
  const info = lstatSync(name);

  return {
    name,
    realname: realpathSync(name),
    normalname: normalize(name),
    isAbsolute: isAbsolute(name),
    isDirectory: info.isDirectory(),
    isFile: info.isFile(),
    isSymlink: info.isSymbolicLink(),
    extension: extname(name),
    basename: basename(name),
    dirname: dirname(name),
    birthtime: info.birthtime,
    atime: info.atime,
    mtime: info.mtime,
    size: info.size,
  };
}

export { join as joinPath } from 'node:path';
export {
  existsSync as fileExists,
  readFileSync as readFile,
  writeFileSync as writeFile,
} from 'node:fs';
export const cwd = process.cwd();
