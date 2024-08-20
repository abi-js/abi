import { BaseFileSystem } from './core/fs';
import type { PathContract } from './core/path';
import { Path } from './path';
import { fileExists } from './utils';

export class FileSystem extends BaseFileSystem {
  exists(pathname: string): boolean {
    return fileExists(this.fullpath(pathname).toString());
  }

  fullpath(pathname: string): PathContract {
    if (!pathname.startsWith(this.root)) {
      pathname = `${this.root}/${pathname}`;
    }
    return new Path(pathname);
  }
}
