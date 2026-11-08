import { describe, expect, it } from 'vitest';
import { domains, guideCards, principles, topics } from './content';

describe('Project_Management content', () => {
  it('has the 12 principles and 8 performance domains of PMBOK 7', () => {
    expect(principles).toHaveLength(12);
    expect(domains).toHaveLength(8);
  });

  it('opens an existing topic with at least one bullet from every card', () => {
    const ids = [...principles, ...domains, ...guideCards].map((card) => card.id);
    for (const id of ids) {
      expect(topics[id].items.length, id).toBeGreaterThan(0);
    }
  });
});
