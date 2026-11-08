// Request validation and response trimming are kept free of Workers APIs so they can be tested with plain Node.

export interface Coordinates {
  lat: number;
  lon: number;
}

// Only the cameras shown by Balconity/ and EurekaWall/balconity/; any other place would spend the key for others.
export const CITY_COORDINATES: Readonly<Record<string, Coordinates>> = {
  brasov: { lat: 45.64, lon: 25.59 },
  'sao-paulo': { lat: -23.42, lon: -46.48 },
  taoyuan: { lat: 24.89, lon: 121.28 },
  taipei: { lat: 25.03, lon: 121.56 },
  odessa: { lat: 46.49, lon: 30.73 },
  tokyo: { lat: 35.65, lon: 139.7 },
  verbier: { lat: 46.09, lon: 7.22 },
  venice: { lat: 45.44, lon: 12.32 },
  amsterdam: { lat: 52.37, lon: 4.89 },
};

export interface RequestFacts {
  method: string;
  origin: string | null;
  url: string;
}

export type Validation = { ok: true; city: Coordinates } | { ok: false; status: number; error: string };

/** What the browser receives: the fields Balconity renders, in OpenWeather's own shape. */
export interface TrimmedWeather {
  main: { temp: number };
  weather: { icon: string; description: string }[];
}

function reject(status: number, error: string): Validation {
  return { ok: false, status, error };
}

export function validateRequest(facts: RequestFacts, allowedOrigins: readonly string[]): Validation {
  if (!facts.origin || !allowedOrigins.includes(facts.origin)) return reject(403, 'origin not allowed');
  if (facts.method !== 'GET') return reject(405, 'method not allowed');

  const url = new URL(facts.url);
  if (url.pathname !== '/weather') return reject(404, 'not found');

  const slug = url.searchParams.get('city') ?? '';
  const city = Object.hasOwn(CITY_COORDINATES, slug) ? CITY_COORDINATES[slug] : undefined;
  if (!city) return reject(404, 'city not allowed');

  return { ok: true, city };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

/** Drops everything except temperature and icon, so the reply cannot leak more than the page needs. */
export function trimWeather(payload: unknown): TrimmedWeather | null {
  if (!isRecord(payload) || !isRecord(payload.main) || !Array.isArray(payload.weather)) return null;
  const first: unknown = payload.weather[0];
  if (typeof payload.main.temp !== 'number' || !isRecord(first) || typeof first.icon !== 'string') return null;
  const description = typeof first.description === 'string' ? first.description : '';
  return { main: { temp: payload.main.temp }, weather: [{ icon: first.icon, description }] };
}
