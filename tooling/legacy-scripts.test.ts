import { describe, expect, it } from 'vitest';
import { bundleLegacyScript, legacyScripts, readCommittedLegacyScript } from './legacy-scripts.ts';

// Git may check the committed bundle out with CRLF line endings.
const withLf = (code: string) => code.replace(/\r\n/g, '\n');

describe.each(legacyScripts)('legacy script $output', (script) => {
  it('is up to date with its TypeScript sources (run `npm run build:legacy-scripts`)', async () => {
    expect(withLf(readCommittedLegacyScript(script))).toBe(withLf(await bundleLegacyScript(script)));
  });
});
