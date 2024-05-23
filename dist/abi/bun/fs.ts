import { existsSync } from 'node:fs';
import { BaseFileSystem } from '../../core/base/fs.ts';
import type { PathContract } from '../../core/base/path.ts';
import { Path } from './path.ts';

export class FileSystem extends BaseFileSystem {
  exists(pathname: string): boolean {
    return existsSync(this.fullpath(pathname).toString());
  }

  fullpath(pathname: string): PathContract {
    if (!pathname.startsWith(this.root)) {
      pathname = `${this.root}/${pathname}`;
    }
    return new Path(pathname);
  }
}
