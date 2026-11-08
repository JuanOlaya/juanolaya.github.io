/** Moves `index` by `delta` inside `[0, length)`, wrapping around at both ends like the original arrows. */
export function stepIndex(index: number, delta: number, length: number): number {
  if (length <= 0) throw new RangeError('length must be positive');
  return (((index + delta) % length) + length) % length;
}
