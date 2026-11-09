<script setup lang="ts">
import { computed } from 'vue';
import type { AuditReport } from '../model-text';
import { BUTTON_PRIMARY, BUTTON_SECONDARY } from '../ui';

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
  <div class="space-y-4 text-[0.92em]" aria-live="polite">
    <div class="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-2">
      <h4 class="font-medium text-accent-text">📋 Diagnóstico & Rediseño de Usabilidad IA</h4>
      <span class="rounded-full border border-border px-2 py-0.5 font-mono text-[11px] text-ink-2"
        >Gemini-2.5-Flash</span
      >
    </div>

    <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div class="flex flex-col items-center rounded-card border border-border bg-surface p-3">
        <span class="mb-1 block text-caption text-ink-2">Imagen Auditada</span>
        <img
          class="max-h-24 rounded-[4px] border border-border object-contain"
          :src="imageSrc"
          alt="Captura auditada"
        />
      </div>
      <div
        v-if="redesignSrc"
        class="flex flex-col items-center rounded-card border border-border bg-surface p-3"
      >
        <span class="mb-1 block text-caption text-success">✨ Rediseño Producido (Image-to-Image)</span>
        <img
          class="max-h-24 rounded-[4px] border border-success/40 object-contain"
          :src="redesignSrc"
          alt="Rediseño IA"
        />
      </div>
    </div>

    <div class="space-y-2 rounded-card border border-border bg-surface p-4">
      <div
        v-for="score in scores"
        :key="score.label"
        class="flex items-center justify-between border-b border-border py-1"
      >
        <span class="text-ink-2">{{ score.label }}</span>
        <span
          :class="['font-mono font-medium', score.value >= PASSING_SCORE ? 'text-success' : 'text-danger']"
          >{{ score.value }}/10</span
        >
      </div>
      <p class="pt-2 text-caption font-medium text-accent-text uppercase">Diagnóstico del Auditor:</p>
      <ul class="space-y-2 text-ink-2">
        <li><strong class="font-medium text-ink">Sobrecarga:</strong> {{ report.sobrecargaFeedback }}</li>
        <li><strong class="font-medium text-ink">Divulgación:</strong> {{ report.disclosureFeedback }}</li>
        <li><strong class="font-medium text-ink">Ley de Hick:</strong> {{ report.hickFeedback }}</li>
      </ul>
      <div class="mt-4 border-t border-border pt-3">
        <strong class="font-medium text-accent-text">💡 Sugerencia del Auditor:</strong> {{ report.summary }}
      </div>
      <div v-if="redesignNotes" class="mt-4 border-t border-border pt-4">
        <strong class="mb-1 block font-medium text-success">📐 Notas del Rediseño Producido:</strong>
        <p class="whitespace-pre-line text-ink-2">{{ redesignNotes }}</p>
      </div>
    </div>

    <div class="flex flex-wrap gap-2 pt-2">
      <button v-if="canRedesign" type="button" :class="`${BUTTON_PRIMARY} flex-1`" @click="$emit('redesign')">
        ✨ Rediseñar Layout (Image-to-Image)
      </button>
      <button type="button" :class="BUTTON_SECONDARY" @click="$emit('clear')">Limpiar</button>
    </div>
  </div>
</template>
