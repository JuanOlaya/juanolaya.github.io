import { readFileSync } from 'node:fs';
import path from 'node:path';

/**
 * Reads declarations straight out of the legacy `verben/A1_A2_B1/script/script.js` so they can be tested before
 * the file is split into modules. Everything there lives inside one `DOMContentLoaded` callback and nothing is
 * exported, so the source text is the only way in without editing the file.
 */
export const LEGACY_SCRIPT_PATH = path.resolve(import.meta.dirname, '../../verben/A1_A2_B1/script/script.js');

export function readLegacyScript(): string {
  return readFileSync(LEGACY_SCRIPT_PATH, 'utf8');
}

function indexAfterMatching(source: string, openIndex: number, open: string, close: string): number {
  let depth = 0;
  for (let i = openIndex; i < source.length; i++) {
    if (source[i] === open) depth++;
    if (source[i] === close) depth--;
    if (depth === 0) return i + 1;
  }
  throw new Error(`Unbalanced "${open}" at ${openIndex}`);
}

/** Source of the declaration starting at `start`: `function f(…) {…}`, `const f = (…) => {…};` or `const x = {…};`. */
function declarationAt(source: string, start: number): string {
  const equals = source.indexOf('=', start);
  const isFunction = source.startsWith('function', start);
  const afterEquals = source.slice(equals + 1).trimStart();
  let bodyOpen: number;
  if (!isFunction && afterEquals.startsWith('{')) {
    bodyOpen = source.indexOf('{', equals);
  } else {
    // Skip the parameter list first: destructured parameters contain braces too.
    const paramsEnd = indexAfterMatching(source, source.indexOf('(', start), '(', ')');
    bodyOpen = source.indexOf('{', paramsEnd);
  }
  const end = indexAfterMatching(source, bodyOpen, '{', '}');
  return source.slice(start, end) + (isFunction ? '' : ';');
}

/** Every declaration of `name`, in file order (the script declares some helpers twice). */
export function declarationsOf(source: string, name: string): string[] {
  const pattern = new RegExp(String.raw`(?:function\s+${name}\s*\(|const\s+${name}\s*=)`, 'g');
  return [...source.matchAll(pattern)].map((match) => declarationAt(source, match.index));
}

/**
 * Evaluates the first declaration of each name (all declarations for `function` names, so a later duplicate
 * overrides an earlier one exactly as in the browser) and returns them by name.
 */
export function loadLegacyDeclarations<T extends object>(names: readonly string[]): T {
  const source = readLegacyScript();
  const body = names
    .map((name) => {
      const found = declarationsOf(source, name);
      if (found.length === 0) throw new Error(`"${name}" not found in script.js`);
      return found[0].startsWith('function') ? found.join('\n') : found[0];
    })
    .join('\n');
  return new Function(`${body}\nreturn { ${names.join(', ')} };`)() as T;
}
