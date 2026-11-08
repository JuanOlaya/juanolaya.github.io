<script setup lang="ts">
import { ref } from 'vue';
import { groundingTemplates } from '../content';
import { aiErrorMessage } from '../gemini-client';
import { firstText, gemini, logAiError, type GenerateContentResponse } from '../gemini';
import { groundingSources, type GroundingSource } from '../model-text';
import ErrorNotice from './ErrorNotice.vue';
import SpinnerIcon from './SpinnerIcon.vue';

type View = 'placeholder' | 'loading' | 'result';

const view = ref<View>('placeholder');
const query = ref('');
const askedQuestion = ref('');
const answer = ref('');
const sources = ref<GroundingSource[]>([]);
const errorMessage = ref('');

async function consult(): Promise<void> {
  const question = query.value.trim();
  if (!question) return;
  errorMessage.value = '';
  askedQuestion.value = question;
  view.value = 'loading';
  // The google_search tool makes Gemini ground the answer in live search results.
  const payload = { contents: [{ parts: [{ text: question }] }], tools: [{ google_search: {} }] };
  try {
    const response = await gemini.call<GenerateContentResponse>(
      'gemini-2.5-flash-preview-09-2025:generateContent',
      payload,
    );
    answer.value = firstText(response);
    sources.value = groundingSources(
      response.candidates?.[0]?.groundingMetadata?.groundingAttributions ?? [],
    );
    view.value = 'result';
    query.value = '';
  } catch (error) {
    logAiError('Grounding UX Consult Error:', error);
    view.value = 'placeholder';
    errorMessage.value = aiErrorMessage(
      error,
      'La consulta no pudo completarse. Revisa la consola o tu conexión.',
    );
  }
}
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
    <div class="lg:col-span-5 space-y-4">
      <div class="flex items-center space-x-2 text-emerald-400">
        <span class="px-2 py-0.5 bg-emerald-950 border border-emerald-800 rounded text-[10px] font-mono"
          >CONEXIÓN WEB</span
        >
        <span class="text-xs font-bold tracking-wider uppercase">Google Search Grounding</span>
      </div>
      <h3 class="text-lg font-bold text-white">🌐 Consultor Técnico UX en Tiempo Real</h3>
      <p class="text-slate-300 text-sm leading-relaxed">
        Resuelve dilemas y debates reales de interfaz consultando de manera directa las últimas publicaciones
        de la web mediante <strong>Google Search Grounding</strong>.
      </p>
      <p class="text-slate-400 text-xs">
        A diferencia de los chats normales de IA que pueden alucinar, Gemini comprobará sus datos consultando
        internet y listará las referencias usadas para fundamentar su respuesta.
      </p>

      <div class="space-y-2 pt-2">
        <span class="text-xs font-bold text-slate-500 block uppercase">Preguntas frecuentes sugeridas:</span>
        <button
          v-for="template in groundingTemplates"
          :key="template.label"
          type="button"
          class="w-full text-left bg-slate-900 hover:bg-slate-800 border border-indigo-950/50 p-2.5 rounded-xl text-[11px] text-slate-300 transition-all"
          @click="query = template.prompt"
        >
          {{ template.label }}
        </button>
      </div>
      <ErrorNotice :message="errorMessage" />
    </div>

    <div
      class="lg:col-span-7 bg-slate-950 rounded-2xl border border-indigo-950 p-6 flex flex-col h-[400px] justify-between"
    >
      <div v-if="view === 'loading'" class="text-center space-y-2 py-8 my-auto">
        <SpinnerIcon class="w-6 h-6 mx-auto" />
        <p class="text-xs text-indigo-300">
          Buscando fuentes, contrastando información y sintetizando respuesta técnica...
        </p>
      </div>
      <div v-else class="flex-1 overflow-y-auto space-y-4 pr-2" aria-live="polite">
        <div
          v-if="view === 'placeholder'"
          class="text-center text-slate-500 my-auto flex flex-col items-center justify-center h-full space-y-2"
        >
          <svg
            class="w-8 h-8 text-slate-600 animate-pulse"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p class="text-xs">Formula una consulta para activar la búsqueda en Google...</p>
        </div>

        <div v-else class="space-y-4 text-xs text-slate-300">
          <div>
            <span class="font-bold text-indigo-400 block mb-1">🔍 Consulta Realizada:</span>
            <p class="italic text-white">{{ askedQuestion }}</p>
          </div>
          <div
            class="bg-slate-900 p-4 rounded-xl border border-indigo-950 leading-relaxed text-slate-200 whitespace-pre-line"
          >
            {{ answer }}
          </div>
          <div>
            <span class="font-bold text-emerald-400 block mb-1"
              >🔗 Fuentes y Referencias (Google Search):</span
            >
            <ul class="space-y-1 text-[11px]">
              <li v-for="source in sources" :key="source.uri">
                <a
                  :href="source.uri"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-indigo-400 hover:text-indigo-300 font-medium underline flex items-center gap-1"
                >
                  <span>• {{ source.title }}</span>
                  <svg
                    class="w-2.5 h-2.5 inline"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </li>
              <li v-if="sources.length === 0" class="text-slate-500 italic">
                No se citaron fuentes externas directamente para este término de usabilidad común.
              </li>
            </ul>
          </div>
        </div>
      </div>

      <form class="mt-4 pt-3 border-t border-indigo-950/50 flex gap-2" @submit.prevent="consult">
        <input
          v-model="query"
          type="text"
          aria-label="Consulta de UX"
          class="flex-1 bg-slate-900 border border-indigo-950 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Pregunta sobre tendencias de UX en la web..."
        />
        <button
          type="submit"
          class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition-all"
        >
          Consultar
        </button>
      </form>
    </div>
  </div>
</template>
