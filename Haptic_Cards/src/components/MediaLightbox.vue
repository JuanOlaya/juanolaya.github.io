<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted } from 'vue';
import type { DeviceMedia } from '../data/types';
import { mediaKind, youTubeEmbedUrl } from '../media';

const props = defineProps<{
  media: readonly DeviceMedia[];
  deviceName?: string;
  category?: string;
  mechanism?: string;
}>();

const emit = defineEmits<{ close: [] }>();
const index = defineModel<number>({ required: true });

const current = computed(() => props.media[index.value]);
const kind = computed(() => (current.value ? mediaKind(current.value) : 'none'));
const captionText = computed(() => current.value?.caption || props.mechanism || '');

function step(delta: number): void {
  const count = props.media.length;
  if (count > 0) index.value = (index.value + delta + count) % count;
}

function onKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape') {
    event.stopImmediatePropagation();
    emit('close');
  } else if (event.key === 'ArrowRight') {
    event.stopImmediatePropagation();
    step(1);
  } else if (event.key === 'ArrowLeft') {
    event.stopImmediatePropagation();
    step(-1);
  }
}

onMounted(() => window.addEventListener('keydown', onKeydown, { capture: true }));
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown, { capture: true }));
</script>

<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0d0c]/85 p-3 backdrop-blur-xs sm:p-6"
      @click.self="emit('close')"
    >
      <div
        class="relative flex max-h-[94vh] w-[95vw] max-w-[1440px] flex-col overflow-hidden rounded-panel border border-line-strong bg-plate text-[#f3f0e8] shadow-2xl"
        role="dialog"
        aria-modal="true"
        :aria-label="`${deviceName ?? 'Controller'} media viewer`"
      >
        <div class="h-1 shrink-0 bg-signal-bright" aria-hidden="true"></div>

        <div
          class="flex shrink-0 items-center justify-between gap-3 border-b border-plate-line px-4 py-3 sm:px-5"
        >
          <div class="flex min-w-0 items-baseline gap-3">
            <h2 class="truncate text-lg font-semibold text-[#f3f0e8] sm:text-xl">
              {{ deviceName ?? 'Haptic Controller' }}
            </h2>
            <span
              v-if="category"
              class="hidden items-center gap-1.5 font-mono text-[11px] tracking-[0.08em] text-[#c9cdc5] uppercase sm:inline-flex"
            >
              <span class="h-1.5 w-1.5 bg-signal-bright" aria-hidden="true"></span>
              {{ category }}
            </span>
          </div>

          <div class="flex shrink-0 items-center gap-2.5">
            <span v-if="media.length > 1" class="font-mono text-xs text-[#c9cdc5] tabular-nums">
              {{ index + 1 }} / {{ media.length }}
            </span>
            <button
              type="button"
              class="keycap flex h-9 w-9 items-center justify-center"
              aria-label="Close expanded media view"
              title="Close (Esc)"
              @click="emit('close')"
            >
              <svg
                viewBox="0 0 24 24"
                class="h-4 w-4"
                fill="none"
                stroke="currentColor"
                stroke-width="2.25"
                aria-hidden="true"
              >
                <path stroke-linecap="round" d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>
          </div>
        </div>

        <div
          class="relative flex min-h-[280px] grow items-center justify-center overflow-hidden bg-[#0a0d0c] p-2 sm:p-4"
        >
          <iframe
            v-if="kind === 'youtube'"
            :src="youTubeEmbedUrl(current!.src)"
            :title="`${deviceName ?? 'Controller'} demo video`"
            class="aspect-video max-h-[76vh] w-full max-w-6xl rounded-[6px] border border-plate-line bg-black"
            allow="autoplay; encrypted-media; fullscreen"
            allowfullscreen
          ></iframe>
          <video
            v-else-if="kind === 'video'"
            :src="current!.src"
            class="max-h-[76vh] w-auto max-w-full rounded-[6px] bg-black object-contain"
            autoplay
            loop
            controls
            playsinline
          ></video>
          <img
            v-else-if="current"
            :src="current.src"
            :alt="current.caption ?? deviceName ?? 'Haptic Controller'"
            class="max-h-[76vh] w-auto max-w-full rounded-[6px] object-contain select-none"
          />

          <template v-if="media.length > 1">
            <button
              type="button"
              class="gallery-nav-btn gallery-prev-btn !h-10 !w-10 !opacity-95"
              aria-label="Previous media"
              @click="step(-1)"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="2.5"
                aria-hidden="true"
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
              </svg>
            </button>
            <button
              type="button"
              class="gallery-nav-btn gallery-next-btn !h-10 !w-10 !opacity-95"
              aria-label="Next media"
              @click="step(1)"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="2.5"
                aria-hidden="true"
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </template>
        </div>

        <div
          class="flex shrink-0 flex-col items-center justify-between gap-2 border-t border-plate-line bg-plate px-4 py-2.5 sm:flex-row sm:px-5"
        >
          <p v-if="captionText" class="text-xs leading-relaxed text-[#c9cdc5]">
            {{ captionText }}
          </p>
          <div v-if="media.length > 1" class="flex shrink-0 items-center gap-1.5">
            <button
              v-for="(_, dot) in media"
              :key="dot"
              type="button"
              class="flex h-6 items-center px-1"
              :aria-label="`Go to media ${dot + 1}`"
              @click="index = dot"
            >
              <span
                class="block h-1 rounded-[1px] transition-all duration-200"
                :class="dot === index ? 'w-6 bg-signal-bright' : 'w-3 bg-white/40 hover:bg-white/75'"
              ></span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
