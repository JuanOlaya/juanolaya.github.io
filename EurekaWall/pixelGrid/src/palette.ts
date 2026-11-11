/**
 * Color palettes for ShapyPresence.
 * Colors are assigned persistent global indices:
 * - 0 to 4: Modern paints (Orange, Blue, Green, Red, Cream)
 * - 5 to 9: Classic paints (Purple, Yellow, Pink, Green, Orange)
 * - 10: BACKGROUND_COLOR (drawn using current background color)
 *
 * This guarantees that cells created in one palette KEEP their original color
 * even when the user switches to the other palette.
 */

export type PaletteId = 'modern' | 'classic';

export interface PaletteDef {
  id: PaletteId;
  label: string;
  indices: readonly number[];
  paints: readonly string[];
  paintNames: readonly string[];
  backgrounds: readonly string[];
  eraserSurface: string;
  eraserAccent: string;
}

export const MODERN_PALETTE: PaletteDef = {
  id: 'modern',
  label: 'Modern',
  indices: [0, 1, 2, 3, 4] as const,
  paints: ['#c48208', '#198bc6', '#7bd389', '#ff7b72', '#f8ecde'] as const,
  paintNames: ['Orange', 'Blue', 'Green', 'Red', 'Cream'] as const,
  backgrounds: ['#282828', '#33333d', '#198bc6', '#f8ecde'] as const,
  eraserSurface: '#33333d',
  eraserAccent: '#c48208',
};

export const CLASSIC_PALETTE: PaletteDef = {
  id: 'classic',
  label: 'Classic',
  indices: [5, 6, 7, 8, 9] as const,
  paints: ['#484B78', '#E4AA2D', '#C62F40', '#58875D', '#D0692E'] as const,
  paintNames: ['Purple', 'Yellow', 'Pink', 'Green', 'Orange'] as const,
  backgrounds: ['#1E1E1E', '#18111D', '#FF6600', '#E1CFA3'] as const,
  eraserSurface: '#18111D',
  eraserAccent: '#de5a04',
};

export const PALETTES: Record<PaletteId, PaletteDef> = {
  modern: MODERN_PALETTE,
  classic: CLASSIC_PALETTE,
};

export const PALETTE_IDS: readonly PaletteId[] = ['modern', 'classic'] as const;

/** All 10 persistent paints in global color order: 0-4 modern, 5-9 classic. */
export const ALL_PAINTS: readonly string[] = [
  ...MODERN_PALETTE.paints,
  ...CLASSIC_PALETTE.paints,
];

export const ALL_PAINT_NAMES: readonly string[] = [
  ...MODERN_PALETTE.paintNames,
  ...CLASSIC_PALETTE.paintNames,
];

export function getPalette(id: PaletteId): PaletteDef {
  return PALETTES[id] ?? PALETTES.modern;
}

export function nextPalette(id: PaletteId): PaletteId {
  return id === 'modern' ? 'classic' : 'modern';
}

/** Home-page palette tokens. */
export const PALETTE = {
  bg: '#282828',
  surface: '#33333d',
  border: '#41414e',
  ink: '#f8ecde',
  ink2: '#b9b2a6',
  accent: '#c48208',
  accentHover: '#d4870a',
  info: '#198bc6',
  success: '#7bd389',
  danger: '#ff7b72',
} as const;

export const PAINT_COLORS = ALL_PAINTS;
export const PAINT_NAMES = ALL_PAINT_NAMES;
export const BACKGROUNDS = MODERN_PALETTE.backgrounds;
