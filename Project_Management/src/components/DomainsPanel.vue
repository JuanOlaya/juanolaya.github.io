<script setup lang="ts">
import PageSection from '@shared/components/PageSection.vue';
import { LayoutGrid } from 'lucide-vue-next';
import { type DomainAccent, type TopicId, domains } from '../content';

const emit = defineEmits<{ select: [id: TopicId] }>();

// Planning-related domains take the orange accent; Delivery is the highlighted one of the green group.
const accentClass: Record<DomainAccent, string> = {
  default: 'tone-success',
  planning: 'tone-accent',
  delivery: 'tone-success topic-button--highlight',
};
</script>

<template>
  <PageSection section-class="card" heading-class="card__title">
    <template #icon><LayoutGrid :size="24" aria-hidden="true" /></template>
    <template #title>8 Project Performance Domains</template>

    <p class="card__caption">8 Dominios: El Cuerpo Técnico — Estrategia de ejecución.</p>
    <div class="grid grid-cols-1 gap-2">
      <button
        v-for="domain in domains"
        :key="domain.id"
        type="button"
        :class="['topic-button', accentClass[domain.accent]]"
        @click="emit('select', domain.id)"
      >
        <span class="topic-button__label">{{ domain.label }}</span>
        <span class="topic-button__sub">{{ domain.summary }}</span>
      </button>
    </div>
  </PageSection>
</template>
