<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
</script>

<template>
  <header class="mx-auto mb-6 flex max-w-7xl items-center gap-4 text-sm">
    <a href="../" class="text-indigo-700 underline">← MemoDeutsch</a>
    <RouterLink :to="{ name: 'home' }" class="text-indigo-700 underline">App</RouterLink>
  </header>
  <main>
    <RouterView />
  </main>
</template>
