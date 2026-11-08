import { readFileSync } from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { describe, expect, it } from 'vitest';
import { legacyGlobals } from './legacy-globals.ts';
import { declarationsOf, readLegacyScript } from './legacy-script.ts';

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

  it('the committed bundle publishes every helper as a global under its legacy name', () => {
    const context: Record<string, unknown> = {};
    vm.runInNewContext(readVerben('script/verben-helpers.js'), context);
    expect(Object.keys(context).sort()).toEqual([...HELPER_NAMES].sort());
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
