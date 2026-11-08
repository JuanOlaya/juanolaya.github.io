import { RATINGS, type Rating, isRating } from './probes.ts';

export interface ProbeDialog {
  show: () => void;
  remove: () => void;
}

function scaleEnd(text: string): HTMLSpanElement {
  const end = document.createElement('span');
  end.className = 'probe__end';
  end.textContent = text;
  return end;
}

function ratingButton(rating: Rating, choose: (rating: Rating) => void): HTMLButtonElement {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'probe__choice';
  button.dataset.rating = String(rating);
  button.textContent = String(rating);
  // p5 listens on window; the answer must not also count as a press on the game.
  button.addEventListener('pointerdown', (event) => event.stopPropagation());
  button.addEventListener('click', () => choose(rating));
  return button;
}

/**
 * The study's thought probe: a 1–5 scale from on-task to off-task, answered by click, touch or the
 * 1–5 keys as in the original. A real dialog so it also works with screen readers.
 */
export function createProbeDialog(host: HTMLElement, onAnswer: (rating: Rating) => void): ProbeDialog {
  const dialog = document.createElement('div');
  dialog.className = 'probe';
  dialog.hidden = true;
  dialog.setAttribute('role', 'dialog');
  dialog.setAttribute('aria-modal', 'true');
  dialog.setAttribute('aria-labelledby', 'probe-title');
  dialog.innerHTML = `<h2 id="probe-title" class="probe__title">Just now, where was your attention?</h2>
    <p class="probe__hint"><strong>On-task</strong> is thinking about playing the game.<br />
    <strong>Off-task</strong> is thinking about anything unrelated to playing the game.</p>`;
  const choose = (rating: Rating) => {
    if (dialog.hidden) return;
    dialog.hidden = true;
    onAnswer(rating);
  };
  const onKey = (event: KeyboardEvent) => {
    const rating = Number(event.key);
    if (dialog.hidden || !isRating(rating)) return;
    event.preventDefault();
    choose(rating);
  };
  const row = document.createElement('div');
  row.className = 'probe__choices';
  row.append(
    scaleEnd('On-task'),
    ...RATINGS.map((rating) => ratingButton(rating, choose)),
    scaleEnd('Off-task'),
  );
  dialog.append(row);
  host.append(dialog);
  window.addEventListener('keydown', onKey);
  return {
    show: () => {
      dialog.hidden = false;
      dialog.querySelector('button')?.focus();
    },
    remove: () => {
      window.removeEventListener('keydown', onKey);
      dialog.remove();
    },
  };
}
