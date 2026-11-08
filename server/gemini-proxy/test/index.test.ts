import { test, mock, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import worker from '../src/index.ts';

const SITE = 'https://juanolaya.github.io';
const MODEL_PATH = '/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent';
const env = { GEMINI_API_KEY: 'test-key' };

function post(origin: string, path = MODEL_PATH): Request {
  return new Request(`https://proxy.example${path}`, {
    method: 'POST',
    headers: { Origin: origin, 'Content-Type': 'application/json' },
    body: '{"contents":[]}',
  });
}

afterEach(() => mock.restoreAll());

test('forwards allowed requests with the key in a header, not the URL', async () => {
  const upstream = mock.method(globalThis, 'fetch', async () => new Response('{"candidates":[]}', { status: 200 }));
  const response = await worker.fetch(post(SITE), env);

  assert.equal(response.status, 200);
  assert.equal(response.headers.get('Access-Control-Allow-Origin'), SITE);
  const [url, init] = upstream.mock.calls[0].arguments as [string, RequestInit];
  assert.equal(url, 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent');
  assert.ok(!url.includes('test-key'));
  assert.equal((init.headers as Record<string, string>)['x-goog-api-key'], 'test-key');
});

test('never calls Google for a foreign origin', async () => {
  const upstream = mock.method(globalThis, 'fetch', async () => new Response('{}'));
  const response = await worker.fetch(post('https://evil.example'), env);

  assert.equal(response.status, 403);
  assert.equal(response.headers.get('Access-Control-Allow-Origin'), null);
  assert.equal(upstream.mock.callCount(), 0);
});

test('answers the CORS preflight only for the allowed origin', async () => {
  const preflight = (origin: string) =>
    worker.fetch(new Request(`https://proxy.example${MODEL_PATH}`, { method: 'OPTIONS', headers: { Origin: origin } }), env);

  assert.equal((await preflight(SITE)).status, 204);
  assert.equal((await preflight('https://evil.example')).status, 403);
});

test('returns 503 when the secret is missing', async () => {
  const upstream = mock.method(globalThis, 'fetch', async () => new Response('{}'));
  const response = await worker.fetch(post(SITE), { GEMINI_API_KEY: '' });

  assert.equal(response.status, 503);
  assert.equal(upstream.mock.callCount(), 0);
});
