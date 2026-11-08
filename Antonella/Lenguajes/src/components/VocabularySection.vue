<script setup lang="ts">
import InfoCard from '@shared/components/InfoCard.vue';
import StackedBar from '@shared/components/StackedBar.vue';
import { Book, CheckCircle2 } from 'lucide-vue-next';
import { bridges, schoolCounts, vocabularyBar } from '../content';
import SectionHeading from './SectionHeading.vue';

const countStyles = {
  red: {
    card: 'bg-red-50 border-red-100 dark:bg-red-500/20 dark:border-red-500/30',
    label: 'text-red-700 dark:text-red-400',
    value: 'text-red-600',
    unit: 'text-red-800/60 dark:text-red-300/60',
  },
  amber: {
    card: 'bg-amber-50 border-amber-100 dark:bg-amber-500/20 dark:border-amber-500/30',
    label: 'text-amber-700 dark:text-amber-400',
    value: 'text-amber-600',
    unit: 'text-amber-800/60 dark:text-amber-300/60',
  },
};

const bridgeStyles = {
  red: { card: 'bg-red-50 border-red-500 dark:bg-red-500/10 dark:border-red-500/30', accent: 'text-red-700 dark:text-red-400' },
  amber: {
    card: 'bg-amber-50 border-amber-500 dark:bg-amber-500/10 dark:border-amber-500/30',
    accent: 'text-amber-700 dark:text-amber-400',
  },
};
</script>

<template>
  <SectionHeading :icon="Book" icon-class="bg-indigo-500">
    <template #title>2. Análisis de Vocabulario (7 años)</template>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
      <InfoCard
        v-for="count in schoolCounts"
        :key="count.label"
        :class="['border p-6 rounded-2xl text-center backdrop-blur-sm transition-theme', countStyles[count.tone].card]"
      >
        <span :class="['text-xs font-black uppercase tracking-widest block mb-2', countStyles[count.tone].label]">
          {{ count.label }}
        </span>
        <div :class="['text-4xl font-black dark:text-white', countStyles[count.tone].value]">{{ count.value }}</div>
        <span :class="['text-xs mt-2 block', countStyles[count.tone].unit]">palabras activas</span>
      </InfoCard>
      <InfoCard
        class="border p-6 rounded-2xl flex items-center transition-theme bg-slate-50 border-slate-200 dark:bg-slate-800/50 dark:border-slate-700"
      >
        <p class="text-sm leading-relaxed italic text-center w-full text-slate-500 dark:text-slate-400">
          "Su hija ya domina dos sistemas robustos antes de tocar el inglés."
        </p>
      </InfoCard>
    </div>

    <div class="grid md:grid-cols-2 gap-8 mb-10">
      <InfoCard
        v-for="bridge in bridges"
        :key="bridge.title"
        :class="['border-t-4 p-8 rounded-3xl shadow-xl transition-all duration-300', bridgeStyles[bridge.tone].card]"
      >
        <div class="flex justify-between items-start mb-6">
          <h3 :class="['font-black text-2xl', bridgeStyles[bridge.tone].accent]">{{ bridge.title }}</h3>
          <span :class="['text-3xl font-black opacity-50', bridgeStyles[bridge.tone].accent]">{{ bridge.percent }}</span>
        </div>
        <p class="mb-6 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{{ bridge.description }}</p>
        <div class="grid grid-cols-1 gap-3">
          <div
            v-for="[source, english] in bridge.pairs"
            :key="source"
            class="flex items-center text-sm p-3 rounded-xl border bg-white/70 border-black/5 dark:bg-black/30 dark:border-white/5"
          >
            <CheckCircle2 :class="['mr-3 w-4 h-4', bridgeStyles[bridge.tone].accent]" />
            <span class="font-medium text-slate-800 dark:text-slate-100">{{ source }}</span>
            <span class="mx-3 text-slate-400">→</span>
            <span :class="['font-bold italic', bridgeStyles[bridge.tone].accent]">{{ english }}</span>
          </div>
        </div>
      </InfoCard>
    </div>

    <div
      class="rounded-3xl p-10 border transition-colors duration-500 bg-slate-900 border-slate-800 shadow-xl dark:bg-indigo-950 dark:border-white/10 dark:shadow-2xl"
    >
      <h3 class="text-center text-indigo-300 font-black mb-8 uppercase tracking-[0.2em] text-sm italic">
        Estado del Vocabulario Inglés a los 7 años
      </h3>
      <StackedBar
        title="Estado del vocabulario inglés a los 7 años"
        :segments="vocabularyBar"
        track-class="flex h-16 w-full rounded-full overflow-hidden p-1 bg-black/40 border border-white/10"
      />
    </div>
  </SectionHeading>
</template>
