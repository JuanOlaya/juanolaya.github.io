import path from 'node:path';

/** A migrated page: `<dir>/index.html` is a Vite entry, so its modules are bundled. `''` is the site root. */
export interface VitePage {
  kind: 'vite';
  dir: string;
}

/**
 * A file or folder published byte-for-byte. Legacy pages load plain `<script src>` files that share
 * globals, so letting Vite rewrite or bundle them would break them; they are copied untouched instead.
 */
export interface LegacyPath {
  kind: 'legacy';
  path: string;
}

export type SiteEntry = VitePage | LegacyPath;

const HOME_ENTRY_NAME = 'home';

function locationOf(entry: SiteEntry): string {
  return entry.kind === 'vite' ? entry.dir : entry.path;
}

function assertRelativePosixPath(location: string, entry: SiteEntry): void {
  const isUnsafe =
    location.startsWith('/') ||
    location.endsWith('/') ||
    location.includes('\\') ||
    location.split('/').some((segment) => segment === '..' || segment === '.');
  if (isUnsafe) {
    throw new Error(`Invalid ${entry.kind} location "${location}": use a relative POSIX path`);
  }
  if (entry.kind === 'legacy' && location === '') {
    throw new Error('A legacy path cannot be the site root; list its files instead');
  }
}

/** True when copying `legacyPath` verbatim would overwrite the HTML that Vite emits for `pageDir`. */
function legacyCoversPage(legacyPath: string, pageDir: string): boolean {
  const pageHtml = pageDir === '' ? 'index.html' : `${pageDir}/index.html`;
  return pageHtml === legacyPath || pageHtml.startsWith(`${legacyPath}/`);
}

export function assertValidEntries(entries: readonly SiteEntry[]): void {
  const seen = new Set<string>();
  for (const entry of entries) {
    const location = locationOf(entry);
    assertRelativePosixPath(location, entry);
    if (seen.has(location)) throw new Error(`Duplicate site entry "${location}"`);
    seen.add(location);
  }
  const pages = entries.filter((entry): entry is VitePage => entry.kind === 'vite');
  const legacy = entries.filter((entry): entry is LegacyPath => entry.kind === 'legacy');
  for (const page of pages) {
    const clash = legacy.find((item) => legacyCoversPage(item.path, page.dir));
    if (clash) throw new Error(`Legacy path "${clash.path}" would overwrite Vite page "${page.dir}"`);
  }
}

/**
 * Builds `build.rolldownOptions.input` (Vite 8 name of `rollupOptions`). Each key is the page folder, so Vite writes
 * `dist/<dir>/index.html` and public URLs such as `/Balconity/` stay unchanged.
 */
export function pageInputFrom(entries: readonly SiteEntry[], rootDir: string): Record<string, string> {
  const input: Record<string, string> = {};
  for (const entry of entries) {
    if (entry.kind !== 'vite') continue;
    const name = entry.dir === '' ? HOME_ENTRY_NAME : entry.dir;
    input[name] = path.resolve(rootDir, entry.dir, 'index.html');
  }
  return input;
}

export function verbatimPathsFrom(entries: readonly SiteEntry[]): string[] {
  return entries.filter((entry): entry is LegacyPath => entry.kind === 'legacy').map((entry) => entry.path);
}
