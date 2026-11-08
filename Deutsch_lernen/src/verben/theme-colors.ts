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

/** Channels of a 3- or 6-digit hex colour (`#` optional), or `null` when it is not one. */
export function hexToRgbChannels(hex: string | null | undefined): Rgb | null {
  if (!hex) return null;
  const normalized = hex.replace('#', '').trim();
  const full =
    normalized.length === 3
      ? normalized
          .split('')
          .map((ch) => ch + ch)
          .join('')
      : normalized;
  const int = parseInt(full, 16);
  if (Number.isNaN(int) || full.length !== 6) return null;
  return { r: (int >> 16) & 255, g: (int >> 8) & 255, b: int & 255 };
}

/**
 * Blends two hex colours (`weight` 0 → `colorA`, 1 → `colorB`) for the modal palette. If one colour is not
 * valid hex, the other is returned unchanged.
 */
export function mixHexColors(colorA: string, colorB: string, weight = 0.5): string {
  const a = hexToRgbChannels(colorA);
  const b = hexToRgbChannels(colorB);
  if (!a) return colorB;
  if (!b) return colorA;
  return rgbToHex({
    r: a.r * (1 - weight) + b.r * weight,
    g: a.g * (1 - weight) + b.g * weight,
    b: a.b * (1 - weight) + b.b * weight,
  });
}
