import { lstatSync, realpathSync } from 'node:fs';
import { basename, dirname, extname, isAbsolute, normalize } from 'node:path';
import { BasePath, type PathInfo } from '../base/path';

export class Path extends BasePath {
  override get info(): PathInfo {
    const i = lstatSync(this.name);
    return {
      isDirectory: i.isDirectory(),
      isFile: i.isFile(),
      isSymlink: i.isSymbolicLink(),
      extension: this.extension,
      basename: this.basename,
      dirname: this.dirname,
      birthtime: i.birthtime,
      atime: i.atime,
      mtime: i.mtime,
      size: i.size,
    };
  }

  override get realname(): string {
    return realpathSync(this.name);
  }

  override get isAbsolute(): boolean {
    return isAbsolute(this.name);
  }
  override get isFile(): boolean {
    return this.info.isFile;
  }
  override get isDirectory(): boolean {
    return this.info.isDirectory;
  }
  override get isSymlink(): boolean {
    return this.info.isSymlink;
  }
  override get size(): number {
    return this.info.size;
  }
  override get mtime(): Date | null {
    return this.info.mtime;
  }
  override get atime(): Date | null {
    return this.info.mtime;
  }
  override get birthtime(): Date | null {
    return this.info.birthtime;
  }
  override get extension(): string {
    return extname(this.name);
  }
  override get basename(): string {
    return basename(this.name);
  }
  override get dirname(): string {
    return dirname(this.name);
  }
  override normalize(): string {
    return normalize(this.name);
  }
}
