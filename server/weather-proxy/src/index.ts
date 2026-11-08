import { trimWeather, validateRequest } from './validate.ts';

export interface Env {
  OPENWEATHER_API_KEY: string;
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

async function proxy(request: Request, env: Env): Promise<Response> {
  const origins = allowedOrigins(env);
  const origin = request.headers.get('Origin');
  if (request.method === 'OPTIONS') return preflight(origin, origins);

  const validation = validateRequest({ method: request.method, origin, url: request.url }, origins);
  const cors = origin && origins.includes(origin) ? corsHeaders(origin) : {};
  if (!validation.ok) return json(validation.status, { error: validation.error }, cors);
  if (!env.OPENWEATHER_API_KEY) return json(503, { error: 'proxy not configured' }, cors);

  const target = new URL(OPENWEATHER_URL);
  target.search = new URLSearchParams({
    lat: String(validation.city.lat),
    lon: String(validation.city.lon),
    units: 'metric',
    appid: env.OPENWEATHER_API_KEY,
  }).toString();

  const upstream = await fetch(target.toString());
  // Upstream errors are not forwarded: their body could echo request details, including the key.
  if (!upstream.ok) return json(502, { error: 'upstream error' }, cors);
  const trimmed = trimWeather(await upstream.json());
  if (!trimmed) return json(502, { error: 'unexpected upstream reply' }, cors);
  return json(200, trimmed, { ...cors, 'Cache-Control': `public, max-age=${CACHE_SECONDS}` });
}

export default { fetch: proxy };
