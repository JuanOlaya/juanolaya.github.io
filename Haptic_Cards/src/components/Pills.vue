<script setup lang="ts">
import type { PatternName } from '../data/types';

export interface PillItem {
  pattern: PatternName;
  count: number;
}

defineProps<{ pills: readonly PillItem[]; active: PatternName; compact: boolean }>();
defineEmits<{ select: [pattern: PatternName] }>();
</script>

<template>
  <div class="flex flex-wrap" :class="compact ? 'gap-1.5' : 'items-center gap-2'">
    <button
      v-for="pill in pills"
      :key="pill.pattern"
      type="button"
      :aria-pressed="pill.pattern === active"
      class="keycap flex min-h-9 items-center gap-1.5 text-xs font-medium select-none"
      :class="compact ? 'px-2.5' : 'px-3.5'"
      @click="$emit('select', pill.pattern)"
    >
      <span>{{ pill.pattern }}</span>
      <span class="font-mono text-[10px]" :class="pill.pattern === active ? '' : 'text-ink-3'"
        >({{ pill.count }})</span
      >
    </button>
  </div>
</template>
