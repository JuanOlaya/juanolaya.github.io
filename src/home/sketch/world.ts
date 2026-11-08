import { headingVelocity, pullToward, stepMover, type Bounds, type Mover, type Vec2 } from './motion.ts';
import { orbitPoint, ringRadius, steer, type Rect } from './orbit.ts';
import { dropExpired, recordRing, type Trail } from './trail.ts';

export type Hue = 'orange' | 'blue';

export interface Particle extends Mover {
  hue: Hue;
  /** Peak opacity of a fresh trail ring; the two leads are the brightest. */
  alpha: number;
  /** Index of the lead it drifts with, or `null` for the two leads. */
  leader: number | null;
  /** Offset into the noise field, so each particle wobbles on its own. */
  seed: number;
  trail: Trail;
}

/** Two rings, one per colour, that orbit a hovered card on opposite sides and leave their own trails. */
export interface Orbit {
  /** `null` once the card is left: the rings stop and their trails fade out. */
  rect: Rect | null;
  angle: number;
  orange: Vec2;
  blue: Vec2;
  orangeTrail: Trail;
  blueTrail: Trail;
}

export interface World {
  bounds: Bounds;
  /** Simulation clock in seconds; it stops while the tab is hidden. */
  time: number;
  particles: Particle[];
  orbit: Orbit | null;
}

export type RandomRange = (min: number, max: number) => number;
/** Smooth noise in 0..1, e.g. p5's `noise(x, y)`. */
export type Noise = (x: number, y: number) => number;

export const TRAIL_LIFETIME = 4;
export const ORBIT_TRAIL_LIFETIME = 2.5;
// The original ball radius, kept on large screens and as the cap for the hover rings.
const MAX_LEAD_RADIUS = 86;
const SMALL_SCREEN = 640;
const SATELLITES_SMALL = 1;
const SATELLITES_LARGE = 3;
const LEAD_ALPHA = 0.24;
// Rings are dropped every 8 % of their radius: dense enough to read as a tube, cheap to stroke.
const RING_SPACING_RATIO = 0.08;
const MIN_RING_SPACING = 4;
const ORBIT_RING_SPACING = 9;
const STEER_RATE = 1.5;
const NOISE_SPEED = 0.15;
// Noise wobble range in radians: enough to bend the paths, not enough to loop.
const WOBBLE = 2.2;
const LEADER_PULL = 0.08;
const MAX_PULL = 60;
const ORBIT_SPEED = 1.8;
const ORBIT_STEER_RATE = 8;
const ORBIT_PADDING = 14;

/** Lead ring radius: the original size on large screens, smaller on phones. */
export function leadRadius(bounds: Bounds): number {
  return Math.min(MAX_LEAD_RADIUS, Math.max(44, Math.min(bounds.width, bounds.height) * 0.11));
}

/** Cruise speed in px/s, scaled with the screen so a phone is not crossed in a second. */
export function leadSpeed(bounds: Bounds): number {
  return Math.min(150, Math.max(70, Math.min(bounds.width, bounds.height) * 0.16));
}

/** Satellites per colour: fewer on small screens to keep phones cool. */
export function satellitesPerHue(width: number): number {
  return width < SMALL_SCREEN ? SATELLITES_SMALL : SATELLITES_LARGE;
}

function spawn(bounds: Bounds, random: RandomRange, radius: number, speed: number): Mover {
  const heading = random(0, Math.PI * 2);
  return {
    position: { x: random(radius, bounds.width - radius), y: random(radius, bounds.height - radius) },
    velocity: headingVelocity(heading, speed),
    heading,
    radius,
    speed,
  };
}

function createLead(bounds: Bounds, random: RandomRange, hue: Hue): Particle {
  const mover = spawn(bounds, random, leadRadius(bounds), leadSpeed(bounds));
  return { ...mover, hue, alpha: LEAD_ALPHA, leader: null, seed: random(0, 1000), trail: [] };
}

function createSatellite(bounds: Bounds, random: RandomRange, hue: Hue, leader: number): Particle {
  const radius = leadRadius(bounds) * random(0.22, 0.5);
  const mover = spawn(bounds, random, radius, leadSpeed(bounds) * random(0.6, 1.1));
  return { ...mover, hue, alpha: random(0.07, 0.14), leader, seed: random(0, 1000), trail: [] };
}

/** The orange lead is particle 0 and the blue one particle 1; satellites follow them. */
export function createWorld(bounds: Bounds, random: RandomRange): World {
  const particles = [createLead(bounds, random, 'orange'), createLead(bounds, random, 'blue')];
  for (let i = 0; i < satellitesPerHue(bounds.width); i++) {
    particles.push(createSatellite(bounds, random, 'orange', 0), createSatellite(bounds, random, 'blue', 1));
  }
  return { bounds, time: 0, particles, orbit: null };
}

function targetVelocity(world: World, particle: Particle, noise: Noise): Vec2 {
  const wobble = (noise(particle.seed, world.time * NOISE_SPEED) - 0.5) * WOBBLE;
  const cruise = headingVelocity(particle.heading + wobble, particle.speed);
  if (particle.leader === null) return cruise;
  const lead = world.particles[particle.leader].position;
  const pull = pullToward(particle.position, lead, LEADER_PULL, MAX_PULL);
  return { x: cruise.x + pull.x, y: cruise.y + pull.y };
}

function advanceOrbit(orbit: Orbit, time: number, dt: number): void {
  const { rect } = orbit;
  if (rect) {
    orbit.angle += ORBIT_SPEED * dt;
    orbit.orange = steer(orbit.orange, orbitPoint(rect, orbit.angle, ORBIT_PADDING), ORBIT_STEER_RATE, dt);
    orbit.blue = steer(
      orbit.blue,
      orbitPoint(rect, orbit.angle + Math.PI, ORBIT_PADDING),
      ORBIT_STEER_RATE,
      dt,
    );
    const radius = ringRadius(rect, MAX_LEAD_RADIUS);
    recordRing(orbit.orangeTrail, orbit.orange, radius, time, ORBIT_RING_SPACING);
    recordRing(orbit.blueTrail, orbit.blue, radius, time, ORBIT_RING_SPACING);
  }
  dropExpired(orbit.orangeTrail, time, ORBIT_TRAIL_LIFETIME);
  dropExpired(orbit.blueTrail, time, ORBIT_TRAIL_LIFETIME);
}

/** Moves everything `dt` seconds forward and updates the trails. */
export function advanceWorld(world: World, dt: number, noise: Noise): void {
  world.time += dt;
  for (const particle of world.particles) {
    stepMover(particle, targetVelocity(world, particle, noise), dt, STEER_RATE, world.bounds);
    const spacing = Math.max(MIN_RING_SPACING, particle.radius * RING_SPACING_RATIO);
    recordRing(particle.trail, particle.position, particle.radius, world.time, spacing);
    dropExpired(particle.trail, world.time, TRAIL_LIFETIME);
  }
  if (world.orbit) advanceOrbit(world.orbit, world.time, dt);
}

// The first hover sends the rings out from the leads; later ones fly them over from the last card.
export function setOrbitTarget(world: World, rect: Rect | null): void {
  if (world.orbit) {
    world.orbit.rect = rect;
    return;
  }
  if (!rect) return;
  const [orange, blue] = world.particles;
  world.orbit = {
    rect,
    angle: 0,
    orange: { ...orange.position },
    blue: { ...blue.position },
    orangeTrail: [],
    blueTrail: [],
  };
}
