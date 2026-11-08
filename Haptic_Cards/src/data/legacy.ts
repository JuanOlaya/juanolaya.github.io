import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

/** Data blocks of the pre-migration page, as its inline script defined them. Test-only oracle. */
export interface LegacyData {
  devices: Array<Record<string, unknown> & { name: string; isIntro?: boolean }>;
  deviceMechanismPatterns: Record<string, string>;
  hapticAuditData: Record<string, unknown>;
  canonicalPatterns: string[];
  patternIcons: Record<string, string>;
  categoryIconSymbols: Record<string, string>;
  categoryMap: Record<string, string>;
  cutaneousSubmodalities: string[];
  kinestheticSubmodalities: string[];
  mechanismFamilies: unknown[];
}

const EXPORTED = `({ devices, deviceMechanismPatterns, hapticAuditData, canonicalPatterns, patternIcons,
  categoryIconSymbols, categoryMap, mechanismFamilies,
  cutaneousSubmodalities: [...cutaneousSubmodalities], kinestheticSubmodalities: [...kinestheticSubmodalities] })`;

export function loadLegacyData(): LegacyData {
  const html = readFileSync(new URL('./__fixtures__/legacy-index.html', import.meta.url), 'utf8');
  const script = /<script>([\s\S]*?)<\/script>/.exec(html)?.[1];
  if (!script) throw new Error('Inline script not found in the legacy snapshot');
  // The script only declares data and functions; `window.onload` is assigned but never fired here.
  // JSON round-trip turns the sandbox's objects into plain ones so deep equality works across realms.
  return JSON.parse(JSON.stringify(runInNewContext(`${script}\n;${EXPORTED}`, { window: {}, document: {} })));
}
