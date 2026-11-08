import p5 from 'p5';

/** Instance mode keeps p5 off `window`, unlike the global mode used by the legacy sketches. */
export function mountSketch(host: HTMLElement): p5 {
  return new p5((p: p5) => {
    p.setup = () => {
      p.createCanvas(240, 120);
      p.noStroke();
    };
    p.draw = () => {
      p.background(15, 23, 42);
      p.fill(56, 189, 248);
      p.circle(120 + 80 * Math.sin(p.frameCount / 30), 60, 32);
    };
  }, host);
}
