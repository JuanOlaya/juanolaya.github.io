import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import type { ZodType } from 'zod';
import { CardSchema, GroupSchema, TenseFileSchema, VerbsIndexSchema } from './schema.ts';

const BOM = String.fromCharCode(0xfeff);
const JSON_DIR = path.resolve(import.meta.dirname, '../../verben/A1_A2_B1/json');

/**
 * Files that do not match the schema today. They are listed, not fixed: the data belongs to the author and the
 * app tolerates them. Fixing one makes this test fail on purpose, so the entry is removed in the same change.
 */
const KNOWN_INVALID: Record<string, Record<string, string>> = {
  cards: {
    'beschließen.json': 'verb is mojibake ("beschlieÃŸen")',
    'äußern.json': 'verb is mojibake ("äuÃŸern")',
    'errichten.json': 'old card format: level "B1", group "B1.2 Group 1", keys translation/hat_sein/folder',
    'kennzeichnen.json':
      'old card format: level "B2", group "B2.1 Group 1", keys translation/hat_sein/folder',
    'trauen.json': 'old card format: level "A1", group "A1.2 Group 1", keys translation/hat_sein/folder',
    'verhalten.json': 'old card format: level "A2", group "A2.2 Group 1", keys translation/hat_sein/folder',
    'sinken.json': 'key "perfect" instead of "perfekt"',
    'versenken.json': 'key "perfect" instead of "perfekt"',
    'überschwemmen.json': 'key "perfect" instead of "perfekt"',
    'halten.json': 'unknown key "net_forms" (not read by the app)',
    'stimmen.json': 'unknown key "net_forms" (not read by the app)',
  },
  groups: {},
  praesens: {},
  praeteritum_konjugation: {},
  perfekt_konjugation: {
    'erleben.json': '"perfekt" is a list of {pronoun, verb_conjugation, auxiliary_verb}',
    'gelten.json': 'root is an array of {person, verb, example, es}',
    'hineingehen.json': 'root is an array',
    'verbinden.json': 'root is an array',
  },
  konjunktiv_ii: {},
};

const SCHEMA_BY_FOLDER: Record<string, ZodType> = {
  cards: CardSchema,
  groups: GroupSchema,
  praesens: TenseFileSchema,
  praeteritum_konjugation: TenseFileSchema,
  perfekt_konjugation: TenseFileSchema,
  konjunktiv_ii: TenseFileSchema,
};

/** The browser decodes with `TextDecoder`, which drops a UTF-8 BOM; several files have one. */
function readJson(file: string): unknown {
  const text = readFileSync(file, 'utf8');
  return JSON.parse(text.startsWith(BOM) ? text.slice(1) : text);
}

function jsonFilesIn(folder: string): string[] {
  return readdirSync(path.join(JSON_DIR, folder), { recursive: true })
    .map((file) => String(file).split(path.sep).join('/'))
    .filter((file) => file.endsWith('.json'))
    .sort();
}

function invalidFiles(folder: string): Record<string, string> {
  const schema = SCHEMA_BY_FOLDER[folder];
  const invalid: Record<string, string> = {};
  for (const file of jsonFilesIn(folder)) {
    const result = schema.safeParse(readJson(path.join(JSON_DIR, folder, file)));
    if (result.success) continue;
    invalid[file] = result.error.issues
      .map((issue) => `${issue.path.join('.') || '(root)'}: ${issue.message}`)
      .join('; ');
  }
  return invalid;
}

describe('verb data matches its schema', () => {
  it('finds every card file', () => {
    expect(jsonFilesIn('cards').length).toBeGreaterThanOrEqual(620);
  });

  for (const folder of Object.keys(SCHEMA_BY_FOLDER)) {
    // Parsing a few hundred files takes several seconds on Windows.
    it(`json/${folder}: only the known files are invalid`, { timeout: 60_000 }, () => {
      const invalid = invalidFiles(folder);
      const known = KNOWN_INVALID[folder];
      const unexpected = Object.fromEntries(Object.entries(invalid).filter(([file]) => !(file in known)));
      const nowValid = Object.keys(known).filter((file) => !(file in invalid));
      expect(unexpected, 'new invalid files (file → schema issues)').toEqual({});
      expect(nowValid, 'listed as invalid but valid now: remove them from KNOWN_INVALID').toEqual([]);
    });
  }

  it('verbs_index.json matches its schema and its totals', () => {
    const index = VerbsIndexSchema.parse(readJson(path.join(JSON_DIR, 'verbs_index.json')));
    expect(index.totalGroups).toBe(index.groups.length);
    expect(index.totalVerbs).toBe(index.groups.reduce((sum, group) => sum + group.verbCount, 0));
  });

  it('every verb listed in a group has a card', () => {
    const cards = new Set(jsonFilesIn('cards').map((file) => file.replace(/\.json$/, '')));
    const missing = jsonFilesIn('groups')
      .flatMap((file) => GroupSchema.parse(readJson(path.join(JSON_DIR, 'groups', file))).verbs)
      .filter((verb) => !cards.has(verb));
    expect(missing).toEqual([]);
  });
});
