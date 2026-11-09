import { describe, expect, it } from 'vitest';
import { STACK_BELOW_PX, tableLayoutForWidth } from './table-layout.ts';

describe('tableLayoutForWidth', () => {
  it.each([0, 319, 320, 639])('stacks the five-column table into cards at %ipx', (width) => {
    expect(tableLayoutForWidth(width)).toBe('cards');
  });

  it.each([640, 1024, 1280])('keeps the table from %ipx on', (width) => {
    expect(tableLayoutForWidth(width)).toBe('table');
  });

  it('matches the contract breakpoint', () => {
    expect(STACK_BELOW_PX).toBe(640);
  });

  it.each([Number.NaN, -1, Number.POSITIVE_INFINITY])(
    'shows the full table for the unusable width %s instead of hiding columns',
    (width) => {
      expect(tableLayoutForWidth(width)).toBe('table');
    },
  );
});
