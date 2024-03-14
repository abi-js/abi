import type { PathContract } from "./path";

export interface FileSystemContract {
  get root(): string;

  set root(root: string);

  exists(pathname: string): boolean;

  fullpath(pathname: string): PathContract;
}

export abstract class BaseFileSystem implements FileSystemContract {
  constructor(public root: string) {}

  abstract exists(pathname: string): boolean;

  abstract fullpath(pathname: string): PathContract;
}
