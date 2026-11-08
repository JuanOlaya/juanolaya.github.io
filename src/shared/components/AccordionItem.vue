<script setup lang="ts">
const open = defineModel<boolean>('open', { default: false });
defineProps<{ buttonClass?: string; panelClass?: string }>();
const panelId = `accordion-${Math.random().toString(36).slice(2, 8)}`;
</script>

<template>
  <div>
    <button
      type="button"
      :class="buttonClass"
      :aria-expanded="open"
      :aria-controls="panelId"
      @click="open = !open"
    >
      <slot name="header" :open="open" />
    </button>
    <div v-show="open" :id="panelId" :class="panelClass">
      <slot />
    </div>
  </div>
</template>
