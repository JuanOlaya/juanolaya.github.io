import { Vec2 } from './vec2.ts';

export interface Agent {
  pos: Vec2;
  vel: Vec2;
  acc: Vec2;
  maxspeed: number;
  maxforce: number;
  color: string;
  ancho: number;
  crossColor: string;
  rectColor: string;
  rot: number;
}

/** The subset of p5's `random()` the agents need, so tests can pass a deterministic source. */
export interface AgentRandom {
  random(min: number, max?: number): number;
  pick<T>(choices: readonly T[]): T;
}

export const PALETTE = ['#8ecae6', '#219ebc', '#023047', '#ffb703', '#fb8500'] as const;
export const CROSS_PALETTE = ['#FE9601', '#686491', '#D93240', '#0B99BC'] as const;
export const RECT_PALETTE = ['#9b5de5', '#f15bb5', '#fee440', '#00bbf9', '#00f5d4'] as const;

const SEPARATION_RADIUS = 40;
const NEIGHBORHOOD_RADIUS = 50;
const WRAP_MARGIN = 100;

function isNeighbour(distance: number, radius: number): boolean {
  return distance > 0 && distance < radius;
}

/** Field order matters: it fixes the order of random draws, as in the original object literal. */
export function createAgent(rng: AgentRandom, width: number, height: number): Agent {
  return {
    pos: new Vec2(rng.random(width), rng.random(height)),
    vel: new Vec2(rng.random(-1, 1), rng.random(-1, 1)),
    acc: new Vec2(),
    maxspeed: rng.random(9, 12),
    maxforce: rng.random(0.05, 0.2),
    color: rng.pick(PALETTE),
    ancho: rng.random(30, 100),
    crossColor: rng.pick(CROSS_PALETTE),
    rectColor: rng.pick(RECT_PALETTE),
    rot: rng.random(10),
  };
}

export function applyForce(agent: Agent, force: Vec2, strength = 1): void {
  force.mult(strength);
  agent.acc.add(force);
}

export function steer(agent: Agent, targetDirection: Vec2, strength = 1): void {
  const steering = Vec2.sub(targetDirection, agent.vel);
  steering.limit(agent.maxforce);
  applyForce(agent, steering, strength);
}

export function seek(agent: Agent, target: Vec2, strength = 1): void {
  const targetDirection = Vec2.sub(target, agent.pos);
  targetDirection.normalize();
  targetDirection.mult(agent.maxspeed);
  steer(agent, targetDirection, strength);
}

export function separate(agent: Agent, group: readonly Agent[], strength = 1): void {
  const sum = new Vec2();
  let count = 0;
  for (const other of group) {
    const d = agent.pos.dist(other.pos);
    if (!isNeighbour(d, SEPARATION_RADIUS)) continue;
    const diff = Vec2.sub(agent.pos, other.pos);
    diff.normalize();
    diff.div(d);
    sum.add(diff);
    count++;
  }
  if (count === 0) return;
  sum.div(count);
  sum.setMag(agent.maxspeed);
  steer(agent, sum, strength);
}

export function align(agent: Agent, group: readonly Agent[], strength = 1): void {
  const sum = new Vec2();
  let count = 0;
  for (const other of group) {
    const d = agent.pos.dist(other.pos);
    if (!isNeighbour(d, NEIGHBORHOOD_RADIUS)) continue;
    sum.add(other.vel);
    count++;
  }
  if (count === 0) return;
  sum.div(count);
  sum.normalize();
  sum.mult(agent.maxspeed);
  steer(agent, sum, strength);
}

/** In the top half of the screen agents steer towards neighbours; in the bottom half they seek them. */
export function cohesion(
  agent: Agent,
  group: readonly Agent[],
  pointerInTopHalf: boolean,
  strength = 1,
): void {
  const sum = new Vec2();
  let count = 0;
  for (const other of group) {
    const d = agent.pos.dist(other.pos);
    if (!isNeighbour(d, NEIGHBORHOOD_RADIUS)) continue;
    sum.add(other.pos);
    count++;
  }
  if (count === 0) return;
  sum.div(count);
  if (pointerInTopHalf) steer(agent, sum, strength);
  else seek(agent, sum, strength);
}

/** `frames` is the step's length in 60 FPS frames (see `frameScale`); 1 moves exactly as the original. */
export function move(agent: Agent, speedFactor: number, frames = 1): void {
  agent.vel.add(agent.acc);
  agent.vel.mult(speedFactor);
  agent.pos.add(agent.vel.copy().mult(frames));
  agent.acc.mult(0);
}

export function wrap(agent: Agent, width: number, height: number): void {
  if (agent.pos.x < -WRAP_MARGIN) agent.pos.x = width + WRAP_MARGIN;
  if (agent.pos.y < -WRAP_MARGIN) agent.pos.y = height + WRAP_MARGIN;
  if (agent.pos.x > width + WRAP_MARGIN) agent.pos.x = -WRAP_MARGIN;
  if (agent.pos.y > height + WRAP_MARGIN) agent.pos.y = -WRAP_MARGIN;
}
