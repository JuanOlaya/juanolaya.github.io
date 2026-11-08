import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { findMissingUrls, parseUrlList } from './public-urls.ts';

const rootDir = fileURLToPath(new URL('..', import.meta.url));
const distDir = join(rootDir, 'dist');

function readList(name: string): string[] {
  return parseUrlList(readFileSync(join(rootDir, 'tooling', name), 'utf8'));
}

if (!existsSync(distDir)) {
  console.error('dist/ not found: run `npm run build` first.');
  process.exit(1);
}

const expected = readList('public-urls.txt');
const retired = readList('public-urls-retired.txt');
const missing = findMissingUrls(expected, retired, (path) => existsSync(join(distDir, path)));

if (missing.length > 0) {
  console.error(`${missing.length} public URL(s) missing from dist/:`);
  for (const path of missing) console.error(`  /${path}`);
  process.exit(1);
}

console.log(
  `OK: ${expected.length} public URLs checked; all present in dist/ except ${retired.length} allowed to be retired.`,
);
