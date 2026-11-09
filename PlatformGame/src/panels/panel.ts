/** Collapsible glass card shared by the explanatory panels (STYLE-CONTRACT §5.4). */
export interface PanelShell {
  element: HTMLElement;
  body: HTMLElement;
}

const PHONE_MAX_WIDTH = 640;
const HIGHLIGHT_SECONDS = 0.4;

/** Phones have little height to spare beside the canvas, so the panels start folded there. */
export function initialCollapsed(viewportWidth: number): boolean {
  return viewportWidth <= PHONE_MAX_WIDTH;
}

/** How long a layer stays lit after an event; 0 with reduced motion, so nothing ever blinks. */
export function highlightSeconds(reduced: boolean): number {
  return reduced ? 0 : HIGHLIGHT_SECONDS;
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

let panelCount = 0;

function toggleButton(panel: HTMLElement, body: HTMLElement, collapsed: boolean): HTMLButtonElement {
  const button = element('button', 'learn-panel__toggle', collapsed ? 'Show' : 'Hide');
  button.type = 'button';
  button.setAttribute('aria-controls', body.id);
  button.setAttribute('aria-expanded', String(!collapsed));
  button.addEventListener('click', () => {
    const folded = panel.classList.toggle('learn-panel--collapsed');
    button.setAttribute('aria-expanded', String(!folded));
    button.textContent = folded ? 'Show' : 'Hide';
  });
  return button;
}

export function createPanel(title: string, caption: string, collapsed: boolean): PanelShell {
  const panel = element('section', `learn-panel${collapsed ? ' learn-panel--collapsed' : ''}`);
  panel.setAttribute('aria-label', title);
  const body = element('div', 'learn-panel__body');
  body.id = `learn-panel-${++panelCount}`;
  const header = element('div', 'learn-panel__header');
  header.append(element('h2', 'learn-panel__title', title), toggleButton(panel, body, collapsed));
  body.append(element('p', 'learn-panel__caption', caption));
  panel.append(header, body);
  return { element: panel, body };
}
