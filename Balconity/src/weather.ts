/**
 * Response of server/weather-proxy: the subset of OpenWeather's "current weather" payload that the page uses.
 * The OpenWeather key lives only in the proxy; a key in a VITE_* variable would ship inside the bundle.
 */
export interface CurrentWeather {
  main: { temp: number };
  weather: { icon: string; description?: string }[];
}

export interface WeatherView {
  temperature: number;
  iconUrl: string;
}

type FetchFn = (url: string) => Promise<Response>;

const ICON_PATTERN = /^\d{2}[dn]$/;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

/** Returns null for anything that does not look like a CurrentWeather, so a bad reply never breaks the page. */
export function toWeatherView(payload: unknown): WeatherView | null {
  if (!isRecord(payload) || !isRecord(payload.main) || !Array.isArray(payload.weather)) return null;
  const temp = payload.main.temp;
  const first: unknown = payload.weather[0];
  if (typeof temp !== 'number' || !Number.isFinite(temp) || !isRecord(first)) return null;
  const icon = first.icon;
  if (typeof icon !== 'string' || !ICON_PATTERN.test(icon)) return null;
  return { temperature: Math.round(temp), iconUrl: `https://openweathermap.org/img/wn/${icon}@2x.png` };
}

export function weatherUrl(proxyUrl: string, slug: string): string {
  return `${proxyUrl.replace(/\/+$/, '')}/weather?city=${encodeURIComponent(slug)}`;
}

/** Null when the proxy is not configured, unreachable or answers with an error: the page then hides the weather. */
export async function fetchCityWeather(
  proxyUrl: string,
  slug: string,
  fetchFn: FetchFn = fetch,
): Promise<WeatherView | null> {
  if (!proxyUrl) return null;
  try {
    const response = await fetchFn(weatherUrl(proxyUrl, slug));
    if (!response.ok) return null;
    return toWeatherView(await response.json());
  } catch {
    return null;
  }
}
