import { describe, expect, it, vi } from 'vitest';
import {
  AI_UNAVAILABLE_MESSAGE,
  AIUnavailableError,
  MAX_BODY_BYTES,
  aiErrorMessage,
  buildEndpointUrl,
  createGeminiClient,
  resolveProxyUrl,
} from './gemini-client';

const TEXT_MODEL = 'gemini-2.5-flash-preview-09-2025:generateContent';

function jsonResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
}

function setup(responses: Array<Response | Error>, proxyUrl = 'https://proxy.example.dev') {
  const fetchMock = vi.fn<typeof fetch>();
  for (const next of responses) {
    if (next instanceof Error) fetchMock.mockRejectedValueOnce(next);
    else fetchMock.mockResolvedValueOnce(next);
  }
  const wait = vi.fn<(ms: number) => Promise<void>>().mockResolvedValue(undefined);
  const client = createGeminiClient({ proxyUrl, fetch: fetchMock, wait });
  return { client, fetchMock, wait };
}

describe('resolveProxyUrl', () => {
  it('prefers the build-time variable over the meta tag', () => {
    expect(resolveProxyUrl('https://env.dev', 'https://meta.dev')).toBe('https://env.dev');
  });

  it('falls back to the meta tag when the variable is empty', () => {
    expect(resolveProxyUrl('  ', ' https://meta.dev/ ')).toBe('https://meta.dev');
    expect(resolveProxyUrl(undefined, 'https://meta.dev')).toBe('https://meta.dev');
  });

  it('strips every trailing slash and returns empty when nothing is configured', () => {
    expect(resolveProxyUrl('https://env.dev/base///', null)).toBe('https://env.dev/base');
    expect(resolveProxyUrl(undefined, null)).toBe('');
    expect(resolveProxyUrl('', '')).toBe('');
  });
});

describe('buildEndpointUrl', () => {
  it('appends the Gemini REST path without a key', () => {
    expect(buildEndpointUrl('https://proxy.dev', 'imagen-4.0-generate-001:predict')).toBe(
      'https://proxy.dev/v1beta/models/imagen-4.0-generate-001:predict',
    );
  });
});

describe('createGeminiClient', () => {
  it('posts the JSON body to the proxy and returns the parsed response', async () => {
    const { client, fetchMock } = setup([jsonResponse(200, { ok: 1 })], 'https://proxy.dev/');
    await expect(client.call(TEXT_MODEL, { contents: [] })).resolves.toEqual({ ok: 1 });
    expect(fetchMock).toHaveBeenCalledWith(`https://proxy.dev/v1beta/models/${TEXT_MODEL}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{"contents":[]}',
    });
  });

  it('throws AIUnavailableError without calling fetch when no proxy is configured', async () => {
    const { client, fetchMock } = setup([], '');
    expect(client.isAvailable).toBe(false);
    await expect(client.call(TEXT_MODEL, {})).rejects.toBeInstanceOf(AIUnavailableError);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('retries 429, 5xx and network errors with exponential backoff, then succeeds', async () => {
    const { client, fetchMock, wait } = setup([
      jsonResponse(429, {}),
      jsonResponse(503, {}),
      new TypeError('network down'),
      jsonResponse(200, { done: true }),
    ]);
    await expect(client.call(TEXT_MODEL, {})).resolves.toEqual({ done: true });
    expect(fetchMock).toHaveBeenCalledTimes(4);
    expect(wait.mock.calls.map(([ms]) => ms)).toEqual([1000, 2000, 4000]);
  });

  it('does not retry other 4xx responses', async () => {
    const { client, fetchMock, wait } = setup([new Response('bad model', { status: 400 })]);
    await expect(client.call(TEXT_MODEL, {})).rejects.toThrow('Error API 400: bad model');
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(wait).not.toHaveBeenCalled();
  });

  it('gives up after 5 attempts with the last status', async () => {
    const failures = Array.from({ length: 5 }, () => new Response('busy', { status: 500 }));
    const { client, fetchMock, wait } = setup(failures);
    await expect(client.call(TEXT_MODEL, {})).rejects.toThrow('Error API 500: busy');
    expect(fetchMock).toHaveBeenCalledTimes(5);
    expect(wait).toHaveBeenCalledTimes(4);
  });

  it('rethrows the network error after 5 failed attempts', async () => {
    const failures = Array.from({ length: 5 }, () => new TypeError('offline'));
    const { client, fetchMock } = setup(failures);
    await expect(client.call(TEXT_MODEL, {})).rejects.toThrow('offline');
    expect(fetchMock).toHaveBeenCalledTimes(5);
  });

  it('rejects bodies over 4 MiB before calling fetch', async () => {
    const { client, fetchMock } = setup([]);
    await expect(client.call(TEXT_MODEL, { data: 'x'.repeat(MAX_BODY_BYTES) })).rejects.toThrow(/4 MiB/);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe('aiErrorMessage', () => {
  it('uses the disabled notice for AIUnavailableError and the fallback otherwise', () => {
    expect(aiErrorMessage(new AIUnavailableError(), 'fallback')).toBe(AI_UNAVAILABLE_MESSAGE);
    expect(aiErrorMessage(new Error('boom'), 'fallback')).toBe('fallback');
  });
});
