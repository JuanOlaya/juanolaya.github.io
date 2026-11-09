import { describe, expect, it } from 'vitest';
import { highlightSeconds, initialCollapsed } from './panel.ts';

describe('initialCollapsed', () => {
  it('folds the panels on phones and opens them from tablets up', () => {
    expect(initialCollapsed(320)).toBe(true);
    expect(initialCollapsed(640)).toBe(true);
    expect(initialCollapsed(641)).toBe(false);
    expect(initialCollapsed(1280)).toBe(false);
  });
});

describe('highlightSeconds', () => {
  it('never lights a layer up when the user prefers reduced motion', () => {
    expect(highlightSeconds(true)).toBe(0);
    expect(highlightSeconds(false)).toBeGreaterThan(0);
  });
});
