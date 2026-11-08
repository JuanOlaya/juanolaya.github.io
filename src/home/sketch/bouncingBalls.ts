import type p5 from 'p5';
import { BALL_RADIUS, Ball, type Vec2 } from './ball.ts';
import { orbitPoint, ringRadius, steer, type Rect } from './orbit.ts';
import { isPressed, layoutFor, shiftTimings, startPositions, type Layout, type Timings } from './scene.ts';

const BACKGROUND_GRAY = 40;
const ORANGE = 'rgba(196,130,8, 0.25)';
const BLUE = 'rgba(25,139,198, 0.25)';
// The orange ball bounces off an invisible wall at 80 % of the width, leaving the right side to the blue one.
const DIAGONAL_RIGHT_LIMIT = 0.8;
// Upper bound for drawing the whole animation at once; both balls stop long before this.
const MAX_SETTLE_FRAMES = 20_000;
// Hover rings are fainter than the balls: they keep overdrawing the same orbit.
const ORANGE_RING = 'rgba(196,130,8, 0.12)';
const BLUE_RING = 'rgba(25,139,198, 0.12)';
const ORBIT_SPEED = 0.03;
const ORBIT_PADDING = 14;
const STEER_EASE = 0.12;

export interface BouncingBalls {
  sketch: (p: p5) => void;
  /** Clears the trails and replays the animation from new random positions. */
  refresh: () => void;
  /** Sends two rings to circle `rect` (a hovered card); `null` lets them go. Ignored under reduced motion. */
  setAttractor: (rect: Rect | null) => void;
}

/** Two rings, one per ball colour, that orbit a hovered card on opposite sides. */
interface Orbit {
  /** `null` while no card is hovered: the rings stop drawing but remember where they are. */
  rect: Rect | null;
  angle: number;
  orange: Vec2;
  blue: Vec2;
}

interface Scene {
  p: p5;
  layout: Layout;
  timings: Timings;
  diagonalBall: Ball;
  horizontalBall: Ball;
  horizontalHits: number;
  diagonalHits: number;
  orbit: Orbit | null;
}

function drawBall(p: p5, ball: Ball, color: string, filled: boolean): void {
  if (filled) {
    p.noStroke();
    p.fill(color);
  } else {
    p.noFill();
    p.stroke(color);
  }
  p.ellipse(ball.position.x, ball.position.y, ball.radius * 2, ball.radius * 2);
}

function createScene(p: p5): Scene {
  const layout = layoutFor(p.windowWidth, p.windowHeight);
  p.createCanvas(layout.canvas.width, layout.canvas.height);
  const start = startPositions(layout, 'initial', (min, max) => p.random(min, max));
  p.background(BACKGROUND_GRAY);
  return {
    p,
    layout,
    timings: layout.timings,
    diagonalBall: new Ball(start.diagonal, { x: 3, y: 3 }),
    horizontalBall: new Ball(start.horizontal, { x: 4, y: 4 }),
    horizontalHits: 0,
    diagonalHits: 0,
    orbit: null,
  };
}

function bounceAndCount(scene: Scene, ball: Ball, right: number): void {
  const hits = ball.bounce({ right, bottom: scene.p.height });
  scene.horizontalHits += hits.horizontal;
  scene.diagonalHits += hits.diagonal;
}

// Both balls share the two hit counters, exactly like the global counters of the original page.
function drawFrame(scene: Scene): void {
  const { p, layout, timings, diagonalBall, horizontalBall } = scene;
  const now = p.millis();
  if (scene.diagonalHits < layout.diagonalStopAfter) {
    drawBall(p, diagonalBall, ORANGE, isPressed(now, timings.pressDiagonal, timings.releaseDiagonal));
    diagonalBall.step();
    bounceAndCount(scene, diagonalBall, p.width * DIAGONAL_RIGHT_LIMIT);
  }
  if (scene.horizontalHits === 0) {
    drawBall(p, horizontalBall, BLUE, isPressed(now, timings.pressHorizontal, timings.releaseHorizontal));
    if (layout.mobile) horizontalBall.moveDown();
    else horizontalBall.moveLeft();
    bounceAndCount(scene, horizontalBall, p.width);
  }
}

function isFinished(scene: Scene): boolean {
  return scene.diagonalHits >= scene.layout.diagonalStopAfter && scene.horizontalHits !== 0;
}

/** Reduced motion: draw every frame of the run at once and leave the final picture still. */
function settle(scene: Scene): void {
  for (let frame = 0; frame < MAX_SETTLE_FRAMES && !isFinished(scene); frame++) drawFrame(scene);
  scene.p.noLoop();
}

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// resizeCanvas() wipes the pixels, so the trails drawn so far are copied back onto the new size.
function resize(scene: Scene): void {
  const { p } = scene;
  const trails = p.get();
  p.resizeCanvas(p.windowWidth, p.windowHeight);
  p.background(BACKGROUND_GRAY);
  p.image(trails, 0, 0);
  scene.layout = { ...scene.layout, canvas: { width: p.width, height: p.height } };
}

function drawRing(p: p5, center: Vec2, radius: number, color: string): void {
  p.noFill();
  p.stroke(color);
  p.ellipse(center.x, center.y, radius * 2, radius * 2);
}

function drawOrbit(p: p5, orbit: Orbit): void {
  const { rect } = orbit;
  if (!rect) return;
  orbit.angle += ORBIT_SPEED;
  orbit.orange = steer(orbit.orange, orbitPoint(rect, orbit.angle, ORBIT_PADDING), STEER_EASE);
  orbit.blue = steer(orbit.blue, orbitPoint(rect, orbit.angle + Math.PI, ORBIT_PADDING), STEER_EASE);
  const radius = ringRadius(rect, BALL_RADIUS);
  drawRing(p, orbit.orange, radius, ORANGE_RING);
  drawRing(p, orbit.blue, radius, BLUE_RING);
}

// The first hover sends the rings out from the balls; later ones fly them over from the last card.
function attract(scene: Scene, rect: Rect | null): void {
  if (scene.orbit) {
    scene.orbit.rect = rect;
    return;
  }
  if (!rect) return;
  const orange = { ...scene.diagonalBall.position };
  const blue = { ...scene.horizontalBall.position };
  scene.orbit = { rect, angle: 0, orange, blue };
}

function restart(scene: Scene): void {
  const { p, layout } = scene;
  p.background(BACKGROUND_GRAY);
  scene.horizontalHits = 0;
  scene.diagonalHits = 0;
  scene.orbit = null;
  const start = startPositions(layout, 'refresh', (min, max) => p.random(min, max));
  scene.diagonalBall.placeAt(start.diagonal);
  scene.horizontalBall.placeAt(start.horizontal);
  // The original page reset only the blue ball's x speed on desktop (to 3, slower than its first run).
  if (!layout.mobile) scene.horizontalBall.velocity.x = 3;
  scene.timings = shiftTimings(layout.timings, p.millis());
  if (prefersReducedMotion()) settle(scene);
}

/**
 * Background of the home page: two translucent balls leave trails (the canvas is never cleared)
 * until their wall hits stop them. Instance mode keeps p5 state out of `window`.
 */
export function createBouncingBalls(): BouncingBalls {
  let scene: Scene | undefined;
  const sketch = (p: p5) => {
    p.setup = () => {
      scene = createScene(p);
      if (prefersReducedMotion()) settle(scene);
    };
    p.windowResized = () => {
      if (scene) resize(scene);
    };
    p.draw = () => {
      if (!scene) return;
      drawFrame(scene);
      if (scene.orbit) drawOrbit(p, scene.orbit);
    };
  };
  const refresh = () => {
    if (scene) restart(scene);
  };
  const setAttractor = (rect: Rect | null) => {
    if (scene && !prefersReducedMotion()) attract(scene, rect);
  };
  return { sketch, refresh, setAttractor };
}
