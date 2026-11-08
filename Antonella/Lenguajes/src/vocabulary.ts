export interface VocabEstimate {
  es: number;
  de: number;
  en: number;
}

export const MIN_AGE = 3;
export const MAX_AGE = 18;
/** Native-level ceilings used to scale the bars: German/Spanish share one scale, English its own. */
export const NATIVE_SCALE = 35_000;
export const ENGLISH_SCALE = 25_000;

/** Linear growth from the age of 3 to adult vocabulary at 18; English only counts from the age of 5. */
export function estimateVocabulary(age: number): VocabEstimate {
  const factor = (age - MIN_AGE) / (MAX_AGE - MIN_AGE);
  return {
    es: Math.round(500 + factor * 29_500),
    de: Math.round(600 + factor * 34_400),
    en: age < 5 ? 0 : Math.round(factor * ENGLISH_SCALE),
  };
}

export function barWidthPercent(words: number, scale: number): number {
  return Math.min(100, (words / scale) * 100);
}

/** Lower-case and strip accents so "información" matches "informacion". */
export function normalizeWord(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim();
}

export interface Cognate {
  query: string;
  en: string;
  es?: string;
  de?: string;
  type: 'latin' | 'germanic';
  explanation: string;
}

export function findCognate(words: readonly Cognate[], input: string): Cognate | undefined {
  const query = normalizeWord(input);
  if (query === '') return undefined;
  return words.find((word) =>
    [word.query, word.en, word.es, word.de].some((text) => text !== undefined && normalizeWord(text).includes(query)),
  );
}
