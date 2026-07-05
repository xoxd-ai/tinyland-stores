#!/usr/bin/env node
// Anchor cwd to THIS script's package dir so `-i src` / `-o dist` resolve whether
// this module is built standalone (root pkg) or as an external Bazel registry dep
// (bin/external/<repo>/) under RBE. import.meta.url points at the copied-to-bin
// location alongside src/, package.json, dist/.
import { register, createRequire } from 'node:module';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';
process.chdir(dirname(fileURLToPath(import.meta.url)));
const require = createRequire(import.meta.url);
const tsUrl = pathToFileURL(require.resolve('typescript/lib/typescript.js')).href;
register('data:text/javascript,' + encodeURIComponent(
  `export function resolve(s,c,n){if(s==='typescript')return{url:'${tsUrl}',shortCircuit:true};return n(s,c);}`
));
const pkgDir = dirname(require.resolve('@sveltejs/package/package.json'));
await import(pathToFileURL(join(pkgDir, 'svelte-package.js')).href);
