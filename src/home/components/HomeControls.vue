<script setup lang="ts">
defineProps<{ gridVisible: boolean }>();
const emit = defineEmits<{ 'show-grid': []; refresh: [] }>();

// Safari only exposes the prefixed method.
type PrefixedElement = HTMLElement & { webkitRequestFullscreen?: () => void };

function toggleFullscreen(): void {
  if (document.fullscreenElement) {
    void document.exitFullscreen();
    return;
  }
  const root: PrefixedElement = document.documentElement;
  if (root.requestFullscreen) void root.requestFullscreen();
  else root.webkitRequestFullscreen?.();
}
</script>

<!-- The controls only appear while the cards are hidden. -->
<template>
  <footer>
    <span
      v-show="!gridVisible"
      id="fullscreenIcon"
      class="material-icons-round span_no_selection"
      @click="toggleFullscreen"
      >fullscreen</span
    >
    <span
      v-show="!gridVisible"
      id="gridOnIcon"
      class="material-icons-round span_no_selection"
      @click="emit('show-grid')"
      >grid_on</span
    >
    <span
      v-show="!gridVisible"
      id="refreshIcon"
      class="material-icons-outlined span_no_selection"
      @click="emit('refresh')"
      >refresh</span
    >
  </footer>
</template>
