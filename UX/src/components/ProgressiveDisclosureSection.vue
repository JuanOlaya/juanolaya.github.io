<script setup lang="ts">
import { ref } from 'vue';
import AccordionItem from '@shared/components/AccordionItem.vue';
import { PRONUNCIATION_TEXT, pastTense, presentTense, usageExamples } from '../content';
import { useSpeechButton } from '../speech';
import { BUTTON_SECONDARY, CARD, EYEBROW, PANEL } from '../ui';
import LawCard from './LawCard.vue';

const pastOpen = ref(false);
const examplesOpen = ref(false);
const {
  busy: speaking,
  label: speechLabel,
  toggle: toggleSpeech,
} = useSpeechButton('Escuchar Pronunciación');

const accordionButtonClass =
  'flex min-h-11 w-full items-center justify-between gap-3 px-4 py-3 text-left hover:bg-white/5 motion-safe:transition-colors';
const accordionPanelClass = 'fade-in border-t border-border p-4 text-[0.92em] text-ink-2';
</script>

<template>
  <section id="concept-disclosure" :class="`${CARD} scroll-mt-20`">
    <div class="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
      <div class="space-y-6 lg:col-span-5">
        <div class="flex items-center gap-3 text-info-text">
          <span class="rounded-button border border-info/40 p-2">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </span>
          <span :class="EYEBROW">La Técnica</span>
        </div>

        <div class="space-y-2">
          <h2 class="text-[clamp(20px,1.1rem+0.5vw,26px)] leading-tight font-medium">
            2. Divulgación Progresiva <br /><span class="text-[0.75em] text-info-text"
              >(Progressive Disclosure)</span
            >
          </h2>
          <span class="inline-block rounded-[4px] border border-border px-2.5 py-1 text-caption text-ink-2">
            Patrón de interacción y diseño
          </span>
        </div>

        <div class="space-y-3 text-ink-2">
          <p>
            Consiste en
            <strong class="font-medium text-ink">mostrar solo la información esencial de inicio</strong>,
            ocultando los detalles avanzados o secundarios hasta que el usuario decida explorarlos de forma
            explícita.
          </p>
          <p>
            Evitamos "saturar" visualmente. Al modular la entrega de información en capas (acordeones,
            pestañas sencillas o tooltips), el aprendizaje y la navegación se vuelven fluidos y sin
            fricciones.
          </p>
          <div class="rounded-r-card border-l-4 border-success bg-bg p-4">
            <p class="text-[0.92em] text-ink">
              <strong class="mb-0.5 block font-medium text-success">💡 Beneficio clave:</strong>
              Reduce el miedo inicial a interfaces complejas. El usuario aprende "en trozos" digeribles.
            </p>
          </div>
        </div>

        <p class="pt-2 text-[0.92em] text-ink-2">
          En el prestigioso compendio
          <a href="https://lawsofux.com/" target="_blank" rel="noopener noreferrer">Laws of UX</a>, la
          Divulgación Progresiva es la técnica reina que sirve para hacer viables tres leyes fundamentales:
        </p>

        <div class="space-y-4 pt-2">
          <LawCard title="1. Ley de Tesler (Complejidad)" href="https://lawsofux.com/teslers-law/">
            Todo sistema tiene una complejidad inherente que no se puede reducir. La divulgación progresiva
            <strong class="font-medium text-ink">gestiona</strong> esta complejidad organizándola en flujos
            secundarios.
          </LawCard>
          <LawCard title="2. Ley de Miller" href="https://lawsofux.com/millers-law/">
            <template #badge>
              <span
                class="rounded-full border border-border px-1.5 font-mono text-[11px] text-info-text normal-case"
                >\(7 \pm 2\)</span
              >
            </template>
            Solo podemos retener temporalmente un promedio de \(7 \pm 2\) elementos en la memoria. Esta
            técnica fragmenta la información en bloques digeribles.
          </LawCard>
          <LawCard title="3. Ley de Hick (Decisiones)" href="https://lawsofux.com/hicks-law/">
            El tiempo de decisión crece con el número y complejidad de opciones. Ocultar los detalles por
            defecto evita la parálisis por análisis.
          </LawCard>
        </div>
      </div>

      <div class="space-y-6 lg:col-span-7">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <h3 :class="`${EYEBROW} text-ink-2`">Demo Interactiva con Sprechen</h3>
          <button
            type="button"
            :class="[BUTTON_SECONDARY, 'text-caption', { 'pulse-loader': speaking }]"
            :aria-pressed="speaking"
            @click="toggleSpeech(PRONUNCIATION_TEXT)"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
              />
            </svg>
            <span aria-live="polite">{{ speechLabel }}</span>
          </button>
        </div>

        <div :class="`${PANEL} space-y-6 p-[clamp(16px,1.6vw,24px)]`">
          <div class="flex items-start justify-between gap-3">
            <div>
              <span :class="`${EYEBROW} text-info-text`">Alemán Interactivo</span>
              <h4 class="mt-1 text-2xl font-medium">Sprechen</h4>
              <p class="text-caption text-ink-2">Verbo irregular • Significa "Hablar"</p>
            </div>
            <span
              class="rounded-[4px] border border-success/40 px-2 py-1 text-caption font-medium text-success"
              >A1-A2</span
            >
          </div>

          <!-- Capa 1: información esencial, siempre visible -->
          <div class="rounded-card border border-border bg-surface p-4">
            <div class="mb-1 flex flex-wrap items-center justify-between gap-2">
              <span :class="`${EYEBROW} text-ink-2`">Presente (Información Clave)</span>
              <span class="rounded-[4px] border border-border px-1.5 text-caption text-info-text"
                >Cumple Miller</span
              >
            </div>
            <div class="mt-2 grid grid-cols-2 gap-2 text-[0.92em]">
              <div v-for="item in presentTense" :key="item.form">
                {{ item.pronoun }} <span class="font-medium text-info-text">{{ item.form }}</span>
              </div>
            </div>
          </div>

          <!-- Capa 2: información revelada a petición -->
          <div class="space-y-3">
            <AccordionItem
              v-model:open="pastOpen"
              class="overflow-hidden rounded-card border border-border bg-surface"
              :button-class="accordionButtonClass"
              :panel-class="`${accordionPanelClass} space-y-2`"
            >
              <template #header="{ open }">
                <span class="text-[0.92em] font-medium">⏱️ Ver conjugación en Pasado (Präteritum)</span>
                <svg
                  :class="['h-4 w-4 shrink-0 motion-safe:transition-transform', { 'rotate-180': open }]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </template>
              <p>Complejidad gestionada por la app (Ley de Tesler) para no saturar al inicio:</p>
              <div class="grid grid-cols-2 gap-1 text-ink">
                <div v-for="item in pastTense" :key="item.form">
                  {{ item.pronoun }} <strong class="font-medium text-success">{{ item.form }}</strong>
                </div>
              </div>
            </AccordionItem>

            <AccordionItem
              v-model:open="examplesOpen"
              class="overflow-hidden rounded-card border border-border bg-surface"
              :button-class="accordionButtonClass"
              :panel-class="`${accordionPanelClass} space-y-3`"
            >
              <template #header="{ open }">
                <span class="text-[0.92em] font-medium">📖 Mostrar Ejemplos de Uso</span>
                <svg
                  :class="['h-4 w-4 shrink-0 motion-safe:transition-transform', { 'rotate-180': open }]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </template>
              <div
                v-for="(example, index) in usageExamples"
                :key="example.title"
                :class="{ 'border-t border-border pt-2': index > 0 }"
              >
                <p class="font-medium text-ink">{{ example.title }}</p>
                <p class="italic">{{ example.sentence }}</p>
              </div>
            </AccordionItem>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
