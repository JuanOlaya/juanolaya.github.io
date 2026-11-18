/**
 * Color palettes for ShapyPresence.
 * Colors are assigned persistent global indices:
 * - 0 to 8: Default paints (Mustard Gold, Crimson Red, Forest Green, Terracotta Orange, Slate Indigo, Flamingo Pink, Orchid Purple, Sky Blue, Platinum)
 * - 9 to 13: Classic paints (Purple, Yellow, Pink, Green, Orange)
 * - 14 to 18: Modern paints (Orange, Blue, Green, Red, Cream)
 * - 19: BACKGROUND_COLOR (drawn using current background color)
 *
 * This guarantees that cells created in one palette KEEP their original color
 * even when the user switches to another palette.
 */

export type PaletteId = 'default' | 'classic' | 'modern';

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

export const BACKGROUNDS: readonly string[] = [
  '#282828',
  '#1E1E1E',
  '#18111D',
  '#F5F2EB',
] as const;

export const DEFAULT_PALETTE: PaletteDef = {
  id: 'default',
  label: 'Default',
  indices: [0, 1, 2, 3, 4, 5, 6, 7, 8] as const,
  paints: [
    '#F1B238',
    '#D83647',
    '#4EAF67',
    '#DF6D38',
    '#4C5680',
    '#DC417F',
    '#AB47BC',
    '#29B6F6',
    '#EBEBEB',
  ] as const,
  paintNames: [
    'Mustard Gold',
    'Crimson Red',
    'Forest Green',
    'Terracotta Orange',
    'Slate Indigo',
    'Flamingo Pink',
    'Orchid Purple',
    'Sky Blue',
    'Platinum',
  ] as const,
  backgrounds: BACKGROUNDS,
  eraserSurface: '#33333d',
  eraserAccent: '#F1B238',
};

export const CLASSIC_PALETTE: PaletteDef = {
  id: 'classic',
  label: 'Classic',
  indices: [9, 10, 11, 12, 13] as const,
  paints: ['#484B78', '#E4AA2D', '#C62F40', '#58875D', '#D0692E'] as const,
  paintNames: ['Purple', 'Yellow', 'Pink', 'Green', 'Orange'] as const,
  backgrounds: BACKGROUNDS,
  eraserSurface: '#18111D',
  eraserAccent: '#de5a04',
};

export const MODERN_PALETTE: PaletteDef = {
  id: 'modern',
  label: 'Modern',
  indices: [14, 15, 16, 17, 18] as const,
  paints: ['#c48208', '#198bc6', '#7bd389', '#ff7b72', '#f8ecde'] as const,
  paintNames: ['Orange', 'Blue', 'Green', 'Red', 'Cream'] as const,
  backgrounds: BACKGROUNDS,
  eraserSurface: '#33333d',
  eraserAccent: '#c48208',
};

export const PALETTES: Record<PaletteId, PaletteDef> = {
  default: DEFAULT_PALETTE,
  classic: CLASSIC_PALETTE,
  modern: MODERN_PALETTE,
};

export const PALETTE_IDS: readonly PaletteId[] = ['default', 'classic', 'modern'] as const;

/** All 19 persistent paints in global color order: 0-8 default, 9-13 classic, 14-18 modern. */
export const ALL_PAINTS: readonly string[] = [
  ...DEFAULT_PALETTE.paints,
  ...CLASSIC_PALETTE.paints,
  ...MODERN_PALETTE.paints,
];

export const ALL_PAINT_NAMES: readonly string[] = [
  ...DEFAULT_PALETTE.paintNames,
  ...CLASSIC_PALETTE.paintNames,
  ...MODERN_PALETTE.paintNames,
];

export function getPalette(id: PaletteId): PaletteDef {
  return PALETTES[id] ?? PALETTES.default;
}

export function nextPalette(id: PaletteId): PaletteId {
  const currentIndex = PALETTE_IDS.indexOf(id);
  if (currentIndex === -1) return 'default';
  return PALETTE_IDS[(currentIndex + 1) % PALETTE_IDS.length];
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
