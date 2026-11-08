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
    <button
      v-show="!gridVisible"
      id="fullscreenIcon"
      type="button"
      aria-label="Toggle fullscreen"
      class="home-control material-icons-round span_no_selection"
      @click="toggleFullscreen"
    >
      <span aria-hidden="true">fullscreen</span>
    </button>
    <button
      v-show="!gridVisible"
      id="gridOnIcon"
      type="button"
      aria-label="Show projects"
      class="home-control material-icons-round span_no_selection"
      @click="emit('show-grid')"
    >
      <span aria-hidden="true">grid_on</span>
    </button>
    <button
      v-show="!gridVisible"
      id="refreshIcon"
      type="button"
      aria-label="Restart animation"
      class="home-control material-icons-outlined span_no_selection"
      @click="emit('refresh')"
    >
      <span aria-hidden="true">refresh</span>
    </button>
  </footer>
</template>
