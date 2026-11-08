<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { demonstrativeCases } from '../demonstratives/cases.ts';
import { FAELLE } from '../demonstratives/types.ts';
</script>

<template>
  <section class="mx-auto max-w-3xl">
    <h1 class="mb-2 text-3xl font-bold text-gray-800">MemoDeutsch</h1>
    <p class="mb-6 text-gray-600">
      Páginas que ya forman parte de la nueva app. El resto sigue en el
      <a href="../" class="text-indigo-700 underline">índice de MemoDeutsch</a>.
    </p>
    <ul class="space-y-2">
      <li>
        <RouterLink :to="{ name: 'demonstratives' }" class="text-indigo-700 underline">
          Demonstrativpronomen – alle Fälle
        </RouterLink>
        <ul class="mt-1 ml-6 list-disc text-sm">
          <li v-for="fall in FAELLE" :key="fall">
            <RouterLink :to="{ name: 'demonstrative', params: { fall } }" class="text-indigo-700 underline">
              {{ demonstrativeCases[fall].label }}
            </RouterLink>
          </li>
        </ul>
      </li>
    </ul>
  </section>
</template>
