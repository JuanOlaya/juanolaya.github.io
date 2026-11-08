<script setup lang="ts">
import p5 from 'p5';
import { onMounted, onUnmounted, useTemplateRef } from 'vue';
import { createBouncingBalls } from '../sketch/bouncingBalls.ts';

const host = useTemplateRef<HTMLDivElement>('host');
const balls = createBouncingBalls();
let instance: p5 | undefined;

onMounted(() => {
  if (host.value) instance = new p5(balls.sketch, host.value);
});
onUnmounted(() => instance?.remove());

defineExpose({ refresh: balls.refresh });
</script>

<template>
  <div ref="host"></div>
</template>
