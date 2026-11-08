import type { Directive } from 'vue';

const HIDDEN = ['opacity-0', 'translate-y-10'];
const SHOWN = ['opacity-100', 'translate-y-0'];

let observer: IntersectionObserver | undefined;

function sharedObserver(): IntersectionObserver {
  observer ??= new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add(...SHOWN);
        entry.target.classList.remove(...HIDDEN);
      }
    },
    { threshold: 0.1 },
  );
  return observer;
}

/** Fades a section in the first time it scrolls into view. */
export const vReveal: Directive<HTMLElement> = {
  mounted(el) {
    el.classList.add('transition-all', 'duration-1000', ...HIDDEN);
    sharedObserver().observe(el);
  },
  unmounted(el) {
    observer?.unobserve(el);
  },
};
