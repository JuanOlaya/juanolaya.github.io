/** Gemini TTS returns raw 16-bit mono PCM; browsers can only play it once wrapped in a WAV header. */

const DEFAULT_SAMPLE_RATE = 24000;
const WAV_HEADER_BYTES = 44;

export function base64ToBytes(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

/** Reads `rate=24000` from a mime type such as `audio/L16;codec=pcm;rate=24000`. */
export function sampleRateFromMime(mimeType: string): number {
  const match = /rate=(\d+)/.exec(mimeType);
  return match ? Number.parseInt(match[1], 10) : DEFAULT_SAMPLE_RATE;
}

function writeAscii(view: DataView, offset: number, text: string): void {
  for (let i = 0; i < text.length; i++) view.setUint8(offset + i, text.charCodeAt(i));
}

export function pcmToWav(pcm16: Int16Array, sampleRate: number): ArrayBuffer {
  const dataBytes = pcm16.length * 2;
  const buffer = new ArrayBuffer(WAV_HEADER_BYTES + dataBytes);
  const view = new DataView(buffer);
  writeAscii(view, 0, 'RIFF');
  view.setUint32(4, 36 + dataBytes, true);
  writeAscii(view, 8, 'WAVE');
  writeAscii(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, 1, true); // mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeAscii(view, 36, 'data');
  view.setUint32(40, dataBytes, true);
  pcm16.forEach((sample, i) => view.setInt16(WAV_HEADER_BYTES + i * 2, sample, true));
  return buffer;
}

/** The interviewer adds Spanish in [brackets] or (parentheses); only the German should be spoken. */
export function speakableText(text: string): string {
  return text
    .replace(/\[.*?\]/g, '')
    .replace(/\(.*?\)/g, '')
    .trim();
}
