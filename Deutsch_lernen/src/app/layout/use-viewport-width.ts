import { onMounted, onUnmounted, ref, type Ref } from 'vue';

/** The viewport width, kept current on resize. Infinite outside a browser so the full table renders. */
export function useViewportWidth(): Ref<number> {
  const width = ref(typeof window === 'undefined' ? Number.POSITIVE_INFINITY : window.innerWidth);
  const update = () => {
    width.value = window.innerWidth;
  };
  onMounted(() => window.addEventListener('resize', update));
  onUnmounted(() => window.removeEventListener('resize', update));
  return width;
}
