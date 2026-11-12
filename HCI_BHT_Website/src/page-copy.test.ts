import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { PANEL_CAPTION, PANEL_TITLE } from './copy.ts';

const read = (file: string) => readFileSync(fileURLToPath(new URL(`../${file}`, import.meta.url)), 'utf8');

/** Text a visitor can read in the markup, one entry per text node. */
function visibleText(html: string): string[] {
  const body = html.replace(/[\s\S]*<body[^>]*>/, '').replace(/<script[\s\S]*?<\/script>/g, '');
  return body
    .replace(/<[^>]+>/g, '\n')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

// Owner decision (TODO.md §4): the academic content is not updated in this round; only the chrome changes.
describe('HCI BHT page copy', () => {
  it('keeps the page title, logo and panel text from origin/master', () => {
    const html = read('index.html');
    expect(html).toContain('<title>HCI BHT</title>');
    expect(html).toContain('alt="HCI_logo"');
    // The logo text is outlined to paths so it renders without the Ubuntu font installed.
    expect(read('assets/HCI_logo.svg')).not.toMatch(/<text|<tspan|font-family/);
    expect(PANEL_TITLE).toBe('HCI · BHT Berlin');
    expect(PANEL_CAPTION).toBe('Press the dashed spot to make the circles shrink away.');
  });

  it('adds no text beyond the home link', () => {
    expect(visibleText(read('index.html'))).toEqual(['← Home']);
  });
});
