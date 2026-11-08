import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  MAX_BODY_BYTES,
  readBodyWithLimit,
  validateBody,
  validateHead,
  type RequestHead,
} from '../src/validate.ts';

const ORIGINS = ['https://juanolaya.github.io'];

function head(overrides: Partial<RequestHead> = {}): RequestHead {
  return {
    method: 'POST',
    origin: 'https://juanolaya.github.io',
    path: '/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent',
    contentType: 'application/json',
    contentLength: '15',
    ...overrides,
  };
}

function streamOf(...chunks: Uint8Array[]): ReadableStream<Uint8Array> {
  return new ReadableStream({
    start(controller) {
      for (const chunk of chunks) controller.enqueue(chunk);
      controller.close();
    },
  });
}

function statusOf(result: { ok: boolean; status?: number }): number | undefined {
  return result.ok ? undefined : result.status;
}

test('accepts an allowed model from the allowed origin', () => {
  assert.deepEqual(validateHead(head(), ORIGINS), { ok: true, target: 'gemini-2.5-flash-preview-09-2025:generateContent' });
});

test('accepts imagen predict', () => {
  assert.equal(validateHead(head({ path: '/v1beta/models/imagen-4.0-generate-001:predict' }), ORIGINS).ok, true);
});

test('rejects a foreign origin with 403', () => {
  assert.deepEqual(validateHead(head({ origin: 'https://evil.example' }), ORIGINS), { ok: false, status: 403, error: 'origin not allowed' });
});

test('rejects a missing origin with 403', () => {
  assert.equal(statusOf(validateHead(head({ origin: null }), ORIGINS)), 403);
});

test('rejects non-POST methods with 405', () => {
  assert.equal(statusOf(validateHead(head({ method: 'GET' }), ORIGINS)), 405);
});

test('rejects a model outside the allowlist with 404', () => {
  assert.equal(statusOf(validateHead(head({ path: '/v1beta/models/gemini-ultra:generateContent' }), ORIGINS)), 404);
});

test('rejects an allowed model with a different method with 404', () => {
  assert.equal(statusOf(validateHead(head({ path: '/v1beta/models/imagen-4.0-generate-001:generateContent' }), ORIGINS)), 404);
});

test('rejects path traversal attempts with 404', () => {
  assert.equal(statusOf(validateHead(head({ path: '/v1beta/models/../files:generateContent' }), ORIGINS)), 404);
});

test('rejects non-JSON content types with 415', () => {
  assert.equal(statusOf(validateHead(head({ contentType: 'text/plain' }), ORIGINS)), 415);
});

test('accepts JSON content type with charset', () => {
  assert.equal(validateHead(head({ contentType: 'application/json; charset=utf-8' }), ORIGINS).ok, true);
});

test('rejects a declared Content-Length over the limit with 413', () => {
  assert.equal(statusOf(validateHead(head({ contentLength: String(MAX_BODY_BYTES + 1) }), ORIGINS)), 413);
});

test('rejects a non-numeric Content-Length with 413', () => {
  assert.equal(statusOf(validateHead(head({ contentLength: 'lots' }), ORIGINS)), 413);
});

test('accepts a missing Content-Length because the limit is enforced while streaming', () => {
  assert.equal(validateHead(head({ contentLength: null }), ORIGINS).ok, true);
});

test('rejects invalid JSON with 400', () => {
  assert.equal(statusOf(validateBody('{not json')), 400);
});

test('rejects a JSON body that is not an object with 400', () => {
  assert.equal(statusOf(validateBody('[1,2]')), 400);
});

test('accepts a JSON object body', () => {
  assert.deepEqual(validateBody('{"contents":[]}'), { ok: true });
});

test('reads a body within the limit across chunks', async () => {
  const encoder = new TextEncoder();
  const body = await readBodyWithLimit(streamOf(encoder.encode('{"a":'), encoder.encode('"é"}')), 64);
  assert.equal(body, '{"a":"é"}');
});

test('stops reading once the streamed bytes pass the limit', async () => {
  let pulls = 0;
  const endless = new ReadableStream<Uint8Array>({
    pull(controller) {
      pulls++;
      controller.enqueue(new Uint8Array(1024));
    },
  });
  assert.equal(await readBodyWithLimit(endless, 4096), null);
  assert.ok(pulls < 10);
});

test('measures the limit in bytes, not characters', async () => {
  const twoBytesEach = new TextEncoder().encode('é'.repeat(3));
  assert.equal(await readBodyWithLimit(streamOf(twoBytesEach), 5), null);
});
