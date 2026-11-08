import { MAX_BODY_BYTES, readBodyWithLimit, validateBody, validateHead } from './validate.ts';

// Shape of the Workers Rate Limiting binding declared in wrangler.toml ([[ratelimits]]).
export interface RateLimiter {
  limit(options: { key: string }): Promise<{ success: boolean }>;
}

export interface Env {
  GEMINI_API_KEY: string;
  RATE_LIMITER?: RateLimiter;
  // Comma-separated; defaults to the production site. Override in .dev.vars for local testing only.
  ALLOWED_ORIGINS?: string;
}

const DEFAULT_ORIGIN = 'https://juanolaya.github.io';
const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models/';

function allowedOrigins(env: Env): string[] {
  return (env.ALLOWED_ORIGINS ?? DEFAULT_ORIGIN).split(',').map((origin) => origin.trim()).filter(Boolean);
}

function corsHeaders(origin: string | null, origins: string[]): Record<string, string> {
  if (!origin || !origins.includes(origin)) return {};
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
}

function jsonError(status: number, error: string, headers: Record<string, string>): Response {
  return new Response(JSON.stringify({ error }), {
    status,
    headers: { 'Content-Type': 'application/json', ...headers },
  });
}

function preflight(cors: Record<string, string>): Response {
  if (!cors['Access-Control-Allow-Origin']) return jsonError(403, 'origin not allowed', cors);
  return new Response(null, { status: 204, headers: cors });
}

// Origin only stops browsers on other sites; the per-IP limit is what bounds scripted abuse of the key.
async function isRateLimited(request: Request, env: Env): Promise<boolean> {
  const key = request.headers.get('CF-Connecting-IP') ?? 'unknown';
  const { success } = await (env.RATE_LIMITER as RateLimiter).limit({ key });
  return !success;
}

async function forward(target: string, body: string, env: Env, cors: Record<string, string>): Promise<Response> {
  const upstream = await fetch(GEMINI_BASE_URL + target, {
    method: 'POST',
    // Header instead of ?key= so the key never appears in URLs or logs.
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': env.GEMINI_API_KEY },
    body,
  });
  return new Response(upstream.body, {
    status: upstream.status,
    headers: { 'Content-Type': upstream.headers.get('Content-Type') ?? 'application/json', ...cors },
  });
}

async function proxy(request: Request, env: Env): Promise<Response> {
  const origins = allowedOrigins(env);
  const cors = corsHeaders(request.headers.get('Origin'), origins);
  if (request.method === 'OPTIONS') return preflight(cors);

  const head = validateHead({
    method: request.method,
    origin: request.headers.get('Origin'),
    path: new URL(request.url).pathname,
    contentType: request.headers.get('Content-Type'),
    contentLength: request.headers.get('Content-Length'),
  }, origins);
  if (!head.ok) return jsonError(head.status, head.error, cors);
  if (!env.GEMINI_API_KEY || !env.RATE_LIMITER) return jsonError(503, 'proxy not configured', cors);
  if (await isRateLimited(request, env)) return jsonError(429, 'too many requests', cors);

  const body = await readBodyWithLimit(request.body, MAX_BODY_BYTES);
  if (body === null) return jsonError(413, 'payload too large', cors);
  const bodyCheck = validateBody(body);
  if (!bodyCheck.ok) return jsonError(bodyCheck.status, bodyCheck.error, cors);

  return forward(head.target, body, env, cors);
}

export default { fetch: proxy };
