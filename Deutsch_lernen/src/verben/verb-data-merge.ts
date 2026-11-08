import { normalizeMojibakeDeep } from './mojibake.ts';
import { konjunktivVerbs } from './verben-data.ts';

/** Root keys that are German pronouns: as objects they come from a rogue JSON structure and are skipped. */
export const PRONOUN_KEYS = ['es', 'wir', 'ihr', 'sie'] as const;

const PROTECTED_STRING_KEYS = ['es', 'en_verb', 'level', 'theme', 'group'];

/**
 * Copies `source` into `target` key by key, except objects under `ignoredObjectKeys` and core strings
 * (`es`, `en_verb`, `level`, `theme`, `group`) that `target` already has.
 */
export function mergeVerbData(
  target: Record<string, unknown>,
  source: unknown,
  ignoredObjectKeys: readonly string[] = PRONOUN_KEYS,
): void {
  if (!source || typeof source !== 'object') return;
  for (const [key, value] of Object.entries(source)) {
    if (ignoredObjectKeys.includes(key) && typeof value === 'object') continue;
    if (PROTECTED_STRING_KEYS.includes(key) && typeof target[key] === 'string' && target[key] !== '')
      continue;
    target[key] = value;
  }
}

/** Response body decoded as UTF-8 JSON, with mojibake repaired. */
export async function parseJsonUtf8(response: Response) {
  const buffer = await response.arrayBuffer();
  const text = new TextDecoder('utf-8').decode(buffer);
  return normalizeMojibakeDeep(JSON.parse(text));
}

export function getExampleLoadKey(verbName: string, tabId: string): string {
  return `${verbName}::${tabId}`;
}

/** The modal calls the Präsens tab `infinitiv`; no tab means that one too. */
export function normalizeModalTabId(tabId: string | null | undefined): string {
  return tabId === 'praesens' ? 'infinitiv' : tabId || 'infinitiv';
}

/** Whether the examples (or conjugations) shown by `tabId` still have to be fetched for this verb. */
export function tabNeedsLazyExamples(
  verbName: string,
  verbData: Record<string, unknown> | null | undefined,
  tabId: string | null | undefined,
): boolean {
  const normalizedTab = normalizeModalTabId(tabId);
  if (!verbData) return false;
  if (normalizedTab === 'infinitiv') {
    return !verbData.praesens_examples || !verbData.praesens_fragen;
  }
  if (normalizedTab === 'perfekt') {
    return !verbData.perfekt_examples;
  }
  if (normalizedTab === 'praeteritum') {
    return !verbData.praeteritum_conjugations || !verbData.praeteritum_examples;
  }
  if (normalizedTab === 'konjunktiv') {
    return (
      konjunktivVerbs.includes(verbName) && (!verbData.konjunktiv_ii || !verbData.konjunktiv_ii_examples)
    );
  }
  return false;
}
