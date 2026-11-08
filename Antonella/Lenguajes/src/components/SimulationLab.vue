<script setup lang="ts">
import AgeSimulator from './AgeSimulator.vue';
import CognateSearch from './CognateSearch.vue';
import PronunciationTrainer from './PronunciationTrainer.vue';
import TriviaQuiz from './TriviaQuiz.vue';
</script>

<template>
  <div class="p-8 md:p-12 border-t transition-theme bg-slate-50 border-slate-200 dark:bg-slate-900/50 dark:border-slate-800">
    <div class="text-center mb-10">
      <span
        class="text-[10px] font-black uppercase tracking-widest bg-indigo-500/10 text-indigo-500 px-4 py-1.5 rounded-full inline-block mb-3"
      >
        Herramientas de Simulación Avanzadas (Gemini Active Engine)
      </span>
      <h2 class="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
        Laboratorio de Simulación y Práctica Activa
      </h2>
      <p class="text-sm text-slate-500 mt-2 max-w-xl mx-auto">
        Experimenta de forma dinámica cómo la edad de tu hija, la fonética y las reglas de asimilación optimizan la
        adquisición del inglés.
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <AgeSimulator />
      <CognateSearch />
      <PronunciationTrainer />
      <TriviaQuiz />
    </div>
  </div>
</template>
