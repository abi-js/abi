export interface PathInfo {
  isFile: boolean;
  isDirectory: boolean;
  isSymlink: boolean;
  size: number;
  mtime: Date | null;
  atime: Date | null;
  birthtime: Date | null;
  extension: string;
  basename: string;
  dirname: string;
}

export interface PathContract {
  get name(): string;
  set name(name: string);
  get realname(): string;
  get info(): PathInfo;
  get isAbsolute(): boolean;
  get isFile(): boolean;
  get isDirectory(): boolean;
  get isSymlink(): boolean;
  get size(): number;
  get mtime(): Date | null;
  get atime(): Date | null;
  get birthtime(): Date | null;
  get extension(): string;
  get basename(): string;
  get dirname(): string;
  normalize(): string;
  toString(): string;
}

export abstract class BasePath implements PathContract {
  constructor(public name: string) {}
  abstract get info(): PathInfo;
  abstract get realname(): string;
  abstract get isAbsolute(): boolean;
  abstract get isFile(): boolean;
  abstract get isDirectory(): boolean;
  abstract get isSymlink(): boolean;
  abstract get size(): number;
  abstract get mtime(): Date | null;
  abstract get atime(): Date | null;
  abstract get birthtime(): Date | null;
  abstract get extension(): string;
  abstract get basename(): string;
  abstract get dirname(): string;
  abstract normalize(): string;
  toString(): string {
    return this.name;
  }
}
