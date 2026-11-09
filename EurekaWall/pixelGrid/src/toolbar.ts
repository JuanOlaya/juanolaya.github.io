import { BACKGROUND_COLOR } from './grid.ts';
import { PAINT_COLORS, PAINT_NAMES } from './palette.ts';

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

function group(label: string, buttons: readonly HTMLButtonElement[]): HTMLDivElement {
  const div = document.createElement('div');
  div.className = 'tools__group';
  div.setAttribute('role', 'group');
  div.setAttribute('aria-label', label);
  div.append(...buttons);
  return div;
}

/** Colour swatches and shape icons as toggle buttons; `tool` is updated in place so the sketch reads it live. */
export function mountToolbar(host: HTMLElement, tool: Tool): () => void {
  const colorButtons = new Map<number, HTMLButtonElement>();
  const shapeButtons = new Map<number, HTMLButtonElement>();
  const sync = () => {
    for (const [color, button] of colorButtons) button.setAttribute('aria-pressed', String(color === tool.color));
    for (const [shape, button] of shapeButtons) button.setAttribute('aria-pressed', String(shape === tool.shape));
  };
  PAINT_COLORS.forEach((hex, color) => {
    const button = toolButton(`${PAINT_NAMES[color]} paint`, color === tool.color, () => {
      tool.color = color;
      sync();
    });
    button.append(swatch(hex));
    colorButtons.set(color, button);
  });
  const blank = toolButton('Blank (background colour)', tool.color === BACKGROUND_COLOR, () => {
    tool.color = BACKGROUND_COLOR;
    sync();
  });
  blank.append(swatch(null));
  colorButtons.set(BACKGROUND_COLOR, blank);
  for (const { shape, label, asset } of SHAPE_TOOLS) {
    const button = toolButton(label, shape === tool.shape, () => {
      tool.shape = shape;
      sync();
    });
    button.append(icon(asset));
    shapeButtons.set(shape, button);
  }
  const groups = [group('Colour', [...colorButtons.values()]), group('Shape', [...shapeButtons.values()])];
  host.append(...groups);
  return () => {
    for (const node of groups) node.remove();
  };
}
