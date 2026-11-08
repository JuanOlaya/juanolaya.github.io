<script setup lang="ts">
import InfoCard from '@shared/components/InfoCard.vue';
import PageSection from '@shared/components/PageSection.vue';
import { artifactColumns } from '../content';
</script>

<template>
  <PageSection
    section-class="gradient-artifacts p-8 rounded-3xl text-white shadow-xl mb-10 card-hover"
    heading-class="text-3xl font-extrabold mb-4 flex items-center"
  >
    <template #icon>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-8 w-8 mr-3"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
        />
      </svg>
    </template>
    <template #title>Commonly Used Artifacts &amp; Visualizations</template>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <InfoCard v-for="column in artifactColumns" :key="column.title" class="bg-black/20 p-4 rounded-xl">
        <h3 class="font-bold border-b border-white/20 pb-2 mb-3">{{ column.title }}</h3>
        <ul class="text-xs space-y-2">
          <li v-for="item in column.items" :key="item.label" class="flex items-center">
            <span class="mr-2" aria-hidden="true">{{ item.icon }}</span> {{ item.label }}
          </li>
        </ul>
      </InfoCard>
    </div>
  </PageSection>
</template>
