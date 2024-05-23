import {
  basename,
  dirname,
  extname,
  isAbsolute,
  normalize,
} from 'https://deno.land/std/path/mod.ts';
import { BasePath, type PathInfo } from './base/path.ts';

export class Path extends BasePath {
  override get info(): PathInfo {
    return {
      ...Deno.lstatSync(this.name),
      extension: this.extension,
      basename: this.basename,
      dirname: this.dirname,
    };
  }

  override get realname(): string {
    return Deno.realPathSync(this.name);
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
