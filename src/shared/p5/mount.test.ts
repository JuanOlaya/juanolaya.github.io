import { beforeEach, describe, expect, it, vi } from 'vitest';

// Tests run in Node: an EventTarget stands in for `window`, and p5 itself is mocked.
vi.stubGlobal('window', new EventTarget());
const host = {} as HTMLElement;
const remove = vi.fn();
vi.mock('p5', () => ({
  default: class {
    remove = remove;
  },
}));

const { mountSketch } = await import('./mount.ts');

describe('mountSketch', () => {
  beforeEach(() => remove.mockClear());

  it('removes the instance on pagehide, once', () => {
    mountSketch(() => {}, host);
    window.dispatchEvent(new Event('pagehide'));
    window.dispatchEvent(new Event('pagehide'));
    expect(remove).toHaveBeenCalledTimes(1);
  });

  it('can be unmounted by hand', () => {
    const unmount = mountSketch(() => {}, host);
    unmount();
    window.dispatchEvent(new Event('pagehide'));
    expect(remove).toHaveBeenCalledTimes(1);
  });
});
