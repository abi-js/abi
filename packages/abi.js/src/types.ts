export type Port = number;
export type Hostname = `${number}.${number}.${number}.${number}` | string;
export type Address = { port: Port; hostname: Hostname };
export type ServeHandler = (request: Request) => Response | Promise<Response>;
export type ServeOptions = Address & {
  handler: ServeHandler;
};

export type Engine = 'V8' | 'JSC';
export type Runtime = 'Node.js' | 'Deno' | 'Bun';

export type UserConfig = Partial<Config> | undefined;

export type Config = {
  root: string;
  port: Port;
  hostname: Hostname;
  assets: string;
  routes: string;
  errors: string;
};

export interface Logger {
  log(...args: any[]): void;
  warn(...args: any[]): void;
  error(...args: any[]): void;
}

export interface PathInfo {
  name: string;
  realname: string;
  normalname: string;
  isAbsolute: boolean;
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
