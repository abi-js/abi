export type Port = number;
export type Hostname = `${number}.${number}.${number}.${number}` | string;
export type PortOrHost = Port | Hostname;
export type ListenAddress = { port?: Port; hostname?: Hostname };
export type ServeOptions = PortOrHost | ListenAddress;
export type ServeHandler = (request: Request) => Response | Promise<Response>;

export type UserConfig = Partial<Config> | undefined;

export type Config = {
  root: string;
  port: Port;
  hostname: Hostname;
  assets: string;
  routes: string;
  errors: string;
};

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
