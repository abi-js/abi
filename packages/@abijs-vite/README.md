# Abi's Vite Plugin 🔥

**Abi's Vite Plugin** is a [Vite.js](https://vitejs.dev/) plugin
designed to enhance the development experience
of projects built with the [Abi.js framework](https://abi.js.org/).

## ✨ Features

- 🔄 Seamless integration of Abi with Vite.
- ⚡ Hot Module Replacement (HMR) support.
- 🚀 Efficient build process optimized for Abi projects.

## 📦 Installation

Using npm:

```sh
npm install @abijs/vite --save-dev
```

Using pnpm:

```sh
pnpm add @abijs/vite --save-dev
```

Using yarn:

```sh
yarn add @abijs/vite --dev
```

Using Bun:

```sh
bun add @abijs/vite --dev
```

Using Deno:

```sh
deno add npm:@abijs/vite
```

## ⚙️ Usage

Add `@abijs/vite` to your `vite.config.js` or `vite.config.ts`:

```js
import { defineConfig } from 'vite';
import abi from '@abijs/vite';

export default defineConfig({
  plugins: [abi('src/assets/main.js')],
});
```

## 🔧 Configuration

The plugin requires you to specify the entry points of your application.
These can be JavaScript or CSS files, as well as preprocessed language elements
like TypeScript, JSX, TSX, Sass, etc. You can provide a string, an array of entries,
or a configuration object as specified below:

```ts
interface PluginConfig {
  /** The path or paths of the entry points to compile. */
  input: InputOption;

  /** V's public directory. @default 'public' */
  publicDirectory?: string;

  /** The public subdirectory where compiled assets should be written. @default 'build' */
  buildDirectory?: string;

  /** The path to the "hot" file. @default `${publicDirectory}/hot` */
  hotFile?: string;

  /** The path of the SSR entry point. */
  ssr?: InputOption;

  /** The directory where the SSR bundle should be written. @default 'ssr' */
  ssrOutputDirectory?: string;

  /** Configuration for full page refresh on file changes. @default false */
  refresh?: boolean | string | string[] | RefreshConfig | RefreshConfig[];

  /** Transform the code while serving. */
  transformOnServe?: (code: string, url: DevServerUrl) => string;
}

interface RefreshConfig {
  paths: string[];
  config?: FullReloadConfig;
}
```

Example usage:

```js
abi({
  input: ['src/design/global.css', 'src/logic/main.js'],
  publicDirectory: 'static',
  buildDirectory: 'dist',
  hotFile: 'static/hot',
  ssr: 'src/ssr.ts',
  ssrOutputDirectory: 'server',
  refresh: ['src/**'],
});
```

## 🤝 Contribution

We welcome contributions! If you find an issue or have an idea for improvement,
feel free to submit a pull request or open an issue.

## 📜 License

This project is licensed under the MIT License.
See the [LICENSE](./LICENSE) file for details.
