import { describe, expect, it } from 'vitest';
import {
  align,
  cohesion,
  createAgent,
  move,
  seek,
  separate,
  wrap,
  type Agent,
  type AgentRandom,
} from './flocking.ts';
import { Vec2 } from './vec2.ts';

function agentAt(x: number, y: number, vx = 0, vy = 0): Agent {
  return {
    pos: new Vec2(x, y),
    vel: new Vec2(vx, vy),
    acc: new Vec2(),
    maxspeed: 10,
    maxforce: 0.1,
    color: '#000',
    ancho: 50,
    crossColor: '#000',
    rectColor: '#000',
    rot: 0,
  };
}

/** Behaves like p5's random() when Math.random() always returns 0.5. */
const half: AgentRandom = {
  random: (min, max) => (max === undefined ? min * 0.5 : min + (max - min) * 0.5),
  pick: (choices) => choices[Math.floor(choices.length * 0.5)],
};

describe('createAgent', () => {
  it('draws position, velocity, speed and colours from the random source', () => {
    const agent = createAgent(half, 800, 600);
    expect(agent.pos).toEqual(new Vec2(400, 300));
    expect(agent.vel).toEqual(new Vec2(0, 0));
    expect(agent.maxspeed).toBe(10.5);
    expect(agent.color).toBe('#023047');
    expect(agent.crossColor).toBe('#D93240');
    expect(agent.rot).toBe(5);
  });
});

describe('steering', () => {
  it('seek accelerates towards the target, limited to maxforce and scaled by strength', () => {
    const agent = agentAt(0, 0);
    seek(agent, new Vec2(100, 0), 5);
    expect(agent.acc.x).toBeCloseTo(0.5);
    expect(agent.acc.y).toBeCloseTo(0);
  });

  it('separate pushes away from close neighbours only', () => {
    const agent = agentAt(0, 0);
    separate(agent, [agent, agentAt(10, 0), agentAt(500, 0)]);
    expect(agent.acc.x).toBeLessThan(0);
    expect(agent.acc.y).toBeCloseTo(0);
  });

  it('align steers towards the heading of neighbours', () => {
    const agent = agentAt(0, 0);
    align(agent, [agent, agentAt(20, 0, 0, 5)]);
    expect(agent.acc.y).toBeGreaterThan(0);
  });

  it('cohesion pulls towards the neighbours centre in both halves', () => {
    for (const topHalf of [true, false]) {
      const agent = agentAt(0, 0);
      cohesion(agent, [agent, agentAt(30, 0)], topHalf);
      expect(agent.acc.x).toBeGreaterThan(0);
    }
  });

  it('does nothing without neighbours', () => {
    const agent = agentAt(0, 0);
    separate(agent, [agent]);
    align(agent, [agent]);
    cohesion(agent, [agent], true);
    expect(agent.acc).toEqual(new Vec2());
  });
});

describe('move and wrap', () => {
  it('integrates velocity and clears acceleration', () => {
    const agent = agentAt(0, 0, 1, 2);
    agent.acc = new Vec2(1, 0);
    move(agent, 1);
    expect(agent.pos).toEqual(new Vec2(2, 2));
    expect(agent.acc.mag()).toBe(0);
  });

  it('wraps 100px beyond each edge', () => {
    const agent = agentAt(-101, 701);
    wrap(agent, 800, 600);
    expect(agent.pos).toEqual(new Vec2(900, -100));
  });
});

describe('Vec2', () => {
  it('limit, setMag, normalize and div(0) follow p5.Vector', () => {
    expect(new Vec2(3, 4).limit(1).mag()).toBeCloseTo(1);
    const scaled = new Vec2(3, 4).setMag(10);
    expect(scaled.x).toBeCloseTo(6);
    expect(scaled.y).toBeCloseTo(8);
    expect(new Vec2(3, 4).div(0)).toEqual(new Vec2(3, 4));
    expect(new Vec2(0, 0).normalize()).toEqual(new Vec2(0, 0));
  });
});
