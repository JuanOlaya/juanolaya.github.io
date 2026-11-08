<script setup lang="ts">
import { ref } from 'vue';
import { PROTOTYPE_STYLE_SUFFIX, prototypeTemplates } from '../content';
import { aiErrorMessage } from '../gemini-client';
import { gemini, logAiError, type PredictResponse } from '../gemini';
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
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
    <div class="space-y-4">
      <h3 class="text-lg font-bold text-white flex items-center gap-2">
        <span>🎨 Generador de Wireframes & Mockups UX (Imagen 4)</span>
      </h3>
      <p class="text-slate-300 text-sm leading-relaxed">
        Escribe una descripción textual del tipo de interfaz o componente que deseas prototipar. La IA de
        última generación <strong>Imagen 4</strong> generará el diseño visual al instante.
      </p>

      <div class="space-y-3">
        <label for="proto-prompt-input" class="block text-xs font-bold text-indigo-400 uppercase"
          >Selecciona una plantilla o escribe tu prompt:</label
        >
        <div class="flex flex-wrap gap-1.5">
          <button
            v-for="template in prototypeTemplates"
            :key="template.label"
            type="button"
            class="bg-slate-800 hover:bg-slate-700 text-[10px] text-slate-300 py-1 px-2.5 rounded-lg transition-all border border-slate-700"
            @click="prompt = template.prompt"
          >
            {{ template.label }}
          </button>
        </div>

        <textarea
          id="proto-prompt-input"
          v-model="prompt"
          rows="3"
          class="w-full bg-slate-950 text-white border border-indigo-950 rounded-xl p-3 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none placeholder-slate-600"
          placeholder="Describe el diseño que quieres que Imagen 4 renderice..."
        ></textarea>

        <button
          type="button"
          class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-all shadow-md"
          @click="generate"
        >
          🚀 Generar Prototipo con Imagen 4
        </button>
        <ErrorNotice :message="errorMessage" />
      </div>
    </div>

    <div
      class="bg-slate-950 rounded-2xl p-6 border border-indigo-950 min-h-[350px] flex flex-col justify-center items-center relative overflow-hidden"
    >
      <div v-if="view === 'initial'" class="text-center space-y-3">
        <span class="inline-block p-4 bg-indigo-950/50 text-indigo-400 rounded-full">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </span>
        <h4 class="font-bold text-slate-300 text-sm">Esperando instrucciones...</h4>
        <p class="text-xs text-slate-500 max-w-xs mx-auto">
          Selecciona una plantilla o escribe tu propio prompt para generar el diseño visual de referencia.
        </p>
      </div>

      <div v-else-if="view === 'loading'" class="text-center space-y-4 pulse-loader">
        <SpinnerIcon class="w-8 h-8 mx-auto" />
        <h4 class="font-bold text-indigo-300 text-sm">Imagen 4 está sintetizando tu prototipo gráfico...</h4>
      </div>

      <div v-else class="space-y-4 w-full text-center">
        <span class="text-xs text-emerald-400 font-bold uppercase block"
          >✨ Mockup Producido por Imagen 4</span
        >
        <img
          class="max-h-[250px] mx-auto object-contain rounded-xl border border-slate-800 shadow-xl"
          :src="imageSrc"
          alt="Prototipo Generado"
        />
        <p class="text-[10px] text-slate-500 max-w-sm mx-auto">{{ caption }}</p>
        <button type="button" class="text-xs text-slate-400 hover:text-white underline" @click="reset">
          Generar otro
        </button>
      </div>
    </div>
  </div>
</template>
