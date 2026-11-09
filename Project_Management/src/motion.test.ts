import { describe, expect, it, vi } from 'vitest';
import { type MotionQuery, animationDurationMs, watchReducedMotion } from './motion';

function fakeQuery(matches: boolean): MotionQuery & { fire(matches: boolean): void } {
  const listeners = new Set<(event: { matches: boolean }) => void>();
  return {
    matches,
    addEventListener: (_type, listener) => listeners.add(listener),
    removeEventListener: (_type, listener) => listeners.delete(listener),
    fire(next) {
      listeners.forEach((listener) => listener({ matches: next }));
    },
  };
}

describe('reduced motion', () => {
  it('animates for 200ms by default and not at all when the user prefers reduced motion', () => {
    expect(animationDurationMs(false)).toBe(200);
    expect(animationDurationMs(true)).toBe(0);
  });

  it('reports the current preference at once and again on every change', () => {
    const query = fakeQuery(true);
    const onChange = vi.fn();
    watchReducedMotion(query, onChange);
    expect(onChange).toHaveBeenLastCalledWith(true);
    query.fire(false);
    expect(onChange).toHaveBeenLastCalledWith(false);
    expect(onChange).toHaveBeenCalledTimes(2);
  });

  it('stops reporting once unsubscribed', () => {
    const query = fakeQuery(false);
    const onChange = vi.fn();
    const stop = watchReducedMotion(query, onChange);
    stop();
    query.fire(true);
    expect(onChange).toHaveBeenCalledTimes(1);
  });
});
