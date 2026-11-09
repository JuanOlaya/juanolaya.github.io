<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';
import { INTERVIEW_FOLLOW_UP_SYSTEM, INTERVIEW_OPENING_PROMPT, INTERVIEW_START_SYSTEM } from '../content';
import { aiErrorMessage } from '../gemini-client';
import { firstText, gemini, logAiError, type ChatTurn, type GenerateContentResponse } from '../gemini';
import { splitTranslations } from '../model-text';
import { stopSpeech, useSpeechButton } from '../speech';
import { BUTTON_GHOST, BUTTON_PRIMARY, BUTTON_SECONDARY, EYEBROW, FIELD, PANEL } from '../ui';
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
  <div class="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
    <div class="space-y-4 lg:col-span-5">
      <div class="flex flex-wrap items-center gap-2 text-danger">
        <span class="rounded-[4px] border border-danger/40 px-2 py-0.5 font-mono text-[11px]">BILINGÜE</span>
        <span :class="EYEBROW">Alemán & UX</span>
      </div>
      <h3 class="text-lg font-medium">🇩🇪 Simulador de Entrevista UX</h3>
      <p class="text-[0.92em] text-ink-2">
        Simula una entrevista técnica para un puesto de Diseñador de Interfaces en una startup en Berlín.
      </p>
      <p :class="`${PANEL} text-caption text-ink-2`">
        La IA te hablará en <strong class="font-medium text-ink">alemán formal</strong>, proveerá la
        <strong class="font-medium text-ink">traducción al español</strong> entre corchetes, y
        <strong class="font-medium text-ink">leerá automáticamente en voz alta</strong> el texto en alemán
        mediante el sintetizador de alta fidelidad <strong class="font-medium text-ink">Gemini TTS</strong>.
        ¡La forma más inmersiva de practicar!
      </p>
      <div class="flex flex-wrap gap-2">
        <button
          type="button"
          :class="[BUTTON_SECONDARY, 'flex-1 text-caption', { 'pulse-loader': speaking }]"
          :aria-pressed="speaking"
          @click="replay"
        >
          🔊 Repetir Pregunta en Voz Alta
        </button>
        <button type="button" :class="`${BUTTON_GHOST} text-caption`" @click="restart">Reiniciar</button>
      </div>
      <ErrorNotice :message="replyError" />
    </div>

    <div :class="`${PANEL} flex h-[400px] flex-col lg:col-span-7`">
      <div ref="chatbox" class="flex-1 space-y-3 overflow-y-auto pr-2" aria-live="polite">
        <div v-if="starting" class="pulse-loader py-10 text-center text-caption text-ink-2">
          Iniciando simulador y conectando con el entrevistador de IA...
        </div>
        <p v-else-if="startError" class="py-10 text-center text-[0.92em] text-danger">{{ startError }}</p>
        <div
          v-for="(turn, index) in visibleTurns"
          :key="index"
          :class="['fade-in mb-3 flex', turn.role === 'model' ? 'justify-start' : 'justify-end']"
        >
          <div
            :class="[
              'max-w-[85%] rounded-panel p-3.5 text-[0.92em]',
              turn.role === 'model' ? 'border border-border bg-surface text-ink' : 'bg-info text-ink',
            ]"
          >
            <template v-for="(segment, segmentIndex) in turn.segments" :key="segmentIndex">
              <span
                v-if="segment.kind === 'translation' && turn.role === 'model'"
                class="mt-2 block border-t border-border pt-2 text-ink-2 italic"
                >🇪🇸 {{ segment.text }}</span
              >
              <span v-else-if="segment.kind === 'translation'">[{{ segment.text }}]</span>
              <span v-else class="whitespace-pre-line">{{ segment.text }}</span>
            </template>
          </div>
        </div>
        <div v-if="typing" class="fade-in flex justify-start">
          <div
            class="pulse-loader rounded-panel border border-border bg-surface p-3.5 text-caption text-ink-2"
          >
            El entrevistador está escuchando y procesando tu respuesta en usabilidad...
          </div>
        </div>
      </div>

      <form class="mt-3 flex flex-wrap gap-2 border-t border-border pt-3" @submit.prevent="send">
        <input
          v-model="draft"
          type="text"
          aria-label="Tu respuesta"
          :class="`${FIELD} min-w-0 flex-1 text-[0.92em]`"
          placeholder="Escribe tu respuesta en alemán o español..."
        />
        <button type="submit" :class="BUTTON_PRIMARY">Responder</button>
      </form>
    </div>
  </div>
</template>
