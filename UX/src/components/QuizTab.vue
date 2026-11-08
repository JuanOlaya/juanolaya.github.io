<script setup lang="ts">
import { computed, ref } from 'vue';
import { QUIZ_SYSTEM_PROMPT, QUIZ_USER_PROMPT } from '../content';
import { aiErrorMessage } from '../gemini-client';
import { firstText, gemini, logAiError, type GenerateContentResponse } from '../gemini';
import { isCorrect, parseQuiz, quizScore, type QuizAnswer, type QuizQuestion } from '../quiz';
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
  <div class="max-w-2xl mx-auto space-y-4">
    <h3 class="text-lg font-bold text-white flex items-center gap-2">
      <span>🧠 Examen de Usabilidad con Gemini</span>
    </h3>
    <p class="text-slate-300 text-sm leading-relaxed">
      Evaluemos lo aprendido. Generamos un cuestionario dinámico de 3 preguntas estructurado por Gemini sobre
      <strong>Sobrecarga Cognitiva, Divulgación Progresiva y Ley de Hick</strong>.
    </p>

    <div
      class="bg-slate-950 rounded-2xl p-6 border border-indigo-950 min-h-[250px] flex flex-col justify-center relative"
    >
      <div v-if="view === 'start'" class="text-center space-y-4">
        <button
          type="button"
          class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-xl text-xs shadow-md transition-all"
          @click="generate"
        >
          🎲 Generar Examen Personalizado de IA
        </button>
        <p class="text-[10px] text-slate-500">
          Usa Inteligencia Artificial para evaluar tu comprensión en tiempo real.
        </p>
        <ErrorNotice :message="errorMessage" />
      </div>

      <div v-else-if="view === 'loading'" class="text-center space-y-4 pulse-loader">
        <SpinnerIcon class="w-8 h-8 mx-auto" />
        <h4 class="font-bold text-indigo-300 text-xs">Estructurando un examen personalizado...</h4>
      </div>

      <div v-else-if="view === 'playing' && current" class="space-y-4">
        <div class="flex justify-between items-center border-b border-indigo-900 pb-2">
          <span class="text-xs font-bold text-indigo-400"
            >Pregunta {{ answers.length + 1 }} de {{ questions.length }}</span
          >
          <span class="text-[10px] bg-indigo-950 text-indigo-300 px-2.5 py-0.5 rounded-full font-semibold"
            >Gemini Structured JSON</span
          >
        </div>
        <h4 class="font-bold text-sm text-white">{{ current.question }}</h4>
        <div class="grid grid-cols-1 gap-2">
          <button
            v-for="(option, index) in current.options"
            :key="index"
            type="button"
            class="w-full text-left bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white p-3.5 rounded-xl border border-indigo-950 transition-all text-xs font-medium"
            @click="choose(index)"
          >
            {{ option }}
          </button>
        </div>
      </div>

      <div v-else-if="view === 'results'" class="text-center space-y-4" aria-live="polite">
        <h4 class="font-black text-xl text-white">🏆 ¡Quiz Terminado!</h4>
        <p class="text-sm text-indigo-300">Has acertado {{ score }} de {{ questions.length }} preguntas.</p>
        <div
          class="p-4 bg-indigo-950/40 rounded-xl border border-indigo-900 text-left max-h-48 overflow-y-auto"
        >
          <div
            v-for="(answer, index) in answers"
            :key="index"
            class="mb-3 border-b border-indigo-900/50 pb-3 last:border-none last:mb-0 text-xs text-slate-300"
          >
            <p class="font-bold text-white">{{ index + 1 }}. {{ answer.question.question }}</p>
            <p class="mt-1">
              Tu respuesta:
              <span
                :class="isCorrect(answer) ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-semibold'"
                >{{ answer.question.options[answer.selected] }}</span
              >
            </p>
            <p v-if="!isCorrect(answer)" class="text-emerald-400">
              Correcta: {{ answer.question.options[answer.question.answerIndex] }}
            </p>
            <p class="italic text-slate-400 mt-1">💡 Explicación: {{ answer.question.explanation }}</p>
          </div>
        </div>
        <button
          type="button"
          class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-xl text-xs transition-all"
          @click="reset"
        >
          Intentar con otro examen
        </button>
      </div>
    </div>
  </div>
</template>
