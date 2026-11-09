import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const domainDir = fileURLToPath(new URL('./', import.meta.url));
const sources = readdirSync(domainDir).filter((name) => name.endsWith('.ts') && !name.endsWith('.test.ts'));

/** The domain must stay a plain model of the game: no canvas library, no DOM, no code from outside the folder. */
describe('domain purity', () => {
  it('has something to check', () => {
    expect(sources.length).toBeGreaterThanOrEqual(6);
  });

  it.each(sources)('%s never mentions p5 and only imports its siblings', (name) => {
    const source = readFileSync(`${domainDir}${name}`, 'utf8');
    expect(source).not.toMatch(/p5/i);
    expect(source).not.toMatch(/\b(document|window|HTMLElement|navigator)\b/);
    const imports = [...source.matchAll(/from '([^']+)'/g)].map((match) => match[1]);
    for (const specifier of imports) expect(specifier).toMatch(/^\.\/[a-z-]+\.ts$/);
  });
});
