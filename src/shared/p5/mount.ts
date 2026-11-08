import p5 from 'p5';

/** Stops and removes a mounted sketch; safe to call more than once. */
export type Unmount = () => void;

/**
 * Starts `sketch` in instance mode inside `host` and tears it down on `pagehide`, so a page kept in
 * the back/forward cache does not keep a p5 loop and its listeners running.
 */
export function mountSketch(sketch: (p: p5) => void, host: HTMLElement): Unmount {
  const instance = new p5(sketch, host);
  const unmount = () => {
    window.removeEventListener('pagehide', unmount);
    instance.remove();
  };
  window.addEventListener('pagehide', unmount);
  return unmount;
}
