<script setup lang="ts">
import PageSection from '@shared/components/PageSection.vue';
import { ClipboardList } from 'lucide-vue-next';
import { type TopicId, guideCards } from '../content';

const emit = defineEmits<{ select: [id: TopicId] }>();
</script>

<template>
  <PageSection section-class="card" heading-class="card__title">
    <template #icon><ClipboardList :size="24" aria-hidden="true" /></template>
    <template #title>Guía rápida: qué poner en tu documento de propuesta</template>

    <div class="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
      <button
        v-for="card in guideCards"
        :key="card.id"
        type="button"
        :class="['topic-button', `tone-${card.tone}`]"
        @click="emit('select', card.id)"
      >
        <span class="topic-button__label">{{ card.title }}</span>
        <span class="topic-button__sub">{{ card.description }}</span>
      </button>
    </div>
  </PageSection>
</template>
