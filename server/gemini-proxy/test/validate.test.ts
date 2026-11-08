import { test } from 'node:test';
import assert from 'node:assert/strict';
import { MAX_BODY_BYTES, validateRequest, type RequestFacts } from '../src/validate.ts';

const ORIGINS = ['https://juanolaya.github.io'];

function facts(overrides: Partial<RequestFacts> = {}): RequestFacts {
  return {
    method: 'POST',
    origin: 'https://juanolaya.github.io',
    path: '/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent',
    contentType: 'application/json',
    body: '{"contents":[]}',
    ...overrides,
  };
}

test('accepts an allowed model from the allowed origin', () => {
  const result = validateRequest(facts(), ORIGINS);
  assert.deepEqual(result, { ok: true, target: 'gemini-2.5-flash-preview-09-2025:generateContent' });
});

test('accepts imagen predict', () => {
  const result = validateRequest(facts({ path: '/v1beta/models/imagen-4.0-generate-001:predict' }), ORIGINS);
  assert.equal(result.ok, true);
});

test('rejects a foreign origin with 403', () => {
  const result = validateRequest(facts({ origin: 'https://evil.example' }), ORIGINS);
  assert.deepEqual(result, { ok: false, status: 403, error: 'origin not allowed' });
});

test('rejects a missing origin with 403', () => {
  const result = validateRequest(facts({ origin: null }), ORIGINS);
  assert.equal(result.ok, false);
  assert.equal(result.ok === false && result.status, 403);
});

test('rejects non-POST methods with 405', () => {
  const result = validateRequest(facts({ method: 'GET' }), ORIGINS);
  assert.equal(result.ok === false && result.status, 405);
});

test('rejects a model outside the allowlist with 404', () => {
  const result = validateRequest(facts({ path: '/v1beta/models/gemini-ultra:generateContent' }), ORIGINS);
  assert.equal(result.ok === false && result.status, 404);
});

test('rejects an allowed model with a different method with 404', () => {
  const result = validateRequest(facts({ path: '/v1beta/models/imagen-4.0-generate-001:generateContent' }), ORIGINS);
  assert.equal(result.ok === false && result.status, 404);
});

test('rejects path traversal attempts with 404', () => {
  const result = validateRequest(facts({ path: '/v1beta/models/../files:generateContent' }), ORIGINS);
  assert.equal(result.ok === false && result.status, 404);
});

test('rejects non-JSON content types with 415', () => {
  const result = validateRequest(facts({ contentType: 'text/plain' }), ORIGINS);
  assert.equal(result.ok === false && result.status, 415);
});

test('accepts JSON content type with charset', () => {
  const result = validateRequest(facts({ contentType: 'application/json; charset=utf-8' }), ORIGINS);
  assert.equal(result.ok, true);
});

test('rejects bodies over the size limit with 413', () => {
  const body = JSON.stringify({ data: 'x'.repeat(MAX_BODY_BYTES) });
  const result = validateRequest(facts({ body }), ORIGINS);
  assert.equal(result.ok === false && result.status, 413);
});

test('measures the limit in bytes, not characters', () => {
  const body = JSON.stringify({ data: 'é'.repeat(MAX_BODY_BYTES / 2) });
  const result = validateRequest(facts({ body }), ORIGINS);
  assert.equal(result.ok === false && result.status, 413);
});

test('rejects invalid JSON with 400', () => {
  const result = validateRequest(facts({ body: '{not json' }), ORIGINS);
  assert.equal(result.ok === false && result.status, 400);
});

test('rejects a JSON body that is not an object with 400', () => {
  const result = validateRequest(facts({ body: '[1,2]' }), ORIGINS);
  assert.equal(result.ok === false && result.status, 400);
});
