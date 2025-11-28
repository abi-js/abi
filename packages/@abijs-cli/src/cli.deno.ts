#!/usr/bin/env deno -A

console.log('Welcome to Deno!');

import('./index.js').then((abi) => abi.default());
