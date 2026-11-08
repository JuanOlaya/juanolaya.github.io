import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { build, type Rolldown } from 'vite';

/**
 * TypeScript modules that legacy pages load as classic `<script src>` files. Legacy folders are published
 * byte-for-byte (see `site-pages.ts`), so the bundle is committed next to the page that loads it: the page
 * then works from the dev server, from `dist/` and from the service worker precache alike.
 * `legacy-scripts.test.ts` fails when a committed bundle is out of date; `npm run build:legacy-scripts`
 * rewrites them.
 */
export interface LegacyScript {
  entry: string;
  output: string;
}

export const legacyScripts: readonly LegacyScript[] = [
  {
    entry: 'Deutsch_lernen/src/verben/verben-helpers.ts',
    output: 'Deutsch_lernen/verben/A1_A2_B1/script/verben-helpers.js',
  },
];

const rootDir = path.resolve(import.meta.dirname, '..');

function bannerFor(script: LegacyScript): string {
  return `// Generated from ${script.entry} by \`npm run build:legacy-scripts\`. Do not edit.`;
}

/** The classic-script bundle of `script.entry`, unminified so diffs stay reviewable. */
export async function bundleLegacyScript(script: LegacyScript): Promise<string> {
  const result = await build({
    configFile: false,
    logLevel: 'silent',
    root: rootDir,
    build: {
      write: false,
      minify: false,
      lib: { entry: path.join(rootDir, script.entry), formats: ['iife'], name: 'legacyScript' },
      rolldownOptions: { output: { banner: bannerFor(script) } },
    },
  });
  const outputs = (Array.isArray(result) ? result : [result]) as Rolldown.RolldownOutput[];
  return outputs[0].output[0].code;
}

export function readCommittedLegacyScript(script: LegacyScript): string {
  return readFileSync(path.join(rootDir, script.output), 'utf8');
}

export async function writeLegacyScripts(): Promise<void> {
  for (const script of legacyScripts) {
    writeFileSync(path.join(rootDir, script.output), await bundleLegacyScript(script));
  }
}
