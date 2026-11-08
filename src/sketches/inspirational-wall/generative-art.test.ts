import { describe, expect, it } from 'vitest';
import { PARTICLE_CANVAS } from './config.ts';
import { generativeArtPanel, nextShape, regenerate } from './generative-art.ts';
import { createWallState } from './state.ts';

describe('nextShape', () => {
  it('cycles lines → crosses → bars → lines', () => {
    expect([1, 2, 3].map(nextShape)).toEqual([2, 3, 1]);
  });
});

describe('regenerate', () => {
  it('empties both flocks', () => {
    const state = createWallState(PARTICLE_CANVAS);
    regenerate(state);
    expect(state.groupA).toEqual([]);
    expect(state.groupB).toEqual([]);
  });
});

describe('generativeArtPanel', () => {
  it('toggles pause and trails and reports them as pressed', () => {
    const state = createWallState(PARTICLE_CANVAS);
    const controls = generativeArtPanel(state, () => undefined).controls;
    const control = (key: string) => controls.find((c) => c.key === key)!;
    control(' ').action();
    control('t').action();
    expect(control(' ').pressed?.()).toBe(true);
    expect(control('t').pressed?.()).toBe(true);
    expect(state.clearBackground).toBe(false);
  });
});
