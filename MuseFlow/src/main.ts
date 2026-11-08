import { mountMuseFlow } from './sketch.ts';
import './style.css';

let unmount = mountMuseFlow(document.body);

// The sketch is torn down on pagehide; a page restored from the back/forward cache starts it again.
window.addEventListener('pageshow', (event) => {
  if (!event.persisted) return;
  unmount();
  unmount = mountMuseFlow(document.body);
});
