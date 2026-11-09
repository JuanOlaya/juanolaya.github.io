<script setup lang="ts">
import PageSection from '@shared/components/PageSection.vue';
import { Workflow } from 'lucide-vue-next';
import { flowSteps } from '../content';
</script>

<template>
  <PageSection section-class="card" heading-class="card__title">
    <template #icon><Workflow :size="24" aria-hidden="true" /></template>
    <template #title>Flujo de entrega de valor</template>

    <p class="card__caption">
      Cómo encajan las piezas de esta guía: los principios guían a los dominios, cuyo trabajo produce
      entregables que generan valor.
    </p>
    <ol class="flow">
      <li v-for="step in flowSteps" :key="step.id" class="flow__step">
        <span class="flow__title">{{ step.title }}</span>
        <span class="flow__text">{{ step.text }}</span>
      </li>
    </ol>
  </PageSection>
</template>
