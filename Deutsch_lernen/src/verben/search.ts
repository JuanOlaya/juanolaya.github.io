/** Lowercase, without diacritics, so "Übung" matches "ubung". */
export function normalizeSearchValue(value: unknown): string {
  if (value === null || value === undefined) return '';
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

/** First word of `text` that starts with the (already normalised) search term, or `''`. */
export function findMatchingWordInText(text: unknown, searchTerm: string): string {
  if (!text || typeof text !== 'string') return '';
  const normalized = text.replace(/[()]/g, '');
  const words = normalized.split(/[\s,/]+/).filter(Boolean);
  return words.find((word) => normalizeSearchValue(word).startsWith(searchTerm)) || '';
}

/** First entry whose text contains a matching word, or `''`. */
export function findMatchingTextEntry<T>(
  entries: readonly T[] | null | undefined,
  searchTerm: string,
  extractor: ((entry: T) => unknown) | null = null,
): string {
  if (!entries) return '';
  for (const entry of entries) {
    const text = extractor ? extractor(entry) : entry;
    if (typeof text === 'string' && findMatchingWordInText(text, searchTerm)) {
      return text;
    }
  }
  return '';
}
