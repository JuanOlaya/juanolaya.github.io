import { Screen } from './screens.ts';

export type StartScreen = typeof Screen.PixelGrid | typeof Screen.GenerativeArt;

export interface WallConfig {
  /** First screen shown after setup. */
  screen: StartScreen;
  /** PixelGrid moved the shape bar 107 px left so it fits its wall display. */
  shapeBarOffsetX: number;
  /** PixelGrid draws the shape bar arcs with square caps. */
  squareShapeCaps: boolean;
}

export const PARTICLE_CANVAS: WallConfig = {
  screen: Screen.GenerativeArt,
  shapeBarOffsetX: 0,
  squareShapeCaps: false,
};
export const PIXEL_GRID: WallConfig = {
  screen: Screen.PixelGrid,
  shapeBarOffsetX: 107,
  squareShapeCaps: true,
};

const START_SCREENS: readonly StartScreen[] = [Screen.PixelGrid, Screen.GenerativeArt];

function parseStartScreen(raw: string | null): StartScreen | undefined {
  const value = Number(raw);
  return START_SCREENS.find((screen) => screen === value);
}

/** `?screen=10|20` overrides the page default; any other value is ignored. */
export function resolveConfig(base: WallConfig, search: string): WallConfig {
  const screen = parseStartScreen(new URLSearchParams(search).get('screen'));
  return screen === undefined ? base : { ...base, screen };
}
