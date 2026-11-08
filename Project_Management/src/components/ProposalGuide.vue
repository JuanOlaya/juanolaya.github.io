<script setup lang="ts">
import PageSection from '@shared/components/PageSection.vue';
import { type TopicId, guideCards } from '../content';

const emit = defineEmits<{ select: [id: TopicId] }>();
</script>

<template>
  <PageSection
    section-class="mt-8 mb-10 bg-white p-8 rounded-3xl shadow-lg border border-slate-200"
    heading-class="text-2xl font-bold text-slate-800 mb-6 flex items-center"
  >
    <template #icon>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6 mr-2 text-amber-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
        />
      </svg>
    </template>
    <template #title>Guía rápida: Qué poner en tu documento de Propuesta</template>

    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <button
        v-for="card in guideCards"
        :key="card.id"
        type="button"
        :class="[
          'p-4 bg-slate-50 rounded-xl border-l-4 shadow-sm text-left transition card-hover',
          card.cardClass,
        ]"
        @click="emit('select', card.id)"
      >
        <h4 :class="['font-bold mb-1 text-xs text-center uppercase', card.titleClass]">{{ card.title }}</h4>
        <p class="text-[10px] text-slate-600">{{ card.description }}</p>
      </button>
    </div>
  </PageSection>
</template>
