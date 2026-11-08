import path from 'node:path';

/**
 * A migrated page: `<dir>/<html>` is a Vite entry, so its modules are bundled. `''` is the site root.
 * `html` defaults to `index.html`; set it only for pages whose public URL is a named file.
 */
export interface VitePage {
  kind: 'vite';
  dir: string;
  html?: string;
}

/**
 * A file or folder published byte-for-byte. Legacy pages load plain `<script src>` files that share
 * globals, so letting Vite rewrite or bundle them would break them; they are copied untouched instead.
 * `exclude` lists sub-paths (relative to `path`) that must not be published, such as TypeScript sources.
 */
export interface LegacyPath {
  kind: 'legacy';
  path: string;
  exclude?: readonly string[];
}

export type SiteEntry = VitePage | LegacyPath;

export interface VerbatimCopy {
  path: string;
  exclude: readonly string[];
}

const HOME_ENTRY_NAME = 'home';
const DEFAULT_HTML = 'index.html';

function joinPosix(dir: string, file: string): string {
  return dir === '' ? file : `${dir}/${file}`;
}

/** Repository-relative path of the HTML file a Vite page publishes. */
function pageHtmlOf(page: VitePage): string {
  return joinPosix(page.dir, page.html ?? DEFAULT_HTML);
}

function isUnsafePath(location: string): boolean {
  return (
    location.startsWith('/') ||
    location.endsWith('/') ||
    location.includes('\\') ||
    location.split('/').some((segment) => segment === '..' || segment === '.')
  );
}

function assertSafe(location: string, kind: SiteEntry['kind']): void {
  if (isUnsafePath(location)) {
    throw new Error(`Invalid ${kind} location "${location}": use a relative POSIX path`);
  }
}

function assertSafeEntry(entry: SiteEntry): void {
  if (entry.kind === 'vite') {
    assertSafe(entry.dir, entry.kind);
    if (entry.html !== undefined && !/^[^/\\]+\.html$/.test(entry.html)) {
      throw new Error(`Invalid html "${entry.html}": use a file name ending in .html`);
    }
    return;
  }
  if (entry.path === '') throw new Error('A legacy path cannot be the site root; list its files instead');
  assertSafe(entry.path, entry.kind);
  entry.exclude?.forEach((subPath) => assertSafe(subPath, entry.kind));
}

/** True when copying `legacyPath` verbatim would overwrite the HTML that Vite emits at `pageHtml`. */
function legacyCoversPage(legacy: LegacyPath, pageHtml: string): boolean {
  if (pageHtml === legacy.path) return true;
  if (!pageHtml.startsWith(`${legacy.path}/`)) return false;
  const inner = pageHtml.slice(legacy.path.length + 1);
  return !(legacy.exclude ?? []).some((subPath) => inner === subPath || inner.startsWith(`${subPath}/`));
}

export function assertValidEntries(entries: readonly SiteEntry[]): void {
  const seen = new Set<string>();
  for (const entry of entries) {
    assertSafeEntry(entry);
    const location = entry.kind === 'vite' ? pageHtmlOf(entry) : entry.path;
    if (seen.has(location)) throw new Error(`Duplicate site entry "${location}"`);
    seen.add(location);
  }
  const legacy = entries.filter((entry): entry is LegacyPath => entry.kind === 'legacy');
  for (const entry of entries) {
    if (entry.kind !== 'vite') continue;
    const clash = legacy.find((item) => legacyCoversPage(item, pageHtmlOf(entry)));
    if (clash)
      throw new Error(`Legacy path "${clash.path}" would overwrite Vite page "${pageHtmlOf(entry)}"`);
  }
}

function inputNameOf(page: VitePage): string {
  if (page.html !== undefined && page.html !== DEFAULT_HTML) return pageHtmlOf(page).replace(/\.html$/, '');
  return page.dir === '' ? HOME_ENTRY_NAME : page.dir;
}

/**
 * Builds `build.rolldownOptions.input` (Vite 8 name of `rollupOptions`). Vite writes each HTML entry
 * at its repository-relative path, so public URLs such as `/Balconity/` stay unchanged.
 */
export function pageInputFrom(entries: readonly SiteEntry[], rootDir: string): Record<string, string> {
  const input: Record<string, string> = {};
  for (const entry of entries) {
    if (entry.kind !== 'vite') continue;
    input[inputNameOf(entry)] = path.resolve(rootDir, pageHtmlOf(entry));
  }
  return input;
}

export function verbatimCopiesFrom(entries: readonly SiteEntry[]): VerbatimCopy[] {
  return entries
    .filter((entry): entry is LegacyPath => entry.kind === 'legacy')
    .map((entry) => ({ path: entry.path, exclude: entry.exclude ?? [] }));
}
