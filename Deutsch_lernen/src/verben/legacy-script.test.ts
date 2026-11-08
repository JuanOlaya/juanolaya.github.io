import { readFileSync } from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { describe, expect, it } from 'vitest';
import { STORAGE_SCHEMA_VERSION, type MemoStorage } from '../storage/memo-storage.ts';
import { legacyGlobals } from './legacy-globals.ts';
import { declarationsOf, loadLegacyFunction, readLegacyScript } from './legacy-script.ts';

const VERBEN_DIR = path.resolve(import.meta.dirname, '../../verben/A1_A2_B1');
const HELPER_NAMES = Object.keys(legacyGlobals);

function readVerben(file: string): string {
  return readFileSync(path.join(VERBEN_DIR, file), 'utf8');
}

describe('verben.html wiring of the helper modules', () => {
  it('script.js no longer declares the moved helpers, so it uses the shared globals', () => {
    const source = readLegacyScript();
    expect(HELPER_NAMES.filter((name) => declarationsOf(source, name).length > 0)).toEqual([]);
  });

  it('script.js reaches localStorage only through the typed memoStorage layer', () => {
    expect(readLegacyScript()).not.toMatch(/localStorage\.\w+\(/);
  });

  it('the committed bundle publishes every helper as a global under its legacy name', () => {
    const items = new Map<string, string>();
    const localStorage = {
      get length() {
        return items.size;
      },
      key: (index: number) => [...items.keys()][index] ?? null,
      getItem: (key: string) => items.get(key) ?? null,
      setItem: (key: string, value: string) => void items.set(key, value),
      removeItem: (key: string) => void items.delete(key),
    };
    const context: Record<string, unknown> = { localStorage };
    vm.runInNewContext(readVerben('script/verben-helpers.js'), context);
    expect(Object.keys(context).sort()).toEqual([...HELPER_NAMES, 'localStorage', 'memoStorage'].sort());
    // The bundle migrates storage before script.js runs, and script.js reaches it through `memoStorage`.
    expect(items.get('memodeutsch-storage-version')).toBe(String(STORAGE_SCHEMA_VERSION));
    (context.memoStorage as MemoStorage).saveProgress('A2', 4);
    expect(items.get('progress_A2')).toBe('4');
    const format = context.formatVerbPrefix as typeof legacyGlobals.formatVerbPrefix;
    expect(format('abfahren')).toBe(legacyGlobals.formatVerbPrefix('abfahren'));
  });

  it('verben.html loads the bundle before script.js', () => {
    const html = readVerben('verben.html');
    const helpers = html.indexOf('src="script/verben-helpers.js');
    expect(helpers).toBeGreaterThan(-1);
    expect(helpers).toBeLessThan(html.indexOf('src="script/script.js'));
  });

  it('the service worker precaches the bundle with script.js', () => {
    const worker = readFileSync(path.resolve(VERBEN_DIR, '../../service-worker.js'), 'utf8');
    expect(worker).toContain("'./verben/A1_A2_B1/script/verben-helpers.js'");
  });
});

interface StubElement {
  className: string;
  innerHTML: string;
  children: StubElement[];
  appendChild: (child: StubElement) => void;
}

function stubElement(): StubElement {
  const element: StubElement = {
    className: '',
    innerHTML: '',
    children: [],
    appendChild: (child) => element.children.push(child),
  };
  return element;
}

/** Runs script.js's renderLightVersion for one group against stubbed DOM and closure state. */
function renderLightRows(allVerbsData: Record<string, object>): string[] {
  const cardsContainer = stubElement();
  const renderLightVersion = loadLegacyFunction<(group: { verbs: string[] }) => void>('renderLightVersion', {
    ...legacyGlobals,
    cardsContainer,
    navigationWrapper: null,
    allVerbsData,
    updateIndicatorsForView: () => {},
    document: { createElement: stubElement, body: { classList: { remove: () => {} } } },
  });
  renderLightVersion({ verbs: Object.keys(allVerbsData) });
  const [lightContainer] = cardsContainer.children;
  return lightContainer.children.slice(1).map((row) => row.innerHTML);
}

describe('renderLightVersion (light card view)', () => {
  const verb = { perfekt: 'hat gemacht', praeteritum: 'er/sie/es machte', es: 'hacer' };

  it('marks LiD verbs with the LiD badge', () => {
    const [row] = renderLightRows({ machen: { ...verb, case_tags: ['LiD'] } });
    expect(row).toContain('class="lid-badge"');
    expect(row).toContain('>gemacht<');
  });

  it('renders verbs without tags without badges', () => {
    const [row] = renderLightRows({ machen: verb });
    expect(row).not.toContain('lid-badge');
    expect(row).toContain('>machte<');
  });
});
