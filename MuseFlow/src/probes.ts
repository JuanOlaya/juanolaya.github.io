/** Where a thought probe pauses the game, as fractions of the level, like the study's five probes. */
const PROBE_FRACTIONS = [0.2, 0.4, 0.6, 0.8, 0.95] as const;
/** Short levels get one probe halfway, enough to show the idea. */
const SHORT_LEVEL = 60;

/** The study's five-point scale: 1 is fully on-task, 5 fully off-task. */
export const RATINGS = [1, 2, 3, 4, 5] as const;
export type Rating = (typeof RATINGS)[number];

export function isRating(value: number): value is Rating {
  return (RATINGS as readonly number[]).includes(value);
}

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
  /** Answers of 1 or 2. */
  onTask: number;
  /** Answers of 4 or 5; a 3 counts as neither. */
  offTask: number;
  /** Average rating, or undefined before the first answer. */
  mean: number | undefined;
}

export function summarize(answers: readonly Rating[]): AttentionSummary {
  const onTask = answers.filter((answer) => answer <= 2).length;
  const offTask = answers.filter((answer) => answer >= 4).length;
  const mean = answers.length ? answers.reduce((sum, answer) => sum + answer, 0) / answers.length : undefined;
  return { onTask, offTask, mean };
}
