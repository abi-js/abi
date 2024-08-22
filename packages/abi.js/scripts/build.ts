import { fs, path, zlib, process } from 'buno.js';
import esbuild, { type BuildOptions, type BuildResult } from 'esbuild';
import { globbySync } from 'globby';
import pkg from '../package.json';
import tsconfig from '../tsconfig.json';

type Target = BuildOptions['target'] | 'default';
type Format = BuildOptions['format'];

const entryPoints = globbySync(tsconfig.include, {
  gitignore: true,
  ignore: tsconfig.exclude,
});

const defaultFormat =
  pkg.type && pkg.type.toLowerCase() === 'module' ? 'esm' : 'cjs';
const outdir = tsconfig.compilerOptions.outDir;
const target = tsconfig.compilerOptions.target || 'default';
const minify = !tsconfig.compilerOptions.pretty;
const watch = process.argv.includes('--watch');
const dtsdir = tsconfig.compilerOptions.declarationDir || outdir;

bunify(entryPoints, dtsdir);
await build(
  entryPoints,
  outdir,
  target,
  [undefined, 'cjs', 'esm'],
  minify,
  watch,
);

const files = fs.readdirSync(outdir);
for (const file of files) {
  const filePath = path.join(outdir, file);
  await outputSize(filePath);
  for (const fileType of ['Node', 'Bun'] as const) {
    const matches = match(filePath, fileType);
    if (matches) {
      const [fileName, ext] = [matches[1], matches[2]];
      if (ext !== '.ts' || fileType === 'Bun') {
        const realPath = path.join(fileName + ext);
        if (fs.existsSync(realPath)) {
          fs.rmSync(realPath);
          console.log('\x1b[32m', `🗑️  ${realPath}`);
        }
        fs.renameSync(filePath, realPath);
        console.log('\x1b[32m', `🔁 ${fileType}: ${filePath} -> ${realPath}`);
      } else {
        fs.rmSync(filePath);
        console.log('\x1b[32m', `🗑️  ${filePath}`);
      }
    }
  }
}

function match(path: string, type: 'Node' | 'Bun'): RegExpMatchArray | null {
  return path.match(
    `^(.*)\.${type.toLowerCase()}((?:\.d)?\.[mc]?${
      type === 'Bun' ? 't' : '[tj]'
    }s)$`,
  );
}

function bunify(
  entryPoints: string[],
  outdir: string,
  srcdir = 'src',
  ext = 'ts',
) {
  if (!fs.existsSync(outdir)) {
    fs.mkdirSync(outdir, { recursive: true });
  }

  for (const entryPoint of entryPoints) {
    if (entryPoint.startsWith(`${srcdir}/`) && entryPoint.endsWith(`.${ext}`)) {
      const relative = entryPoint.substring(srcdir.length + 1);
      const outfile = path.join(outdir, relative);
      fs.copyFileSync(entryPoint, outfile);
      console.log('\x1b[32m', `🚚 ${entryPoint} -> ${outfile}`);
    }
  }
}

function getBuildOptions(
  { format, minify, ...options }: BuildOptions,
  watch: boolean,
): BuildOptions {
  const define = {
    CDN: 'true',
    'process.env.NODE_ENV': watch ? '"development"' : '"production"',
  };

  return {
    ...options,
    platform: 'node',
    minify,
    format: format ?? defaultFormat,
    sourcemap: false,
    bundle: true,
    external: ['bun', 'bun:test', 'bun:jsc'],
    outExtension:
      format === 'cjs'
        ? { '.js': '.cjs' }
        : format === 'esm'
          ? { '.js': '.mjs' }
          : { '.js': '.js' },
    define,
  };
}

function build(
  entryPoints: string[],
  outdir: string,
  target: Target,
  formats: Format[] = ['cjs', 'esm'],
  minify = false,
  watch = false,
): Promise<(void | BuildResult<BuildOptions>)[]> {
  const results: Promise<void | BuildResult>[] = [];

  for (const format of formats) {
    const options = getBuildOptions(
      {
        entryPoints,
        outdir,
        target,
        format,
        minify,
      },
      watch,
    );

    results.push(
      watch
        ? esbuild.context(options).then((ctx) => ctx.watch())
        : esbuild.build(options),
    );
  }

  return Promise.all(results);
}

function outputSize(file: string) {
  const content = fs.readFileSync(file);
  const bytes = zlib.brotliCompressSync(content).length;
  const size = bytesToSize(bytes);

  console.log('[\x1b[32m+\x1b[0m]', `📦️ ${file} bundle size: ${size}`);
}

function bytesToSize(bytes: number): string {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) {
    return 'n/a';
  }
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  if (i === 0) {
    return `${bytes} ${sizes[i]}`;
  }
  return `${(bytes / 1024 ** i).toFixed(1)} ${sizes[i]}`;
}
