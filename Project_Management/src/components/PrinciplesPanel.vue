<script setup lang="ts">
import PageSection from '@shared/components/PageSection.vue';
import { Compass } from 'lucide-vue-next';
import { type TopicId, principles } from '../content';

const emit = defineEmits<{ select: [id: TopicId] }>();
</script>

<template>
  <PageSection section-class="card" heading-class="card__title">
    <template #icon><Compass :size="24" aria-hidden="true" /></template>
    <template #title>12 Project Management Principles</template>

    <p class="card__caption">12 Principios (Mentalidad) — Brújula moral del proyecto.</p>
    <div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
      <button
        v-for="principle in principles"
        :key="principle.id"
        type="button"
        class="topic-button tone-info"
        @click="emit('select', principle.id)"
      >
        <span class="topic-button__label">{{ principle.label }}</span>
        <span class="topic-button__sub">{{ principle.translation }}</span>
      </button>
    </div>
  </PageSection>
</template>
