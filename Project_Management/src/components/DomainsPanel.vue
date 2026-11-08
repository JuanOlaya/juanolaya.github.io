<script setup lang="ts">
import PageSection from '@shared/components/PageSection.vue';
import { type DomainAccent, type TopicId, domains } from '../content';

const emit = defineEmits<{ select: [id: TopicId] }>();

const accentStyles: Record<DomainAccent, { button: string; label: string; summary: string }> = {
  emerald: { button: 'border-emerald-400', label: '', summary: '' },
  amber: { button: 'border-amber-400', label: 'text-amber-200', summary: 'text-amber-50' },
  delivery: {
    button: 'border-emerald-500 bg-emerald-900/30',
    label: 'text-emerald-200',
    summary: 'text-emerald-100',
  },
};
</script>

<template>
  <PageSection
    section-class="gradient-domains p-6 rounded-2xl text-white shadow-lg"
    heading-class="text-2xl font-bold mb-2 flex items-center"
  >
    <template #icon>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6 mr-2"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    </template>
    <template #title>8 Project Performance Domains</template>

    <p class="text-emerald-100 text-xs mb-6 italic">
      8 Dominios: El Cuerpo Técnico — Estrategia de ejecución.
    </p>
    <div class="grid grid-cols-1 gap-2">
      <button
        v-for="domain in domains"
        :key="domain.id"
        type="button"
        :class="[
          'bg-white/10 p-2 rounded border-l-4 text-left hover:bg-white/20 transition w-full',
          accentStyles[domain.accent].button,
        ]"
        @click="emit('select', domain.id)"
      >
        <span :class="['font-bold text-xs uppercase tracking-wide block', accentStyles[domain.accent].label]">
          {{ domain.label }}
        </span>
        <span
          :class="['text-[10px] block font-semibold opacity-90 italic', accentStyles[domain.accent].summary]"
        >
          {{ domain.summary }}
        </span>
      </button>
    </div>
  </PageSection>
</template>
