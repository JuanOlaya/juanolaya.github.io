import { AIUnavailableError, createGeminiClient, resolveProxyUrl } from './gemini-client';

export interface ContentPart {
  text?: string;
  inlineData?: { mimeType?: string; data?: string };
}

export interface ChatTurn {
  role: 'user' | 'model';
  parts: [{ text: string }];
}

export interface GenerateContentResponse {
  candidates?: Array<{
    content?: { parts?: ContentPart[] };
    groundingMetadata?: { groundingAttributions?: unknown[] };
  }>;
}

export interface PredictResponse {
  predictions?: Array<{ bytesBase64Encoded?: string }>;
}

const metaContent = document.querySelector<HTMLMetaElement>('meta[name="gemini-proxy-url"]')?.content ?? null;

export const gemini = createGeminiClient({
  proxyUrl: resolveProxyUrl(import.meta.env.VITE_GEMINI_PROXY_URL, metaContent),
  fetch: (input, init) => fetch(input, init),
  wait: (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
});

export function responseParts(response: GenerateContentResponse): ContentPart[] {
  return response.candidates?.[0]?.content?.parts ?? [];
}

export function firstText(response: GenerateContentResponse): string {
  const text = responseParts(response)[0]?.text;
  if (!text) throw new Error('Respuesta vacía de Gemini.');
  return text;
}

/** A disabled hub is expected on the public site, so it is not logged as an error. */
export function logAiError(context: string, error: unknown): void {
  if (error instanceof AIUnavailableError) return;
  console.error(context, error);
}
