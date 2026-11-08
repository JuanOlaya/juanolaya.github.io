import { separablePrefixesMap } from './verb-prefix.ts';

const HIGHLIGHT_OPEN =
  '<span style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); color: #6e4e00; padding: 0;">';

function escapeRegExp(query: string): string {
  return query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Every word of `text` containing `query`, wrapped in the search highlight. */
export function highlightMatch(text: string, query: string): string {
  if (!query || !text) return text;
  // Whole words, German letters included, so the highlight covers the word and not just the typed part.
  const regex = new RegExp(`([\\wäöüÄÖÜß]*${escapeRegExp(query)}[\\wäöüÄÖÜß]*)`, 'gi');
  return text.replace(regex, (match) => `${HIGHLIGHT_OPEN}${match}</span>`);
}

export function highlightBaseVerb(text: string): string {
  if (!text) return text;
  return `${HIGHLIGHT_OPEN}${text}</span>`;
}

function separableMarkup(prefix: string, verbName: string): string {
  return `<span class="separable-prefix">${prefix}</span>${verbName.slice(prefix.length)}`;
}

/** The verb as the search results show it: separable prefix marked, highlighted when it matches `query`. */
export function highlightVerbName(verbName: string, query: string): string {
  if (!verbName) return '';
  if (verbName === 'geboren werden') {
    // Kept as written in script.js: this character class differs from escapeRegExp's.
    const escapedQuery = query.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&');
    const regex = new RegExp(`([\\wäöüÄÖÜß]*${escapedQuery}[\\wäöüÄÖÜß]*)`, 'gi');
    if (query && regex.test('geboren')) {
      return `${HIGHLIGHT_OPEN}geboren</span> werden`;
    }
    return 'geboren werden';
  }
  const prefix = separablePrefixesMap[verbName];
  const isSeparable = prefix && verbName.startsWith(prefix);
  const plain = isSeparable ? separableMarkup(prefix, verbName) : verbName;
  if (!query) return plain;
  const regex = new RegExp(`([\\wäöüÄÖÜß]*${escapeRegExp(query)}[\\wäöüÄÖÜß]*)`, 'gi');
  if (regex.test(verbName)) return `${HIGHLIGHT_OPEN}${plain}</span>`;
  return plain;
}

/** The conjugated form a search result matched, or `''` when it matched the infinitive. */
export function getMatchHint(match: Record<string, string | undefined>): string {
  return (
    match.matchedPraesensForm ||
    match.matchedPerfektForm ||
    match.matchedPraeteritumForm ||
    match.matchedKonjunktivForm ||
    match.matchedRelatedForm ||
    ''
  );
}
