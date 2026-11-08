<script setup lang="ts">
import { Moon, Sparkles, Sun } from 'lucide-vue-next';
import GrammarSection from './components/GrammarSection.vue';
import HorizonSection from './components/HorizonSection.vue';
import LanguageMapSection from './components/LanguageMapSection.vue';
import MilestoneSection from './components/MilestoneSection.vue';
import SimulationLab from './components/SimulationLab.vue';
import VennSection from './components/VennSection.vue';
import VocabularySection from './components/VocabularySection.vue';
import { useDarkMode } from './use-dark-mode';

const { isDark, toggleDarkMode } = useDarkMode();
</script>

<template>
  <div
    class="max-w-4xl mx-auto rounded-3xl shadow-2xl overflow-hidden border transition-theme bg-white border-slate-200 dark:bg-slate-900 dark:border-slate-800"
  >
    <div
      class="p-8 md:p-10 text-white text-center border-b relative transition-colors duration-500 bg-indigo-700 border-indigo-800 dark:bg-gradient-to-r dark:from-indigo-800 dark:to-blue-900 dark:border-white/10"
    >
      <button
        type="button"
        class="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all border border-white/20 shadow-lg"
        title="Cambiar de modo"
        :aria-pressed="isDark"
        aria-label="Cambiar de modo claro u oscuro"
        @click="toggleDarkMode"
      >
        <Sun v-if="isDark" class="w-5 h-5 text-amber-300" />
        <Moon v-else class="w-5 h-5 text-white" />
      </button>

      <h1 class="text-3xl md:text-4xl font-black mb-3 tracking-tight">La Ventaja de la Niña Trilingüe</h1>
      <p class="max-w-2xl mx-auto text-lg opacity-90 text-indigo-50 dark:text-indigo-100">
        Análisis del desarrollo lingüístico, transferencia de vocabulario y gramática.
      </p>
    </div>

    <div class="p-6 md:p-12 space-y-16">
      <MilestoneSection />
      <VocabularySection />
      <GrammarSection />
      <HorizonSection />
      <VennSection />
      <LanguageMapSection />

      <div
        class="bg-gradient-to-br from-indigo-600 to-purple-700 p-10 rounded-3xl text-white shadow-2xl relative overflow-hidden"
      >
        <div class="absolute top-0 right-0 p-4 opacity-20 scale-150">
          <Sparkles class="w-32 h-32 text-white" />
        </div>
        <h4 class="flex items-center gap-3 font-black text-2xl mb-4 relative z-10">
          <Sparkles class="w-6 h-6" />
          Veredicto Final
        </h4>
        <p class="text-indigo-50 leading-relaxed relative z-10 font-medium text-lg italic">
          A los 18 años, su hija no solo hablará tres idiomas; tendrá <strong>tres visiones del mundo</strong>. El
          esfuerzo extra que le falte para el inglés será mínimo comparado con un niño monolingüe.
        </p>
      </div>
    </div>

    <SimulationLab />
  </div>

  <p class="text-center mt-10 text-xs font-bold tracking-widest uppercase text-slate-400 dark:text-slate-500">
    Infografía de Análisis Lingüístico Comparativo • Berlín 2026
  </p>
</template>
