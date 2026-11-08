import { describe, expect, it } from 'vitest';
import { isGridToggleShortcut } from './shortcuts';

// Stand-in for an element: only `closest` is used, and it matches when the selector names this tag.
function element(tag: string): { closest: (selector: string) => unknown } {
  return { closest: (selector) => (selector.split(',').some((part) => part.trim() === tag) ? {} : null) };
}

function keyup(code: string, target: unknown, defaultPrevented = false): Pick<KeyboardEvent, 'code' | 'target' | 'defaultPrevented'> {
  return { code, target: target as EventTarget, defaultPrevented };
}

describe('isGridToggleShortcut', () => {
  it('accepts Space when nothing interactive is focused', () => {
    expect(isGridToggleShortcut(keyup('Space', element('body')))).toBe(true);
    expect(isGridToggleShortcut(keyup('Space', null))).toBe(true);
  });

  it('ignores other keys', () => {
    expect(isGridToggleShortcut(keyup('Enter', element('body')))).toBe(false);
  });

  it.each(['button', 'input', 'textarea', 'select', 'a', '[contenteditable]'])(
    'ignores Space typed on an interactive %s, which handles the key itself',
    (tag) => {
      expect(isGridToggleShortcut(keyup('Space', element(tag)))).toBe(false);
    },
  );

  it('ignores Space when another handler already consumed it', () => {
    expect(isGridToggleShortcut(keyup('Space', element('body'), true))).toBe(false);
  });
});
