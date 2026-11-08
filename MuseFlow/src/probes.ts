/** Where a thought probe pauses the game, as fractions of the level, like the study's five probes. */
const PROBE_FRACTIONS = [0.2, 0.4, 0.6, 0.8, 0.95] as const;
/** Short levels get one probe halfway, enough to show the idea. */
const SHORT_LEVEL = 60;

export type Attention = 'on-task' | 'off-task';

/** Column indexes that trigger a probe the first time the ball reaches them. */
export function probeColumns(columnCount: number): number[] {
  if (columnCount < 3) return [];
  const fractions = columnCount < SHORT_LEVEL ? [0.5] : PROBE_FRACTIONS;
  const indexes = fractions.map((fraction) =>
    Math.min(Math.round(fraction * (columnCount - 1)), columnCount - 2),
  );
  return [...new Set(indexes)].filter((index) => index > 0);
}

/** The first probe not yet asked whose column the ball has reached, if any. */
export function dueProbe(probes: readonly number[], asked: number, reachedIndex: number): number | undefined {
  const next = probes[asked];
  return next !== undefined && reachedIndex >= next ? next : undefined;
}

export interface AttentionSummary {
  onTask: number;
  offTask: number;
}

export function summarize(answers: readonly Attention[]): AttentionSummary {
  const offTask = answers.filter((answer) => answer === 'off-task').length;
  return { onTask: answers.length - offTask, offTask };
}
