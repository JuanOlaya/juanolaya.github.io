import { describe, expect, it } from 'vitest';
import { normalizeMojibakeDeep, normalizeMojibakeString } from './mojibake.ts';
import { findMatchingTextEntry, findMatchingWordInText, normalizeSearchValue } from './search.ts';
import { hexToRgb, mixHexColors, rgbToHex } from './theme-colors.ts';
import {
  getCardTranslation,
  getCardTranslationLines,
  getPrimaryTranslation,
  removeParentheses,
} from './translations.ts';
import { cleanVerbForm, conjugateBaseForm, getCleanPerfekt, getCleanPraeteritum } from './verb-forms.ts';
import { formatVerbPrefix } from './verb-prefix.ts';

/**
 * Characterization tests: they pin what these helpers did inside `verben/A1_A2_B1/script/script.js`, quirks
 * included, before they moved to these modules. A quirk that is a bug is marked as such; fix it in its own
 * change and update the expectation there.
 */

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
    expect(conjugateBaseForm(phrase, suffix)).toBe(expected);
  });

  it('strips a leading pronoun and keeps a separable prefix after the stem', () => {
    expect(conjugateBaseForm('ich spiele', 'n')).toBe('spielen');
    expect(conjugateBaseForm('er/sie/es biege ab', 'st')).toBe('biegest ab');
    expect(conjugateBaseForm('sie/Sie rufe an', 'n')).toBe('rufen an');
  });

  it('returns an empty string for an empty phrase', () => {
    expect(conjugateBaseForm('', 'st')).toBe('');
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
    expect(cleanVerbForm(phrase)).toBe(expected);
  });

  it('is null-safe', () => {
    expect(cleanVerbForm(null)).toBe('');
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
    expect(getCleanPerfekt(input)).toBe(expected);
  });

  it.each([
    ['er/sie/es machte', 'machte'],
    ['machte', 'machte'],
    ['er machte', 'er machte'],
    ['', '---'],
  ])('getCleanPraeteritum(%j) → %j', (input, expected) => {
    expect(getCleanPraeteritum(input)).toBe(expected);
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
    expect(removeParentheses(input)).toBe(expected);
  });

  it('removeParentheses passes null through', () => {
    expect(removeParentheses(null)).toBeNull();
  });

  it('getPrimaryTranslation keeps the first alternative', () => {
    expect(getPrimaryTranslation('hacer / realizar')).toBe('hacer');
    expect(getPrimaryTranslation('(sich) alegrarse o reír')).toBe('alegrarse');
    expect(getPrimaryTranslation(null)).toBe('');
  });

  it('getCardTranslation prefers card_es', () => {
    expect(getCardTranslation({ card_es: 'Hacer', es: 'a / b' })).toBe('Hacer');
    expect(getCardTranslation({ es: 'a / b' })).toBe('a');
    expect(getCardTranslation(null)).toBe('');
  });

  it('getCardTranslationLines splits on commas, slashes and newlines', () => {
    expect(getCardTranslationLines({ es: 'hacer, realizar / ejecutar' })).toEqual(['hacer', 'realizar']);
    expect(getCardTranslationLines({ card_es: 'ir\npasear, / andar' })).toEqual(['ir', 'pasear', 'andar']);
    expect(getCardTranslationLines(null)).toEqual([]);
  });
});

describe('search matching', () => {
  it('normalizeSearchValue lowercases and drops diacritics', () => {
    expect(normalizeSearchValue('Übung')).toBe('ubung');
    expect(normalizeSearchValue('Canción')).toBe('cancion');
    expect(normalizeSearchValue(12)).toBe('12');
    expect(normalizeSearchValue(null)).toBe('');
  });

  it('findMatchingWordInText matches word prefixes, ignoring parentheses and accents', () => {
    expect(findMatchingWordInText('sich (etwas) ansehen', 'an')).toBe('ansehen');
    expect(findMatchingWordInText('hacer, realizar', 'rea')).toBe('realizar');
    expect(findMatchingWordInText('Über/unter', 'uber')).toBe('Über');
    expect(findMatchingWordInText('machen', 'xyz')).toBe('');
    expect(findMatchingWordInText(42, 'a')).toBe('');
  });

  it('findMatchingTextEntry returns the first matching entry', () => {
    expect(findMatchingTextEntry(['ab cd', 'ef gh'], 'gh')).toBe('ef gh');
    expect(findMatchingTextEntry([{ de: 'Ich fahre' }], 'fah', (entry) => entry.de)).toBe('Ich fahre');
    expect(findMatchingTextEntry(null, 'a')).toBe('');
  });
});

describe('formatVerbPrefix', () => {
  it('wraps a known separable prefix', () => {
    expect(formatVerbPrefix('abfahren')).toBe('<span class="separable-prefix">ab</span>fahren');
  });

  it('leaves other verbs alone', () => {
    expect(formatVerbPrefix('machen')).toBe('machen');
  });

  it('shortens "geboren werden" outside the modal only', () => {
    expect(formatVerbPrefix('geboren werden')).toBe('geboren');
    expect(formatVerbPrefix('geboren werden', true)).toBe('geboren werden');
  });
});

describe('mojibake normalisation of fetched JSON', () => {
  const BROKEN_A_UMLAUT = 'íÃ†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¾';

  it('repairs the multi-encoded sequences still in its table', () => {
    expect(normalizeMojibakeString(`${BROKEN_A_UMLAUT}rger`)).toBe('Ärger');
  });

  it('no longer repairs single-encoded umlauts: their table entries map a string to itself', () => {
    // Quirk: an earlier repair script rewrote both sides of these pairs, e.g. ["ä", "ä"].
    expect(normalizeMojibakeString('beschlieÃŸen')).toBe('beschlieÃŸen');
    expect(normalizeMojibakeString('Ã¤')).toBe('Ã¤');
  });

  it('walks arrays and object keys, leaving other values untouched', () => {
    const value = { [BROKEN_A_UMLAUT]: [BROKEN_A_UMLAUT, 1, null, true] };
    expect(normalizeMojibakeDeep(value)).toEqual({ Ä: ['Ä', 1, null, true] });
    expect(normalizeMojibakeString(5)).toBe(5);
  });
});

describe('theme colours', () => {
  it('rgbToHex clamps and rounds', () => {
    expect(rgbToHex({ r: 300, g: -4, b: 16.4 })).toBe('#ff0010');
  });

  it('hexToRgb (the declaration that won in script.js) returns an "r, g, b" string', () => {
    expect(hexToRgb('#fff')).toBe('255, 255, 255');
    expect(hexToRgb('zzz')).toBe('59, 130, 246');
  });

  it('BUG: mixHexColors yields "#NaNNaNNaN" because hexToRgb no longer returns {r, g, b}', () => {
    expect(mixHexColors('#ff0000', '#0000ff')).toBe('#NaNNaNNaN');
  });
});
