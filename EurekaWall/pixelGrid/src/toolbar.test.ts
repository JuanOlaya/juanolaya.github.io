import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { SHAPE_COUNT } from './grid.ts';
import { PALETTES, PALETTE_IDS, getPalette, nextPalette, type PaletteId } from './palette.ts';
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

describe('PALETTES', () => {
  it('exposes modern and classic palette options', () => {
    expect(PALETTE_IDS).toEqual(['modern', 'classic']);
  });

  it.each(PALETTE_IDS)('defines a complete palette for %s', (id) => {
    const pal = PALETTES[id];
    expect(pal.id).toBe(id);
    expect(typeof pal.label).toBe('string');
    expect(pal.paints).toHaveLength(5);
    expect(pal.paintNames).toHaveLength(5);
    expect(pal.backgrounds).toHaveLength(4);
    expect(new Set(pal.paints).size).toBe(5);
    expect(new Set(pal.paintNames).size).toBe(5);
    expect(new Set(pal.backgrounds).size).toBe(4);

    const hexRegex = /^#[0-9a-fA-F]{6}$/;
    for (const hex of pal.paints) expect(hex).toMatch(hexRegex);
    for (const hex of pal.backgrounds) expect(hex).toMatch(hexRegex);
    expect(pal.eraserSurface).toMatch(hexRegex);
    expect(pal.eraserAccent).toMatch(hexRegex);
  });

  it('provides the original EurekaWall colors in the classic palette', () => {
    const classic = PALETTES.classic;
    expect(classic.paints).toEqual(['#484B78', '#E4AA2D', '#C62F40', '#58875D', '#D0692E']);
    expect(classic.paintNames).toEqual(['Purple', 'Yellow', 'Pink', 'Green', 'Orange']);
    expect(classic.backgrounds).toEqual(['#282828', '#1E1E1E', '#18111D', '#F5F2EB']);
  });

  it('toggles back and forth between palettes', () => {
    expect(nextPalette('modern')).toBe('classic');
    expect(nextPalette('classic')).toBe('modern');
    expect(getPalette('unknown' as PaletteId).id).toBe('modern');
  });
});
