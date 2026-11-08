import { describe, expect, it } from 'vitest';
import { getMatchHint, highlightBaseVerb, highlightMatch, highlightVerbName } from './search-highlight.ts';

/** Characterization tests: they pin what these functions did inside `verben/A1_A2_B1/script/script.js`. */
const open =
  '<span style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); color: #6e4e00; padding: 0;">';

describe('search highlighting', () => {
  it('highlightMatch wraps every whole word that contains the query, German letters included', () => {
    expect(highlightMatch('Ich möchte, er mochte', 'ch')).toBe(
      `${open}Ich</span> ${open}möchte</span>, er ${open}mochte</span>`,
    );
    expect(highlightMatch('a.b c', '.')).toBe(`${open}a.b</span> c`);
    expect(highlightMatch('text', '')).toBe('text');
  });

  it('highlightBaseVerb wraps the whole text', () => {
    expect(highlightBaseVerb('sein')).toBe(`${open}sein</span>`);
    expect(highlightBaseVerb('')).toBe('');
  });

  it('highlightVerbName marks the separable prefix and highlights matches', () => {
    expect(highlightVerbName('abfahren', '')).toBe('<span class="separable-prefix">ab</span>fahren');
    expect(highlightVerbName('abfahren', 'fahr')).toBe(
      `${open}<span class="separable-prefix">ab</span>fahren</span>`,
    );
    expect(highlightVerbName('gehen', 'geh')).toBe(`${open}gehen</span>`);
    expect(highlightVerbName('gehen', 'xyz')).toBe('gehen');
    expect(highlightVerbName('', 'x')).toBe('');
  });

  it('highlightVerbName highlights only "geboren" in "geboren werden"', () => {
    expect(highlightVerbName('geboren werden', 'gebor')).toBe(`${open}geboren</span> werden`);
    expect(highlightVerbName('geboren werden', 'werd')).toBe('geboren werden');
  });

  it('getMatchHint returns the first matched form, Präsens first', () => {
    expect(getMatchHint({ matchedPerfektForm: 'gegangen', matchedPraesensForm: 'geht' })).toBe('geht');
    expect(getMatchHint({ matchedRelatedForm: 'Gang' })).toBe('Gang');
    expect(getMatchHint({})).toBe('');
  });
});
