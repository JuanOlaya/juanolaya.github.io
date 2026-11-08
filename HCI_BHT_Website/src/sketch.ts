import type p5 from 'p5';
import { frameScale } from '@shared/p5/frame-scale.ts';
import { mountSketch, type Unmount } from '@shared/p5/mount.ts';
import { CIRCLES, circleCenter, isShrinkTrigger, shrink } from './circles.ts';

const BACKGROUND = '#1C3147';
const START_DIAMETER = 80;
// Behind the HCI logo, which is positioned over the canvas.
const CANVAS_Z_INDEX = '-1';

/** Five coloured circles; pressing the empty sixth spot makes them all shrink away. */
export function mountHciSketch(host: HTMLElement): Unmount {
  let diameter = START_DIAMETER;
  let shrinking = false;
  const sketch = (p: p5) => {
    p.setup = () => {
      const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
      canvas.position(0, 0);
      canvas.style('z-index', CANVAS_Z_INDEX);
      p.noStroke();
    };
    p.windowResized = () => p.resizeCanvas(p.windowWidth, p.windowHeight);
    p.draw = () => {
      p.background(BACKGROUND);
      for (const circle of CIRCLES) {
        const { x, y } = circleCenter(circle, p.width, p.height);
        p.fill(circle.color);
        p.ellipse(x, y, diameter, diameter);
      }
      if (p.mouseIsPressed && isShrinkTrigger(p.mouseX, p.mouseY, p.width, p.height)) shrinking = true;
      if (shrinking) diameter = shrink(diameter, frameScale(p.deltaTime));
    };
  };
  return mountSketch(sketch, host);
}
