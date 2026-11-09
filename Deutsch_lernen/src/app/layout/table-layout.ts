/** Below this width (style contract §6, `sm`) a five-column table no longer fits without horizontal scroll. */
export const STACK_BELOW_PX = 640;

export type TableLayout = 'cards' | 'table';

/** How a demonstratives table renders at `width` CSS px; an unusable width keeps every column visible. */
export function tableLayoutForWidth(width: number): TableLayout {
  if (!Number.isFinite(width) || width < 0) return 'table';
  return width < STACK_BELOW_PX ? 'cards' : 'table';
}
