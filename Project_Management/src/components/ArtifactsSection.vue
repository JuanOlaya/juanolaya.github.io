<script setup lang="ts">
import PageSection from '@shared/components/PageSection.vue';
import {
  ChartArea,
  ChartColumn,
  ChartGantt,
  ChartLine,
  Fish,
  Flame,
  Gem,
  Kanban,
  ListChecks,
  Map,
  Monitor,
  Network,
  Ruler,
  ScrollText,
  Search,
  TrendingDown,
} from 'lucide-vue-next';
import type { Component } from 'vue';
import { type ArtifactIcon, artifactColumns } from '../content';

const icons: Record<ArtifactIcon, Component> = {
  kanban: Kanban,
  gantt: ChartGantt,
  burndown: TrendingDown,
  's-curve': ChartLine,
  cfd: ChartArea,
  traceability: ListChecks,
  backlog: ScrollText,
  wbs: Network,
  baseline: Ruler,
  pareto: Search,
  roadmap: Map,
  heatmap: Flame,
  dashboard: Monitor,
  vsm: Gem,
  ishikawa: Fish,
};
</script>

<template>
  <PageSection section-class="card" heading-class="card__title">
    <template #icon><ChartColumn :size="24" aria-hidden="true" /></template>
    <template #title>Artefactos y visualizaciones habituales</template>

    <div class="grid grid-cols-1 gap-3 md:grid-cols-3">
      <div
        v-for="column in artifactColumns"
        :key="column.title"
        class="rounded-card border border-border p-4"
      >
        <h3 class="mb-3 border-b border-border pb-2 text-[1em]">{{ column.title }}</h3>
        <ul class="m-0 grid list-none gap-2 p-0 text-[0.92em]">
          <li v-for="item in column.items" :key="item.label" class="flex items-center gap-2">
            <component :is="icons[item.icon]" :size="20" class="text-ink-2 flex-none" aria-hidden="true" />
            {{ item.label }}
          </li>
        </ul>
      </div>
    </div>
  </PageSection>
</template>
