import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { SHAPE_COUNT } from './grid.ts';
import { SHAPE_TOOLS } from './toolbar.ts';

const assetsDir = fileURLToPath(new URL('../../assets/', import.meta.url));

describe('SHAPE_TOOLS', () => {
  it('offers every shape exactly once, in drawing order', () => {
    expect(SHAPE_TOOLS.map((tool) => tool.shape)).toEqual(
      Array.from({ length: SHAPE_COUNT }, (_, index) => index + 1),
    );
  });

  it.each(SHAPE_TOOLS.map((tool) => [tool.asset]))('uses the published EurekaWall icon %s', (asset) => {
    expect(existsSync(`${assetsDir}${asset}`)).toBe(true);
  });

  it('labels every button differently', () => {
    expect(new Set(SHAPE_TOOLS.map((tool) => tool.label)).size).toBe(SHAPE_COUNT);
  });
});
