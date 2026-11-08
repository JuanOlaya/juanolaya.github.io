<script setup lang="ts">
import InfoCard from '@shared/components/InfoCard.vue';
import type { Component } from 'vue';

/** Card frame shared by the four simulation tools: tinted icon, title and hint. */
defineProps<{ icon: Component; iconClass: string; title: string; hint: string }>();
</script>

<template>
  <InfoCard
    class="p-6 rounded-3xl border transition-theme bg-white border-slate-200 shadow-lg dark:bg-slate-900 dark:border-white/5"
  >
    <div class="flex items-center gap-3 mb-4">
      <div :class="['p-2 rounded-xl', iconClass]">
        <component :is="icon" class="w-5 h-5" />
      </div>
      <div>
        <h3 class="font-black text-base text-slate-900 dark:text-white">{{ title }}</h3>
        <p class="text-xs text-slate-400">{{ hint }}</p>
      </div>
    </div>
    <slot />
  </InfoCard>
</template>
