import { execFileSync } from 'node:child_process';
import { copyFileSync, cpSync, existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import type { Plugin } from 'vite';
import type { VerbatimCopy } from './page-inputs.ts';

const OS_JUNK = new Set(['.DS_Store', 'Thumbs.db']);
// AI-assistant config is tooling for authors, never site content.
const AGENT_FILES = new Set(['CLAUDE.md', 'AGENTS.md']);
const AGENT_DIRS = new Set(['.claude', '.agents']);

function isAgentConfig(relativeFile: string): boolean {
  const segments = relativeFile.split('/');
  if (AGENT_FILES.has(segments[segments.length - 1] ?? '')) return true;
  return segments.some((segment) => AGENT_DIRS.has(segment));
}

function isExcluded(relativeFile: string, copy: VerbatimCopy): boolean {
  if (OS_JUNK.has(path.posix.basename(relativeFile))) return true;
  if (isAgentConfig(relativeFile)) return true;
  const inner = relativeFile === copy.path ? '' : relativeFile.slice(copy.path.length + 1);
  return copy.exclude.some((subPath) => inner === subPath || inner.startsWith(`${subPath}/`));
}

/**
 * Files git tracks under `relativePath`, or `undefined` when git or the repository is unavailable
 * (e.g. a source tarball). CI checkouts always have git, so deploys publish tracked files only.
 */
export function listTrackedFiles(rootDir: string, relativePath: string): string[] | undefined {
  try {
    const output = execFileSync('git', ['ls-files', '-z', '--', relativePath], {
      cwd: rootDir,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    });
    return output.split('\0').filter(Boolean);
  } catch {
    return undefined;
  }
}

function copyTracked(files: readonly string[], copy: VerbatimCopy, rootDir: string, outDir: string): void {
  if (files.length === 0) throw new Error(`copy-verbatim: "${copy.path}" has no files tracked by git`);
  for (const file of files) {
    if (isExcluded(file, copy)) continue;
    const target = path.join(outDir, file);
    mkdirSync(path.dirname(target), { recursive: true });
    copyFileSync(path.join(rootDir, file), target);
  }
}

function copyFromDisk(copy: VerbatimCopy, rootDir: string, outDir: string): void {
  cpSync(path.join(rootDir, copy.path), path.join(outDir, copy.path), {
    recursive: true,
    filter: (file) => !isExcluded(path.relative(rootDir, file).split(path.sep).join('/'), copy),
  });
}

/**
 * Publishes legacy paths exactly as committed. Only git-tracked files are copied, so local
 * untracked or ignored files (node_modules, tmp folders, local secrets) never reach `dist/`.
 */
export function publishVerbatim(copies: readonly VerbatimCopy[], rootDir: string, outDir: string): void {
  let warnedNoGit = false;
  for (const copy of copies) {
    // Fail loudly: a silently missing folder would publish a site with 404s.
    if (!existsSync(path.join(rootDir, copy.path)))
      throw new Error(`copy-verbatim: "${copy.path}" does not exist`);
    const tracked = listTrackedFiles(rootDir, copy.path);
    if (tracked) {
      copyTracked(tracked, copy, rootDir, outDir);
      continue;
    }
    if (!warnedNoGit) console.warn('copy-verbatim: git unavailable, copying legacy paths from disk');
    warnedNoGit = true;
    copyFromDisk(copy, rootDir, outDir);
  }
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
      publishVerbatim(copies, rootDir, outDir);
    },
  };
}
