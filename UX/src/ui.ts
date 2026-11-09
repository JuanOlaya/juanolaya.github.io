/** Class recipes of the shared STYLE-CONTRACT (§5, §9 A), so every component uses the same look. */

const BUTTON_BASE =
  'inline-flex min-h-11 min-w-11 items-center justify-center gap-1.5 rounded-button px-4 font-medium ' +
  'disabled:cursor-not-allowed disabled:opacity-50 motion-safe:transition-colors';

export const BUTTON_PRIMARY = `${BUTTON_BASE} bg-accent text-on-accent hover:bg-accent-hover`;

export const BUTTON_SECONDARY =
  `${BUTTON_BASE} border border-white/15 bg-white/5 text-ink hover:bg-white/10 ` +
  'aria-pressed:border-accent-hover aria-pressed:bg-accent-hover/20';

/** Text-only action (links inside copy, "Reiniciar"), still a 44px target. */
export const BUTTON_GHOST = `${BUTTON_BASE} text-ink-2 underline underline-offset-2 hover:text-ink`;

export const CARD = 'rounded-card border border-border bg-surface p-[clamp(16px,1.6vw,24px)] text-ink';

/** Nested panel inside a card: page background so the layering stays readable. */
export const PANEL = 'rounded-card border border-border bg-bg p-4';

export const FIELD =
  'min-h-11 w-full rounded-button border border-border bg-bg px-3 text-ink placeholder:text-ink-2 ' +
  'focus-visible:border-[rgba(243,228,206,0.6)]';

/** Small uppercase label above a block ("El Problema", "Demostración visual"). */
export const EYEBROW = 'text-caption font-medium uppercase tracking-wider';
