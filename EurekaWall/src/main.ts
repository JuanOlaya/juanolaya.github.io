import { mountEurekaWall } from './sketch.ts';
import './style.css';

let unmount = mountEurekaWall(document.body);

// Sketch and panel are torn down on pagehide; a page restored from the back/forward cache
// would otherwise come back without them.
window.addEventListener('pageshow', (event) => {
  if (!event.persisted) return;
  unmount();
  unmount = mountEurekaWall(document.body);
});
