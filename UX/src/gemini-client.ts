/**
 * Gemini calls go through a proxy (server/gemini-proxy/) that holds the API key as a secret,
 * so the key never reaches the browser. Without a proxy URL the AI Hub is disabled.
 */

export const AI_UNAVAILABLE_MESSAGE =
  'El AI Hub está desactivado en esta versión pública: no hay un proxy de Gemini configurado.';

/** The proxy rejects anything larger, so fail early instead of uploading it. */
export const MAX_BODY_BYTES = 4 * 1024 * 1024;

const MAX_ATTEMPTS = 5;
const FIRST_RETRY_DELAY_MS = 1000;

/** The only model/method pairs the proxy forwards. */
export type GeminiEndpoint =
  | 'gemini-2.5-flash-preview-09-2025:generateContent'
  | 'gemini-2.5-flash-preview-tts:generateContent'
  | 'gemini-2.5-flash-image-preview:generateContent'
  | 'imagen-4.0-generate-001:predict';

export class AIUnavailableError extends Error {
  constructor() {
    super(AI_UNAVAILABLE_MESSAGE);
    this.name = 'AIUnavailableError';
  }
}

export interface GeminiClientDeps {
  proxyUrl: string;
  fetch: typeof fetch;
  wait: (ms: number) => Promise<void>;
}

export interface GeminiClient {
  readonly isAvailable: boolean;
  call<T>(endpoint: GeminiEndpoint, payload: unknown): Promise<T>;
}

/** The build-time variable wins so a deploy can enable the hub without editing the HTML. */
export function resolveProxyUrl(envUrl: string | undefined, metaContent: string | null): string {
  const fromEnv = (envUrl ?? '').trim();
  const raw = fromEnv || (metaContent ?? '').trim();
  return raw.replace(/\/+$/, '');
}

export function buildEndpointUrl(proxyUrl: string, endpoint: GeminiEndpoint): string {
  return `${proxyUrl}/v1beta/models/${endpoint}`;
}

/** The disabled notice is more useful to the visitor than each feature's generic error text. */
export function aiErrorMessage(error: unknown, fallback: string): string {
  return error instanceof AIUnavailableError ? AI_UNAVAILABLE_MESSAGE : fallback;
}

function isRetryableStatus(status: number): boolean {
  return status === 429 || status >= 500;
}

function serializeBody(payload: unknown): string {
  const body = JSON.stringify(payload);
  if (new TextEncoder().encode(body).byteLength > MAX_BODY_BYTES) {
    throw new Error('La petición supera el límite de 4 MiB del proxy.');
  }
  return body;
}

export function createGeminiClient(deps: GeminiClientDeps): GeminiClient {
  const proxyUrl = deps.proxyUrl.trim().replace(/\/+$/, '');

  async function call<T>(endpoint: GeminiEndpoint, payload: unknown): Promise<T> {
    if (!proxyUrl) throw new AIUnavailableError();
    const url = buildEndpointUrl(proxyUrl, endpoint);
    const init: RequestInit = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: serializeBody(payload),
    };
    let delay = FIRST_RETRY_DELAY_MS;
    for (let attempt = 1; ; attempt++) {
      const isLastAttempt = attempt === MAX_ATTEMPTS;
      let response: Response;
      try {
        response = await deps.fetch(url, init);
      } catch (networkError) {
        if (isLastAttempt) throw networkError;
        await deps.wait(delay);
        delay *= 2;
        continue;
      }
      if (response.ok) return (await response.json()) as T;
      // Only rate limits and server errors are transient; any other 4xx from the proxy is final.
      if (isRetryableStatus(response.status) && !isLastAttempt) {
        await deps.wait(delay);
        delay *= 2;
        continue;
      }
      throw new Error(`Error API ${response.status}: ${await response.text()}`);
    }
  }

  return { isAvailable: proxyUrl !== '', call };
}
