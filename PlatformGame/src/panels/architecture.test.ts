import { describe, expect, it } from 'vitest';
import { Vector } from '../domain/vector.ts';
import { IDLE_STEP, type InputState, type StepReport } from '../domain/world.ts';
import { describeFrame } from './architecture.ts';

const NO_INPUT: InputState = { left: false, right: false, up: false };

function report(overrides: Partial<StepReport>): StepReport {
  return { ...IDLE_STEP, ...overrides };
}

describe('describeFrame', () => {
  it('lists the four layers outermost first and lights none up on an idle frame', () => {
    const layers = describeFrame(IDLE_STEP, NO_INPUT);
    expect(layers.map((layer) => layer.layer)).toEqual([
      'UI · p5 + DOM',
      'Application',
      'Domain · entities',
      'Domain · service',
    ]);
    expect(layers.every((layer) => !layer.active)).toBe(true);
    expect(layers[1]?.status).toContain('0 steps');
    expect(layers[3]?.status).toBe('resolveCollisions(): no contact');
  });

  it('lights the UI layer while a key is held and names the keys', () => {
    const [ui] = describeFrame(IDLE_STEP, { left: true, right: false, up: true });
    expect(ui?.active).toBe(true);
    expect(ui?.status).toContain('← ↑');
  });

  it('lights application and entities when fixed steps ran, with the step count', () => {
    const layers = describeFrame(report({ steps: 2 }), NO_INPUT);
    expect(layers[1]).toMatchObject({ active: true, status: 'World.step(dt, input) → 2 fixed steps' });
    expect(layers[2]).toMatchObject({ active: true });
    expect(layers[2]?.status).toContain('Player.fall()');
    expect(layers[3]?.active).toBe(false);
  });

  it('lights the collision service on a landing and tells the bounce rule', () => {
    const landing = report({ steps: 1, side: 3, landingSpeed: 12, normal: new Vector(0, -1) });
    const service = describeFrame(landing, NO_INPUT)[3];
    expect(service?.active).toBe(true);
    expect(service?.status).toBe('resolveCollisions(): top · landed at 12.0, bounced ×1.05');
  });

  it('reports an end-wall bounce and a respawn', () => {
    const wall = describeFrame(report({ steps: 1, wallHit: true, normal: new Vector(1, 0) }), NO_INPUT);
    expect(wall[3]).toMatchObject({ active: true, status: 'resolveCollisions(): end wall' });
    const fell = describeFrame(report({ steps: 1, respawned: true }), NO_INPUT);
    expect(fell[2]?.status).toContain('respawned');
  });
});
