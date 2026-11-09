<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { demonstrativeCases } from '../demonstratives/cases.ts';
import { FAELLE } from '../demonstratives/types.ts';
</script>

<template>
  <section class="mx-auto max-w-3xl">
    <h1 class="mb-2 text-[clamp(26px,1.4rem+1vw,36px)] leading-[1.1] font-medium text-ink">MemoDeutsch</h1>
    <p class="mb-6 text-ink-2">
      Páginas que ya forman parte de la nueva app. El resto sigue en el
      <a href="../">índice de MemoDeutsch</a>.
    </p>
    <ul class="flex flex-col gap-1">
      <li>
        <RouterLink :to="{ name: 'demonstratives' }" class="inline-flex min-h-11 items-center">
          Demonstrativpronomen – alle Fälle
        </RouterLink>
        <ul class="ml-6 flex list-disc flex-col gap-1">
          <li v-for="fall in FAELLE" :key="fall">
            <RouterLink
              :to="{ name: 'demonstrative', params: { fall } }"
              class="inline-flex min-h-11 items-center"
            >
              {{ demonstrativeCases[fall].label }}
            </RouterLink>
          </li>
        </ul>
      </li>
    </ul>
  </section>
</template>
