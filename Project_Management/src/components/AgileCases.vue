<script setup lang="ts">
import PageSection from '@shared/components/PageSection.vue';
import { Check, Puzzle, RotateCcw, X } from 'lucide-vue-next';
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import {
  type CaseRun,
  agileCases,
  chooseOption,
  currentCase,
  feedbackFor,
  isCorrect,
  isFinished,
  nextCase,
  restartRun,
  startRun,
} from '../agile-cases';
import { animationDurationMs, reducedMotionQuery, watchReducedMotion } from '../motion';

const run = ref<CaseRun>(startRun());
const reduceMotion = ref(false);

let stopWatching = (): void => {};
onMounted(() => {
  stopWatching = watchReducedMotion(reducedMotionQuery(), (reduce) => (reduceMotion.value = reduce));
});
onBeforeUnmount(() => stopWatching());

const aCase = computed(() => currentCase(agileCases, run.value));
const finished = computed(() => isFinished(agileCases, run.value));
const answered = computed(() => run.value.chosenOptionId !== null);
const verdict = computed(() => (aCase.value ? isCorrect(aCase.value, run.value.chosenOptionId) : null));
const feedback = computed(() => (aCase.value ? feedbackFor(aCase.value, run.value.chosenOptionId) : null));
const feedbackStyle = computed(() => ({ '--feedback-ms': `${animationDurationMs(reduceMotion.value)}ms` }));

/** After answering, the right option is always marked and the chosen wrong one too. */
function markOf(optionId: string): 'correct' | 'wrong' | null {
  if (!aCase.value || !answered.value) return null;
  if (optionId === aCase.value.correctOptionId) return 'correct';
  return optionId === run.value.chosenOptionId ? 'wrong' : null;
}

function choose(optionId: string): void {
  run.value = chooseOption(agileCases, run.value, optionId);
}
function next(): void {
  run.value = nextCase(agileCases, run.value);
}
function restart(): void {
  run.value = restartRun();
}
</script>

<template>
  <PageSection id="casos-agiles" section-class="card" heading-class="card__title">
    <template #icon><Puzzle :size="24" aria-hidden="true" /></template>
    <template #title>Casos prácticos de gestión ágil</template>

    <p class="card__caption">
      Elige la mejor respuesta en cada situación y compárala con lo que recomienda PMBOK 7.
    </p>

    <template v-if="aCase">
      <p class="text-ink-2 m-0 text-[13px]">
        Caso {{ run.index + 1 }} de {{ agileCases.length }} · Aciertos: {{ run.correctCount }}
      </p>
      <h3 class="m-0 text-[1.1em]">{{ aCase.title }}</h3>
      <p class="m-0">{{ aCase.context }}</p>
      <p class="m-0 font-medium">{{ aCase.question }}</p>

      <ul class="m-0 grid list-none gap-2 p-0">
        <li v-for="option in aCase.options" :key="option.id">
          <button
            type="button"
            :class="['option-button', markOf(option.id) && `option-button--${markOf(option.id)}`]"
            :aria-pressed="run.chosenOptionId === option.id"
            :disabled="answered"
            @click="choose(option.id)"
          >
            <span class="option-button__mark" aria-hidden="true">
              <Check v-if="markOf(option.id) === 'correct'" :size="20" />
              <X v-else-if="markOf(option.id) === 'wrong'" :size="20" />
            </span>
            <span>{{ option.text }}</span>
            <span v-if="markOf(option.id) === 'correct'" class="sr-only">(respuesta correcta)</span>
            <span v-else-if="markOf(option.id) === 'wrong'" class="sr-only"
              >(respuesta elegida, incorrecta)</span
            >
          </button>
        </li>
      </ul>

      <div role="status" aria-live="polite">
        <div
          v-if="feedback !== null"
          :class="['feedback', verdict ? 'tone-success' : 'tone-danger']"
          :style="feedbackStyle"
        >
          <p class="feedback__verdict m-0">{{ verdict ? 'Correcto.' : 'No es la mejor opción.' }}</p>
          <p class="m-0">{{ feedback }}</p>
          <p class="feedback__lesson m-0">{{ aCase.lesson }}</p>
        </div>
      </div>

      <div class="mt-2 flex flex-wrap gap-2">
        <button type="button" class="btn btn-primary" :disabled="!answered" @click="next">
          {{ run.index + 1 === agileCases.length ? 'Ver resultado' : 'Siguiente caso' }}
        </button>
        <button type="button" class="btn btn-secondary" @click="restart">
          <RotateCcw :size="20" aria-hidden="true" /> Reiniciar
        </button>
      </div>
    </template>

    <div v-else-if="finished" class="grid gap-3" role="status">
      <h3 class="m-0 text-[1.1em]">Resultado</h3>
      <p class="m-0">
        Has acertado {{ run.correctCount }} de {{ agileCases.length }} casos. Repasa los dominios Delivery,
        Project Work, Measurement y Uncertainty para afianzar las decisiones.
      </p>
      <div>
        <button type="button" class="btn btn-primary" @click="restart">
          <RotateCcw :size="20" aria-hidden="true" /> Reiniciar
        </button>
      </div>
    </div>
  </PageSection>
</template>
