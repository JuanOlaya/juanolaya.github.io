import { describe, expect, it } from 'vitest';
import { findMissingUrls, parseUrlList } from './public-urls.ts';

describe('parseUrlList', () => {
  it('drops blank lines, comments and surrounding whitespace', () => {
    const text = '# header\nindex.html\n\n  CV/JuanOlaya.pdf  \r\nSockets/public/index.html # moved by #16\n';
    expect(parseUrlList(text)).toEqual(['index.html', 'CV/JuanOlaya.pdf', 'Sockets/public/index.html']);
  });

  it('keeps inner spaces in file names', () => {
    expect(parseUrlList('Deutsch_lernen/a b.html')).toEqual(['Deutsch_lernen/a b.html']);
  });
});

describe('findMissingUrls', () => {
  const inDist = new Set(['index.html', 'CV/JuanOlaya.pdf']);
  const exists = (path: string): boolean => inDist.has(path);

  it('reports expected URLs absent from dist', () => {
    expect(findMissingUrls(['index.html', 'Balconity/index.html'], [], exists)).toEqual([
      'Balconity/index.html',
    ]);
  });

  it('ignores URLs retired on purpose', () => {
    expect(
      findMissingUrls(['index.html', 'Sockets/public/index.html'], ['Sockets/public/index.html'], exists),
    ).toEqual([]);
  });

  it('passes when every URL is present', () => {
    expect(findMissingUrls(['index.html', 'CV/JuanOlaya.pdf'], [], exists)).toEqual([]);
  });
});
