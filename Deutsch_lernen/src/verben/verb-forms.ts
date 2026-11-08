/** Perfekt without its auxiliary ("hat gemacht" → "gemacht"); `'---'` when missing. */
export function getCleanPerfekt(perfekt: string | null | undefined): string {
  if (!perfekt || perfekt === '---') return '---';
  return perfekt.replace(/^(habe|hast|hat|haben|habt|bin|bist|ist|sind|seid|sein)\s+/i, '');
}

/** Präteritum without the "er/sie/es" label; `'---'` when missing. */
export function getCleanPraeteritum(praeteritum: string | null | undefined): string {
  if (!praeteritum || praeteritum === '---') return '---';
  return praeteritum.replace(/^(er\/sie\/es)\s+/, '');
}

/** Verb form without personal or reflexive pronouns, for the tense buttons on the card back. */
export function cleanVerbForm(phrase: string | null | undefined): string {
  if (!phrase) return '';
  const clean = phrase
    .replace(/\b(er\/sie\/es|er|sie|es|ich|du|wir|ihr|Sie)\s+/gi, '')
    .replace(/\b(sich|mich|dich|uns|euch)\s+/gi, '');
  return clean.trim().replace(/\s+/g, ' ');
}

function withEnding(base: string, suffix: string): string {
  if (suffix === 'st') {
    if (base.endsWith('e')) return base + 'st';
    if (base.endsWith('t') || base.endsWith('d')) return base + 'est';
    return base + 'st';
  }
  if (suffix === 'n') {
    if (base.endsWith('en')) return base;
    if (base.endsWith('e')) return base + 'n';
    return base + 'en';
  }
  if (suffix === 't') {
    if (base.endsWith('t')) return base;
    if (base.endsWith('e')) return base + 't';
    if (base.endsWith('d')) return base + 'et';
    return base + 't';
  }
  return base;
}

/**
 * Adds a person ending to the first word of a conjugated phrase for the card-back table, keeping a
 * separable prefix after it ("biege ab" + "st" → "biegest ab").
 */
export function conjugateBaseForm(phrase: string | null | undefined, suffix: string): string {
  if (!phrase) return '';
  const cleanPhrase = phrase.replace(/^(ich|du|er\/sie\/es|wir|ihr|sie\/Sie)\s+/, '');
  const parts = cleanPhrase.split(/\s+/);
  const prefix = parts.slice(1).join(' ');
  const base = withEnding(parts[0], suffix);
  return prefix ? `${base} ${prefix}` : base;
}
