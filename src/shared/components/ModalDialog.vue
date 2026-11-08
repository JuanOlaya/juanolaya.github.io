<script setup lang="ts">
import { onBeforeUnmount, watch } from 'vue';

const props = defineProps<{
  open: boolean;
  labelledBy: string;
  overlayClass?: string;
  panelClass?: string;
}>();
const emit = defineEmits<{ close: [] }>();

function onKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape') emit('close');
}

// The page behind the dialog must not scroll while it is open.
function lockPage(locked: boolean): void {
  document.body.style.overflow = locked ? 'hidden' : '';
  if (locked) document.addEventListener('keydown', onKeydown);
  else document.removeEventListener('keydown', onKeydown);
}

watch(() => props.open, lockPage, { immediate: true });
onBeforeUnmount(() => lockPage(false));
</script>

<template>
  <Teleport to="body">
    <div v-if="open" :class="overlayClass" @click.self="emit('close')">
      <div role="dialog" aria-modal="true" :aria-labelledby="labelledBy" :class="panelClass">
        <slot />
      </div>
    </div>
  </Teleport>
</template>
