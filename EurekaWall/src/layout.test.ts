import { describe, expect, it } from 'vitest';
import { approach, buttonAt, isOnStart, wheelLayout } from './layout.ts';

const SIZES = [
  [1920, 1080],
  [390, 844],
] as const;

describe('wheelLayout', () => {
  it.each(SIZES)('keeps every button inside a %ix%i window and above the pivot', (width, height) => {
    const layout = wheelLayout(width, height, 5);
    const r = layout.buttonDiameter / 2;
    for (const b of layout.buttons) {
      expect(b.x - r).toBeGreaterThanOrEqual(0);
      expect(b.x + r).toBeLessThanOrEqual(width);
      expect(b.y).toBeLessThan(layout.pivot.y);
    }
  });

  it.each(SIZES)('does not let buttons overlap in a %ix%i window', (width, height) => {
    const layout = wheelLayout(width, height, 5);
    for (let i = 1; i < layout.buttons.length; i += 1) {
      const [a, b] = [layout.buttons[i - 1], layout.buttons[i]];
      expect(Math.hypot(a.x - b.x, a.y - b.y)).toBeGreaterThan(layout.buttonDiameter);
    }
  });

  it('is symmetric around the centre', () => {
    const { buttons, pivot } = wheelLayout(1000, 800, 5);
    expect(buttons[2].x).toBeCloseTo(pivot.x);
    expect(buttons[0].x + buttons[4].x).toBeCloseTo(2 * pivot.x);
  });
});

describe('hit tests', () => {
  const layout = wheelLayout(1920, 1080, 5);

  it('finds the button under the pointer', () => {
    const { x, y } = layout.buttons[3];
    expect(buttonAt(layout, x + 5, y - 5)).toBe(3);
    expect(buttonAt(layout, 0, 0)).toBe(-1);
  });

  it('finds the Start button', () => {
    expect(isOnStart(layout, layout.start.x, layout.start.y)).toBe(true);
    expect(isOnStart(layout, layout.start.x + layout.start.width, layout.start.y)).toBe(false);
  });
});

describe('approach', () => {
  it('gets closer without overshooting and is frame-rate independent', () => {
    const once = approach(0, 1, 2);
    const twice = approach(approach(0, 1, 1), 1, 1);
    expect(once).toBeCloseTo(twice);
    expect(once).toBeGreaterThan(0);
    expect(once).toBeLessThan(1);
    expect(approach(0.5, 1, 0)).toBe(0.5);
  });
});
