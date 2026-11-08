/** Helpers that turn model output into typed data rendered as text (never as HTML). */

export interface TextSegment {
  kind: 'text' | 'translation';
  text: string;
}

/** Splits an interviewer message so the Spanish translations in [brackets] can be styled apart. */
export function splitTranslations(message: string): TextSegment[] {
  const segments: TextSegment[] = [];
  let cursor = 0;
  for (const match of message.matchAll(/\[(.*?)\]/g)) {
    const before = message.slice(cursor, match.index);
    if (before.trim()) segments.push({ kind: 'text', text: before.trim() });
    segments.push({ kind: 'translation', text: match[1] });
    cursor = match.index + match[0].length;
  }
  const rest = message.slice(cursor);
  if (rest.trim()) segments.push({ kind: 'text', text: rest.trim() });
  return segments;
}

export interface AuditReport {
  sobrecargaScore: number;
  sobrecargaFeedback: string;
  disclosureScore: number;
  disclosureFeedback: string;
  hickScore: number;
  hickFeedback: string;
  summary: string;
}

function field<T>(data: Record<string, unknown>, key: string, type: 'string' | 'number'): T {
  const value = data[key];
  if (typeof value !== type) throw new Error(`Campo "${key}" ausente en el diagnóstico.`);
  return value as T;
}

export function parseAuditReport(jsonText: string): AuditReport {
  const data: unknown = JSON.parse(jsonText);
  if (typeof data !== 'object' || data === null) throw new Error('Diagnóstico no válido.');
  const record = data as Record<string, unknown>;
  return {
    sobrecargaScore: field(record, 'sobrecarga_score', 'number'),
    sobrecargaFeedback: field(record, 'sobrecarga_feedback', 'string'),
    disclosureScore: field(record, 'disclosure_score', 'number'),
    disclosureFeedback: field(record, 'disclosure_feedback', 'string'),
    hickScore: field(record, 'hick_score', 'number'),
    hickFeedback: field(record, 'hick_feedback', 'string'),
    summary: field(record, 'resumen_general', 'string'),
  };
}

export interface GroundingSource {
  title: string;
  uri: string;
}

/** Keeps only http(s) links so a model-supplied `javascript:` URI can never become a clickable link. */
export function groundingSources(attributions: readonly unknown[]): GroundingSource[] {
  const sources: GroundingSource[] = [];
  for (const attribution of attributions) {
    const web = (attribution as { web?: { uri?: unknown; title?: unknown } } | null)?.web;
    if (typeof web?.uri !== 'string' || !/^https?:\/\//i.test(web.uri)) continue;
    const title = typeof web.title === 'string' && web.title ? web.title : web.uri;
    sources.push({ title, uri: web.uri });
  }
  return sources;
}
