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

// Everything known before the body is read, so bad requests are rejected without buffering it.
export interface RequestHead {
  method: string;
  origin: string | null;
  path: string;
  contentType: string | null;
  contentLength: string | null;
}

export type Rejection = { ok: false; status: number; error: string };
export type Validation = { ok: true; target: string } | Rejection;
export type BodyValidation = { ok: true } | Rejection;

function reject(status: number, error: string): Rejection {
  return { ok: false, status, error };
}

function declaresTooLarge(contentLength: string | null): boolean {
  if (contentLength === null) return false;
  const bytes = Number(contentLength);
  return !Number.isFinite(bytes) || bytes > MAX_BODY_BYTES;
}

export function validateHead(head: RequestHead, allowedOrigins: readonly string[]): Validation {
  if (!head.origin || !allowedOrigins.includes(head.origin)) return reject(403, 'origin not allowed');
  if (head.method !== 'POST') return reject(405, 'method not allowed');

  const target = head.path.startsWith(PATH_PREFIX) ? head.path.slice(PATH_PREFIX.length) : '';
  if (!ALLOWED_TARGETS.has(target)) return reject(404, 'model not allowed');

  const mediaType = (head.contentType ?? '').split(';')[0].trim().toLowerCase();
  if (mediaType !== 'application/json') return reject(415, 'content type must be application/json');
  if (declaresTooLarge(head.contentLength)) return reject(413, 'payload too large');

  return { ok: true, target };
}

export function validateBody(body: string): BodyValidation {
  try {
    const parsed: unknown = JSON.parse(body);
    if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) return { ok: true };
  } catch {
    // Invalid JSON gets the same rejection as a non-object body.
  }
  return reject(400, 'body must be a JSON object');
}

function concat(chunks: Uint8Array[], total: number): Uint8Array {
  const bytes = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return bytes;
}

// Content-Length can be missing or wrong, so the limit is also enforced on the bytes actually streamed.
export async function readBodyWithLimit(stream: ReadableStream<Uint8Array> | null, maxBytes: number): Promise<string | null> {
  if (!stream) return '';
  const reader = stream.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > maxBytes) {
      await reader.cancel();
      return null;
    }
    chunks.push(value);
  }
  return new TextDecoder().decode(concat(chunks, total));
}
