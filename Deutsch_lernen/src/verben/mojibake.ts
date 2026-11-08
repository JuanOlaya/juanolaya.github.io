/**
 * Repairs text that was saved with a wrong encoding (UTF-8 read as Windows-1252, sometimes several times).
 * Each pair is [broken, fixed]; up to three passes undo multiple layers.
 */
const REPLACEMENTS: readonly (readonly [string, string])[] = [
  ['íÃ†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¾', 'Ä'],
  ['Ö', 'Ö'],
  ['íÃ†â€™Ãƒâ€¦Ã¢â‚¬Å“', 'Ü'],
  ['ä', 'ä'],
  ['ö', 'ö'],
  ['ü', 'ü'],
  ['ß', 'ß'],
  ['á', 'á'],
  ['é', 'é'],
  ['í', 'í'],
  ['ó', 'ó'],
  ['ú', 'ú'],
  ['ñ', 'ñ'],
  ['íÃ†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â°', 'Ãƒâ€°'],
  ['íÃ¢â‚¬Å¾', 'Ä'],
  ['íÃ¢â‚¬â€œ', 'Ö'],
  ['íÃ…â€œ', 'Ü'],
  ['ä', 'ä'],
  ['ö', 'ö'],
  ['ü', 'ü'],
  ['ß', 'ß'],
  ['á', 'á'],
  ['é', 'é'],
  ['í', 'í'],
  ['ó', 'ó'],
  ['ú', 'ú'],
  ['ñ', 'ñ'],
  ['Ã‚Â¿', 'Ã‚Â¿'],
  ['Ã‚Â¡', 'Ã‚Â¡'],
  // Mojibake for emojis (UTF-8 bytes read as Windows-1252)
  ['ÃƒÂ°Ã…Â¸Ã¢â‚¬Å“Ã…Â¡', '🔵œÅ¡'],
  ['🏡', '🏡'],
  ['ÃƒÂ°Ã…Â¸Ã¢â‚¬â„¢Ã‚Â¼', '🔵™Â¼'],
  ['ÃƒÂ°Ã…Â¸Ã…Â¡Ã‚Â¢', 'Ã°Å¸Å¡Â¢'],
  ['ÃƒÂ°Ã…Â¸Ã…Â¡Ã¢â€šÂ¬', '🚀'],
  ['ÃƒÂ°Ã…Â¸Ã¢â‚¬â„¢Ã‚Â¬', '🔵™Â¬'],
  ['ÃƒÂ°Ã…Â¸Ã¢â‚¬Å“Ã¢â‚¬â€œ', '🔵œâ€“'],
  ['ÃƒÂ°Ã…Â¸Ã¢â‚¬â„¢Ã‚Â¡', '💡'],
];

export function normalizeMojibakeString<T>(value: T): T {
  if (typeof value !== 'string') return value;
  let normalized: string = value;
  for (let pass = 0; pass < 3; pass++) {
    let changed = false;
    for (const [broken, fixed] of REPLACEMENTS) {
      if (normalized.includes(broken)) {
        normalized = normalized.split(broken).join(fixed);
        changed = true;
      }
    }
    if (!changed) break;
  }
  return normalized as T;
}

/** Applies {@link normalizeMojibakeString} to every string and object key of parsed JSON; the shape is kept. */
export function normalizeMojibakeDeep<T>(value: T): T;
export function normalizeMojibakeDeep(value: unknown): unknown {
  if (typeof value === 'string') {
    return normalizeMojibakeString(value);
  }
  if (Array.isArray(value)) {
    return value.map((item) => normalizeMojibakeDeep(item));
  }
  if (!value || typeof value !== 'object') {
    return value;
  }
  const normalizedObject: Record<string, unknown> = {};
  Object.entries(value).forEach(([key, entryValue]) => {
    normalizedObject[normalizeMojibakeString(key)] = normalizeMojibakeDeep(entryValue);
  });
  return normalizedObject;
}
