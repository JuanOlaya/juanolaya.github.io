/** The translation fields of a verb card that these helpers read. */
export interface TranslatedVerb {
  es?: string | null;
  card_es?: string | null;
}

/** Drops a leading "(sich)", unwraps any other leading "(word)" and turns " o " into " / ". */
export function removeParentheses<T extends string | null | undefined>(text: T): T | string {
  if (!text) return text;
  const parsed = text
    .replace(/^\(([^)]+)\)\s*/, (_match, innerWord: string) =>
      innerWord.toLowerCase() === 'sich' ? '' : innerWord + ' ',
    )
    .replace(/ o /g, ' / ');
  return parsed.trim();
}

export function getPrimaryTranslation(text: string | null | undefined): string {
  const cleaned = removeParentheses(text || '');
  if (!cleaned) return cleaned;
  return cleaned.split('/')[0].trim();
}

export function getCardTranslation(verbData: TranslatedVerb | null | undefined): string {
  return (verbData && verbData.card_es) || getPrimaryTranslation((verbData && verbData.es) || '');
}

/** The card's translation, one line per alternative. */
export function getCardTranslationLines(verbData: TranslatedVerb | null | undefined): string[] {
  if (!verbData) return [];
  const text = verbData.card_es || getCardTranslation(verbData);
  if (!text) return [];
  return text
    .split(/[,/\n\r]+/)
    .map((part) => part.trim())
    .filter((part) => part.length > 0);
}
