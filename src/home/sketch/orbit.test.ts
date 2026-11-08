import { describe, expect, it } from 'vitest';
import { orbitPoint, ringRadius, steer } from './orbit.ts';

const card = { x: 100, y: 50, width: 200, height: 100 };

describe('orbitPoint', () => {
  it('starts on the right edge of the padded ellipse', () => {
    expect(orbitPoint(card, 0, 10)).toEqual({ x: 310, y: 100 });
  });

  it('reaches the bottom edge a quarter turn later', () => {
    const point = orbitPoint(card, Math.PI / 2, 10);
    expect(point.x).toBeCloseTo(200);
    expect(point.y).toBeCloseTo(160);
  });

  it('opposite angles are symmetric around the card centre', () => {
    const a = orbitPoint(card, 1, 20);
    const b = orbitPoint(card, 1 + Math.PI, 20);
    expect((a.x + b.x) / 2).toBeCloseTo(200);
    expect((a.y + b.y) / 2).toBeCloseTo(100);
  });
});

describe('steer', () => {
  it('stays put when no time passes', () => {
    expect(steer({ x: 3, y: 4 }, { x: 9, y: 9 }, 8, 0)).toEqual({ x: 3, y: 4 });
  });

  it('lands in the same place with one long step or two short ones', () => {
    const target = { x: 100, y: -50 };
    const once = steer({ x: 0, y: 0 }, target, 8, 0.032);
    const twice = steer(steer({ x: 0, y: 0 }, target, 8, 0.016), target, 8, 0.016);
    expect(twice.x).toBeCloseTo(once.x, 9);
    expect(twice.y).toBeCloseTo(once.y, 9);
  });

  it('converges on the target when repeated', () => {
    let position = { x: 0, y: 0 };
    for (let i = 0; i < 120; i++) position = steer(position, { x: 50, y: 50 }, 8, 1 / 60);
    expect(position.x).toBeCloseTo(50, 3);
    expect(position.y).toBeCloseTo(50, 3);
  });
});

describe('ringRadius', () => {
  it('keeps the ball radius around big cards', () => {
    expect(ringRadius({ x: 0, y: 0, width: 400, height: 300 }, 86)).toBe(86);
  });

  it('shrinks to half the short side of small cards', () => {
    expect(ringRadius(card, 86)).toBe(50);
  });
});
