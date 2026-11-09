<script setup lang="ts">
import { ref } from 'vue';
import { PROTOTYPE_STYLE_SUFFIX, prototypeTemplates } from '../content';
import { aiErrorMessage } from '../gemini-client';
import { gemini, logAiError, type PredictResponse } from '../gemini';
import { BUTTON_GHOST, BUTTON_PRIMARY, BUTTON_SECONDARY, FIELD, PANEL } from '../ui';
import ErrorNotice from './ErrorNotice.vue';
import SpinnerIcon from './SpinnerIcon.vue';

type View = 'initial' | 'loading' | 'result';

const view = ref<View>('initial');
const prompt = ref('');
const imageSrc = ref('');
const caption = ref('');
const errorMessage = ref('');

function reset(): void {
  view.value = 'initial';
  prompt.value = '';
}

async function generate(): Promise<void> {
  const promptText = prompt.value.trim();
  errorMessage.value = '';
  if (!promptText) {
    errorMessage.value = 'Por favor, introduce un prompt.';
    return;
  }
  view.value = 'loading';
  const payload = {
    instances: [{ prompt: `${promptText}${PROTOTYPE_STYLE_SUFFIX}` }],
    parameters: { sampleCount: 1 },
  };
  try {
    const response = await gemini.call<PredictResponse>('imagen-4.0-generate-001:predict', payload);
    const encoded = response.predictions?.[0]?.bytesBase64Encoded;
    if (!encoded) throw new Error('No se devolvió imagen');
    imageSrc.value = `data:image/png;base64,${encoded}`;
    caption.value = `Prompt: "${promptText}"`;
    view.value = 'result';
  } catch (error) {
    logAiError('Imagen 4 Error:', error);
    reset();
    errorMessage.value = aiErrorMessage(
      error,
      'Hubo un error al generar la imagen con Imagen 4. Por favor, asegúrate de que el backend soporte Imagen 4 en el ambiente.',
    );
  }
}
</script>

<template>
  <div class="grid grid-cols-1 items-start gap-8 lg:grid-cols-2">
    <div class="space-y-4">
      <h3 class="text-lg font-medium">🎨 Generador de Wireframes & Mockups UX (Imagen 4)</h3>
      <p class="text-[0.92em] text-ink-2">
        Escribe una descripción textual del tipo de interfaz o componente que deseas prototipar. La IA de
        última generación <strong class="font-medium text-ink">Imagen 4</strong> generará el diseño visual al
        instante.
      </p>

      <div class="space-y-3">
        <label for="proto-prompt-input" class="block text-caption font-medium text-accent-text uppercase"
          >Selecciona una plantilla o escribe tu prompt:</label
        >
        <div class="flex flex-wrap gap-2">
          <button
            v-for="template in prototypeTemplates"
            :key="template.label"
            type="button"
            :class="`${BUTTON_SECONDARY} text-caption`"
            @click="prompt = template.prompt"
          >
            {{ template.label }}
          </button>
        </div>

        <textarea
          id="proto-prompt-input"
          v-model="prompt"
          rows="3"
          :class="`${FIELD} py-3 text-[0.92em]`"
          placeholder="Describe el diseño que quieres que Imagen 4 renderice..."
        ></textarea>

        <button type="button" :class="`${BUTTON_PRIMARY} w-full`" @click="generate">
          🚀 Generar Prototipo con Imagen 4
        </button>
        <ErrorNotice :message="errorMessage" />
      </div>
    </div>

    <div
      :class="`${PANEL} relative flex min-h-[350px] flex-col items-center justify-center overflow-hidden p-6`"
    >
      <div v-if="view === 'initial'" class="space-y-3 text-center">
        <span class="inline-block rounded-full border border-border p-4 text-ink-2">
          <svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </span>
        <h4 class="font-medium">Esperando instrucciones...</h4>
        <p class="mx-auto max-w-xs text-caption text-ink-2">
          Selecciona una plantilla o escribe tu propio prompt para generar el diseño visual de referencia.
        </p>
      </div>

      <div v-else-if="view === 'loading'" class="pulse-loader space-y-4 text-center">
        <SpinnerIcon class="mx-auto h-8 w-8" />
        <h4 class="font-medium text-accent-text">Imagen 4 está sintetizando tu prototipo gráfico...</h4>
      </div>

      <div v-else class="w-full space-y-4 text-center">
        <span class="block text-caption font-medium text-success uppercase"
          >✨ Mockup Producido por Imagen 4</span
        >
        <img
          class="mx-auto max-h-[250px] rounded-card border border-border object-contain"
          :src="imageSrc"
          alt="Prototipo Generado"
        />
        <p class="mx-auto max-w-sm text-caption text-ink-2">{{ caption }}</p>
        <button type="button" :class="BUTTON_GHOST" @click="reset">Generar otro</button>
      </div>
    </div>
  </div>
</template>
