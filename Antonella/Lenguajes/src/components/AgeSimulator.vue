<script setup lang="ts">
import { Sliders } from 'lucide-vue-next';
import { computed, ref } from 'vue';
import { ENGLISH_SCALE, MAX_AGE, MIN_AGE, NATIVE_SCALE, barWidthPercent, estimateVocabulary } from '../vocabulary';
import LabCard from './LabCard.vue';

const age = ref(7);
const vocab = computed(() => estimateVocabulary(age.value));
const rows = computed(() => [
  { label: 'Español (Casa)', words: vocab.value.es, scale: NATIVE_SCALE, text: 'text-red-500', bar: 'bg-red-500' },
  {
    label: 'Alemán (Kita/Colegio)',
    words: vocab.value.de,
    scale: NATIVE_SCALE,
    text: 'text-amber-500',
    bar: 'bg-amber-500',
  },
  {
    label: 'Inglés (Potencial de Transferencia)',
    words: vocab.value.en,
    scale: ENGLISH_SCALE,
    text: 'text-blue-500',
    bar: 'bg-blue-500',
  },
]);
</script>

<template>
  <LabCard
    :icon="Sliders"
    icon-class="bg-pink-500/10 text-pink-500"
    title="1. Simulación Dinámica de Edad"
    hint="Desliza la edad para calcular la curva de vocabulario estimativo."
  >
    <div class="mb-6">
      <div class="flex justify-between text-xs font-bold mb-2">
        <span>
          Edad de tu hija: <span class="text-indigo-500 font-black">{{ age }} años</span>
        </span>
        <span class="text-slate-400">Rango: {{ MIN_AGE }} - {{ MAX_AGE }} años</span>
      </div>
      <input
        v-model.number="age"
        type="range"
        :min="MIN_AGE"
        :max="MAX_AGE"
        aria-label="Edad de tu hija"
        class="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
      />
    </div>

    <div class="space-y-4">
      <div v-for="row in rows" :key="row.label">
        <div class="flex justify-between text-[11px] font-bold mb-1">
          <span>{{ row.label }}</span>
          <span :class="row.text">{{ row.words.toLocaleString() }} p.</span>
        </div>
        <div class="h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
          <div :class="['h-full', row.bar]" :style="{ width: `${barWidthPercent(row.words, row.scale)}%` }"></div>
        </div>
      </div>
    </div>
  </LabCard>
</template>
