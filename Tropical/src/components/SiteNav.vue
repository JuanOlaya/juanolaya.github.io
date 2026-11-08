<script setup lang="ts">
import { useLanguage } from '../use-language';

const { lang, t, toggleLanguage } = useLanguage();
</script>

<template>
  <nav
    class="fixed w-full z-50 bg-tropical/90 backdrop-blur-md py-4 px-6 md:px-12 flex justify-between items-center border-b border-white/10"
  >
    <div class="flex items-center gap-3">
      <svg
        class="w-8 h-8 text-accent-green"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="M12 17a5 5 0 0 0 5-5c0-4-5-8-5-8s-5 4-5 8a5 5 0 0 0 5 5z" />
        <path d="M7 12a5 5 0 0 1 10 0" />
      </svg>
      <div>
        <span
          class="text-white font-bold text-xl tracking-tighter uppercase font-unbounded block leading-none"
        >
          Tropical
        </span>
        <span class="i18n text-[10px] text-accent-green font-bold uppercase tracking-widest mt-1 block">
          {{ t('logo_subtitle') }}
        </span>
      </div>
    </div>

    <div class="flex items-center gap-6">
      <div class="hidden md:flex gap-8 text-white text-sm font-semibold uppercase tracking-widest">
        <a href="#about" class="i18n hover:text-accent-green transition-colors">{{ t('nav_history') }}</a>
        <a href="#flavors" class="i18n hover:text-accent-green transition-colors">{{ t('nav_flavors') }}</a>
        <a href="#visit" class="i18n hover:text-accent-green transition-colors">{{ t('nav_location') }}</a>
      </div>

      <button
        type="button"
        class="bg-white/10 border border-white/20 text-white text-[10px] font-bold px-3 py-1 rounded hover:bg-white/20 transition-all flex items-center gap-2"
        :aria-pressed="lang === 'en'"
        aria-label="Sprache wechseln / Switch language"
        @click="toggleLanguage"
      >
        <span>DE</span>
        <div class="w-8 h-4 bg-white/20 rounded-full relative">
          <div
            class="absolute top-1 w-2 h-2 bg-accent-green rounded-full transition-all"
            :style="{ left: lang === 'en' ? 'calc(100% - 12px)' : '4px' }"
          ></div>
        </div>
        <span>EN</span>
      </button>

      <a
        href="#visit"
        class="i18n bg-neon-pink text-white px-5 py-2 rounded-full text-xs font-bold hover:scale-105 transition-transform uppercase tracking-tighter"
      >
        {{ t('nav_order') }}
      </a>
    </div>
  </nav>
</template>
