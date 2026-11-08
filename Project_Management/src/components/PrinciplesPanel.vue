<script setup lang="ts">
import PageSection from '@shared/components/PageSection.vue';
import { type TopicId, principles } from '../content';

const emit = defineEmits<{ select: [id: TopicId] }>();
</script>

<template>
  <PageSection
    section-class="gradient-principles p-6 rounded-2xl text-white shadow-lg"
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
          d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-5.19 4.595-9.362 9.716-10.178"
        />
      </svg>
    </template>
    <template #title>12 Project Management Principles</template>

    <p class="text-indigo-100 text-xs mb-6 italic">
      12 Principios (Mentalidad) — Brújula moral del proyecto.
    </p>
    <div class="grid grid-cols-2 gap-3">
      <button
        v-for="principle in principles"
        :key="principle.id"
        type="button"
        class="bg-white/10 p-3 rounded-xl border border-white/20 text-left hover:bg-white/20 transition group"
        @click="emit('select', principle.id)"
      >
        <div class="font-bold text-xs uppercase tracking-wide">{{ principle.label }}</div>
        <div class="text-[11px] opacity-80">{{ principle.translation }}</div>
      </button>
    </div>
  </PageSection>
</template>
