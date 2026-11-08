// Controls that act on Space themselves; the global shortcut must not fire on top of them.
const INTERACTIVE = 'button, input, textarea, select, a, [contenteditable]';

type ClosestCapable = { closest?: (selector: string) => unknown };

/** Whether a keyup should toggle the project cards (Space with nothing interactive focused). */
export function isGridToggleShortcut(event: Pick<KeyboardEvent, 'code' | 'target' | 'defaultPrevented'>): boolean {
  if (event.code !== 'Space' || event.defaultPrevented) return false;
  const target = event.target as ClosestCapable | null;
  return !target?.closest?.(INTERACTIVE);
}
