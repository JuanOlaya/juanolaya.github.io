import { ref } from 'vue';
import { type Lang, type TranslationKey, translations } from './content';

/** Matches the 0.2 s opacity transition of `.i18n` in style.css. */
const FADE_MS = 200;

const lang = ref<Lang>('de');
const fading = ref(false);

function t(key: TranslationKey): string {
  return translations[lang.value][key];
}

// Texts fade out, switch while invisible and fade back in, as on the original page.
function toggleLanguage(): void {
  const next: Lang = lang.value === 'de' ? 'en' : 'de';
  fading.value = true;
  window.setTimeout(() => {
    lang.value = next;
    document.documentElement.lang = next;
    fading.value = false;
  }, FADE_MS);
}

export function useLanguage() {
  return { lang, fading, t, toggleLanguage };
}
