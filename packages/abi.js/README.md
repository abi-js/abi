# [Abi.js](https://github.com/abi-js/)

[![typescript-icon]][typescript-link]
[![license-icon]][license-link]
[![status-icon]][status-link]
[![ci-icon]][ci-link]
[![twitter-icon]][twitter-link]

[Abi.js][abi-repo] is a fast, type-safe and easy-to-use web framework
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

`Abi` works the same way under `Bun`, `Deno` and `Node` like this:

1. Create a file, example `app.js` and copy/paste this code:

```javascript
import abi from 'abi.js';

abi.get('', 'Welcome to Abi!');
abi.get(':user', (name) => `Hello ${name}!`);

abi.start();
```

2. Run your file with:

- **Node**: `node app.js`
- **Deno**: `deno run app.js`
- **Bun**: `bun run app.js`

Under `Bun` and `Deno`, you just need to use a default export.
You can also use a TypeScript `app.ts` file instead of `app.js` like this:

```typescript
import abi from 'abi.js';

abi.get('', 'Welcome to Abi!');
abi.get(':user', (name: string) => `Hello ${name}!`);

export default abi;
```

Then run your script with `deno serve app.ts` (with Deno)
or `bun run app.ts` (with Bun).

## 📖 Documentation

Find more examples and in-depth use cases by [visiting the documentation][abi-docs].

## 📄 License

This project is licensed under the MIT License -
see the [LICENSE.md file](./LICENSE.md) for details.

***

<div align="center"><sub>Made with ❤︎ by <a href="https://twitter.com/intent/follow?screen_name=siguici" style="content:url(https://img.shields.io/twitter/follow/siguici.svg?label=@siguici);margin-bottom:-6px">@siguici</a>.</sub></div>

[typescript-icon]: https://img.shields.io/badge/TypeScript-294E80.svg?logo=typescript
[typescript-link]:  https://github.com/abi-js/abi/search?l=typescript "TypeScript code"

[status-icon]: https://img.shields.io/badge/Abi-WIP-f59e0b.svg?style=flat
[status-link]: https://github.com/abi-js/abi "Abi.js work in progress"

[ci-icon]: https://github.com/abi-js/abi/workflows/CI/badge.svg
[ci-link]: https://github.com/abi-js/abi/actions "Abi.js CI"

[twitter-icon]: https://img.shields.io/twitter/follow/abidotjs.svg?label=@abidotjs
[twitter-link]: https://x.com/intent/follow?screen_name=abidotjs "Ping Abi.js"

[license-icon]: https://img.shields.io/badge/license-MIT-blue.svg
[license-link]: https://github.com/abi-js/abi/blob/HEAD/LICENSE "Abi.js License"

[abi-docs]: https://abi.js.org/ "Abi.js Documentation"
[abi-repo]: https://github.com/abi-js/ "Abi.js Repository"
