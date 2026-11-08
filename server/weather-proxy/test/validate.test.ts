import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CITY_COORDINATES, trimWeather, validateRequest } from '../src/validate.ts';

const SITE = 'https://juanolaya.github.io';

function facts(url: string, method = 'GET', origin: string | null = SITE) {
  return { method, origin, url };
}

test('accepts every Balconity city', () => {
  for (const slug of Object.keys(CITY_COORDINATES)) {
    const result = validateRequest(facts(`https://p.example/weather?city=${slug}`), [SITE]);
    assert.deepEqual(result, { ok: true, city: CITY_COORDINATES[slug] });
  }
});

test('rejects missing origin, other paths and missing city', () => {
  assert.deepEqual(validateRequest(facts('https://p.example/weather?city=tokyo', 'GET', null), [SITE]), {
    ok: false,
    status: 403,
    error: 'origin not allowed',
  });
  assert.equal(validateRequest(facts('https://p.example/forecast?city=tokyo'), [SITE]).ok, false);
  assert.equal(validateRequest(facts('https://p.example/weather'), [SITE]).ok, false);
});

test('trimWeather keeps temperature, icon and description only', () => {
  assert.deepEqual(trimWeather({ main: { temp: 3, pressure: 1 }, weather: [{ icon: '01n', id: 800 }], coord: {} }), {
    main: { temp: 3 },
    weather: [{ icon: '01n', description: '' }],
  });
  assert.equal(trimWeather({ main: {}, weather: [] }), null);
  assert.equal(trimWeather('nope'), null);
});
