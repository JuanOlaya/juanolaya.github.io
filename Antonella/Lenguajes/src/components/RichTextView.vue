<script setup lang="ts">
import type { RichText } from '../content';

defineProps<{ text: RichText; strongClass?: string }>();
</script>

<template>
  <template v-for="(part, index) in text" :key="index">
    <template v-if="typeof part === 'string'">{{ part }}</template>
    <strong v-else :class="strongClass">{{ part.strong }}</strong>
  </template>
</template>
