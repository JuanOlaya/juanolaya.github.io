import { test, mock, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import worker, { type Env } from '../src/index.ts';
import { MAX_BODY_BYTES } from '../src/validate.ts';

const SITE = 'https://juanolaya.github.io';
const MODEL_PATH = '/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent';
const CLIENT_IP = '203.0.113.7';

function limiter(success = true) {
  return { limit: mock.fn(async (_options: { key: string }) => ({ success })) };
}

function envWith(overrides: Partial<Env> = {}): Env {
  return { GEMINI_API_KEY: 'test-key', RATE_LIMITER: limiter(), ...overrides };
}

function post(origin: string, body: BodyInit = '{"contents":[]}', path = MODEL_PATH): Request {
  const init: RequestInit & { duplex?: 'half' } = {
    method: 'POST',
    headers: { Origin: origin, 'Content-Type': 'application/json', 'CF-Connecting-IP': CLIENT_IP },
    body,
  };
  if (body instanceof ReadableStream) init.duplex = 'half';
  return new Request(`https://proxy.example${path}`, init);
}

function countingStream(chunkBytes: number, chunks: number) {
  const state = { pulls: 0 };
  const stream = new ReadableStream<Uint8Array>({
    pull(controller) {
      state.pulls++;
      if (state.pulls > chunks) return controller.close();
      controller.enqueue(new Uint8Array(chunkBytes).fill(32));
    },
  });
  return { stream, state };
}

afterEach(() => mock.restoreAll());

test('forwards allowed requests with the key in a header, not the URL', async () => {
  const upstream = mock.method(globalThis, 'fetch', async () => new Response('{"candidates":[]}', { status: 200 }));
  const response = await worker.fetch(post(SITE), envWith());

  assert.equal(response.status, 200);
  assert.equal(response.headers.get('Access-Control-Allow-Origin'), SITE);
  const [url, init] = upstream.mock.calls[0].arguments as [string, RequestInit];
  assert.equal(url, 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent');
  assert.ok(!url.includes('test-key'));
  assert.equal((init.headers as Record<string, string>)['x-goog-api-key'], 'test-key');
});

test('never calls Google for a foreign origin', async () => {
  const upstream = mock.method(globalThis, 'fetch', async () => new Response('{}'));
  const response = await worker.fetch(post('https://evil.example'), envWith());

  assert.equal(response.status, 403);
  assert.equal(response.headers.get('Access-Control-Allow-Origin'), null);
  assert.equal(upstream.mock.callCount(), 0);
});

test('does not read the body of a request rejected by its headers', async () => {
  const { stream, state } = countingStream(1024, 3);
  const response = await worker.fetch(post('https://evil.example', stream), envWith());

  assert.equal(response.status, 403);
  assert.equal(state.pulls <= 1, true, 'at most the stream start-up pull');
});

test('rejects a streamed body over the limit without a Content-Length', async () => {
  const upstream = mock.method(globalThis, 'fetch', async () => new Response('{}'));
  const { stream, state } = countingStream(1024 * 1024, 10);
  const response = await worker.fetch(post(SITE, stream), envWith());

  assert.equal(response.status, 413);
  assert.ok(state.pulls <= MAX_BODY_BYTES / (1024 * 1024) + 2);
  assert.equal(upstream.mock.callCount(), 0);
});

test('rate limits per client IP and returns 429 without calling Google', async () => {
  const upstream = mock.method(globalThis, 'fetch', async () => new Response('{}'));
  const blocked = limiter(false);
  const response = await worker.fetch(post(SITE), envWith({ RATE_LIMITER: blocked }));

  assert.equal(response.status, 429);
  assert.equal(response.headers.get('Access-Control-Allow-Origin'), SITE);
  assert.deepEqual(blocked.limit.mock.calls[0].arguments[0], { key: CLIENT_IP });
  assert.equal(upstream.mock.callCount(), 0);
});

test('does not spend rate-limit budget on requests rejected by their headers', async () => {
  const counted = limiter();
  await worker.fetch(post('https://evil.example'), envWith({ RATE_LIMITER: counted }));
  assert.equal(counted.limit.mock.callCount(), 0);
});

test('answers the CORS preflight only for the allowed origin', async () => {
  const preflight = (origin: string) =>
    worker.fetch(new Request(`https://proxy.example${MODEL_PATH}`, { method: 'OPTIONS', headers: { Origin: origin } }), envWith());

  assert.equal((await preflight(SITE)).status, 204);
  assert.equal((await preflight('https://evil.example')).status, 403);
});

test('returns 503 when the secret is missing', async () => {
  const upstream = mock.method(globalThis, 'fetch', async () => new Response('{}'));
  const response = await worker.fetch(post(SITE), envWith({ GEMINI_API_KEY: '' }));

  assert.equal(response.status, 503);
  assert.equal(upstream.mock.callCount(), 0);
});

test('returns 503 when the rate limiter binding is missing', async () => {
  const upstream = mock.method(globalThis, 'fetch', async () => new Response('{}'));
  const response = await worker.fetch(post(SITE), envWith({ RATE_LIMITER: undefined }));

  assert.equal(response.status, 503);
  assert.equal(upstream.mock.callCount(), 0);
});
