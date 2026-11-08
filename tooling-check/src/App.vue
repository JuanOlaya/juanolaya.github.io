<script setup lang="ts">
import type p5 from 'p5';
import { onBeforeUnmount, onMounted, ref, useTemplateRef } from 'vue';
import { mountSketch } from './sketch';

const sketchHost = useTemplateRef<HTMLDivElement>('sketchHost');
const clicks = ref(0);
let sketch: p5 | undefined;

onMounted(() => {
  if (sketchHost.value) sketch = mountSketch(sketchHost.value);
});
onBeforeUnmount(() => sketch?.remove());
</script>

<template>
  <main class="flex min-h-screen items-center justify-center bg-slate-100 p-6 font-sans">
    <section class="w-full max-w-md space-y-4 rounded-2xl bg-white p-6 shadow-lg">
      <h1 class="text-2xl font-bold text-slate-900">Tooling check</h1>
      <p class="text-slate-600">Vue 3, Tailwind (compiled at build time) and p5 from npm.</p>
      <div ref="sketchHost" class="overflow-hidden rounded-lg"></div>
      <button
        type="button"
        class="rounded-lg bg-sky-600 px-4 py-2 font-medium text-white hover:bg-sky-700"
        @click="clicks++"
      >
        Clicked {{ clicks }} times
      </button>
    </section>
  </main>
</template>
