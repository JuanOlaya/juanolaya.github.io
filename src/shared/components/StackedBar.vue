<script setup lang="ts" generic="S extends BarSegment">
import type { BarSegment } from './stacked-bar';

/** Horizontal 100% stacked bar: the infographics' "charts" are CSS bars, so no chart library is needed. */
defineProps<{ segments: readonly S[]; trackClass?: string; title: string }>();
</script>

<template>
  <div
    role="img"
    :aria-label="`${title}: ${segments.map((s) => `${s.label} ${s.percent}%`).join(', ')}`"
    :class="trackClass"
  >
    <div
      v-for="segment in segments"
      :key="segment.label"
      :class="segment.class"
      :style="{ width: `${segment.percent}%` }"
    >
      <slot :segment="segment">{{ segment.label }} ({{ segment.percent }}%)</slot>
    </div>
  </div>
</template>
