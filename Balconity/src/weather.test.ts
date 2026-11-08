import { describe, expect, it, vi } from 'vitest';
import { fetchCityWeather, toWeatherView, weatherUrl } from './weather.ts';

const VALID = { main: { temp: 17.6 }, weather: [{ icon: '04d', description: 'broken clouds' }] };

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
}

describe('toWeatherView', () => {
  it('rounds the temperature and builds an https icon URL', () => {
    expect(toWeatherView(VALID)).toEqual({
      temperature: 18,
      iconUrl: 'https://openweathermap.org/img/wn/04d@2x.png',
    });
  });

  it.each([
    ['null', null],
    ['missing main', { weather: VALID.weather }],
    ['non-numeric temp', { main: { temp: '17' }, weather: VALID.weather }],
    ['empty weather list', { main: VALID.main, weather: [] }],
    ['unexpected icon code', { main: VALID.main, weather: [{ icon: '"><script>' }] }],
  ])('returns null for %s', (_label, payload) => {
    expect(toWeatherView(payload)).toBeNull();
  });
});

describe('weatherUrl', () => {
  it('appends the city to the proxy URL without doubling slashes', () => {
    expect(weatherUrl('https://proxy.example/', 'sao-paulo')).toBe(
      'https://proxy.example/weather?city=sao-paulo',
    );
  });
});

describe('fetchCityWeather', () => {
  it('does not call the network when the proxy is not configured', async () => {
    const fetchFn = vi.fn();
    await expect(fetchCityWeather('', 'tokyo', fetchFn)).resolves.toBeNull();
    expect(fetchFn).not.toHaveBeenCalled();
  });

  it('returns the view for a valid reply', async () => {
    const fetchFn = vi.fn(async () => jsonResponse(VALID));
    await expect(fetchCityWeather('https://proxy.example', 'tokyo', fetchFn)).resolves.toEqual({
      temperature: 18,
      iconUrl: 'https://openweathermap.org/img/wn/04d@2x.png',
    });
    expect(fetchFn).toHaveBeenCalledWith('https://proxy.example/weather?city=tokyo');
  });

  it('returns null on HTTP errors and network failures', async () => {
    await expect(
      fetchCityWeather('https://p', 'tokyo', async () => jsonResponse({ error: 'x' }, 503)),
    ).resolves.toBeNull();
    await expect(
      fetchCityWeather('https://p', 'tokyo', async () => {
        throw new TypeError('offline');
      }),
    ).resolves.toBeNull();
  });
});
