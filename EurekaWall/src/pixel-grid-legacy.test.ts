import { readFileSync } from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { describe, expect, it } from 'vitest';

const SCRIPT = path.resolve(import.meta.dirname, '../pixelGrid/script.js');
const SHAPE_CALLS = new Set(['ellipse', 'rect', 'arc', 'triangle']);
const SHAPE_COUNT = 12;
const PURPLE = '#484B78';

type FillEvent = { kind: 'fill'; color: unknown } | { kind: 'noFill' } | { kind: 'shape' };

// Runs the legacy global-mode p5 script with recording stubs instead of p5.
function loadPixelClass(events: FillEvent[]): new (x: number, y: number, d: number) => { status: number; indexColor: number; show(): void } {
  const element = { addEventListener: () => undefined, style: {} };
  const record = (name: string) => () => {
    if (SHAPE_CALLS.has(name)) events.push({ kind: 'shape' });
  };
  const context: Record<string, unknown> = {
    document: { getElementById: () => element, getElementsByClassName: () => [] },
    window: { location: {} },
    random: () => 0,
    floor: Math.floor,
    PI: Math.PI,
    CHORD: 'chord',
    CENTER: 'center',
    CORNER: 'corner',
    fill: (color: unknown) => events.push({ kind: 'fill', color }),
    noFill: () => events.push({ kind: 'noFill' }),
  };
  for (const name of ['ellipse', 'rect', 'arc', 'triangle', 'stroke', 'noStroke', 'strokeWeight', 'rectMode', 'push', 'pop', 'translate']) {
    context[name] = record(name);
  }
  const source = `${readFileSync(SCRIPT, 'utf8')}\nglobalThis.__Pixel = Pixel;`;
  vm.runInNewContext(source, context);
  return context.__Pixel as ReturnType<typeof loadPixelClass>;
}

function fillAtFirstShape(events: FillEvent[]): unknown {
  let current: unknown = null;
  for (const event of events) {
    if (event.kind === 'shape') return current;
    current = event.kind === 'fill' ? event.color : null;
  }
  return undefined;
}

describe('EurekaWall pixelGrid legacy shapes', () => {
  const statuses = Array.from({ length: SHAPE_COUNT }, (_, index) => index + 1);

  it.each(statuses)('shape %i is drawn filled with the selected color', (status) => {
    const events: FillEvent[] = [];
    const Pixel = loadPixelClass(events);
    const pixel = new Pixel(100, 100, 50);
    pixel.status = status;
    pixel.indexColor = 0;
    events.length = 0;
    pixel.show();
    expect(fillAtFirstShape(events)).toBe(PURPLE);
  });
});
