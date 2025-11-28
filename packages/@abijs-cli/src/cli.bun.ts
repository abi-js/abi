#!/usr/bin/env bun

console.log('Welcome to Bun!');

import('./index.js').then((abi) => abi.default());
