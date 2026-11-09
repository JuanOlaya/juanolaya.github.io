import { GRAVITY, type Player } from '../domain/player.ts';
import type { Vector } from '../domain/vector.ts';
import type { StepReport, World } from '../domain/world.ts';
import { createPanel } from './panel.ts';

/** Text shown for each physics quantity; computed apart from the DOM so it can be tested. */
export interface PhysicsReadout {
  velocity: string;
  gravity: string;
  normal: string;
  minSpeed: string;
}

const REFRESH_SECONDS = 0.1;
/** Velocity arrows grow with speed up to this length; the normal is a unit vector, drawn at a fixed length. */
const MAX_VELOCITY_ARROW = 34;
const NORMAL_ARROW = 28;

const SIDE_NAMES: Record<number, string> = {
  1: 'top-left corner',
  2: 'top-left corner',
  3: 'top',
  4: 'top-right corner',
  5: 'top-right corner',
  6: 'right face',
  7: 'bottom-right corner',
  8: 'bottom-right corner',
  9: 'bottom',
  10: 'bottom-left corner',
  11: 'bottom-left corner',
  12: 'left face',
};

function fixed(value: number): string {
  // -0 would read as "-0.0"; the ball is simply still.
  return (Object.is(value, -0) ? 0 : value).toFixed(1);
}

/** Where the last contact happened: a platform side, an end wall, or nothing yet. */
export function contactName(report: Pick<StepReport, 'side' | 'normal'>): string {
  if (report.side) return SIDE_NAMES[report.side] ?? 'platform';
  return report.normal ? 'end wall' : 'none';
}

export function describePhysics(player: Player, report: StepReport): PhysicsReadout {
  const { velocity, minSpeed } = player;
  const normal = report.normal
    ? `(${fixed(report.normal.x)}, ${fixed(report.normal.y)}) · ${contactName(report)}`
    : 'none';
  return {
    velocity: `(${fixed(velocity.x)}, ${fixed(velocity.y)}) · ${fixed(velocity.length())} units/step`,
    gravity: `(${fixed(GRAVITY.x)}, ${fixed(GRAVITY.y)}) units/step², always on`,
    normal,
    minSpeed: `${fixed(minSpeed)} units/step`,
  };
}

const ROWS: readonly (readonly [keyof PhysicsReadout, string])[] = [
  ['velocity', 'Velocity'],
  ['gravity', 'Gravity'],
  ['normal', 'Contact normal'],
  ['minSpeed', 'Fastest rise since landing'],
];

const SVG = 'http://www.w3.org/2000/svg';

function arrow(className: string): SVGLineElement {
  const line = document.createElementNS(SVG, 'line');
  line.setAttribute('class', className);
  line.setAttribute('x1', '0');
  line.setAttribute('y1', '0');
  return line;
}

/** Points an arrow of `pixels` length from the centre along `direction`; hidden when there is none. */
function aim(line: SVGLineElement, direction: Vector | null, pixels: number): void {
  const size = direction?.length() ?? 0;
  if (!direction || size === 0) return line.setAttribute('visibility', 'hidden');
  line.removeAttribute('visibility');
  line.setAttribute('x2', String((direction.x / size) * pixels));
  line.setAttribute('y2', String((direction.y / size) * pixels));
}

function diagram(): { svg: SVGSVGElement; velocity: SVGLineElement; normal: SVGLineElement } {
  const svg = document.createElementNS(SVG, 'svg');
  svg.setAttribute('class', 'physics-diagram');
  svg.setAttribute('viewBox', '-40 -40 80 80');
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', 'Velocity (blue) and contact normal (orange) arrows');
  const ball = document.createElementNS(SVG, 'circle');
  ball.setAttribute('class', 'physics-diagram__ball');
  ball.setAttribute('r', '9');
  const velocity = arrow('physics-diagram__velocity');
  const normal = arrow('physics-diagram__normal');
  svg.append(ball, velocity, normal);
  return { svg, velocity, normal };
}

export interface PhysicsPanel {
  update(world: World, seconds: number): void;
}

/** Live readout of the ball's velocity, gravity and the last contact normal, refreshed 10×/s. */
export function mountPhysicsPanel(host: HTMLElement, collapsed: boolean): PhysicsPanel {
  const panel = createPanel(
    'Physics',
    'Fixed 1/30 s steps: gravity adds to the velocity, the velocity moves the ball, then every platform pushes it back out.',
    collapsed,
  );
  const list = document.createElement('dl');
  list.className = 'learn-panel__rows';
  const values = new Map<keyof PhysicsReadout, HTMLElement>();
  for (const [key, label] of ROWS) {
    const term = document.createElement('dt');
    term.textContent = label;
    const value = document.createElement('dd');
    values.set(key, value);
    list.append(term, value);
  }
  const arrows = diagram();
  const readout = document.createElement('div');
  readout.className = 'physics-readout';
  readout.append(arrows.svg, list);
  panel.body.append(readout);
  host.append(panel.element);
  let elapsed = REFRESH_SECONDS;
  return {
    update(world, seconds) {
      elapsed += seconds;
      const eventful = world.lastStep.side !== 0 || world.lastStep.wallHit;
      if (elapsed < REFRESH_SECONDS && !eventful) return;
      elapsed = 0;
      const readout = describePhysics(world.player, world.lastStep);
      for (const [key, node] of values) node.textContent = readout[key];
      const speed = world.player.velocity.length();
      aim(arrows.velocity, world.player.velocity, Math.min(speed * 2, MAX_VELOCITY_ARROW));
      aim(arrows.normal, world.lastStep.normal, NORMAL_ARROW);
    },
  };
}
