<script setup lang="ts">
// Replaces the original `alert()` calls: an inline message does not block the page.
defineProps<{ message: string }>();
</script>

<template>
  <p
    v-if="message"
    role="alert"
    class="rounded-card border border-danger/40 bg-bg p-3 text-[0.92em] text-danger"
  >
    {{ message }}
  </p>
</template>
