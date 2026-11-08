import { readFileSync } from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { describe, expect, it } from 'vitest';
import { demonstrativeCases, hasExample, highlightForm } from './cases.ts';
import { FAELLE, type DemonstrativeRow } from './types.ts';

const FIXTURES = path.join(import.meta.dirname, '__fixtures__');
const EXAMPLE_KEYS = ['Männlich (M)', 'Weiblich (F)', 'Neutral (N)', 'Plural (P)'];
const TRANSLATION_KEYS = ['Trad. (M)', 'Trad. (F)', 'Trad. (N)', 'Trad. (P)'];

/** Evaluates `const <name> = [...]` from a pre-migration page, the oracle for the extracted data. */
function legacyArray(file: string, name: string): Record<string, string>[] {
  const html = readFileSync(path.join(FIXTURES, file), 'utf8');
  const start = html.indexOf(`const ${name} = [`);
  const end = html.indexOf('];', start);
  return vm.runInNewContext(html.slice(start + `const ${name} = `.length, end + 1)) as Record<
    string,
    string
  >[];
}

function legacyRows(file: string, dataName: string, keysName: string): DemonstrativeRow[] {
  const keys = legacyArray(file, keysName).map((entry) => entry.key);
  return legacyArray(file, dataName).map((row) => ({
    type: row['Tipo'],
    typeTranslation: row['Trad. Tipo'],
    forms: keys.map((key, index) => ({
      form: row[key],
      example: row[EXAMPLE_KEYS[index]],
      translation: row[TRANSLATION_KEYS[index]],
    })),
  }));
}

describe.each(FAELLE)('%s demonstratives', (fall) => {
  const entry = demonstrativeCases[fall];

  it('keeps every row of the former single-case page', () => {
    expect(entry.rows).toEqual(legacyRows(`${fall}.html`, 'tableData', 'mergedDeterminerKeys'));
  });

  it('keeps every row of the former all-cases page', () => {
    expect(entry.overviewRows).toEqual(legacyRows('index.html', `${fall}Data`, `${fall}Keys`));
  });

  it('has four gender forms per row', () => {
    expect(entry.rows.every((row) => row.forms.length === 4)).toBe(true);
  });
});

describe('highlightForm', () => {
  it('splits around the first whole-word match, ignoring case', () => {
    expect(highlightForm('Dieser Mann ist nett.', 'dieser')).toEqual({
      before: '',
      match: 'Dieser',
      after: ' Mann ist nett.',
    });
  });

  it('does not match inside a longer word', () => {
    expect(highlightForm('Ich helfe diesem Mann.', 'diese')).toEqual({
      before: 'Ich helfe diesem Mann.',
      match: '',
      after: '',
    });
  });
});

describe('hasExample', () => {
  it('needs both a sentence and its translation', () => {
    expect(hasExample({ example: 'Jeder Mann.', translation: 'Cada hombre.' })).toBe(true);
    expect(hasExample({ example: '-', translation: '-' })).toBe(false);
    expect(hasExample({ example: 'Jeder Mann.', translation: '' })).toBe(false);
  });
});
