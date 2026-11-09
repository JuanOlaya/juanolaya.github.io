/** Eases `value` toward `target` in about `seconds`; instant when `seconds` is 0 (reduced motion). */
export function approach(value: number, target: number, deltaSeconds: number, seconds: number): number {
  if (seconds <= 0) return target;
  const step = deltaSeconds / seconds;
  return value < target ? Math.min(value + step, target) : Math.max(value - step, target);
}

/** Largest size with the given aspect that fits inside the box. */
export function fitAspect(
  boxWidth: number,
  boxHeight: number,
  aspect: number,
): { width: number; height: number } {
  const width = Math.max(0, Math.min(boxWidth, boxHeight * aspect));
  return { width: Math.floor(width), height: Math.floor(width / aspect) };
}
