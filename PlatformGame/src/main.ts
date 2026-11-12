import '@fontsource-variable/instrument-sans/wdth.css';
import '@fontsource/ibm-plex-mono/500.css';
import { prefersReducedMotion } from '@shared/p5/display.ts';
import { mountPlatformGame } from './game.ts';
import { mountLearnPanels } from './panels/learn.ts';
import { SANS } from './render.ts';
import './style.css';

// Canvas text does not trigger webfont downloads the way DOM text does.
void document.fonts.load(`bold 16px "${SANS}"`);

const stage = document.querySelector<HTMLElement>('.game__stage');
const pad = document.querySelector<HTMLElement>('.game__pad');
const panel = document.querySelector<HTMLElement>('.game__panel');
const learn = document.querySelector<HTMLElement>('.game__learn');

function mount(stage: HTMLElement, pad: HTMLElement, panel: HTMLElement, learn: HTMLElement): void {
  const panels = mountLearnPanels(learn, prefersReducedMotion());
  mountPlatformGame({ stage, pad, panel, onFrame: panels.onFrame });
  // The game tears itself down on pagehide; the panels follow so a bfcache restore mounts both afresh.
  window.addEventListener('pagehide', panels.remove, { once: true });
}

if (stage && pad && panel && learn) {
  mount(stage, pad, panel, learn);
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) mount(stage, pad, panel, learn);
  });
}
