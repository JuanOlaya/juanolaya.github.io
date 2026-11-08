import { cpSync, existsSync } from 'node:fs';
import path from 'node:path';
import type { Plugin } from 'vite';

const OS_JUNK = new Set(['.DS_Store', 'Thumbs.db']);

/** Copies legacy files and folders into the build output exactly as they are in the repository. */
export function copyVerbatim(paths: readonly string[], rootDir: string): Plugin {
  let outDir = '';
  return {
    name: 'copy-verbatim',
    apply: 'build',
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir);
    },
    writeBundle() {
      for (const relativePath of paths) {
        const source = path.join(rootDir, relativePath);
        // Fail loudly: a silently missing folder would publish a site with 404s.
        if (!existsSync(source)) throw new Error(`copy-verbatim: "${relativePath}" does not exist`);
        cpSync(source, path.join(outDir, relativePath), {
          recursive: true,
          filter: (file) => !OS_JUNK.has(path.basename(file)),
        });
      }
    },
  };
}
