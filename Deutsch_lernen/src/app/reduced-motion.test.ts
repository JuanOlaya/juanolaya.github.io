import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const memoRoot = fileURLToPath(new URL('../../', import.meta.url));

/**
 * MemoDeutsch animates only through CSS, so the reduced-motion rule of the style contract (§7) is the
 * whole mechanism: every stylesheet that ships transitions must carry it.
 */
const stylesheets = [
  'src/app/style.css',
  'index.html',
  'verben/styles.css',
  'verben/A1_A2_B1/style/styles.css',
];

const reducedMotionBlock =
  /@media \(prefers-reduced-motion: reduce\)\s*\{[^}]*\{[^}]*animation: none !important;[^}]*transition-duration: 0\.01ms !important;/;

describe('prefers-reduced-motion', () => {
  it.each(stylesheets)(
    '%s turns animations and transitions off when the user asks for less motion',
    (file) => {
      expect(readFileSync(`${memoRoot}${file}`, 'utf8')).toMatch(reducedMotionBlock);
    },
  );
});
