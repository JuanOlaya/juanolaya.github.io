import '@fontsource-variable/instrument-sans/wdth.css';
import '@fontsource/ibm-plex-mono/500.css';
import { mountPlatformGame } from './game.ts';
import { MONO, SANS } from './render.ts';
import './style.css';

// Canvas text does not trigger webfont downloads the way DOM text does.
void document.fonts.load(`16px "${MONO}"`);
void document.fonts.load(`bold 16px "${SANS}"`);

const stage = document.querySelector<HTMLElement>('.game__stage');
const pad = document.querySelector<HTMLElement>('.game__pad');
const panel = document.querySelector<HTMLElement>('.game__panel');

if (stage && pad && panel) {
  mountPlatformGame({ stage, pad, panel });
  // Everything was torn down on pagehide; a page restored from the bfcache needs a fresh game.
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) mountPlatformGame({ stage, pad, panel });
  });
}
