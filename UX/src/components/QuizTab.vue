<script setup lang="ts">
import { computed, ref } from 'vue';
import { QUIZ_SYSTEM_PROMPT, QUIZ_USER_PROMPT } from '../content';
import { aiErrorMessage } from '../gemini-client';
import { firstText, gemini, logAiError, type GenerateContentResponse } from '../gemini';
import { isCorrect, parseQuiz, quizScore, type QuizAnswer, type QuizQuestion } from '../quiz';
import { BUTTON_PRIMARY, BUTTON_SECONDARY, PANEL } from '../ui';
import ErrorNotice from './ErrorNotice.vue';
import SpinnerIcon from './SpinnerIcon.vue';

type View = 'start' | 'loading' | 'playing' | 'results';

const view = ref<View>('start');
const questions = ref<QuizQuestion[]>([]);
const answers = ref<QuizAnswer[]>([]);
const errorMessage = ref('');

const current = computed(() => questions.value[answers.value.length]);
const score = computed(() => quizScore(answers.value));

function reset(): void {
  view.value = 'start';
  questions.value = [];
  answers.value = [];
}

async function generate(): Promise<void> {
  errorMessage.value = '';
  view.value = 'loading';
  const payload = {
    contents: [{ parts: [{ text: QUIZ_USER_PROMPT }] }],
    generationConfig: { responseMimeType: 'application/json' },
    systemInstruction: { parts: [{ text: QUIZ_SYSTEM_PROMPT }] },
  };
  try {
    const response = await gemini.call<GenerateContentResponse>(
      'gemini-2.5-flash-preview-09-2025:generateContent',
      payload,
    );
    questions.value = parseQuiz(firstText(response));
    answers.value = [];
    view.value = 'playing';
  } catch (error) {
    logAiError('Quiz Generation Error:', error);
    reset();
    errorMessage.value = aiErrorMessage(
      error,
      'No se pudo generar el examen por IA en este momento. Inténtalo de nuevo en unos segundos.',
    );
  }
}

function choose(selected: number): void {
  if (!current.value) return;
  answers.value.push({ question: current.value, selected });
  if (answers.value.length === questions.value.length) view.value = 'results';
}
</script>

<template>
  <div class="mx-auto max-w-2xl space-y-4">
    <h3 class="text-lg font-medium">🧠 Examen de Usabilidad con Gemini</h3>
    <p class="text-[0.92em] text-ink-2">
      Evaluemos lo aprendido. Generamos un cuestionario dinámico de 3 preguntas estructurado por Gemini sobre
      <strong class="font-medium text-ink">Sobrecarga Cognitiva, Divulgación Progresiva y Ley de Hick</strong
      >.
    </p>

    <div :class="`${PANEL} relative flex min-h-[250px] flex-col justify-center p-6`">
      <div v-if="view === 'start'" class="space-y-4 text-center">
        <button type="button" :class="BUTTON_PRIMARY" @click="generate">
          🎲 Generar Examen Personalizado de IA
        </button>
        <p class="text-caption text-ink-2">
          Usa Inteligencia Artificial para evaluar tu comprensión en tiempo real.
        </p>
        <ErrorNotice :message="errorMessage" />
      </div>

      <div v-else-if="view === 'loading'" class="pulse-loader space-y-4 text-center">
        <SpinnerIcon class="mx-auto h-8 w-8" />
        <h4 class="font-medium text-accent-text">Estructurando un examen personalizado...</h4>
      </div>

      <div v-else-if="view === 'playing' && current" class="space-y-4">
        <div class="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-2">
          <span class="text-caption font-medium text-accent-text"
            >Pregunta {{ answers.length + 1 }} de {{ questions.length }}</span
          >
          <span class="rounded-full border border-border px-2.5 py-0.5 font-mono text-[11px] text-ink-2"
            >Gemini Structured JSON</span
          >
        </div>
        <h4 class="font-medium">{{ current.question }}</h4>
        <div class="grid grid-cols-1 gap-2">
          <button
            v-for="(option, index) in current.options"
            :key="index"
            type="button"
            :class="`${BUTTON_SECONDARY} w-full justify-start py-3 text-left text-[0.92em] whitespace-normal`"
            @click="choose(index)"
          >
            {{ option }}
          </button>
        </div>
      </div>

      <div v-else-if="view === 'results'" class="space-y-4 text-center" aria-live="polite">
        <h4 class="text-xl font-medium">🏆 ¡Quiz Terminado!</h4>
        <p class="text-[0.92em] text-accent-text">
          Has acertado {{ score }} de {{ questions.length }} preguntas.
        </p>
        <div class="max-h-48 overflow-y-auto rounded-card border border-border bg-surface p-4 text-left">
          <div
            v-for="(answer, index) in answers"
            :key="index"
            class="mb-3 border-b border-border pb-3 text-[0.92em] text-ink-2 last:mb-0 last:border-none"
          >
            <p class="font-medium text-ink">{{ index + 1 }}. {{ answer.question.question }}</p>
            <p class="mt-1">
              Tu respuesta:
              <span :class="['font-medium', isCorrect(answer) ? 'text-success' : 'text-danger']">{{
                answer.question.options[answer.selected]
              }}</span>
            </p>
            <p v-if="!isCorrect(answer)" class="text-success">
              Correcta: {{ answer.question.options[answer.question.answerIndex] }}
            </p>
            <p class="mt-1 italic">💡 Explicación: {{ answer.question.explanation }}</p>
          </div>
        </div>
        <button type="button" :class="BUTTON_PRIMARY" @click="reset">Intentar con otro examen</button>
      </div>
    </div>
  </div>
</template>
