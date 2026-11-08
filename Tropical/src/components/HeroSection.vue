<script setup lang="ts">
import { useLanguage } from '../use-language';

const { t } = useLanguage();
const blobPath =
  'M44.7,-76.4C58.3,-69.2,70,-57.9,78.3,-44.6C86.7,-31.3,91.8,-15.7,91.2,-0.3C90.7,15,84.4,30,75,43C65.5,56,52.8,67,38.6,74.5C24.4,82,8.6,86,-6.9,82C-22.4,78,-37.6,66,-49.4,53.2C-61.2,40.4,-69.6,26.8,-73.8,11.8C-78,-3.2,-78,-19.6,-71.5,-33.4C-64.9,-47.1,-51.8,-58.3,-38.1,-65.4C-24.4,-72.6,-10.1,-75.7,3.1,-81.1C16.3,-86.5,31.2,-83.6,44.7,-76.4Z';
</script>

<template>
  <section
    class="relative min-h-screen flex items-center justify-center tropical-gradient overflow-hidden pt-20"
  >
    <div class="absolute top-20 -left-20 w-64 h-64 bg-accent-green/20 rounded-full blur-3xl"></div>
    <div class="absolute bottom-20 -right-20 w-80 h-80 bg-neon-pink/20 rounded-full blur-3xl"></div>

    <div class="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center relative z-10">
      <div class="text-white">
        <span class="i18n badge-pill mb-6 text-sm">{{ t('hero_badge') }}</span>
        <h1 class="text-5xl md:text-7xl font-bold font-unbounded leading-tight mb-6">
          <span class="i18n">{{ t('hero_h1_p1') }}</span>
          {{ ' ' }}
          <span class="i18n text-neon-pink">{{ t('hero_h1_span') }}</span>
          {{ ' ' }}
          <span class="i18n">{{ t('hero_h1_p2') }}</span>
        </h1>
        <p class="i18n text-stone-300 text-lg mb-8 max-w-md leading-relaxed">{{ t('hero_p') }}</p>
        <div class="flex flex-col sm:flex-row gap-4">
          <a
            href="#flavors"
            class="i18n bg-white text-tropical px-8 py-4 rounded-full font-bold text-center hover:bg-accent-green hover:text-tropical transition-colors uppercase text-sm"
          >
            {{ t('btn_flavors') }}
          </a>
          <a
            href="#visit"
            class="i18n border border-white/30 text-white px-8 py-4 rounded-full font-bold text-center hover:bg-white/10 transition-colors uppercase text-sm"
          >
            {{ t('btn_visit') }}
          </a>
        </div>
      </div>
      <div class="relative flex justify-center">
        <div class="w-full max-w-md float-animation">
          <div class="relative">
            <div class="absolute inset-0 bg-white/10 blur-3xl rounded-full"></div>
            <svg
              viewBox="0 0 200 200"
              xmlns="http://www.w3.org/2000/svg"
              class="relative z-10"
              aria-hidden="true"
            >
              <path fill="#baff39" :d="blobPath" transform="translate(100 100)" />
              <text x="50" y="115" font-family="Unbounded" font-size="60" fill="white">🍦</text>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
