import { describe, expect, it } from 'vitest';
import { cognates } from './content';
import { barWidthPercent, estimateVocabulary, findCognate, normalizeWord } from './vocabulary';

describe('estimateVocabulary', () => {
  it('matches the original values at the default age of 7', () => {
    expect(estimateVocabulary(7)).toEqual({ es: 8367, de: 9773, en: 6667 });
  });

  it('has no English before the age of 5', () => {
    expect(estimateVocabulary(4).en).toBe(0);
    expect(estimateVocabulary(5).en).toBe(3333);
  });

  it('reaches the adult ceilings at 18', () => {
    expect(estimateVocabulary(18)).toEqual({ es: 30000, de: 35000, en: 25000 });
  });
});

describe('barWidthPercent', () => {
  it('caps the bar at 100%', () => {
    expect(barWidthPercent(50_000, 35_000)).toBe(100);
    expect(barWidthPercent(17_500, 35_000)).toBe(50);
  });
});

describe('findCognate', () => {
  it('ignores case and accents', () => {
    expect(normalizeWord('  Información ')).toBe('informacion');
    expect(findCognate(cognates, 'INFORMACIÓN')?.en).toBe('Information');
  });

  it('finds a word by its German or English form', () => {
    expect(findCognate(cognates, 'bruder')?.en).toBe('Brother');
    expect(findCognate(cognates, 'water')?.de).toBe('Wasser');
  });

  it('returns nothing for empty or unknown input', () => {
    expect(findCognate(cognates, '   ')).toBeUndefined();
    expect(findCognate(cognates, 'xyz')).toBeUndefined();
  });
});
