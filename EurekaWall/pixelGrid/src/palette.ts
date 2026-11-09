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

/** The five paints a cell can take, in toolbar order; index 5 is "same as the background" (see grid.ts). */
export const PAINT_COLORS = [
  PALETTE.accent,
  PALETTE.info,
  PALETTE.success,
  PALETTE.danger,
  PALETTE.ink,
] as const;

export const PAINT_NAMES = ['Orange', 'Blue', 'Green', 'Red', 'Cream'] as const;

/** Backgrounds the B key cycles through: two dark, one saturated, one light, like the original four. */
export const BACKGROUNDS = [PALETTE.bg, PALETTE.surface, PALETTE.info, PALETTE.ink] as const;
