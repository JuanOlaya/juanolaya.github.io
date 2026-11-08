import { test, mock, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import worker from '../src/index.ts';

const SITE = 'https://juanolaya.github.io';
const env = { OPENWEATHER_API_KEY: 'test-key' };
const UPSTREAM_BODY = { main: { temp: 17.6, humidity: 80 }, weather: [{ icon: '04d', description: 'broken clouds' }], name: 'X' };

function get(origin: string, path = '/weather?city=tokyo', method = 'GET'): Request {
  return new Request(`https://proxy.example${path}`, { method, headers: { Origin: origin } });
}

afterEach(() => mock.restoreAll());

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
  const response = await worker.fetch(get(SITE), { OPENWEATHER_API_KEY: '' });

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
