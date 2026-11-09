import { describe, expect, it } from 'vitest';
import { Player } from '../domain/player.ts';
import { Vector } from '../domain/vector.ts';
import { IDLE_STEP, type StepReport } from '../domain/world.ts';
import { contactName, describePhysics } from './physics.ts';

function report(overrides: Partial<StepReport>): StepReport {
  return { ...IDLE_STEP, ...overrides };
}

describe('describePhysics', () => {
  it('prints velocity, its magnitude, gravity and the fastest rise with one decimal', () => {
    const player = new Player(new Vector(0, 0));
    player.velocity = new Vector(3, -4);
    player.minSpeed = -21;
    const readout = describePhysics(player, IDLE_STEP);
    expect(readout.velocity).toBe('(3.0, -4.0) · 5.0 units/step');
    expect(readout.gravity).toBe('(0.0, 0.6) units/step², always on');
    expect(readout.minSpeed).toBe('-21.0 units/step');
    expect(readout.normal).toBe('none');
  });

  it('never shows a negative zero for a resting ball', () => {
    const player = new Player(new Vector(0, 0));
    player.velocity = new Vector(-0, 0);
    expect(describePhysics(player, IDLE_STEP).velocity).toBe('(0.0, 0.0) · 0.0 units/step');
  });

  it('names the contact behind the normal', () => {
    const player = new Player(new Vector(0, 0));
    const top = describePhysics(player, report({ side: 3, normal: new Vector(0, -1) }));
    expect(top.normal).toBe('(0.0, -1.0) · top');
    const corner = report({ side: 1, normal: new Vector(-Math.SQRT1_2, -Math.SQRT1_2) });
    expect(describePhysics(player, corner).normal).toBe('(-0.7, -0.7) · top-left corner');
  });
});

describe('contactName', () => {
  it('distinguishes faces, corners, end walls and no contact', () => {
    expect(contactName(report({ side: 12 }))).toBe('left face');
    expect(contactName(report({ side: 6 }))).toBe('right face');
    expect(contactName(report({ side: 9 }))).toBe('bottom');
    expect(contactName(report({ side: 8 }))).toBe('bottom-right corner');
    expect(contactName(report({ side: 0, normal: new Vector(1, 0), wallHit: true }))).toBe('end wall');
    expect(contactName(IDLE_STEP)).toBe('none');
  });
});
