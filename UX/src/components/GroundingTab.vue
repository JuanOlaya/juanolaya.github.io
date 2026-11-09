<script setup lang="ts">
import { ref } from 'vue';
import { groundingTemplates } from '../content';
import { aiErrorMessage } from '../gemini-client';
import { firstText, gemini, logAiError, type GenerateContentResponse } from '../gemini';
import { groundingSources, type GroundingSource } from '../model-text';
import { BUTTON_PRIMARY, BUTTON_SECONDARY, EYEBROW, FIELD, PANEL } from '../ui';
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
  <div class="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
    <div class="space-y-4 lg:col-span-5">
      <div class="flex flex-wrap items-center gap-2 text-success">
        <span class="rounded-[4px] border border-success/40 px-2 py-0.5 font-mono text-[11px]"
          >CONEXIÓN WEB</span
        >
        <span :class="EYEBROW">Google Search Grounding</span>
      </div>
      <h3 class="text-lg font-medium">🌐 Consultor Técnico UX en Tiempo Real</h3>
      <p class="text-[0.92em] text-ink-2">
        Resuelve dilemas y debates reales de interfaz consultando de manera directa las últimas publicaciones
        de la web mediante <strong class="font-medium text-ink">Google Search Grounding</strong>.
      </p>
      <p class="text-caption text-ink-2">
        A diferencia de los chats normales de IA que pueden alucinar, Gemini comprobará sus datos consultando
        internet y listará las referencias usadas para fundamentar su respuesta.
      </p>

      <div class="space-y-2 pt-2">
        <span :class="`${EYEBROW} block text-ink-2`">Preguntas frecuentes sugeridas:</span>
        <button
          v-for="template in groundingTemplates"
          :key="template.label"
          type="button"
          :class="`${BUTTON_SECONDARY} w-full justify-start text-left text-caption whitespace-normal`"
          @click="query = template.prompt"
        >
          {{ template.label }}
        </button>
      </div>
      <ErrorNotice :message="errorMessage" />
    </div>

    <div :class="`${PANEL} flex h-[400px] flex-col justify-between p-6 lg:col-span-7`">
      <div v-if="view === 'loading'" class="my-auto space-y-2 py-8 text-center">
        <SpinnerIcon class="mx-auto h-6 w-6" />
        <p class="text-caption text-accent-text">
          Buscando fuentes, contrastando información y sintetizando respuesta técnica...
        </p>
      </div>
      <div v-else class="flex-1 space-y-4 overflow-y-auto pr-2" aria-live="polite">
        <div
          v-if="view === 'placeholder'"
          class="my-auto flex h-full flex-col items-center justify-center space-y-2 text-center text-ink-2"
        >
          <svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p class="text-caption">Formula una consulta para activar la búsqueda en Google...</p>
        </div>

        <div v-else class="space-y-4 text-[0.92em] text-ink-2">
          <div>
            <span class="mb-1 block font-medium text-accent-text">🔍 Consulta Realizada:</span>
            <p class="text-ink italic">{{ askedQuestion }}</p>
          </div>
          <div class="rounded-card border border-border bg-surface p-4 whitespace-pre-line text-ink">
            {{ answer }}
          </div>
          <div>
            <span class="mb-1 block font-medium text-success">🔗 Fuentes y Referencias (Google Search):</span>
            <ul class="space-y-1 text-caption">
              <li v-for="source in sources" :key="source.uri">
                <a
                  :href="source.uri"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex min-h-11 items-center gap-1"
                >
                  <span>• {{ source.title }}</span>
                  <svg
                    class="inline h-2.5 w-2.5"
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
              <li v-if="sources.length === 0" class="italic">
                No se citaron fuentes externas directamente para este término de usabilidad común.
              </li>
            </ul>
          </div>
        </div>
      </div>

      <form class="mt-4 flex flex-wrap gap-2 border-t border-border pt-3" @submit.prevent="consult">
        <input
          v-model="query"
          type="text"
          aria-label="Consulta de UX"
          :class="`${FIELD} min-w-0 flex-1 text-[0.92em]`"
          placeholder="Pregunta sobre tendencias de UX en la web..."
        />
        <button type="submit" :class="BUTTON_PRIMARY">Consultar</button>
      </form>
    </div>
  </div>
</template>
