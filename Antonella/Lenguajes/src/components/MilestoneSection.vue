<script setup lang="ts">
import InfoCard from '@shared/components/InfoCard.vue';
import { Baby } from 'lucide-vue-next';
import { kitaCounts } from '../content';
import SectionHeading from './SectionHeading.vue';

const toneClasses = {
  red: { card: 'bg-red-50/50 border-red-100 dark:bg-red-950/20 dark:border-red-900/30', text: 'text-red-600' },
  amber: {
    card: 'bg-amber-50/50 border-amber-100 dark:bg-amber-950/20 dark:border-amber-900/30',
    text: 'text-amber-600',
  },
};
</script>

<template>
  <SectionHeading :icon="Baby" icon-class="bg-pink-500">
    <template #title>1. El Despegue a los 5 años (Kita &amp; Casa)</template>

    <p class="text-sm md:text-base leading-relaxed mb-8 text-slate-600 dark:text-slate-300">
      A los 5 años, tu hija está en la edad de oro de la <strong>plasticidad fonética</strong>. Su cerebro no traduce;
      absorbe de manera directa la música de cada idioma, preparando la audición para registrar sonidos que un adulto
      monolingüe ya no puede distinguir.
    </p>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <InfoCard
        v-for="count in kitaCounts"
        :key="count.label"
        :class="['border p-6 rounded-2xl text-center transition-theme', toneClasses[count.tone].card]"
      >
        <span
          :class="[
            'text-[10px] font-black uppercase tracking-widest block mb-1',
            toneClasses[count.tone].text,
            count.tone === 'red' ? 'dark:text-red-400' : 'dark:text-amber-400',
          ]"
        >
          {{ count.label }}
        </span>
        <div :class="['text-3xl font-black dark:text-white', toneClasses[count.tone].text]">{{ count.value }}</div>
        <span class="text-[11px] block mt-1 text-slate-500 dark:text-slate-400">palabras activas</span>
      </InfoCard>
      <InfoCard
        class="border p-6 rounded-2xl flex items-center transition-theme bg-slate-50 border-slate-200 dark:bg-slate-800/50 dark:border-slate-700"
      >
        <div class="w-full">
          <span
            class="text-[10px] font-black uppercase tracking-widest block mb-1 text-indigo-600 dark:text-indigo-400"
          >
            Hito Fonético
          </span>
          <p class="text-xs italic leading-relaxed text-slate-600 dark:text-slate-400">
            "Distingue y reproduce la 'H' aspirada alemana y la 'R' vibrante española, cubriendo el 90% de los sonidos
            necesarios para el inglés."
          </p>
        </div>
      </InfoCard>
    </div>
  </SectionHeading>
</template>
