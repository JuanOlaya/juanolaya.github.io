import type { Attention } from './probes.ts';

const CHOICES: readonly { attention: Attention; label: string; hint: string }[] = [
  { attention: 'on-task', label: 'On-task', hint: 'I was thinking about playing the game' },
  { attention: 'off-task', label: 'Off-task', hint: 'I was thinking about something unrelated' },
];

export interface ProbeDialog {
  show: () => void;
  remove: () => void;
}

/** The study's thought probe, as a real dialog so it works with keyboard, touch and screen readers. */
export function createProbeDialog(host: HTMLElement, onAnswer: (attention: Attention) => void): ProbeDialog {
  const dialog = document.createElement('div');
  dialog.className = 'probe';
  dialog.hidden = true;
  dialog.setAttribute('role', 'dialog');
  dialog.setAttribute('aria-modal', 'true');
  dialog.setAttribute('aria-labelledby', 'probe-title');
  dialog.innerHTML = '<h2 id="probe-title" class="probe__title">Just now, where was your attention?</h2>';
  const row = document.createElement('div');
  row.className = 'probe__choices';
  for (const choice of CHOICES) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'probe__choice';
    button.dataset.attention = choice.attention;
    button.innerHTML = `<strong>${choice.label}</strong><span>${choice.hint}</span>`;
    // p5 listens on window; the answer must not also count as a press on the game.
    button.addEventListener('pointerdown', (event) => event.stopPropagation());
    button.addEventListener('click', () => {
      dialog.hidden = true;
      onAnswer(choice.attention);
    });
    row.append(button);
  }
  dialog.append(row);
  host.append(dialog);
  return {
    show: () => {
      dialog.hidden = false;
      dialog.querySelector('button')?.focus();
    },
    remove: () => dialog.remove(),
  };
}
