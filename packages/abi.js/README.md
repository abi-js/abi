# [Abi Framework](https://github.com/abi-framework/)

[![typescript-icon]][typescript-link]
[![license-icon]][license-link]
[![status-icon]][status-link]
[![ci-icon]][ci-link]
[![twitter-icon]][twitter-link]

[Abi][abi-repo] is a fast, type-safe and easy-to-use web framework
for building robust web applications in no time without any hassle.

## 🚀 Installation

You can install [`Abi`](https://abi.js.org) from [`NPM`](https://npmjs.com/package/abi.js):

- Using `npm`:

  ```bash
  npm install abi.js
  ```

- Using `Yarn`:

  ```bash
  yarn add abi.js
  ```

- Using `PNPM`:

  ```bash
  pnpm add abi.js
  ```

- Using `Bun`:

  ```bash
  bun install abi.js
  ```

- Using `Deno`:

  ```bash
  deno add npm:abi.js
  ```

## 💡 Usage

- Use `Abi` in a few lines of code:

```typescript
import abi from 'abi.js';

abi.get('', 'Welcome to Abi!');
abi.get(':user', (name: string) => `Hello ${name}!`);

abi.start();
```

- Under Bun and Deno, you just need to use a default export:

```typescript
import abi from 'abi.js';

abi.get('', 'Welcome to Abi!');
abi.get(':user', (name: string) => `Hello ${name}!`);

export default abi;
```

## 📖 Documentation

Find more examples and in-depth use cases by [visiting the documentation][abi-docs].

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md file](./LICENSE.md) for details.

***

<div align="center"><sub>Made with ❤︎ by <a href="https://twitter.com/intent/follow?screen_name=siguici" style="content:url(https://img.shields.io/twitter/follow/siguici.svg?label=@siguici);margin-bottom:-6px">@siguici</a>.</sub></div>

[typescript-icon]: https://img.shields.io/badge/TypeScript-294E80.svg?logo=typescript
[typescript-link]:  https://github.com/abi-framework/abi/search?l=typescript "TypeScript code"

[status-icon]: https://img.shields.io/badge/Abi-WIP-f59e0b.svg?style=flat
[status-link]: https://github.com/abi-framework/abi "Abi work in progress"

[ci-icon]: https://github.com/abi-framework/abi/workflows/CI/badge.svg
[ci-link]: https://github.com/abi-framework/abi/actions "Abi CI"

[twitter-icon]: https://img.shields.io/twitter/follow/abi_framework.svg?label=@abi_framework
[twitter-link]: https://x.com/intent/follow?screen_name=abi_framework "Ping Abi"

[license-icon]: https://img.shields.io/badge/license-MIT-blue.svg
[license-link]: https://github.com/abi-framework/abi/blob/HEAD/LICENSE "Abi License"

[abi-docs]: https://abi.js.org/ "Abi Documentation"
[abi-repo]: https://github.com/abi-framework/ "Abi Repository"
