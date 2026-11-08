<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';
import { INTERVIEW_FOLLOW_UP_SYSTEM, INTERVIEW_OPENING_PROMPT, INTERVIEW_START_SYSTEM } from '../content';
import { aiErrorMessage } from '../gemini-client';
import { firstText, gemini, logAiError, type ChatTurn, type GenerateContentResponse } from '../gemini';
import { splitTranslations } from '../model-text';
import { stopSpeech, useSpeechButton } from '../speech';
import ErrorNotice from './ErrorNotice.vue';

const props = defineProps<{ active: boolean }>();

const openingTurn: ChatTurn = { role: 'user', parts: [{ text: INTERVIEW_OPENING_PROMPT }] };

const history = ref<ChatTurn[]>([openingTurn]);
const starting = ref(false);
const typing = ref(false);
const startError = ref('');
const replyError = ref('');
const draft = ref('');
const chatbox = ref<HTMLElement | null>(null);
const { busy: speaking, toggle: toggleSpeech, speak } = useSpeechButton('');

// The first turn is the setup prompt, which the visitor never sees.
const visibleTurns = computed(() =>
  history.value
    .slice(1)
    .map((turn) => ({ role: turn.role, segments: splitTranslations(turn.parts[0].text) })),
);
const lastModelText = computed(
  () => [...history.value].reverse().find((turn) => turn.role === 'model')?.parts[0].text ?? '',
);

async function scrollToBottom(): Promise<void> {
  await nextTick();
  if (chatbox.value) chatbox.value.scrollTop = chatbox.value.scrollHeight;
}

async function askInterviewer(systemText: string): Promise<void> {
  const payload = { contents: history.value, systemInstruction: { parts: [{ text: systemText }] } };
  const response = await gemini.call<GenerateContentResponse>(
    'gemini-2.5-flash-preview-09-2025:generateContent',
    payload,
  );
  const text = firstText(response);
  history.value.push({ role: 'model', parts: [{ text }] });
  await scrollToBottom();
  void speak(text);
}

async function start(): Promise<void> {
  starting.value = true;
  startError.value = '';
  try {
    await askInterviewer(INTERVIEW_START_SYSTEM);
  } catch (error) {
    logAiError('Interview Initialization Error:', error);
    startError.value = aiErrorMessage(error, 'Fallo de conexión en el simulador de entrevista bilingüe.');
  } finally {
    starting.value = false;
  }
}

async function send(): Promise<void> {
  const text = draft.value.trim();
  if (!text || typing.value) return;
  draft.value = '';
  replyError.value = '';
  history.value.push({ role: 'user', parts: [{ text }] });
  typing.value = true;
  await scrollToBottom();
  try {
    await askInterviewer(INTERVIEW_FOLLOW_UP_SYSTEM);
  } catch (error) {
    logAiError('Interview response error:', error);
    replyError.value = aiErrorMessage(error, 'Se perdió la conexión con el entrevistador.');
  } finally {
    typing.value = false;
  }
}

function replay(): void {
  if (lastModelText.value) void toggleSpeech(lastModelText.value);
}

function restart(): void {
  stopSpeech();
  history.value = [openingTurn];
  replyError.value = '';
  void start();
}

// The interview starts the first time the tab is opened, like the original.
watch(
  () => props.active,
  (active) => {
    if (active && history.value.length === 1 && !starting.value) void start();
  },
  { immediate: true },
);
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
    <div class="lg:col-span-5 space-y-4">
      <div class="flex items-center space-x-2 text-rose-400">
        <span class="px-2 py-0.5 bg-rose-950 border border-rose-800 rounded text-[10px] font-mono"
          >BILINGÜE</span
        >
        <span class="text-xs font-bold tracking-wider uppercase">Alemán & UX</span>
      </div>
      <h3 class="text-lg font-bold text-white">🇩🇪 Simulador de Entrevista UX</h3>
      <p class="text-slate-300 text-sm leading-relaxed">
        Simula una entrevista técnica para un puesto de Diseñador de Interfaces en una startup en Berlín.
      </p>
      <p
        class="text-slate-400 text-xs leading-relaxed bg-slate-950/40 p-3 rounded-xl border border-indigo-950"
      >
        La IA te hablará en <strong>alemán formal</strong>, proveerá la
        <strong>traducción al español</strong> entre corchetes, y
        <strong>leerá automáticamente en voz alta</strong> el texto en alemán mediante el sintetizador de alta
        fidelidad <strong>Gemini TTS</strong>. ¡La forma más inmersiva de practicar!
      </p>
      <div class="flex gap-2">
        <button
          type="button"
          :class="[
            'flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold py-2 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-1',
            { 'pulse-loader': speaking },
          ]"
          @click="replay"
        >
          🔊 Repetir Pregunta en Voz Alta
        </button>
        <button type="button" class="text-xs text-slate-400 hover:text-white underline px-2" @click="restart">
          Reiniciar
        </button>
      </div>
      <ErrorNotice :message="replyError" />
    </div>

    <div class="lg:col-span-7 bg-slate-950 rounded-2xl border border-indigo-950 p-4 flex flex-col h-[400px]">
      <div ref="chatbox" class="flex-1 overflow-y-auto space-y-3 pr-2" aria-live="polite">
        <div v-if="starting" class="text-center text-slate-500 py-10 pulse-loader">
          <span class="text-xs">Iniciando simulador y conectando con el entrevistador de IA...</span>
        </div>
        <p v-else-if="startError" class="text-xs text-rose-400 text-center py-10">{{ startError }}</p>
        <div
          v-for="(turn, index) in visibleTurns"
          :key="index"
          :class="['flex fade-in mb-3', turn.role === 'model' ? 'justify-start' : 'justify-end']"
        >
          <div
            :class="[
              'max-w-[85%] rounded-2xl p-3.5 text-xs',
              turn.role === 'model'
                ? 'bg-slate-900 border border-slate-800 text-slate-200'
                : 'bg-indigo-600 text-white',
            ]"
          >
            <template v-for="(segment, segmentIndex) in turn.segments" :key="segmentIndex">
              <span
                v-if="segment.kind === 'translation' && turn.role === 'model'"
                class="block mt-2 pt-2 border-t border-slate-800 text-slate-400 italic font-sans"
                >🇪🇸 {{ segment.text }}</span
              >
              <span v-else-if="segment.kind === 'translation'">[{{ segment.text }}]</span>
              <span v-else class="whitespace-pre-line">{{ segment.text }}</span>
            </template>
          </div>
        </div>
        <div v-if="typing" class="flex justify-start fade-in">
          <div
            class="bg-slate-900 border border-slate-800 text-slate-400 rounded-2xl p-3.5 text-xs pulse-loader"
          >
            El entrevistador está escuchando y procesando tu respuesta en usabilidad...
          </div>
        </div>
      </div>

      <form class="mt-3 pt-3 border-t border-indigo-950/50 flex gap-2" @submit.prevent="send">
        <input
          v-model="draft"
          type="text"
          aria-label="Tu respuesta"
          class="flex-1 bg-slate-900 border border-indigo-950 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Escribe tu respuesta en alemán o español..."
        />
        <button
          type="submit"
          class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition-all"
        >
          Responder
        </button>
      </form>
    </div>
  </div>
</template>
