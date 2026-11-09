<script setup lang="ts">
import type { HighlightedExample } from '../demonstratives/cases.ts';

/** Example sentence whose translation shows on hover, focus or tap (the only option on touch screens). */
defineProps<{ example: HighlightedExample; translation: string; open: boolean }>();
defineEmits<{ toggle: [] }>();
</script>

<template>
  <button
    type="button"
    class="study-cell mt-1 flex min-h-11 w-full flex-col items-start justify-center text-left"
    :class="{ open }"
    :aria-expanded="open"
    @click="$emit('toggle')"
  >
    <span class="text-sm leading-tight text-ink">
      {{ example.before }}<b>{{ example.match }}</b
      >{{ example.after }}
    </span>
    <span class="translation text-sm text-ink-2 italic">{{ translation }}</span>
  </button>
</template>

<style scoped>
.translation {
  max-height: 0;
  overflow: hidden;
  opacity: 0;
  transition:
    max-height 0.3s ease-out,
    opacity 0.3s ease-out;
}

.study-cell:hover .translation,
.study-cell:focus-visible .translation,
.study-cell.open .translation {
  max-height: 10rem;
  opacity: 1;
}
</style>
