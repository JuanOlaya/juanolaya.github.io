/**
 * Public URL preservation check for the GitHub Pages deploy (issue #9).
 *
 * `public-urls.txt` freezes every URL served from `master` before the migration: each tracked
 * `.html` file plus the CV PDFs. Regenerate it only from the pre-migration master:
 *   git ls-tree -r --name-only -z <sha> | tr '\0' '\n' \
 *     | grep -iE '\.html?$|^CV/.*\.pdf$' \
 *     | grep -vE '^(\.vs|Sockets/node_modules|Haptic_Controller_3D_modelling)/' | LC_ALL=C sort
 * `public-urls-retired.txt` lists URLs a PR removed on purpose, each with a `#` comment saying why.
 */

/** Non-empty, non-comment lines; trailing `# comment` and whitespace are dropped. */
export function parseUrlList(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map((line) => line.replace(/#.*$/, '').trim())
    .filter((line) => line.length > 0);
}

/** Expected paths that are neither retired nor present in the build output. */
export function findMissingUrls(
  expected: readonly string[],
  retired: readonly string[],
  existsInDist: (path: string) => boolean,
): string[] {
  const retiredSet = new Set(retired);
  return expected.filter((path) => !retiredSet.has(path) && !existsInDist(path));
}
