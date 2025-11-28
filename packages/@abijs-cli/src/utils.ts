import path from 'node:path';

export const __filename = getModuleFilename();
export const __dirname = path.dirname(__filename);

export function realpath(pathname: string): string {
  return pathname.startsWith('file://') || pathname.startsWith('/')
    ? pathname
    : pathname.startsWith('./') || pathname.startsWith('../')
      ? path.join(__dirname, pathname)
      : path.resolve(pathname);
}

export function getModuleFilename(): string {
  const error = new Error();
  const stack = error.stack;
  const matches = stack?.match(
    /^Error\s+at[^\r\n]+\s+at *(?:[^\r\n(]+\((.+?)(?::\d+:\d+)?\)|(.+?)(?::\d+:\d+)?) *([\r\n]|$)/,
  );
  const filename = matches?.[1] || matches?.[2];
  if (filename?.startsWith('file://')) {
    return fileURLToPath(filename);
  }
  return filename || fileURLToPath(import.meta.url);
}
