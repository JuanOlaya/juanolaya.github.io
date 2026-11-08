<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { mediaKind, youTubeEmbedUrl } from '../media';
import type { DeviceMedia } from '../data/types';

const props = defineProps<{ media: readonly DeviceMedia[]; fallbackIcon: string }>();

const index = ref(0);
const failed = ref(new Set<string>());
const current = computed(() => props.media[index.value]);
const kind = computed(() => (current.value ? mediaKind(current.value) : 'none'));
const showFallback = computed(() => !current.value || failed.value.has(current.value.src));

watch(
  () => props.media,
  () => (index.value = 0),
);

function step(delta: number): void {
  const count = props.media.length;
  if (count > 0) index.value = (index.value + delta + count) % count;
}

function markFailed(src: string): void {
  failed.value = new Set(failed.value).add(src);
}
</script>

<template>
  <div class="gallery-container relative bg-plate">
    <div
      v-if="showFallback"
      class="flex h-44 w-full flex-col items-center justify-center bg-sunken text-ink"
      data-testid="media-fallback"
    >
      <span class="mb-1 text-3xl" aria-hidden="true">{{ fallbackIcon }}</span>
      <span class="spec-label">Active Haptic Controller</span>
    </div>
    <iframe
      v-else-if="kind === 'youtube'"
      :src="youTubeEmbedUrl(current!.src)"
      title="Controller demo video"
      class="h-44 w-full border-0"
      allow="autoplay; encrypted-media"
      allowfullscreen
    ></iframe>
    <video
      v-else-if="kind === 'video'"
      :src="current!.src"
      class="h-44 w-full bg-black object-cover"
      autoplay
      loop
      muted
      playsinline
      controls
    ></video>
    <div v-else class="group relative h-44 w-full overflow-hidden bg-sunken">
      <img
        :src="current!.src"
        :alt="current!.caption ?? 'Haptic Controller'"
        width="400"
        height="176"
        loading="lazy"
        decoding="async"
        class="h-44 w-full object-cover transition-all duration-500 ease-out group-hover:scale-105"
        :class="{ 'contrast-[1.08] brightness-[0.98] grayscale group-hover:grayscale-0': index === 0 }"
        @error="markFailed(current!.src)"
      />
    </div>

    <button
      type="button"
      class="gallery-nav-btn gallery-prev-btn"
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
    <button type="button" class="gallery-nav-btn gallery-next-btn" aria-label="Next media" @click="step(1)">
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
    <div class="gallery-dots">
      <template v-if="media.length > 1">
        <span
          v-for="(_, dot) in media"
          :key="dot"
          class="gallery-dot"
          :class="{ active: dot === index }"
        ></span>
      </template>
    </div>
  </div>
</template>
