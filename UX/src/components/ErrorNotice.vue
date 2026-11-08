<script setup lang="ts">
// Replaces the original `alert()` calls: an inline message does not block the page.
defineProps<{ message: string }>();
</script>

<template>
  <p
    v-if="message"
    role="alert"
    class="text-xs text-rose-300 bg-rose-950/40 border border-rose-900 rounded-xl p-3"
  >
    {{ message }}
  </p>
</template>
