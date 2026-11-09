<script setup lang="ts">
defineProps<{ formulas: readonly string[] }>();

const indicators = [
  {
    code: 'KPI',
    name: 'Key Performance Indicator',
    text: 'Indicador Clave de Desempeño: métrica cuantificable del progreso hacia los objetivos.',
    tone: 'tone-info',
  },
  {
    code: 'SPI',
    name: 'Schedule Performance Index',
    text: 'Índice de desempeño del cronograma. Mayor que 1 indica adelanto.',
    tone: 'tone-accent',
  },
  {
    code: 'CPI',
    name: 'Cost Performance Index',
    text: 'Índice de desempeño del costo. Mayor que 1 indica que se gasta menos de lo planificado.',
    tone: 'tone-success',
  },
];
</script>

<template>
  <div class="grid gap-3 sm:grid-cols-3">
    <div v-for="indicator in indicators" :key="indicator.code" :class="['lead-box', indicator.tone]">
      <p class="tone-text m-0 font-medium">{{ indicator.code }}</p>
      <p class="text-ink-2 m-0 text-[13px]">{{ indicator.name }}</p>
      <p class="m-0 mt-1 text-[0.92em] font-light">{{ indicator.text }}</p>
    </div>
  </div>

  <div class="rounded-card border border-border p-4">
    <h3 class="mb-2 text-[1em]">Fórmulas y tipos</h3>
    <ul class="infographic-list">
      <li v-for="formula in formulas" :key="formula">{{ formula }}</li>
    </ul>
  </div>
</template>
