import { describe, expect, it } from 'vitest';
import { controlForKey, type KeyPress, type SketchControl } from './sketch-ui.ts';

const noop = () => {};
const controls: SketchControl[] = [
  { label: 'Pause', key: ' ', action: noop },
  { label: 'Reset', key: 'r', action: noop },
];

function press(key: string, modifiers: Partial<KeyPress> = {}): KeyPress {
  return { key, ctrlKey: false, metaKey: false, altKey: false, ...modifiers };
}

describe('controlForKey', () => {
  it('matches keys case-insensitively, including Space', () => {
    expect(controlForKey(controls, press('R'))?.label).toBe('Reset');
    expect(controlForKey(controls, press(' '))?.label).toBe('Pause');
  });

  it('leaves unknown keys and modifier shortcuts alone', () => {
    expect(controlForKey(controls, press('x'))).toBeUndefined();
    expect(controlForKey(controls, press('r', { ctrlKey: true }))).toBeUndefined();
    expect(controlForKey(controls, press('r', { metaKey: true }))).toBeUndefined();
  });
});
