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
      class="flex items-center gap-1.5 rounded-full border py-1.5 text-xs font-medium transition-all duration-150 select-none"
      :class="[
        compact ? 'px-3' : 'px-3.5 shadow-xs',
        pill.pattern === active
          ? 'scale-105 border-[#fd5321] bg-[#fd5321] font-bold text-white shadow-md'
          : 'border-[#001011]/15 bg-white text-[#001011] hover:border-[#fd5321] hover:bg-[#FEFAF6]',
      ]"
      @click="$emit('select', pill.pattern)"
    >
      <span>{{ pill.pattern }}</span>
      <span
        :class="[
          compact ? 'text-[10px]' : 'text-[10.5px]',
          pill.pattern === active ? 'font-bold text-white' : 'font-semibold text-[#001011]/60',
        ]"
        >({{ pill.count }})</span
      >
    </button>
  </div>
</template>
