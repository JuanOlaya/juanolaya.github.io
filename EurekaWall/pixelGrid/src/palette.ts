/**
 * Palettes available in ShapyPresence:
 * - Modern: aligns with the portfolio style contract (orange, blue, green, red, cream)
 * - Classic: the original EurekaWall pixelGrid colors (purple, yellow, pink, green, orange)
 */

export type PaletteId = 'modern' | 'classic';

export interface PaletteDef {
  id: PaletteId;
  label: string;
  paints: readonly string[];
  paintNames: readonly string[];
  backgrounds: readonly string[];
  eraserSurface: string;
  eraserAccent: string;
}

export const PALETTES: Record<PaletteId, PaletteDef> = {
  modern: {
    id: 'modern',
    label: 'Modern',
    paints: ['#c48208', '#198bc6', '#7bd389', '#ff7b72', '#f8ecde'] as const,
    paintNames: ['Orange', 'Blue', 'Green', 'Red', 'Cream'] as const,
    backgrounds: ['#282828', '#33333d', '#198bc6', '#f8ecde'] as const,
    eraserSurface: '#33333d',
    eraserAccent: '#c48208',
  },
  classic: {
    id: 'classic',
    label: 'Classic',
    paints: ['#484B78', '#E4AA2D', '#C62F40', '#58875D', '#D0692E'] as const,
    paintNames: ['Purple', 'Yellow', 'Pink', 'Green', 'Orange'] as const,
    backgrounds: ['#1E1E1E', '#18111D', '#FF6600', '#E1CFA3'] as const,
    eraserSurface: '#18111D',
    eraserAccent: '#de5a04',
  },
} as const;

export const PALETTE_IDS: readonly PaletteId[] = ['modern', 'classic'] as const;

export function getPalette(id: PaletteId): PaletteDef {
  return PALETTES[id] ?? PALETTES.modern;
}

export function nextPalette(id: PaletteId): PaletteId {
  return id === 'modern' ? 'classic' : 'modern';
}

/** Home-page palette (shared style contract, §2). Literal constants: canvas code cannot read CSS tokens. */
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

/** Default paints (modern) for backwards compatibility */
export const PAINT_COLORS = PALETTES.modern.paints;
export const PAINT_NAMES = PALETTES.modern.paintNames;
export const BACKGROUNDS = PALETTES.modern.backgrounds;
