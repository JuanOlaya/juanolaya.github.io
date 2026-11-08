/** Screen ids used by the original sketch: 0 menu, 10–12 pixel grid, 20 generative art, 30–31 artwork. */
export type StartScreen = 10 | 20;

export interface WallConfig {
  /** First screen shown after setup. */
  screen: StartScreen;
  /** PixelGrid moved the shape bar 107 px left so it fits its wall display. */
  shapeBarOffsetX: number;
  /** PixelGrid draws the shape bar arcs with square caps. */
  squareShapeCaps: boolean;
}

export const PARTICLE_CANVAS: WallConfig = { screen: 20, shapeBarOffsetX: 0, squareShapeCaps: false };
export const PIXEL_GRID: WallConfig = { screen: 10, shapeBarOffsetX: 107, squareShapeCaps: true };

const START_SCREENS: readonly StartScreen[] = [10, 20];

function parseStartScreen(raw: string | null): StartScreen | undefined {
  const value = Number(raw);
  return START_SCREENS.find((screen) => screen === value);
}

/** `?screen=10|20` overrides the page default; any other value is ignored. */
export function resolveConfig(base: WallConfig, search: string): WallConfig {
  const screen = parseStartScreen(new URLSearchParams(search).get('screen'));
  return screen === undefined ? base : { ...base, screen };
}
