#!/usr/bin/env node

import runtime from 'panam/runtime';

switch (runtime.name) {
  case 'bun':
    await import('./cli.bun.ts');
    break;

  case 'deno':
    await import('./cli.deno.ts');
    break;

  default:
    console.log('Welcome to Node.js!');
    import('./index.js').then((abi) => abi.default());
    break;
}
