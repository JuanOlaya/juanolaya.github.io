<script setup lang="ts">
import InfoCard from '@shared/components/InfoCard.vue';
import { aboutTiles } from '../content';
import { vReveal } from '../reveal';
import { useLanguage } from '../use-language';

const { t } = useLanguage();
</script>

<template>
  <section id="about" v-reveal class="py-24 bg-white">
    <div class="container mx-auto px-6">
      <div class="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-16">
        <div class="md:w-1/2">
          <div class="i18n badge-pill mb-6 text-xs">{{ t('nav_history') }}</div>
          <h2 class="i18n text-4xl font-unbounded mb-8">{{ t('about_h2') }}</h2>
          <p class="i18n text-stone-600 text-lg leading-relaxed mb-6">{{ t('about_p1') }}</p>
          <p class="i18n text-stone-600 text-lg leading-relaxed mb-6">{{ t('about_p2') }}</p>
          <InfoCard class="p-6 bg-accent-green/5 rounded-3xl border border-accent-green/20">
            <h4 class="i18n font-bold text-tropical uppercase text-xs tracking-widest mb-3">
              {{ t('about_ethics_title') }}
            </h4>
            <p class="i18n text-stone-600 text-sm leading-relaxed">{{ t('about_p_ethics') }}</p>
          </InfoCard>
        </div>
        <div class="md:w-1/2 grid grid-cols-2 gap-4">
          <div
            v-for="(tile, index) in aboutTiles"
            :key="index"
            :class="['aspect-square rounded-3xl flex items-center justify-center text-5xl', tile.class]"
          >
            {{ tile.emoji }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
