export interface Rgb {
  r: number;
  g: number;
  b: number;
}

/** `"r, g, b"` for `rgba(var(--x), alpha)` styles; unknown input falls back to the default blue. */
export function hexToRgb(hex: string): string {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  const full = hex.replace(
    shorthandRegex,
    (_match, r: string, g: string, b: string) => r + r + g + g + b + b,
  );
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(full);
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : '59, 130, 246';
}

export function rgbToHex({ r, g, b }: Rgb): string {
  const toHex = (value: number) =>
    Math.max(0, Math.min(255, Math.round(value)))
      .toString(16)
      .padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Blends two hex colours (`weight` 0 → `colorA`, 1 → `colorB`) for the modal palette.
 * It reads channels through `hexToRgb`, which returns a string, so every channel is NaN.
 */
export function mixHexColors(colorA: string, colorB: string, weight = 0.5): string {
  const a = hexToRgb(colorA) as unknown as Rgb | null;
  const b = hexToRgb(colorB) as unknown as Rgb | null;
  if (!a) return colorB;
  if (!b) return colorA;
  return rgbToHex({
    r: a.r * (1 - weight) + b.r * weight,
    g: a.g * (1 - weight) + b.g * weight,
    b: a.b * (1 - weight) + b.b * weight,
  });
}
