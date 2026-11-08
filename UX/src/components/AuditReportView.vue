<script setup lang="ts">
import { computed } from 'vue';
import type { AuditReport } from '../model-text';

const props = defineProps<{
  report: AuditReport;
  imageSrc: string;
  redesignSrc: string;
  redesignNotes: string;
}>();
defineEmits<{ redesign: []; clear: [] }>();

const PASSING_SCORE = 7;

const scores = computed(() => [
  { label: '🧠 Sobrecarga Cognitiva:', value: props.report.sobrecargaScore },
  { label: '⏱️ Divulgación Progresiva:', value: props.report.disclosureScore },
  { label: '⚡ Ley de Hick:', value: props.report.hickScore },
]);

// Hidden once a redesign came back, as in the original, to avoid repeated image generations.
const canRedesign = computed(() => !props.redesignSrc && !props.redesignNotes);
</script>

<template>
  <div class="space-y-4 text-xs" aria-live="polite">
    <div class="flex justify-between items-center pb-2 border-b border-indigo-900">
      <h4 class="font-bold text-sm text-indigo-400 flex items-center gap-2">
        <span>📋 Diagnóstico & Rediseño de Usabilidad IA</span>
      </h4>
      <span class="bg-indigo-900 text-indigo-300 text-[10px] py-0.5 px-2 rounded-full font-mono"
        >Gemini-2.5-Flash</span
      >
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="bg-slate-900/60 p-3 rounded-xl border border-indigo-950/50 flex flex-col items-center">
        <span class="text-slate-400 font-bold block mb-1">Imagen Auditada</span>
        <img
          class="max-h-24 object-contain rounded border border-slate-800"
          :src="imageSrc"
          alt="Captura auditada"
        />
      </div>
      <div
        v-if="redesignSrc"
        class="bg-slate-900/60 p-3 rounded-xl border border-indigo-950/50 flex flex-col items-center"
      >
        <span class="text-emerald-400 font-bold block mb-1">✨ Rediseño Producido (Image-to-Image)</span>
        <img
          class="max-h-24 object-contain rounded border border-emerald-900"
          :src="redesignSrc"
          alt="Rediseño IA"
        />
      </div>
    </div>

    <div class="space-y-2 bg-slate-900/40 p-4 rounded-xl border border-indigo-950">
      <div
        v-for="score in scores"
        :key="score.label"
        class="flex justify-between items-center py-1 border-b border-indigo-950"
      >
        <span class="text-slate-400">{{ score.label }}</span>
        <span :class="['font-bold', score.value >= PASSING_SCORE ? 'text-emerald-400' : 'text-rose-400']"
          >{{ score.value }}/10</span
        >
      </div>
      <p class="font-bold mb-2 text-xs uppercase text-indigo-400 pt-2">Diagnóstico del Auditor:</p>
      <ul class="space-y-2 text-slate-300">
        <li><strong>Sobrecarga:</strong> {{ report.sobrecargaFeedback }}</li>
        <li><strong>Divulgación:</strong> {{ report.disclosureFeedback }}</li>
        <li><strong>Ley de Hick:</strong> {{ report.hickFeedback }}</li>
      </ul>
      <div class="mt-4 pt-3 border-t border-indigo-900 text-indigo-200">
        <strong>💡 Sugerencia del Auditor:</strong> {{ report.summary }}
      </div>
      <div v-if="redesignNotes" class="mt-4 pt-4 border-t border-emerald-950 text-emerald-200">
        <strong class="text-emerald-400 block mb-1">📐 Notas del Rediseño Producido:</strong>
        <p class="whitespace-pre-line">{{ redesignNotes }}</p>
      </div>
    </div>

    <div class="flex gap-2 pt-2">
      <button
        v-if="canRedesign"
        type="button"
        class="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-1"
        @click="$emit('redesign')"
      >
        <span>✨ Rediseñar Layout (Image-to-Image)</span>
      </button>
      <button
        type="button"
        class="border border-slate-700 hover:bg-slate-900 text-slate-300 font-bold py-2 px-4 rounded-xl text-xs transition-all"
        @click="$emit('clear')"
      >
        Limpiar
      </button>
    </div>
  </div>
</template>
