<script setup lang="ts">
defineProps<{ headingClass?: string; sectionClass?: string; id?: string }>();
</script>

<template>
  <section :id="id" :class="sectionClass">
    <h2 :class="headingClass">
      <slot name="icon" />
      <slot name="title" />
    </h2>
    <slot />
  </section>
</template>
