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

function paletteIcon(): SVGElement {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('width', '20');
  svg.setAttribute('height', '20');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', '2');
  svg.setAttribute('stroke-linecap', 'round');
  svg.setAttribute('stroke-linejoin', 'round');
  svg.setAttribute('aria-hidden', 'true');

  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute(
    'd',
    'M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z',
  );
  svg.append(path);

  const dots = [
    [13.5, 6.5],
    [17.5, 10.5],
    [8.5, 7.5],
    [6.5, 12.5],
  ];
  for (const [cx, cy] of dots) {
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', String(cx));
    circle.setAttribute('cy', String(cy));
    circle.setAttribute('r', '1');
    circle.setAttribute('fill', 'currentColor');
    svg.append(circle);
  }

  return svg;
}

/** Colour swatches with palette toggle button and shape icons */
export function mountToolbar(host: HTMLElement, tool: Tool, options?: ToolbarOptions): ToolbarHandle {
  let activePaletteId: PaletteId = options?.paletteId ?? 'modern';
  const colorButtons = new Map<number, HTMLButtonElement>();
  const shapeButtons = new Map<number, HTMLButtonElement>();

  // Button to toggle palette (monochrome artist palette icon)
  const paletteButton = document.createElement('button');
  paletteButton.type = 'button';
  paletteButton.className = 'tool tool--palette';
  paletteButton.append(paletteIcon());

  const sync = () => {
    for (const [color, button] of colorButtons) {
      button.setAttribute('aria-pressed', String(color === tool.color));
    }
    for (const [shape, button] of shapeButtons) {
      button.setAttribute('aria-pressed', String(shape === tool.shape));
    }
  };

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
    paletteButton.setAttribute('aria-label', `Cambiar paleta (actual: ${pal.label}, siguiente: ${otherPal.label})`);
    paletteButton.title = `Cambiar a paleta ${otherPal.label} (actual: ${pal.label})`;

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

  paletteButton.addEventListener('click', () => {
    const oldPal = getPalette(activePaletteId);
    const currentSlot = oldPal.indices.indexOf(tool.color);
    const nextId = nextPalette(activePaletteId);
    setMainPalette(nextId);
    if (tool.color !== BACKGROUND_COLOR) {
      const newPal = getPalette(nextId);
      tool.color = currentSlot >= 0 ? newPal.indices[currentSlot] : newPal.indices[0];
    }
    sync();
    options?.onPaletteChange?.(nextId);
  });

  for (const { shape, label, asset } of SHAPE_TOOLS) {
    const button = toolButton(label, shape === tool.shape, () => {
      tool.shape = shape;
      sync();
    });
    button.append(icon(asset));
    shapeButtons.set(shape, button);
  }

  const colorGroup = group('Colour', [paletteButton, ...mainSwatchButtons, blank]);

  const shapeGroup = group('Shape', [...shapeButtons.values()]);
  const groups = [colorGroup, shapeGroup];
  host.append(...groups);

  // Initialize main palette
  setMainPalette(activePaletteId);

  const unmount = () => {
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
