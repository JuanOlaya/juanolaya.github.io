import { describe, expect, it } from 'vitest';
import { devices } from './data/devices';
import { researchFocus } from './versatility';

const byName = (name: string) => devices.find((device) => device.name === name)!;

describe('research focus', () => {
  it('maps audited sensations to topics', () => {
    expect(researchFocus(byName('Drag:on'))).toEqual([
      'Compliance & Force',
      'Mass & Inertia',
      'Surface & Form',
    ]);
  });

  it('falls back to Active Actuation when nothing matches', () => {
    const device = {
      ...byName('Drag:on'),
      audit: { ...byName('Drag:on').audit, sensations: ['Motion' as const] },
    };
    expect(researchFocus(device)).toEqual(['Active Actuation']);
  });
});
