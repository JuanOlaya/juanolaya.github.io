import { describe, expect, it } from 'vitest';
import { base64ToBytes, pcmToWav, sampleRateFromMime, speakableText } from './audio';
import { DISTRACTOR_OPTIONS, TARGET_OPTION, elapsedMs, improvementPercent, scenarioAOptions } from './hick';
import { groundingSources, parseAuditReport, splitTranslations } from './model-text';
import { parseQuiz, quizScore } from './quiz';
import { inlineImageFromDataUrl } from './sample-canvas';

describe('audio helpers', () => {
  it('decodes base64 into bytes', () => {
    expect(Array.from(base64ToBytes('AQL/'))).toEqual([1, 2, 255]);
  });

  it('reads the sample rate from the mime type, defaulting to 24 kHz', () => {
    expect(sampleRateFromMime('audio/L16;codec=pcm;rate=16000')).toBe(16000);
    expect(sampleRateFromMime('audio/L16')).toBe(24000);
  });

  it('wraps PCM16 samples in a mono 16-bit WAV header', () => {
    const wav = new DataView(pcmToWav(new Int16Array([1, -2]), 24000));
    const ascii = (offset: number) =>
      String.fromCharCode(...Array.from({ length: 4 }, (_, i) => wav.getUint8(offset + i)));
    expect(wav.byteLength).toBe(48);
    expect([ascii(0), ascii(8), ascii(12), ascii(36)]).toEqual(['RIFF', 'WAVE', 'fmt ', 'data']);
    expect(wav.getUint32(4, true)).toBe(40);
    expect(wav.getUint16(22, true)).toBe(1);
    expect(wav.getUint32(24, true)).toBe(24000);
    expect(wav.getUint32(28, true)).toBe(48000);
    expect(wav.getUint32(40, true)).toBe(4);
    expect([wav.getInt16(44, true), wav.getInt16(46, true)]).toEqual([1, -2]);
  });

  it('removes bracketed and parenthesised translations before speaking', () => {
    expect(speakableText('Guten Tag. [Buenos días.] Wie geht es (¿cómo?)')).toBe('Guten Tag.  Wie geht es');
  });
});

describe('Hick test math', () => {
  it('builds 24 unique options including the target exactly once', () => {
    let seed = 0.37;
    const random = () => (seed = (seed * 9301 + 49297) % 1);
    const options = scenarioAOptions(random);
    expect(options).toHaveLength(24);
    expect(new Set(options).size).toBe(24);
    expect(options.filter((option) => option === TARGET_OPTION)).toHaveLength(1);
    expect(options.every((option) => option === TARGET_OPTION || DISTRACTOR_OPTIONS.includes(option))).toBe(
      true,
    );
  });

  it('rounds elapsed time to whole milliseconds', () => {
    expect(elapsedMs(100.2, 1300.7)).toBe(1201);
  });

  it('computes the improvement of B over A, never below zero', () => {
    expect(improvementPercent(2000, 500)).toBe(75);
    expect(improvementPercent(500, 2000)).toBe(0);
    expect(improvementPercent(0, 300)).toBe(0);
  });
});

describe('quiz', () => {
  const quizJson = JSON.stringify([
    { question: 'Q1', options: ['a', 'b'], answer_index: 1, explanation: 'e1' },
    { question: 'Q2', options: ['a', 'b', 'c'], answer_index: 0, explanation: 'e2' },
  ]);

  it('parses valid questions and scores the answers', () => {
    const [first, second] = parseQuiz(quizJson);
    expect(first).toEqual({ question: 'Q1', options: ['a', 'b'], answerIndex: 1, explanation: 'e1' });
    const score = quizScore([
      { question: first, selected: 1 },
      { question: second, selected: 2 },
    ]);
    expect(score).toBe(1);
  });

  it('rejects malformed quizzes', () => {
    expect(() => parseQuiz('{}')).toThrow();
    expect(() =>
      parseQuiz(JSON.stringify([{ question: 'Q', options: ['a'], answer_index: 3, explanation: 'e' }])),
    ).toThrow();
  });
});

describe('model text helpers', () => {
  it('splits translations in brackets from the German text', () => {
    expect(splitTranslations('Hallo! [¡Hola!] Wie geht es? [¿Qué tal?]')).toEqual([
      { kind: 'text', text: 'Hallo!' },
      { kind: 'translation', text: '¡Hola!' },
      { kind: 'text', text: 'Wie geht es?' },
      { kind: 'translation', text: '¿Qué tal?' },
    ]);
    expect(splitTranslations('Nur Deutsch')).toEqual([{ kind: 'text', text: 'Nur Deutsch' }]);
  });

  it('parses the audit report and rejects missing fields', () => {
    const report = parseAuditReport(
      JSON.stringify({
        sobrecarga_score: 3,
        sobrecarga_feedback: 'a',
        disclosure_score: 4,
        disclosure_feedback: 'b',
        hick_score: 8,
        hick_feedback: 'c',
        resumen_general: 'd',
      }),
    );
    expect(report.hickScore).toBe(8);
    expect(report.summary).toBe('d');
    expect(() => parseAuditReport('{"sobrecarga_score": 3}')).toThrow();
  });

  it('keeps only http(s) grounding sources and falls back to the URI as title', () => {
    expect(
      groundingSources([
        { web: { uri: 'https://a.dev', title: 'A' } },
        { web: { uri: 'https://b.dev' } },
        { web: { uri: 'javascript:alert(1)', title: 'x' } },
        {},
      ]),
    ).toEqual([
      { title: 'A', uri: 'https://a.dev' },
      { title: 'https://b.dev', uri: 'https://b.dev' },
    ]);
  });
});

describe('inlineImageFromDataUrl', () => {
  it('splits a base64 data URL into mime type and data', () => {
    expect(inlineImageFromDataUrl('data:image/jpeg;base64,AAAA')).toEqual({
      mimeType: 'image/jpeg',
      data: 'AAAA',
    });
    expect(() => inlineImageFromDataUrl('https://example.dev/a.png')).toThrow();
  });
});
