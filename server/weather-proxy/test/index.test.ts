import { test, mock, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import worker from '../src/index.ts';

const SITE = 'https://juanolaya.github.io';
const allowAll = { limit: async () => ({ success: true }) };
const env = { OPENWEATHER_API_KEY: 'test-key', RATE_LIMITER: allowAll };
const UPSTREAM_BODY = { main: { temp: 17.6, humidity: 80 }, weather: [{ icon: '04d', description: 'broken clouds' }], name: 'X' };

function get(origin: string, path = '/weather?city=tokyo', method = 'GET', ip = '203.0.113.7'): Request {
  return new Request(`https://proxy.example${path}`, { method, headers: { Origin: origin, 'CF-Connecting-IP': ip } });
}

// Minimal stand-in for the Workers Cache API (caches.default), which plain Node lacks.
function installMemoryCache(): Map<string, Response> {
  const store = new Map<string, Response>();
  const cache = {
    match: async (request: Request) => store.get(request.url)?.clone(),
    put: async (request: Request, response: Response) => void store.set(request.url, response),
  };
  Object.defineProperty(globalThis, 'caches', { value: { default: cache }, configurable: true });
  return store;
}

afterEach(() => {
  mock.restoreAll();
  delete (globalThis as { caches?: unknown }).caches;
});

test('returns only temperature and icon for a whitelisted city', async () => {
  const upstream = mock.method(globalThis, 'fetch', async () => Response.json(UPSTREAM_BODY));
  const response = await worker.fetch(get(SITE), env);

  assert.equal(response.status, 200);
  assert.equal(response.headers.get('Access-Control-Allow-Origin'), SITE);
  assert.match(response.headers.get('Cache-Control') ?? '', /max-age=600/);
  assert.deepEqual(await response.json(), { main: { temp: 17.6 }, weather: [{ icon: '04d', description: 'broken clouds' }] });

  const url = new URL(upstream.mock.calls[0].arguments[0] as string);
  assert.equal(url.origin + url.pathname, 'https://api.openweathermap.org/data/2.5/weather');
  assert.equal(url.searchParams.get('lat'), '35.65');
  assert.equal(url.searchParams.get('lon'), '139.7');
  assert.equal(url.searchParams.get('units'), 'metric');
});

test('never calls OpenWeather for a foreign origin or an unknown city', async () => {
  const upstream = mock.method(globalThis, 'fetch', async () => Response.json(UPSTREAM_BODY));

  assert.equal((await worker.fetch(get('https://evil.example'), env)).status, 403);
  assert.equal((await worker.fetch(get(SITE, '/weather?city=paris'), env)).status, 404);
  assert.equal((await worker.fetch(get(SITE, '/weather?city=__proto__'), env)).status, 404);
  assert.equal((await worker.fetch(get(SITE, '/weather?city=tokyo', 'POST'), env)).status, 405);
  assert.equal(upstream.mock.callCount(), 0);
});

test('answers 503 without calling upstream when the key is missing', async () => {
  const upstream = mock.method(globalThis, 'fetch', async () => Response.json(UPSTREAM_BODY));
  const response = await worker.fetch(get(SITE), { OPENWEATHER_API_KEY: '', RATE_LIMITER: allowAll });

  assert.equal(response.status, 503);
  assert.equal(upstream.mock.callCount(), 0);
});

test('hides upstream error bodies, which could echo the key', async () => {
  mock.method(globalThis, 'fetch', async () => Response.json({ message: 'Invalid API key test-key' }, { status: 401 }));
  const response = await worker.fetch(get(SITE), env);

  assert.equal(response.status, 502);
  assert.ok(!(await response.text()).includes('test-key'));
});

test('answers the CORS preflight only for the allowed origin', async () => {
  assert.equal((await worker.fetch(get(SITE, '/weather', 'OPTIONS'), env)).status, 204);
  assert.equal((await worker.fetch(get('https://evil.example', '/weather', 'OPTIONS'), env)).status, 403);
});

test('answers 503 when the rate limiter binding is missing', async () => {
  const upstream = mock.method(globalThis, 'fetch', async () => Response.json(UPSTREAM_BODY));
  const response = await worker.fetch(get(SITE), { OPENWEATHER_API_KEY: 'test-key' });

  assert.equal(response.status, 503);
  assert.equal(upstream.mock.callCount(), 0);
});

test('answers 429 per client IP once the limit is reached, without calling upstream', async () => {
  const upstream = mock.method(globalThis, 'fetch', async () => Response.json(UPSTREAM_BODY));
  const keys: string[] = [];
  const limiter = { limit: async ({ key }: { key: string }) => (keys.push(key), { success: false }) };
  const response = await worker.fetch(get(SITE), { OPENWEATHER_API_KEY: 'test-key', RATE_LIMITER: limiter });

  assert.equal(response.status, 429);
  assert.equal(response.headers.get('Access-Control-Allow-Origin'), SITE);
  assert.deepEqual(keys, ['203.0.113.7']);
  assert.equal(upstream.mock.callCount(), 0);
});

test('answers 502 without details when OpenWeather is unreachable', async () => {
  mock.method(globalThis, 'fetch', async () => {
    throw new TypeError('connect failed for appid=test-key');
  });
  const response = await worker.fetch(get(SITE), env);

  assert.equal(response.status, 502);
  assert.ok(!(await response.text()).includes('test-key'));
});

test('answers 502 when OpenWeather replies with invalid JSON', async () => {
  mock.method(globalThis, 'fetch', async () => new Response('<html>oops test-key</html>', { status: 200 }));
  const response = await worker.fetch(get(SITE), env);

  assert.equal(response.status, 502);
  assert.ok(!(await response.text()).includes('test-key'));
});

test('serves repeated requests for the same city from the Worker cache', async () => {
  const store = installMemoryCache();
  const upstream = mock.method(globalThis, 'fetch', async () => Response.json(UPSTREAM_BODY));

  const first = await worker.fetch(get(SITE), env);
  const second = await worker.fetch(get(SITE), env);
  await worker.fetch(get(SITE, '/weather?city=venice'), env);

  assert.equal(first.status, 200);
  assert.equal(second.status, 200);
  assert.equal(second.headers.get('Access-Control-Allow-Origin'), SITE);
  assert.deepEqual(await second.json(), await first.json());
  assert.equal(upstream.mock.callCount(), 2);
  assert.ok([...store.keys()].every((key) => !key.includes('test-key')));
});
