import { ref } from 'vue';

const isDark = ref(false);

function toggleDarkMode(): void {
  isDark.value = !isDark.value;
  document.documentElement.classList.toggle('dark', isDark.value);
}

/** Light mode by default, as on the original page; the choice is not persisted. */
export function useDarkMode() {
  return { isDark, toggleDarkMode };
}
