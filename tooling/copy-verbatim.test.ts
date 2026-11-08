import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { publishVerbatim } from './copy-verbatim.ts';

const tempDirs: string[] = [];

function tempDir(): string {
  const dir = mkdtempSync(path.join(os.tmpdir(), 'copy-verbatim-'));
  tempDirs.push(dir);
  return dir;
}

function writeFile(root: string, relativePath: string, content = relativePath): void {
  mkdirSync(path.dirname(path.join(root, relativePath)), { recursive: true });
  writeFileSync(path.join(root, relativePath), content);
}

function git(root: string, ...args: string[]): void {
  execFileSync('git', args, {
    cwd: root,
    stdio: 'ignore',
  });
}

/** A legacy page folder mixing page files with server code that must not be published. */
function legacyPageFixture(root: string): void {
  writeFile(root, 'Sockets/index.html');
  writeFile(root, 'Sockets/sketch.js');
  writeFile(root, 'Sockets/server.js');
  writeFile(root, '.gitignore', 'tmp/\n');
}

afterEach(() => {
  tempDirs.splice(0).forEach((dir) => rmSync(dir, { recursive: true, force: true }));
});

// Spawning git is slow on Windows runners.
describe('publishVerbatim', { timeout: 30_000 }, () => {
  it('publishes only git-tracked files, minus excluded sub-paths', () => {
    const root = tempDir();
    const out = tempDir();
    legacyPageFixture(root);
    git(root, 'init', '-q');
    // Staging is enough: `git ls-files` reads the index, and skipping a commit avoids running hooks.
    git(root, 'add', '.');
    writeFile(root, 'Sockets/untracked.php');
    writeFile(root, 'Sockets/tmp/ignored.bin');

    publishVerbatim([{ path: 'Sockets', exclude: ['server.js'] }], root, out);

    expect(existsSync(path.join(out, 'Sockets/index.html'))).toBe(true);
    expect(existsSync(path.join(out, 'Sockets/sketch.js'))).toBe(true);
    expect(existsSync(path.join(out, 'Sockets/server.js'))).toBe(false);
    expect(existsSync(path.join(out, 'Sockets/untracked.php'))).toBe(false);
    expect(existsSync(path.join(out, 'Sockets/tmp'))).toBe(false);
  });

  it('fails when a listed path exists on disk but is not tracked', () => {
    const root = tempDir();
    legacyPageFixture(root);
    git(root, 'init', '-q');

    expect(() => publishVerbatim([{ path: 'Sockets', exclude: [] }], root, tempDir())).toThrow(
      /no files tracked by git/,
    );
  });

  it('falls back to copying from disk outside a git repository', () => {
    const root = tempDir();
    const out = tempDir();
    legacyPageFixture(root);

    publishVerbatim([{ path: 'Sockets', exclude: ['server.js'] }], root, out);

    expect(existsSync(path.join(out, 'Sockets/sketch.js'))).toBe(true);
    expect(existsSync(path.join(out, 'Sockets/server.js'))).toBe(false);
  });
});
