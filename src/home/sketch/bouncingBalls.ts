import type p5 from 'p5';
import { pulseLevel } from './motion.ts';
import type { Rect } from './orbit.ts';
import { fadeBucket, ringAlpha, type Trail } from './trail.ts';
import {
  ORBIT_TRAIL_LIFETIME,
  TRAIL_LIFETIME,
  advanceWorld,
  createWorld,
  setOrbitTarget,
  type Hue,
  type World,
} from './world.ts';

const BACKGROUND_GRAY = 40;
const RGB: Record<Hue, string> = { orange: '196,130,8', blue: '25,139,198' };
const ORBIT_ALPHA = 0.2;
// Rings are stroked in this many opacity steps: a handful of canvas calls per trail instead of one per ring.
const FADE_STEPS = 8;
const MAX_PIXEL_DENSITY = 2;
// A frame longer than this (tab switch, debugger) is treated as this long, so nothing teleports.
const MAX_STEP_SECONDS = 0.05;
// Reduced motion shows the trails a few seconds of motion would have left, then stays still.
const SETTLE_SECONDS = 4;
const SETTLE_STEP = 1 / 60;
const PULSE_PERIOD = 9;
const PULSE_DURATION = 0.8;
const PULSE_ALPHA = 0.22;

export interface BouncingBalls {
  sketch: (p: p5) => void;
  /** Clears the trails and starts again from new random positions. */
  refresh: () => void;
  /** Sends two rings to circle `rect` (a hovered card); `null` lets them go. Ignored under reduced motion. */
  setAttractor: (rect: Rect | null) => void;
  /** Stops the loop while the tab is hidden, so a background tab costs nothing. */
  setHidden: (hidden: boolean) => void;
}

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

interface TrailStyle {
  rgb: string;
  peak: number;
  lifetime: number;
}

function strokeTrail(ctx: CanvasRenderingContext2D, trail: Trail, now: number, style: TrailStyle): void {
  const { rgb, peak, lifetime } = style;
  let index = 0;
  // The trail is oldest first, so walking it from the faintest step down gives one contiguous run per step.
  for (let step = FADE_STEPS - 1; step >= 0 && index < trail.length; step--) {
    ctx.beginPath();
    while (index < trail.length && fadeBucket(now - trail[index].bornAt, lifetime, FADE_STEPS) >= step) {
      const { x, y, radius } = trail[index++];
      ctx.moveTo(x + radius, y);
      ctx.arc(x, y, radius, 0, Math.PI * 2);
    }
    const age = (lifetime * (step + 0.5)) / FADE_STEPS;
    ctx.strokeStyle = `rgba(${rgb},${ringAlpha(age, lifetime, peak)})`;
    ctx.stroke();
  }
}

function fillPulses(ctx: CanvasRenderingContext2D, world: World): void {
  world.particles.slice(0, 2).forEach((lead, i) => {
    const level = pulseLevel(world.time, PULSE_PERIOD, PULSE_DURATION, i * (PULSE_PERIOD / 2));
    if (level === 0) return;
    ctx.fillStyle = `rgba(${RGB[lead.hue]},${PULSE_ALPHA * level})`;
    ctx.beginPath();
    ctx.arc(lead.position.x, lead.position.y, lead.radius, 0, Math.PI * 2);
    ctx.fill();
  });
}

function render(p: p5, world: World): void {
  p.background(BACKGROUND_GRAY);
  const ctx = p.drawingContext as CanvasRenderingContext2D;
  ctx.lineWidth = 1;
  const { time, orbit } = world;
  for (const { trail, hue, alpha } of world.particles) {
    strokeTrail(ctx, trail, time, { rgb: RGB[hue], peak: alpha, lifetime: TRAIL_LIFETIME });
  }
  fillPulses(ctx, world);
  if (!orbit) return;
  const orbitStyle = { peak: ORBIT_ALPHA, lifetime: ORBIT_TRAIL_LIFETIME };
  strokeTrail(ctx, orbit.orangeTrail, time, { ...orbitStyle, rgb: RGB.orange });
  strokeTrail(ctx, orbit.blueTrail, time, { ...orbitStyle, rgb: RGB.blue });
}

function settle(world: World, noise: (x: number, y: number) => number): void {
  for (let t = 0; t < SETTLE_SECONDS; t += SETTLE_STEP) advanceWorld(world, SETTLE_STEP, noise);
}

/**
 * Background of the home page: translucent rings drift on noise-bent paths, leaving trails that fade
 * after a few seconds. Instance mode keeps p5 state out of `window`.
 */
export function createBouncingBalls(): BouncingBalls {
  let p: p5 | undefined;
  let world: World | undefined;
  const reduced = prefersReducedMotion();
  const noise = (x: number, y: number) => p?.noise(x, y) ?? 0.5;
  const random = (min: number, max: number) => p?.random(min, max) ?? min;
  const bounds = () => ({ width: p?.width ?? 0, height: p?.height ?? 0 });

  const start = () => {
    world = createWorld(bounds(), random);
    if (reduced) settle(world, noise);
  };
  const sketch = (instance: p5) => {
    p = instance;
    instance.setup = () => {
      instance.createCanvas(instance.windowWidth, instance.windowHeight);
      instance.pixelDensity(Math.min(window.devicePixelRatio || 1, MAX_PIXEL_DENSITY));
      start();
      if (reduced) instance.noLoop();
    };
    instance.windowResized = () => {
      instance.resizeCanvas(instance.windowWidth, instance.windowHeight);
      if (world) world.bounds = bounds();
    };
    instance.draw = () => {
      if (!world) return;
      if (!reduced) advanceWorld(world, Math.min(instance.deltaTime / 1000, MAX_STEP_SECONDS), noise);
      render(instance, world);
    };
  };
  const refresh = () => {
    if (!p) return;
    start();
    if (reduced) p.redraw();
  };
  const setAttractor = (rect: Rect | null) => {
    if (world && !reduced) setOrbitTarget(world, rect);
  };
  const setHidden = (hidden: boolean) => {
    if (!p || reduced) return;
    if (hidden) p.noLoop();
    else p.loop();
  };
  return { sketch, refresh, setAttractor, setHidden };
}
