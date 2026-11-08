<script setup lang="ts">
import { ref } from 'vue';
import { AUDIT_SYSTEM_PROMPT, AUDIT_USER_PROMPT, REDESIGN_PROMPT } from '../content';
import { aiErrorMessage } from '../gemini-client';
import { firstText, gemini, logAiError, responseParts, type GenerateContentResponse } from '../gemini';
import { parseAuditReport, type AuditReport } from '../model-text';
import { drawChaoticSampleUi, inlineImageFromDataUrl } from '../sample-canvas';
import AuditReportView from './AuditReportView.vue';
import ErrorNotice from './ErrorNotice.vue';
import SpinnerIcon from './SpinnerIcon.vue';

type View = 'initial' | 'loading' | 'report';

const view = ref<View>('initial');
const loadingText = ref('');
const imageDataUrl = ref('');
const report = ref<AuditReport | null>(null);
const redesignSrc = ref('');
const redesignNotes = ref('');
const errorMessage = ref('');
const dragging = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);

function reset(): void {
  view.value = 'initial';
  imageDataUrl.value = '';
  report.value = null;
  redesignSrc.value = '';
  redesignNotes.value = '';
}

function imagePayloadPart() {
  return { inlineData: inlineImageFromDataUrl(imageDataUrl.value) };
}

async function runAudit(dataUrl: string): Promise<void> {
  reset();
  imageDataUrl.value = dataUrl;
  errorMessage.value = '';
  view.value = 'loading';
  loadingText.value = 'Analizando la captura de pantalla...';
  const payload = {
    contents: [{ role: 'user', parts: [{ text: AUDIT_USER_PROMPT }, imagePayloadPart()] }],
    generationConfig: { responseMimeType: 'application/json' },
    systemInstruction: { parts: [{ text: AUDIT_SYSTEM_PROMPT }] },
  };
  try {
    const response = await gemini.call<GenerateContentResponse>(
      'gemini-2.5-flash-preview-09-2025:generateContent',
      payload,
    );
    report.value = parseAuditReport(firstText(response));
    view.value = 'report';
  } catch (error) {
    logAiError('Multimodal Audit Error:', error);
    reset();
    errorMessage.value = aiErrorMessage(
      error,
      'Hubo un error al diagnosticar la interfaz con la IA. Asegúrate de que las credenciales estén activas.',
    );
  }
}

async function runRedesign(): Promise<void> {
  if (!imageDataUrl.value) return;
  errorMessage.value = '';
  view.value = 'loading';
  loadingText.value = 'Generando rediseño visual de baja fidelidad (Image-to-Image)...';
  const payload = {
    contents: [{ parts: [{ text: REDESIGN_PROMPT }, imagePayloadPart()] }],
    generationConfig: { responseModalities: ['TEXT', 'IMAGE'] },
  };
  try {
    const response = await gemini.call<GenerateContentResponse>(
      'gemini-2.5-flash-image-preview:generateContent',
      payload,
    );
    const parts = responseParts(response);
    const image = parts.find((part) => part.inlineData?.data)?.inlineData;
    if (image?.data) redesignSrc.value = `data:${image.mimeType ?? 'image/png'};base64,${image.data}`;
    redesignNotes.value = parts.find((part) => part.text)?.text ?? '';
  } catch (error) {
    logAiError('Image-to-Image Error:', error);
    errorMessage.value = aiErrorMessage(
      error,
      'La función de rediseño gráfico (Image-to-Image) no pudo completarse en esta iteración.',
    );
  }
  view.value = 'report';
}

function readFile(file: File | undefined): void {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    if (typeof reader.result === 'string') void runAudit(reader.result);
  };
  reader.readAsDataURL(file);
}

function onFileChange(event: Event): void {
  const input = event.target as HTMLInputElement;
  readFile(input.files?.[0]);
  // Allows picking the same file again after "Limpiar".
  input.value = '';
}

function onDrop(event: DragEvent): void {
  dragging.value = false;
  readFile(event.dataTransfer?.files[0]);
}
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
    <div class="space-y-4">
      <h3 class="text-lg font-bold text-white flex items-center gap-2">
        <span>🔍 Auditor & Rediseñador de Interfaces</span>
      </h3>
      <p class="text-slate-300 text-sm leading-relaxed">
        Sube una captura de tu interfaz. Gemini la auditará visualmente y, si lo deseas,
        <strong>rediseñará el layout</strong> generando un wireframe limpio y optimizado aplicando las leyes
        de usabilidad.
      </p>

      <div class="bg-slate-950/40 border border-indigo-950 p-4 rounded-2xl flex flex-col gap-3">
        <span class="text-xs font-bold text-indigo-400">¿No tienes una captura a mano?</span>
        <p class="text-xs text-slate-400">
          Haz clic en el botón de abajo para generar de manera simulada una interfaz extremadamente caótica en
          canvas y enviarla a analizar y rediseñar.
        </p>
        <button
          type="button"
          class="w-full bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-700 text-indigo-200 text-xs font-bold py-2.5 px-4 rounded-xl transition-all"
          @click="runAudit(drawChaoticSampleUi())"
        >
          ⚡ Generar UI Caótica de Prueba
        </button>
      </div>

      <button
        type="button"
        :class="[
          'w-full border-2 border-dashed hover:border-indigo-500 rounded-2xl p-6 text-center cursor-pointer transition-all hover:bg-indigo-950/20',
          dragging ? 'border-indigo-400 bg-indigo-950/30' : 'border-indigo-800 bg-indigo-950/10',
        ]"
        @click="fileInput?.click()"
        @dragenter.prevent="dragging = true"
        @dragover.prevent="dragging = true"
        @dragleave.prevent="dragging = false"
        @drop.prevent="onDrop"
      >
        <svg
          class="w-8 h-8 text-indigo-400 mx-auto mb-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <span class="text-xs font-bold">Arrastra tu captura de pantalla o haz clic para subir</span>
      </button>
      <input ref="fileInput" type="file" class="hidden" accept="image/*" @change="onFileChange" />
      <ErrorNotice :message="errorMessage" />
    </div>

    <div
      class="bg-slate-950 rounded-2xl p-6 border border-indigo-950 min-h-[350px] flex flex-col justify-center relative overflow-hidden"
    >
      <div v-if="view === 'initial'" class="text-center space-y-3">
        <span class="inline-block p-4 bg-indigo-950/50 text-indigo-400 rounded-full">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </span>
        <h4 class="font-bold text-slate-300 text-sm">Esperando interfaz...</h4>
        <p class="text-xs text-slate-500 max-w-xs mx-auto">
          Sube una imagen o usa la de prueba para activar el análisis.
        </p>
      </div>

      <div v-else-if="view === 'loading'" class="text-center space-y-4 pulse-loader">
        <SpinnerIcon class="w-8 h-8 mx-auto" />
        <h4 class="font-bold text-indigo-300 text-sm">{{ loadingText }}</h4>
      </div>

      <AuditReportView
        v-else-if="report"
        :report="report"
        :image-src="imageDataUrl"
        :redesign-src="redesignSrc"
        :redesign-notes="redesignNotes"
        @redesign="runRedesign"
        @clear="reset"
      />
    </div>
  </div>
</template>
