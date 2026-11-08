// Request validation is kept free of Workers APIs so it can be tested with plain Node.

// Screenshots from the UX audit tab are sent inline as base64, so the limit leaves room for one image.
export const MAX_BODY_BYTES = 4 * 1024 * 1024;

// Exactly the model:method pairs that UX/index.html uses; anything else would spend the key on other models.
export const ALLOWED_TARGETS: ReadonlySet<string> = new Set([
  'gemini-2.5-flash-preview-09-2025:generateContent',
  'gemini-2.5-flash-preview-tts:generateContent',
  'gemini-2.5-flash-image-preview:generateContent',
  'imagen-4.0-generate-001:predict',
]);

const PATH_PREFIX = '/v1beta/models/';

export interface RequestFacts {
  method: string;
  origin: string | null;
  path: string;
  contentType: string | null;
  body: string;
}

export type Validation =
  | { ok: true; target: string }
  | { ok: false; status: number; error: string };

function reject(status: number, error: string): Validation {
  return { ok: false, status, error };
}

function isJsonObject(body: string): boolean {
  try {
    const parsed: unknown = JSON.parse(body);
    return typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed);
  } catch {
    return false;
  }
}

export function validateRequest(facts: RequestFacts, allowedOrigins: readonly string[]): Validation {
  if (!facts.origin || !allowedOrigins.includes(facts.origin)) return reject(403, 'origin not allowed');
  if (facts.method !== 'POST') return reject(405, 'method not allowed');

  const target = facts.path.startsWith(PATH_PREFIX) ? facts.path.slice(PATH_PREFIX.length) : '';
  if (!ALLOWED_TARGETS.has(target)) return reject(404, 'model not allowed');

  const mediaType = (facts.contentType ?? '').split(';')[0].trim().toLowerCase();
  if (mediaType !== 'application/json') return reject(415, 'content type must be application/json');

  if (new TextEncoder().encode(facts.body).byteLength > MAX_BODY_BYTES) return reject(413, 'payload too large');
  if (!isJsonObject(facts.body)) return reject(400, 'body must be a JSON object');

  return { ok: true, target };
}
