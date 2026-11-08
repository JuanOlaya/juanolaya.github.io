import { validateRequest } from './validate.ts';

export interface Env {
  GEMINI_API_KEY: string;
  // Comma-separated; defaults to the production site. Override in .dev.vars for local testing only.
  ALLOWED_ORIGINS?: string;
}

const DEFAULT_ORIGIN = 'https://juanolaya.github.io';
const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models/';

function allowedOrigins(env: Env): string[] {
  return (env.ALLOWED_ORIGINS ?? DEFAULT_ORIGIN).split(',').map((origin) => origin.trim()).filter(Boolean);
}

function corsHeaders(origin: string): Record<string, string> {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
}

function jsonError(status: number, error: string, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify({ error }), {
    status,
    headers: { 'Content-Type': 'application/json', ...headers },
  });
}

function preflight(origin: string | null, origins: string[]): Response {
  if (!origin || !origins.includes(origin)) return jsonError(403, 'origin not allowed');
  return new Response(null, { status: 204, headers: corsHeaders(origin) });
}

async function proxy(request: Request, env: Env): Promise<Response> {
  const origins = allowedOrigins(env);
  const origin = request.headers.get('Origin');
  if (request.method === 'OPTIONS') return preflight(origin, origins);

  const body = request.method === 'POST' ? await request.text() : '';
  const facts = {
    method: request.method,
    origin,
    path: new URL(request.url).pathname,
    contentType: request.headers.get('Content-Type'),
    body,
  };
  const validation = validateRequest(facts, origins);
  if (!validation.ok) return jsonError(validation.status, validation.error, origin && origins.includes(origin) ? corsHeaders(origin) : {});

  const cors = corsHeaders(facts.origin as string);
  if (!env.GEMINI_API_KEY) return jsonError(503, 'proxy not configured', cors);

  const upstream = await fetch(GEMINI_BASE_URL + validation.target, {
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

export default { fetch: proxy };
