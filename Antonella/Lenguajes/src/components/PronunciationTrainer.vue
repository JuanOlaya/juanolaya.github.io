<script setup lang="ts">
import { Mic, Volume2 } from 'lucide-vue-next';
import { onBeforeUnmount, ref } from 'vue';
import { pronunciationWords } from '../content';
import LabCard from './LabCard.vue';

/** Simulated "listening" time before the score appears; the original page has no real speech analysis. */
const LISTEN_MS = 2000;

const listening = ref(false);
const score = ref<number | null>(null);
let timer: number | undefined;

function speak(text: string): void {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  utterance.rate = 0.85;
  window.speechSynthesis.speak(utterance);
}

function startPractice(): void {
  listening.value = true;
  score.value = null;
  timer = window.setTimeout(() => {
    listening.value = false;
    score.value = Math.floor(Math.random() * 11) + 88;
  }, LISTEN_MS);
}

onBeforeUnmount(() => window.clearTimeout(timer));
</script>

<template>
  <LabCard
    :icon="Mic"
    icon-class="bg-emerald-500/10 text-emerald-500"
    title="3. Simulador de Pronunciación"
    hint="Prueba cómo responde el oído fonético a los sonidos del inglés."
  >
    <div class="grid grid-cols-2 gap-2 mb-4">
      <button
        v-for="word in pronunciationWords"
        :key="word"
        type="button"
        class="flex items-center justify-between p-2.5 rounded-xl border transition-all text-xs font-bold bg-slate-50 border-slate-200 hover:bg-slate-100 dark:bg-slate-950 dark:border-slate-800 dark:hover:bg-slate-800/50"
        :aria-label="`Escuchar ${word}`"
        @click="speak(word)"
      >
        <span>{{ word }}</span>
        <Volume2 class="w-4 h-4 text-slate-400" />
      </button>
    </div>

    <div class="flex gap-2">
      <button
        type="button"
        :disabled="listening"
        class="flex-1 py-2 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 bg-indigo-600 text-white hover:bg-indigo-700 shadow-md"
        @click="startPractice"
      >
        <Mic class="w-4 h-4" />
        <span>Practicar Fonética</span>
      </button>
    </div>

    <div v-if="listening" class="mt-4 flex justify-center" role="status" aria-label="Escuchando">
      <div class="flex gap-1 items-center">
        <span class="w-1.5 h-3 bg-indigo-500 rounded-full animate-bounce"></span>
        <span class="w-1.5 h-5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
        <span class="w-1.5 h-4 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
      </div>
    </div>

    <div v-if="score !== null" class="mt-4 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-center">
      <span class="text-[10px] font-black uppercase text-emerald-500 block mb-1">Alineación Auditiva con Inglés</span>
      <div class="text-xl font-black text-emerald-400">{{ score }}% Match</div>
      <p class="text-[10px] text-slate-500 mt-1">
        Excelente flexibilidad fonética facilitada por la fonética de la Kita berlinesa.
      </p>
    </div>
  </LabCard>
</template>
