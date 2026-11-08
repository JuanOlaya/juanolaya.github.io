<script setup lang="ts">
import { ref } from 'vue';
import AccordionItem from '@shared/components/AccordionItem.vue';
import { PRONUNCIATION_TEXT, pastTense, presentTense, usageExamples } from '../content';
import { useSpeechButton } from '../speech';
import LawCard from './LawCard.vue';

const pastOpen = ref(false);
const examplesOpen = ref(false);
const {
  busy: speaking,
  label: speechLabel,
  toggle: toggleSpeech,
} = useSpeechButton('Escuchar Pronunciación');

const accordionButtonClass =
  'w-full flex items-center justify-between p-4 bg-slate-800/30 hover:bg-slate-800 text-left transition-all';
const accordionPanelClass = 'p-4 bg-slate-950/50 border-t border-slate-800 text-xs text-slate-400 fade-in';
</script>

<template>
  <section
    id="concept-disclosure"
    class="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden scroll-mt-20"
  >
    <div class="p-6 md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <div class="lg:col-span-5 space-y-6">
        <div class="flex items-center space-x-3 text-indigo-600">
          <span class="p-2 bg-indigo-50 rounded-lg">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </span>
          <span class="text-sm font-bold tracking-wider uppercase">La Técnica</span>
        </div>

        <div class="space-y-2">
          <h2 class="text-2xl md:text-3xl font-bold text-slate-950">
            2. Divulgación Progresiva <br /><span class="text-indigo-600 text-lg font-medium"
              >(Progressive Disclosure)</span
            >
          </h2>
          <span
            class="inline-block bg-indigo-50 text-indigo-700 text-[11px] font-semibold px-2.5 py-1 rounded border border-indigo-100"
          >
            Patrón de interacción y diseño
          </span>
        </div>

        <div class="space-y-3">
          <p class="text-slate-700 leading-relaxed text-sm">
            Consiste en <strong>mostrar solo la información esencial de inicio</strong>, ocultando los
            detalles avanzados o secundarios hasta que el usuario decida explorarlos de forma explícita.
          </p>
          <p class="text-slate-600 leading-relaxed text-sm">
            Evitamos "saturar" visualmente. Al modular la entrega de información en capas (acordeones,
            pestañas sencillas o tooltips), el aprendizaje y la navegación se vuelven fluidos y sin
            fricciones.
          </p>
          <div class="p-4 bg-emerald-50/80 border-l-4 border-emerald-500 rounded-r-xl shadow-sm">
            <p class="text-xs text-emerald-950 font-medium leading-relaxed">
              <strong class="text-emerald-800 font-bold block mb-0.5">💡 Beneficio clave:</strong>
              Reduce el miedo inicial a interfaces complejas. El usuario aprende "en trozos" digeribles.
            </p>
          </div>
        </div>

        <p class="text-slate-600 leading-relaxed text-xs pt-2">
          En el prestigioso compendio
          <a
            href="https://lawsofux.com/"
            target="_blank"
            rel="noopener noreferrer"
            class="text-indigo-600 underline font-semibold hover:text-indigo-800"
            >Laws of UX</a
          >, la Divulgación Progresiva es la técnica reina que sirve para hacer viables tres leyes
          fundamentales:
        </p>

        <div class="space-y-4 pt-2">
          <LawCard title="1. Ley de Tesler (Complejidad)" href="https://lawsofux.com/teslers-law/">
            Todo sistema tiene una complejidad inherente que no se puede reducir. La divulgación progresiva
            <strong>gestiona</strong> esta complejidad organizándola en flujos secundarios.
          </LawCard>
          <LawCard title="2. Ley de Miller" href="https://lawsofux.com/millers-law/">
            <template #badge>
              <span class="bg-indigo-100 text-indigo-800 text-[9px] px-1.5 rounded-full font-mono font-normal"
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

      <div class="lg:col-span-7 space-y-6">
        <div class="flex justify-between items-center">
          <h3 class="text-sm font-semibold text-slate-500 uppercase tracking-wider">
            Demo Interactiva con Sprechen
          </h3>
          <button
            type="button"
            :class="[
              'flex items-center gap-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
              { 'pulse-loader': speaking },
            ]"
            @click="toggleSpeech(PRONUNCIATION_TEXT)"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
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

        <div class="bg-slate-900 text-white rounded-2xl p-6 shadow-xl space-y-6 border border-slate-800">
          <div class="flex justify-between items-start">
            <div>
              <span class="text-xs font-bold text-indigo-400 uppercase tracking-widest"
                >Alemán Interactivo</span
              >
              <h4 class="text-2xl font-extrabold mt-1">Sprechen</h4>
              <p class="text-slate-400 text-xs">Verbo irregular • Significa "Hablar"</p>
            </div>
            <span
              class="bg-emerald-500/10 text-emerald-400 text-xs px-2 py-1 rounded font-bold border border-emerald-500/20"
              >A1-A2</span
            >
          </div>

          <!-- Capa 1: información esencial, siempre visible -->
          <div class="bg-slate-800/50 rounded-xl p-4 border border-slate-800">
            <div class="flex justify-between items-center mb-1">
              <span class="text-[10px] text-slate-400 uppercase font-bold tracking-wider"
                >Presente (Información Clave)</span
              >
              <span class="text-[9px] text-indigo-300 bg-indigo-950 px-1.5 rounded">Cumple Miller</span>
            </div>
            <div class="grid grid-cols-2 gap-2 mt-2 text-sm text-slate-200">
              <div v-for="item in presentTense" :key="item.form">
                {{ item.pronoun }} <span class="text-indigo-400 font-bold">{{ item.form }}</span>
              </div>
            </div>
          </div>

          <!-- Capa 2: información revelada a petición -->
          <div class="space-y-3">
            <AccordionItem
              v-model:open="pastOpen"
              class="border border-slate-800 rounded-xl overflow-hidden"
              :button-class="accordionButtonClass"
              :panel-class="`${accordionPanelClass} space-y-2`"
            >
              <template #header="{ open }">
                <span class="text-xs font-bold text-slate-300"
                  >⏱️ Ver conjugación en Pasado (Präteritum)</span
                >
                <svg
                  :class="['w-4 h-4 transform transition-transform', { 'rotate-180': open }]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </template>
              <p class="text-slate-500">
                Complejidad gestionada por la app (Ley de Tesler) para no saturar al inicio:
              </p>
              <div class="grid grid-cols-2 gap-1 text-slate-300">
                <div v-for="item in pastTense" :key="item.form">
                  {{ item.pronoun }} <strong class="text-emerald-400">{{ item.form }}</strong>
                </div>
              </div>
            </AccordionItem>

            <AccordionItem
              v-model:open="examplesOpen"
              class="border border-slate-800 rounded-xl overflow-hidden"
              :button-class="accordionButtonClass"
              :panel-class="`${accordionPanelClass} space-y-3`"
            >
              <template #header="{ open }">
                <span class="text-xs font-bold text-slate-300">📖 Mostrar Ejemplos de Uso</span>
                <svg
                  :class="['w-4 h-4 transform transition-transform', { 'rotate-180': open }]"
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
                :class="{ 'pt-2 border-t border-slate-800/50': index > 0 }"
              >
                <p class="font-bold text-slate-300">{{ example.title }}</p>
                <p class="italic">{{ example.sentence }}</p>
              </div>
            </AccordionItem>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
