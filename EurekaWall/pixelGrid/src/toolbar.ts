import { BACKGROUND_COLOR } from './grid.ts';
import {
  getPalette,
  nextPalette,
  type PaletteId,
} from './palette.ts';

export interface ShapeTool {
  shape: number;
  label: string;
  /** File name in EurekaWall/assets/, shared with the wall's other tools. */
  asset: string;
}

export const SHAPE_TOOLS: readonly ShapeTool[] = [
  { shape: 1, label: 'Circle', asset: 'circleShapy.svg' },
  { shape: 2, label: 'Square', asset: 'rectangleShapy.svg' },
  { shape: 3, label: 'Quarter, bottom right', asset: 'pie1.svg' },
  { shape: 4, label: 'Quarter, bottom left', asset: 'pie2.svg' },
  { shape: 5, label: 'Quarter, top right', asset: 'pie3.svg' },
  { shape: 6, label: 'Quarter, top left', asset: 'pie4.svg' },
  { shape: 7, label: 'Triangle, top left', asset: 'triangle1.svg' },
  { shape: 8, label: 'Triangle, top right', asset: 'triangle2.svg' },
  { shape: 9, label: 'Triangle, bottom left', asset: 'triangle3.svg' },
  { shape: 10, label: 'Triangle, bottom right', asset: 'triangle4.svg' },
  { shape: 11, label: 'Leaf, falling', asset: 'leave1.svg' },
  { shape: 12, label: 'Leaf, rising', asset: 'leave2.svg' },
];

/** The assets folder is published verbatim next to this page, so the icons need no bundling. */
const ASSETS_URL = '/EurekaWall/assets/';

export interface Tool {
  shape: number;
  color: number;
}

export interface ToolbarOptions {
  paletteId?: PaletteId;
  onPaletteChange?: (paletteId: PaletteId) => void;
}

export interface ToolbarHandle {
  (): void;
  unmount: () => void;
  setPalette: (id: PaletteId) => void;
}

function toolButton(label: string, pressed: boolean, pick: () => void): HTMLButtonElement {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'tool';
  button.setAttribute('aria-label', label);
  button.setAttribute('aria-pressed', String(pressed));
  button.addEventListener('click', pick);
  return button;
}

function swatch(hex: string | null): HTMLSpanElement {
  const span = document.createElement('span');
  span.className = hex ? 'tool__swatch' : 'tool__swatch tool__swatch--blank';
  if (hex) span.style.backgroundColor = hex;
  return span;
}

function icon(asset: string): HTMLImageElement {
  const img = document.createElement('img');
  img.src = `${ASSETS_URL}${asset}`;
  img.alt = '';
  img.width = 22;
  img.height = 22;
  return img;
}

function group(label: string, buttons: readonly (HTMLElement | HTMLButtonElement)[]): HTMLDivElement {
  const div = document.createElement('div');
  div.className = 'tools__group';
  div.setAttribute('role', 'group');
  div.setAttribute('aria-label', label);
  div.append(...buttons);
  return div;
}

function arrowIcon(): SVGElement {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('width', '18');
  svg.setAttribute('height', '18');
  svg.setAttribute('fill', 'currentColor');
  svg.setAttribute('aria-hidden', 'true');
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', 'M7 10l5 5 5-5z');
  svg.append(path);
  return svg;
}

/** Colour swatches with expandable palette drawer and shape icons */
export function mountToolbar(host: HTMLElement, tool: Tool, options?: ToolbarOptions): ToolbarHandle {
  let activePaletteId: PaletteId = options?.paletteId ?? 'modern';
  const colorButtons = new Map<number, HTMLButtonElement>();
  const shapeButtons = new Map<number, HTMLButtonElement>();

  // Arrow button to unfold the other palette
  const arrowButton = document.createElement('button');
  arrowButton.type = 'button';
  arrowButton.className = 'tool tool--arrow';
  arrowButton.setAttribute('aria-expanded', 'false');
  arrowButton.append(arrowIcon());

  // Flyout container that unfolds above the toolbar
  const flyout = document.createElement('div');
  flyout.className = 'palette-flyout';
  flyout.hidden = true;

  const closeFlyout = () => {
    flyout.hidden = true;
    arrowButton.setAttribute('aria-expanded', 'false');
  };

  const sync = () => {
    for (const [color, button] of colorButtons) {
      button.setAttribute('aria-pressed', String(color === tool.color));
    }
    for (const [shape, button] of shapeButtons) {
      button.setAttribute('aria-pressed', String(shape === tool.shape));
    }
  };

  const populateFlyout = () => {
    flyout.replaceChildren();
    const otherId = nextPalette(activePaletteId);
    const otherPal = getPalette(otherId);

    const title = document.createElement('span');
    title.className = 'palette-flyout__title';
    title.textContent = `${otherPal.label}:`;
    flyout.append(title);

    otherPal.indices.forEach((globalIndex, i) => {
      const hex = otherPal.paints[i];
      const name = otherPal.paintNames[i];
      const btn = toolButton(`${name} paint (${otherPal.label})`, tool.color === globalIndex, () => {
        tool.color = globalIndex;
        setMainPalette(otherId);
        closeFlyout();
        options?.onPaletteChange?.(otherId);
      });
      btn.append(swatch(hex));
      flyout.append(btn);
    });
  };

  const toggleFlyout = () => {
    if (flyout.hidden) {
      populateFlyout();
      flyout.hidden = false;
      arrowButton.setAttribute('aria-expanded', 'true');
    } else {
      closeFlyout();
    }
  };

  arrowButton.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleFlyout();
  });

  const onDocClick = (e: MouseEvent) => {
    if (!flyout.hidden && !colorGroup.contains(e.target as Node)) {
      closeFlyout();
    }
  };
  document.addEventListener('click', onDocClick);

  // 5 main color swatch buttons
  const mainSwatchButtons: HTMLButtonElement[] = [];
  for (let slot = 0; slot < 5; slot += 1) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'tool';
    btn.append(swatch(null));
    mainSwatchButtons.push(btn);
  }

  const blank = toolButton('Blank (background colour)', tool.color === BACKGROUND_COLOR, () => {
    tool.color = BACKGROUND_COLOR;
    sync();
  });
  blank.append(swatch(null));

  const setMainPalette = (id: PaletteId) => {
    activePaletteId = id;
    const pal = getPalette(id);
    const otherPal = getPalette(nextPalette(id));
    arrowButton.setAttribute('aria-label', `Desplegar paleta ${otherPal.label}`);
    arrowButton.title = `Desplegar paleta ${otherPal.label}`;

    colorButtons.clear();

    pal.indices.forEach((globalIndex, slot) => {
      const btn = mainSwatchButtons[slot];
      const hex = pal.paints[slot];
      const name = pal.paintNames[slot];

      btn.setAttribute('aria-label', `${name} paint`);
      const span = btn.querySelector('.tool__swatch') as HTMLSpanElement | null;
      if (span) {
        span.className = 'tool__swatch';
        span.style.backgroundColor = hex;
      }
      btn.onclick = () => {
        tool.color = globalIndex;
        sync();
      };
      colorButtons.set(globalIndex, btn);
    });

    colorButtons.set(BACKGROUND_COLOR, blank);
    sync();
  };

  for (const { shape, label, asset } of SHAPE_TOOLS) {
    const button = toolButton(label, shape === tool.shape, () => {
      tool.shape = shape;
      sync();
    });
    button.append(icon(asset));
    shapeButtons.set(shape, button);
  }

  const colorGroup = group('Colour', [arrowButton, ...mainSwatchButtons, blank, flyout]);
  colorGroup.classList.add('tools__group--color');

  const shapeGroup = group('Shape', [...shapeButtons.values()]);
  const groups = [colorGroup, shapeGroup];
  host.append(...groups);

  // Initialize main palette
  setMainPalette(activePaletteId);

  const unmount = () => {
    document.removeEventListener('click', onDocClick);
    for (const node of groups) node.remove();
  };

  return Object.assign(unmount, {
    unmount,
    setPalette: (id: PaletteId) => {
      setMainPalette(id);
      if (tool.color !== BACKGROUND_COLOR) {
        const pal = getPalette(id);
        if (!pal.indices.includes(tool.color)) {
          tool.color = pal.indices[0];
        }
      }
      sync();
    },
  });
}
