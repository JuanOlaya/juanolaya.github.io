<script setup lang="ts">
import PageSection from '@shared/components/PageSection.vue';
import type { Component } from 'vue';

/** The numbered section style of this infographic: coloured icon tile + title. */
withDefaults(defineProps<{ icon: Component; iconClass: string; centered?: boolean; spacing?: string }>(), {
  centered: false,
  spacing: 'mb-8',
});
</script>

<template>
  <PageSection
    :section-class="centered ? 'text-center' : undefined"
    :heading-class="[
      'text-2xl font-bold flex items-center gap-3 text-slate-900 dark:text-white',
      spacing,
      centered ? 'justify-center' : '',
    ].join(' ')"
  >
    <template #icon>
      <div :class="['p-2 rounded-lg text-white flex items-center justify-center', iconClass]">
        <component :is="icon" class="w-6 h-6" />
      </div>
    </template>
    <template #title><slot name="title" /></template>
    <slot />
  </PageSection>
</template>
