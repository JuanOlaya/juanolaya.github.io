export interface BarSegment {
  label: string;
  percent: number;
  /** Tailwind classes for the segment (colour, rounding, text). */
  class: string;
}

/** True when the segments fill the bar exactly; content files are checked against it in tests. */
export function segmentsFillBar(segments: readonly BarSegment[]): boolean {
  return segments.reduce((total, segment) => total + segment.percent, 0) === 100;
}
