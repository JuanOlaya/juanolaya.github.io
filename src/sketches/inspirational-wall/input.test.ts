import { describe, expect, it } from 'vitest';
import { PARTICLE_CANVAS } from './config.ts';
import { applyToolbarButton, handleKey, nextWebcam } from './input.ts';
import { GeneralMode } from './screens.ts';
import { createWallState } from './state.ts';

// Only the "print" button touches the canvas, and it is not exercised here.
const canvas = {} as HTMLCanvasElement;

describe('nextWebcam', () => {
  it('cycles through the three webcams', () => {
    expect([1, 2, 3].map(nextWebcam)).toEqual([2, 3, 1]);
  });
});

describe('handleKey', () => {
  it("switches to the plain screen with '2' and back with '1'", () => {
    const state = createWallState(PARTICLE_CANVAS);
    handleKey(state, 50);
    expect(state.generalMode).toBe(GeneralMode.Plain);
    handleKey(state, 49);
    expect(state.generalMode).toBe(GeneralMode.Wall);
  });
});

describe('applyToolbarButton', () => {
  it('toggles pause and trails; adds shapes only below 150 and removes them only above 6', () => {
    const state = createWallState(PARTICLE_CANVAS);
    applyToolbarButton(state, 'pause', canvas);
    applyToolbarButton(state, 'trace', canvas);
    expect(state.paused).toBe(true);
    expect(state.clearBackground).toBe(false);
    applyToolbarButton(state, 'amountDown', canvas);
    expect(state.amountShapes).toBe(1);
    for (let i = 0; i < 100; i++) applyToolbarButton(state, 'amountUp', canvas);
    expect(state.amountShapes).toBe(151);
  });
});
