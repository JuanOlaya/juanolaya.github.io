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
  it('moves the given fraction of the way', () => {
    expect(steer({ x: 0, y: 0 }, { x: 100, y: -50 }, 0.1)).toEqual({ x: 10, y: -5 });
  });

  it('stays put with ease 0 and arrives with ease 1', () => {
    expect(steer({ x: 3, y: 4 }, { x: 9, y: 9 }, 0)).toEqual({ x: 3, y: 4 });
    expect(steer({ x: 3, y: 4 }, { x: 9, y: 9 }, 1)).toEqual({ x: 9, y: 9 });
  });

  it('converges on the target when repeated', () => {
    let position = { x: 0, y: 0 };
    for (let i = 0; i < 100; i++) position = steer(position, { x: 50, y: 50 }, 0.12);
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
