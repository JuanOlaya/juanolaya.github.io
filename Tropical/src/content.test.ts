import { describe, expect, it } from 'vitest';
import { flavors, translations } from './content';

describe('Tropical content', () => {
  it('has a non-empty text for every key in both languages', () => {
    for (const lang of ['de', 'en'] as const) {
      for (const [key, text] of Object.entries(translations[lang])) {
        expect(text.trim(), `${lang}.${key}`).not.toBe('');
      }
    }
  });

  it('lists the six flavors announced in the heading', () => {
    expect(flavors).toHaveLength(6);
  });
});
