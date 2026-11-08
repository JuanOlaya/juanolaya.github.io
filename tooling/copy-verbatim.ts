import { cpSync, existsSync } from 'node:fs';
import path from 'node:path';
import type { Plugin } from 'vite';
import type { VerbatimCopy } from './page-inputs.ts';

const OS_JUNK = new Set(['.DS_Store', 'Thumbs.db']);

function copyFilter(source: string, exclude: readonly string[]): (file: string) => boolean {
  const excluded = exclude.map((subPath) => path.join(source, subPath));
  return (file) =>
    !OS_JUNK.has(path.basename(file)) &&
    !excluded.some((root) => file === root || file.startsWith(`${root}${path.sep}`));
}

/** Copies legacy files and folders into the build output exactly as they are in the repository. */
export function copyVerbatim(copies: readonly VerbatimCopy[], rootDir: string): Plugin {
  let outDir = '';
  return {
    name: 'copy-verbatim',
    apply: 'build',
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir);
    },
    writeBundle() {
      for (const copy of copies) {
        const source = path.join(rootDir, copy.path);
        // Fail loudly: a silently missing folder would publish a site with 404s.
        if (!existsSync(source)) throw new Error(`copy-verbatim: "${copy.path}" does not exist`);
        cpSync(source, path.join(outDir, copy.path), {
          recursive: true,
          filter: copyFilter(source, copy.exclude),
        });
      }
    },
  };
}
