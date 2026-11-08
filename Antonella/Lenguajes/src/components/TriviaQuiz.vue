<script setup lang="ts">
import { ArrowRight, Gamepad2 } from 'lucide-vue-next';
import { computed, ref } from 'vue';
import { WRONG_ANSWER_TEXT, quizQuestions } from '../content';
import LabCard from './LabCard.vue';

const OPTION_BASE = 'w-full p-2.5 rounded-xl border text-left text-xs font-bold transition-all';
const OPTION_IDLE =
  'bg-slate-50 border-slate-200 hover:bg-slate-100 dark:bg-slate-950 dark:border-slate-800 dark:hover:bg-slate-800';

const index = ref(0);
const chosen = ref<number | null>(null);
const question = computed(() => quizQuestions[index.value]);
const answeredCorrectly = computed(() => chosen.value !== null && question.value.options[chosen.value].isCorrect);

// Only the clicked option is coloured, as on the original page.
function optionClass(optionIndex: number): string {
  if (chosen.value !== optionIndex) return `${OPTION_BASE} ${OPTION_IDLE}`;
  return answeredCorrectly.value
    ? `${OPTION_BASE} bg-emerald-500/10 border-emerald-500 text-emerald-400`
    : `${OPTION_BASE} bg-red-500/10 border-red-500/30 text-red-400`;
}

function nextQuestion(): void {
  index.value = (index.value + 1) % quizQuestions.length;
  chosen.value = null;
}
</script>

<template>
  <LabCard
    :icon="Gamepad2"
    icon-class="bg-purple-500/10 text-purple-500"
    title="4. Trivia del Cerebro Trilingüe"
    hint="Responde y comprueba tus conocimientos lingüísticos."
  >
    <div class="mb-4">
      <p class="text-xs font-bold leading-relaxed mb-3 text-slate-800 dark:text-indigo-200">{{ question.question }}</p>
      <div class="space-y-2">
        <button
          v-for="(option, optionIndex) in question.options"
          :key="option.text"
          type="button"
          :disabled="chosen !== null"
          :class="optionClass(optionIndex)"
          @click="chosen = optionIndex"
        >
          {{ option.text }}
        </button>
      </div>
    </div>

    <div v-if="chosen !== null" class="p-3 rounded-xl bg-slate-950/20 border border-white/5 mb-3" aria-live="polite">
      <p class="text-[11px] leading-relaxed text-indigo-300">
        {{ answeredCorrectly ? question.explanation : WRONG_ANSWER_TEXT }}
      </p>
      <button
        type="button"
        class="mt-3 flex items-center gap-1.5 text-[10px] font-black uppercase text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 rounded-lg transition-all"
        @click="nextQuestion"
      >
        <span>Siguiente</span>
        <ArrowRight class="w-3 h-3" />
      </button>
    </div>
  </LabCard>
</template>
