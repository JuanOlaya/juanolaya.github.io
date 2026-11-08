import { isTypingTarget } from '@shared/p5/sketch-ui.ts';
import type { Input } from './physics.ts';

type Direction = keyof Input;

const KEY_DIRECTIONS: Record<string, Direction> = { ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up' };

const PAD_BUTTONS: readonly { direction: Direction; label: string; symbol: string }[] = [
  { direction: 'left', label: 'Move left', symbol: '◀' },
  { direction: 'right', label: 'Move right', symbol: '▶' },
  { direction: 'up', label: 'Jump higher', symbol: '▲' },
];

export interface Controls {
  input: Input;
  remove: () => void;
}

/** Arrow keys plus the on-screen pad share one held-direction state; `onPress` fires on each new press. */
export function attachControls(pad: HTMLElement, onPress: () => void): Controls {
  const keys: Input = { left: false, right: false, up: false };
  const touch: Input = { left: false, right: false, up: false };
  const input: Input = {
    get left() {
      return keys.left || touch.left;
    },
    get right() {
      return keys.right || touch.right;
    },
    get up() {
      return keys.up || touch.up;
    },
  };
  const onKey = (event: KeyboardEvent) => {
    const direction = KEY_DIRECTIONS[event.key];
    if (!direction || isTypingTarget(event.target)) return;
    event.preventDefault();
    const down = event.type === 'keydown';
    if (down && !event.repeat) onPress();
    keys[direction] = down;
  };
  // A key released while the window is unfocused never sends keyup; drop everything instead of sticking.
  const release = () => Object.assign(keys, { left: false, right: false, up: false });
  window.addEventListener('keydown', onKey);
  window.addEventListener('keyup', onKey);
  window.addEventListener('blur', release);
  const buttons = PAD_BUTTONS.map(({ direction, label, symbol }) =>
    padButton(direction, label, symbol, (held) => {
      if (held) onPress();
      touch[direction] = held;
    }),
  );
  pad.append(...buttons);
  return {
    input,
    remove: () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('keyup', onKey);
      window.removeEventListener('blur', release);
      for (const button of buttons) button.remove();
    },
  };
}

function padButton(direction: Direction, label: string, symbol: string, hold: (held: boolean) => void) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = `pad__button pad__button--${direction}`;
  button.setAttribute('aria-label', label);
  button.textContent = symbol;
  button.addEventListener('pointerdown', (event) => {
    event.preventDefault();
    button.setPointerCapture(event.pointerId);
    button.classList.add('is-held');
    hold(true);
  });
  const up = () => {
    button.classList.remove('is-held');
    hold(false);
  };
  button.addEventListener('pointerup', up);
  button.addEventListener('pointercancel', up);
  button.addEventListener('lostpointercapture', up);
  button.addEventListener('contextmenu', (event) => event.preventDefault());
  return button;
}
