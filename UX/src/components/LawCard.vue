<script setup lang="ts">
import { PANEL } from '../ui';

defineProps<{ title: string; href: string }>();
</script>

<template>
  <div :class="`${PANEL} hover:border-[rgba(243,228,206,0.6)] motion-safe:transition-colors`">
    <div class="flex items-start justify-between gap-3">
      <h4 class="flex items-center gap-1 text-caption font-medium text-ink uppercase">
        {{ title }}
        <slot name="badge" />
      </h4>
      <a
        :href="href"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex min-h-11 shrink-0 items-center text-caption whitespace-nowrap text-link"
        >Leer ley ↗</a
      >
    </div>
    <p class="mt-1.5 text-[0.92em] text-ink-2">
      <slot />
    </p>
  </div>
</template>
