import { trimWeather, validateRequest, type Coordinates, type TrimmedWeather } from './validate.ts';

// Shape of the Workers Rate Limiting binding declared in wrangler.toml ([[ratelimits]]).
export interface RateLimiter {
  limit(options: { key: string }): Promise<{ success: boolean }>;
}

// The Workers runtime exposes caches.default; plain Node (tests) has no Cache API, so it is optional.
interface EdgeCache {
  match(request: Request): Promise<Response | undefined>;
  put(request: Request, response: Response): Promise<void>;
}

export interface Env {
  OPENWEATHER_API_KEY: string;
  RATE_LIMITER?: RateLimiter;
  // Comma-separated; defaults to the production site. Override in .dev.vars for local testing only.
  ALLOWED_ORIGINS?: string;
}

const DEFAULT_ORIGIN = 'https://juanolaya.github.io';
// "Current weather" works on the free plan; One Call 2.5, used by the old Balconity page, was retired.
const OPENWEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather';
// Weather barely changes in ten minutes and browsers/CDN may reuse the reply, which keeps the key's quota low.
const CACHE_SECONDS = 600;

function allowedOrigins(env: Env): string[] {
  return (env.ALLOWED_ORIGINS ?? DEFAULT_ORIGIN)
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}

function corsHeaders(origin: string): Record<string, string> {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
}

function json(status: number, body: unknown, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', ...headers } });
}

function preflight(origin: string | null, origins: string[]): Response {
  if (!origin || !origins.includes(origin)) return json(403, { error: 'origin not allowed' });
  return new Response(null, { status: 204, headers: corsHeaders(origin) });
}

// Origin only stops browsers on other sites; the per-IP limit is what bounds scripted abuse of the key.
async function isRateLimited(request: Request, limiter: RateLimiter): Promise<boolean> {
  const key = request.headers.get('CF-Connecting-IP') ?? 'unknown';
  const { success } = await limiter.limit({ key });
  return !success;
}

function edgeCache(): EdgeCache | undefined {
  return (globalThis as { caches?: { default?: EdgeCache } }).caches?.default;
}

// Keyed by coordinates only, so the key never ends up in the cache and every origin shares one entry per city.
function cacheKey(city: Coordinates): Request {
  return new Request(`https://weather-proxy.cache/weather?lat=${city.lat}&lon=${city.lon}`);
}

async function fetchWeather(city: Coordinates, apiKey: string): Promise<TrimmedWeather | null> {
  const target = new URL(OPENWEATHER_URL);
  target.search = new URLSearchParams({
    lat: String(city.lat),
    lon: String(city.lon),
    units: 'metric',
    appid: apiKey,
  }).toString();
  try {
    const upstream = await fetch(target.toString());
    // Upstream errors are not forwarded: their body could echo request details, including the key.
    if (!upstream.ok) return null;
    return trimWeather(await upstream.json());
  } catch {
    // Network failures and invalid JSON are reported as a generic 502; their messages may contain the URL.
    return null;
  }
}

async function cachedWeather(city: Coordinates, apiKey: string): Promise<TrimmedWeather | null> {
  const cache = edgeCache();
  const hit = await cache?.match(cacheKey(city));
  if (hit) return (await hit.json()) as TrimmedWeather;

  const weather = await fetchWeather(city, apiKey);
  if (weather && cache) await cache.put(cacheKey(city), json(200, weather, { 'Cache-Control': `max-age=${CACHE_SECONDS}` }));
  return weather;
}

async function proxy(request: Request, env: Env): Promise<Response> {
  const origins = allowedOrigins(env);
  const origin = request.headers.get('Origin');
  if (request.method === 'OPTIONS') return preflight(origin, origins);

  const validation = validateRequest({ method: request.method, origin, url: request.url }, origins);
  const cors = origin && origins.includes(origin) ? corsHeaders(origin) : {};
  if (!validation.ok) return json(validation.status, { error: validation.error }, cors);
  if (!env.OPENWEATHER_API_KEY || !env.RATE_LIMITER) return json(503, { error: 'proxy not configured' }, cors);
  if (await isRateLimited(request, env.RATE_LIMITER)) return json(429, { error: 'too many requests' }, cors);

  const weather = await cachedWeather(validation.city, env.OPENWEATHER_API_KEY);
  if (!weather) return json(502, { error: 'upstream error' }, cors);
  return json(200, weather, { ...cors, 'Cache-Control': `public, max-age=${CACHE_SECONDS}` });
}

export default { fetch: proxy };
