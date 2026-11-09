import { mountShapyPresence, type ShapyHosts } from './sketch.ts';
import './style.css';

function hosts(): ShapyHosts | null {
  const stage = document.querySelector<HTMLElement>('.shapy__stage');
  const panel = document.querySelector<HTMLElement>('.shapy__panel');
  const tools = document.querySelector<HTMLElement>('.shapy__tools');
  return stage && panel && tools ? { stage, panel, tools } : null;
}

const found = hosts();
if (found) {
  let unmount = mountShapyPresence(found);
  // Everything is torn down on pagehide; a page restored from the back/forward cache needs a fresh mount.
  window.addEventListener('pageshow', (event) => {
    if (!event.persisted) return;
    unmount();
    unmount = mountShapyPresence(found);
  });
}
