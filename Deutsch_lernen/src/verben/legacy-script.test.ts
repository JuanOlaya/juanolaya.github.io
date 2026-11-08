import { describe, expect, it } from 'vitest';
import { declarationsOf, loadLegacyDeclarations, readLegacyScript } from './legacy-script.ts';

/**
 * Characterization tests: they pin what `verben/A1_A2_B1/script/script.js` does today, quirks included, so the
 * upcoming split into TypeScript modules can prove it changes nothing. A quirk that is a bug is marked as such;
 * fix it in its own change and update the expectation there.
 */

interface LegacyHelpers {
  formatVerbPrefix: (verbName: string, isModal?: boolean) => string;
  hexToRgb: (hex: string) => unknown;
  rgbToHex: (rgb: { r: number; g: number; b: number }) => string;
  mixHexColors: (colorA: string, colorB: string, weight?: number) => string;
  normalizeMojibakeString: (value: unknown) => unknown;
  normalizeMojibakeDeep: (value: unknown) => unknown;
  normalizeSearchValue: (value: unknown) => string;
  findMatchingWordInText: (text: unknown, searchTerm: string) => string;
  findMatchingTextEntry: (
    entries: unknown[] | null,
    searchTerm: string,
    extractor?: (entry: { de: string }) => unknown,
  ) => string;
  removeParentheses: (text: string | null) => string | null;
  getPrimaryTranslation: (text: string | null) => string;
  getCardTranslation: (verbData: unknown) => string;
  getCardTranslationLines: (verbData: unknown) => string[];
  getCleanPerfekt: (perfekt: string) => string;
  getCleanPraeteritum: (praeteritum: string) => string;
  cleanVerbForm: (phrase: string | null) => string;
  conjugateBaseForm: (phrase: string, suffix: string) => string;
}

const NAMES = [
  'separablePrefixesMap',
  'formatVerbPrefix',
  'hexToRgb',
  'rgbToHex',
  'mixHexColors',
  'normalizeMojibakeString',
  'normalizeMojibakeDeep',
  'normalizeSearchValue',
  'findMatchingWordInText',
  'findMatchingTextEntry',
  'removeParentheses',
  'getPrimaryTranslation',
  'getCardTranslation',
  'getCardTranslationLines',
  'getCleanPerfekt',
  'getCleanPraeteritum',
  'cleanVerbForm',
  'conjugateBaseForm',
] as const;

const legacy = loadLegacyDeclarations<LegacyHelpers>(NAMES);

describe('conjugateBaseForm (card back conjugation table)', () => {
  it.each([
    ['mach', 'st', 'machst'],
    ['arbeite', 'st', 'arbeitest'],
    ['find', 'st', 'findest'],
    ['arbeit', 'st', 'arbeitest'],
    ['mach', 'n', 'machen'],
    ['arbeite', 'n', 'arbeiten'],
    ['gehen', 'n', 'gehen'],
    ['mach', 't', 'macht'],
    ['spiele', 't', 'spielet'],
    ['find', 't', 'findet'],
    // Quirk: a stem already ending in "t" gets no ending ("ihr arbeit").
    ['arbeit', 't', 'arbeit'],
    ['mach', 'x', 'mach'],
  ])('%s + %s → %s', (phrase, suffix, expected) => {
    expect(legacy.conjugateBaseForm(phrase, suffix)).toBe(expected);
  });

  it('strips a leading pronoun and keeps a separable prefix after the stem', () => {
    expect(legacy.conjugateBaseForm('ich spiele', 'n')).toBe('spielen');
    expect(legacy.conjugateBaseForm('er/sie/es biege ab', 'st')).toBe('biegest ab');
    expect(legacy.conjugateBaseForm('sie/Sie rufe an', 'n')).toBe('rufen an');
  });

  it('returns an empty string for an empty phrase', () => {
    expect(legacy.conjugateBaseForm('', 'st')).toBe('');
  });
});

describe('cleanVerbForm (tense buttons on the card back)', () => {
  it.each([
    ['er/sie/es macht', 'macht'],
    ['Er ist gegangen', 'ist gegangen'],
    ['er freut sich auf', 'freut auf'],
    // Quirk: a trailing reflexive pronoun stays because the pattern needs whitespace after it.
    ['er wäscht sich', 'wäscht sich'],
    ['  ich   habe   gemacht ', 'habe gemacht'],
    ['wir treffen uns heute', 'treffen heute'],
    ['', ''],
  ])('%j → %j', (phrase, expected) => {
    expect(legacy.cleanVerbForm(phrase)).toBe(expected);
  });

  it('is null-safe', () => {
    expect(legacy.cleanVerbForm(null)).toBe('');
  });

  it('has a second, identical copy in the modal tense tabs', () => {
    const withoutComments = (code: string) => code.replace(/\/\/[^\n]*/g, '').replace(/\s+/g, ' ');
    const copies = declarationsOf(readLegacyScript(), 'cleanVerbForm').map(withoutComments);
    expect(copies).toHaveLength(2);
    expect(copies[1]).toBe(copies[0]);
  });
});

describe('Perfekt / Präteritum display helpers', () => {
  it.each([
    ['hat gemacht', 'gemacht'],
    ['ist gegangen', 'gegangen'],
    ['Hat gemacht', 'gemacht'],
    ['hat sich gefreut', 'sich gefreut'],
    ['gemacht', 'gemacht'],
    ['---', '---'],
    ['', '---'],
  ])('getCleanPerfekt(%j) → %j', (input, expected) => {
    expect(legacy.getCleanPerfekt(input)).toBe(expected);
  });

  it.each([
    ['er/sie/es machte', 'machte'],
    ['machte', 'machte'],
    ['er machte', 'er machte'],
    ['', '---'],
  ])('getCleanPraeteritum(%j) → %j', (input, expected) => {
    expect(legacy.getCleanPraeteritum(input)).toBe(expected);
  });
});

describe('translations', () => {
  it.each([
    ['(sich) alegrarse', 'alegrarse'],
    ['(algo) hacer', 'algo hacer'],
    ['hacer o realizar', 'hacer / realizar'],
    ['  cocinar  ', 'cocinar'],
    ['', ''],
  ])('removeParentheses(%j) → %j', (input, expected) => {
    expect(legacy.removeParentheses(input)).toBe(expected);
  });

  it('removeParentheses passes null through', () => {
    expect(legacy.removeParentheses(null)).toBeNull();
  });

  it('getPrimaryTranslation keeps the first alternative', () => {
    expect(legacy.getPrimaryTranslation('hacer / realizar')).toBe('hacer');
    expect(legacy.getPrimaryTranslation('(sich) alegrarse o reír')).toBe('alegrarse');
    expect(legacy.getPrimaryTranslation(null)).toBe('');
  });

  it('getCardTranslation prefers card_es', () => {
    expect(legacy.getCardTranslation({ card_es: 'Hacer', es: 'a / b' })).toBe('Hacer');
    expect(legacy.getCardTranslation({ es: 'a / b' })).toBe('a');
    expect(legacy.getCardTranslation(null)).toBe('');
  });

  it('getCardTranslationLines splits on commas, slashes and newlines', () => {
    expect(legacy.getCardTranslationLines({ es: 'hacer, realizar / ejecutar' })).toEqual([
      'hacer',
      'realizar',
    ]);
    expect(legacy.getCardTranslationLines({ card_es: 'ir\npasear, / andar' })).toEqual([
      'ir',
      'pasear',
      'andar',
    ]);
    expect(legacy.getCardTranslationLines(null)).toEqual([]);
  });
});

describe('search matching', () => {
  it('normalizeSearchValue lowercases and drops diacritics', () => {
    expect(legacy.normalizeSearchValue('Übung')).toBe('ubung');
    expect(legacy.normalizeSearchValue('Canción')).toBe('cancion');
    expect(legacy.normalizeSearchValue(12)).toBe('12');
    expect(legacy.normalizeSearchValue(null)).toBe('');
  });

  it('findMatchingWordInText matches word prefixes, ignoring parentheses and accents', () => {
    expect(legacy.findMatchingWordInText('sich (etwas) ansehen', 'an')).toBe('ansehen');
    expect(legacy.findMatchingWordInText('hacer, realizar', 'rea')).toBe('realizar');
    expect(legacy.findMatchingWordInText('Über/unter', 'uber')).toBe('Über');
    expect(legacy.findMatchingWordInText('machen', 'xyz')).toBe('');
    expect(legacy.findMatchingWordInText(42, 'a')).toBe('');
  });

  it('findMatchingTextEntry returns the first matching entry', () => {
    expect(legacy.findMatchingTextEntry(['ab cd', 'ef gh'], 'gh')).toBe('ef gh');
    expect(legacy.findMatchingTextEntry([{ de: 'Ich fahre' }], 'fah', (entry) => entry.de)).toBe('Ich fahre');
    expect(legacy.findMatchingTextEntry(null, 'a')).toBe('');
  });
});

describe('formatVerbPrefix', () => {
  it('wraps a known separable prefix', () => {
    expect(legacy.formatVerbPrefix('abfahren')).toBe('<span class="separable-prefix">ab</span>fahren');
  });

  it('leaves other verbs alone', () => {
    expect(legacy.formatVerbPrefix('machen')).toBe('machen');
  });

  it('shortens "geboren werden" outside the modal only', () => {
    expect(legacy.formatVerbPrefix('geboren werden')).toBe('geboren');
    expect(legacy.formatVerbPrefix('geboren werden', true)).toBe('geboren werden');
  });
});

describe('mojibake normalisation of fetched JSON', () => {
  const BROKEN_A_UMLAUT = 'íÃ†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¾';

  it('repairs the multi-encoded sequences still in its table', () => {
    expect(legacy.normalizeMojibakeString(`${BROKEN_A_UMLAUT}rger`)).toBe('Ärger');
  });

  it('no longer repairs single-encoded umlauts: their table entries map a string to itself', () => {
    // Quirk: an earlier repair script rewrote both sides of these pairs, e.g. ["ä", "ä"].
    expect(legacy.normalizeMojibakeString('beschlieÃŸen')).toBe('beschlieÃŸen');
    expect(legacy.normalizeMojibakeString('Ã¤')).toBe('Ã¤');
  });

  it('walks arrays and object keys, leaving other values untouched', () => {
    const value = { [BROKEN_A_UMLAUT]: [BROKEN_A_UMLAUT, 1, null, true] };
    expect(legacy.normalizeMojibakeDeep(value)).toEqual({ Ä: ['Ä', 1, null, true] });
    expect(legacy.normalizeMojibakeString(5)).toBe(5);
  });
});

describe('theme colours', () => {
  it('rgbToHex clamps and rounds', () => {
    expect(legacy.rgbToHex({ r: 300, g: -4, b: 16.4 })).toBe('#ff0010');
  });

  it('the second hexToRgb declaration wins and returns an "r, g, b" string', () => {
    expect(legacy.hexToRgb('#fff')).toBe('255, 255, 255');
    expect(legacy.hexToRgb('zzz')).toBe('59, 130, 246');
  });

  it('BUG: mixHexColors yields "#NaNNaNNaN" because hexToRgb no longer returns {r, g, b}', () => {
    expect(legacy.mixHexColors('#ff0000', '#0000ff')).toBe('#NaNNaNNaN');
  });
});
