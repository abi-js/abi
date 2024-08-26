export type QueryType = 'string' | 'number';
export type QueryValue = string | number;
export type Index = number;
export type Name = string;
export type Key = Index | Name;
export type Argument = { index: Index; value: QueryValue };
export type Parameter = { name: Name; type: QueryType; value: QueryValue };
export type Option = { key: Key; value: QueryValue };
export type Arguments = Record<Index, QueryValue>;
export type Parameters = Record<Name, QueryValue>;
export type Options = Record<Key, QueryValue>;

export type Result = boolean | number | string | object | Response;
export type Path = string;
export type Pattern = string;
export type Resolver = (...args: any[]) => Result;

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
