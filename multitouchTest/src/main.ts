import { mountMultitouch } from './sketch.ts';
import './style.css';

let unmount = mountMultitouch(document.body);

// The sketch is torn down on pagehide; a page restored from the back/forward cache starts it again.
window.addEventListener('pageshow', (event) => {
  if (!event.persisted) return;
  unmount();
  unmount = mountMultitouch(document.body);
});
