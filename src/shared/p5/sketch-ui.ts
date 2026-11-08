import './sketch-ui.css';

export interface SketchControl {
  label: string;
  /** Keyboard shortcut as `KeyboardEvent.key`, lower case (' ' for Space). */
  key: string;
  action: () => void;
  /** For toggles: whether the control is on, shown with `aria-pressed`. */
  pressed?: () => boolean;
}

export interface SketchUiOptions {
  title: string;
  caption: string;
  controls: readonly SketchControl[];
  /** Corner the panel sits in; `top` keeps it clear of toolbars drawn along the bottom. */
  placement?: 'top' | 'bottom';
}

const HIDE_KEY = 'h';

export interface KeyPress {
  key: string;
  ctrlKey: boolean;
  metaKey: boolean;
  altKey: boolean;
}

/** The control a key press triggers; browser and OS shortcuts (with modifiers) are left alone. */
export function controlForKey(
  controls: readonly SketchControl[],
  press: KeyPress,
): SketchControl | undefined {
  if (hasModifier(press)) return undefined;
  return controls.find((control) => control.key === press.key.toLowerCase());
}

function keyLabel(key: string): string {
  return key === ' ' ? 'Space' : key.toUpperCase();
}

function element<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className: string,
  text = '',
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  node.className = className;
  node.textContent = text;
  return node;
}

// Presses must not reach p5, which listens on window and would read them as a press on the sketch.
const STOPPED_EVENTS = ['pointerdown', 'mousedown', 'mouseup', 'touchstart', 'touchend'] as const;

function createButton(control: SketchControl, run: (control: SketchControl) => void): HTMLButtonElement {
  const button = element('button', 'sketch-ui__button', control.label);
  button.type = 'button';
  button.setAttribute('aria-keyshortcuts', keyLabel(control.key));
  button.append(' ', element('kbd', '', keyLabel(control.key)));
  for (const type of STOPPED_EVENTS) button.addEventListener(type, (event) => event.stopPropagation());
  button.addEventListener('click', () => run(control));
  return button;
}

function hasModifier(press: KeyPress): boolean {
  return press.ctrlKey || press.metaKey || press.altKey;
}

/** Folds the panel down to its title so it never hides part of the sketch for good. */
function collapseButton(panel: HTMLElement, body: HTMLElement): HTMLButtonElement {
  const button = element('button', 'sketch-ui__button sketch-ui__collapse', 'Hide');
  button.type = 'button';
  body.id = `sketch-ui-body-${Math.random().toString(36).slice(2)}`;
  button.setAttribute('aria-controls', body.id);
  button.setAttribute('aria-expanded', 'true');
  button.setAttribute('aria-keyshortcuts', keyLabel(HIDE_KEY));
  for (const type of STOPPED_EVENTS) button.addEventListener(type, (event) => event.stopPropagation());
  button.addEventListener('click', () => {
    const collapsed = panel.classList.toggle('sketch-ui--collapsed');
    button.setAttribute('aria-expanded', String(!collapsed));
    button.textContent = collapsed ? 'Show' : 'Hide';
  });
  return button;
}

/**
 * Title, caption and a row of buttons laid over a sketch, each with a keyboard shortcut.
 * Returns a function that removes the panel and its key listener.
 */
export function mountSketchUi(host: HTMLElement, options: SketchUiOptions): () => void {
  const panel = element('section', `sketch-ui sketch-ui--${options.placement ?? 'bottom'}`);
  panel.setAttribute('aria-label', `${options.title} controls`);
  const body = element('div', 'sketch-ui__body');
  const row = element('div', 'sketch-ui__controls');
  const buttons = new Map<SketchControl, HTMLButtonElement>();
  const sync = () => {
    for (const [control, button] of buttons) {
      if (control.pressed) button.setAttribute('aria-pressed', String(control.pressed()));
    }
  };
  const run = (control: SketchControl) => {
    control.action();
    sync();
  };
  for (const control of options.controls) buttons.set(control, createButton(control, run));
  row.append(...buttons.values());
  body.append(element('p', 'sketch-ui__caption', options.caption), row);
  const header = element('div', 'sketch-ui__header');
  const hide = collapseButton(panel, body);
  header.append(element('h1', 'sketch-ui__title', options.title), hide);
  panel.append(header, body);
  host.append(panel);
  sync();

  const onKey = (event: KeyboardEvent) => {
    // Space or Enter on a focused button already fires its click.
    if (event.target instanceof HTMLButtonElement && (event.key === ' ' || event.key === 'Enter')) return;
    if (event.key.toLowerCase() === HIDE_KEY && !hasModifier(event)) {
      hide.click();
      return;
    }
    const control = controlForKey(options.controls, event);
    if (!control) return;
    event.preventDefault();
    run(control);
  };
  window.addEventListener('keydown', onKey);
  return () => {
    window.removeEventListener('keydown', onKey);
    panel.remove();
  };
}
