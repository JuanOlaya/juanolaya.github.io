import p5 from 'p5';
import { CIRCLES, isShrinkTrigger, shrink } from './circles.ts';

const BACKGROUND = '#1C3147';
const START_DIAMETER = 80;

export function mountHciSketch(host: HTMLElement): p5 {
  let diameter = START_DIAMETER;
  let shrinking = false;
  return new p5((p: p5) => {
    p.setup = () => {
      const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
      canvas.position(0, 0);
      canvas.style('z-index', '-1');
    };
    p.draw = () => {
      p.background(BACKGROUND);
      for (const circle of CIRCLES) {
        p.fill(circle.color);
        p.noStroke();
        p.ellipse((circle.xPercent * p.width) / 100, (circle.yPercent * p.height) / 100, diameter, diameter);
      }
      if (p.mouseIsPressed && isShrinkTrigger(p.mouseX, p.mouseY, p.width, p.height)) shrinking = true;
      if (shrinking) diameter = shrink(diameter);
    };
  }, host);
}
