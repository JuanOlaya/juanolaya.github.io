<script setup lang="ts">
import StackedBar from '@shared/components/StackedBar.vue';
import { ArrowRightLeft, Brain, CheckCircle2, Layout, Zap } from 'lucide-vue-next';
import { germanTabs, grammarBar, grammarRules, spanishTabs } from '../content';
import EquivalencePanel from './EquivalencePanel.vue';
import SectionHeading from './SectionHeading.vue';
</script>

<template>
  <SectionHeading :icon="Layout" icon-class="bg-blue-500" spacing="mb-6">
    <template #title>3. Dominio de la Gramática (7 años)</template>

    <div class="p-5 mb-8 rounded-2xl border bg-indigo-50/50 border-indigo-100 dark:bg-indigo-950/20 dark:border-indigo-900/40">
      <p class="text-sm md:text-base leading-relaxed font-bold text-indigo-800 dark:text-indigo-300 italic">
        "A los 7 años, su cerebro en Berlín ya ha hecho el 70% del trabajo para el inglés."
      </p>
    </div>

    <div class="grid grid-cols-1 gap-4 mb-10">
      <div
        v-for="rule in grammarRules"
        :key="rule.title"
        class="flex items-center gap-5 p-5 rounded-2xl border transition-all bg-slate-50 border-slate-200 hover:bg-slate-100 dark:bg-slate-800/40 dark:border-white/5 dark:hover:bg-slate-800/60"
      >
        <div
          :class="[
            'w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border',
            rule.icon === 'zap'
              ? 'bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 dark:border-indigo-500/10'
              : 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 dark:border-emerald-500/10',
          ]"
        >
          <Zap v-if="rule.icon === 'zap'" class="w-6 h-6" />
          <CheckCircle2 v-else class="w-6 h-6" />
        </div>
        <div class="flex-1">
          <div class="flex justify-between items-center mb-1">
            <span class="font-black tracking-tight text-slate-800 dark:text-white">{{ rule.title }}</span>
            <span :class="['text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-tighter', rule.viaClass]">
              {{ rule.via }}
            </span>
          </div>
          <p class="text-xs leading-relaxed text-slate-500 dark:text-slate-400">{{ rule.description }}</p>
        </div>
      </div>
    </div>

    <div
      class="rounded-3xl p-10 border transition-colors duration-500 bg-indigo-950 border-white/10 shadow-2xl text-white mb-8"
    >
      <h3 class="text-center text-indigo-200 font-black mb-8 uppercase tracking-[0.2em] text-sm italic">
        Transferencia de Reglas Gramaticales
      </h3>
      <StackedBar
        v-slot="{ segment }"
        title="Transferencia de reglas gramaticales"
        :segments="grammarBar"
        track-class="flex h-16 w-full rounded-full overflow-hidden p-1 bg-black/40 border border-white/10"
      >
        <div class="flex flex-col text-right leading-none">
          <span class="text-[7px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-tight">
            {{ segment.kicker }}
          </span>
          <span class="text-[8px] sm:text-[10px] md:text-[12px] font-black uppercase tracking-wider">
            {{ segment.label }}
          </span>
        </div>
        <span class="text-xs sm:text-base md:text-2xl font-black leading-none self-center">{{ segment.percent }}%</span>
      </StackedBar>
      <p class="mt-8 text-center text-xs italic leading-relaxed px-6 max-w-xl mx-auto text-indigo-200">
        "A los 7 años, le faltaría aprender un 40% de gramática específica, principalmente:
        <span class="text-white font-black not-italic">Ortografía no fonética, Preposiciones y Phrasal Verbs.</span>"
      </p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <EquivalencePanel
        :tabs="spanishTabs"
        :icon="ArrowRightLeft"
        title='El "Superpoder" del 25% (Español ➜ Inglés)'
        subtitle="Su hija ya sabe estructurar el tiempo en inglés gracias a su español de casa."
        tone="spanish"
      />
      <EquivalencePanel
        :tabs="germanTabs"
        :icon="Brain"
        title='La Lógica "Deutsch" del 35% (Alemán ➜ Inglés)'
        subtitle="El alemán de la Kita le hereda la estructura y el ritmo primitivo del inglés."
        tone="german"
      />
    </div>
  </SectionHeading>
</template>
