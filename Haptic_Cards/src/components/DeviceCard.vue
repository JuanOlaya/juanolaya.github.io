<script setup lang="ts">
import { computed, ref } from 'vue';
import { MECHANISM_ICON } from '../data/patterns';
import type { Device } from '../data/types';
import { researchFocus } from '../versatility';
import Carousel from './Carousel.vue';
import Tabs from './Tabs.vue';
import VersatilityRating from './VersatilityRating.vue';

const props = defineProps<{ device: Device }>();

const infoTabs = [
  { id: 'sensations', label: 'Haptic Sensations' },
  { id: 'research', label: 'Research' },
  { id: 'use-cases', label: 'Use Cases' },
  { id: 'reference', label: 'Reference' },
] as const;

const activeTab = ref<string>('sensations');
const focus = computed(() => researchFocus(props.device));
</script>

<template>
  <article
    tabindex="0"
    class="card-item relative flex flex-col overflow-hidden"
    :data-pattern="device.category"
  >
    <div class="flex flex-col bg-plate px-2.5 pb-2.5">
      <div class="flex items-baseline justify-between gap-3 px-1.5 pt-3 pb-2.5">
        <h2
          class="truncate text-lg leading-snug font-semibold text-[#f3f0e8] [font-stretch:94%]"
          :title="device.name"
        >
          {{ device.name }}
        </h2>
        <span
          class="flex shrink-0 items-center gap-1.5 font-mono text-[10px] tracking-[0.08em] whitespace-nowrap text-[#c9cdc5] uppercase"
        >
          <span class="h-1.5 w-1.5 bg-signal-bright" aria-hidden="true"></span>
          {{ device.category }}
        </span>
      </div>
      <div class="media-frame">
        <Carousel
          :media="device.media"
          :fallback-icon="MECHANISM_ICON"
          :device-name="device.name"
          :category="device.category"
          :mechanism="device.mechanism"
        />
      </div>
    </div>

    <div class="flex grow flex-col p-4">
      <div class="mb-3 space-y-1">
        <div class="flex items-center gap-1.5">
          <svg
            viewBox="0 0 24 24"
            class="h-3.5 w-3.5 text-ink-3"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            role="img"
            :aria-label="device.category"
          >
            <title>{{ device.category }}</title>
            <circle cx="12" cy="12" r="3" />
            <path
              stroke-linecap="round"
              d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1"
            />
          </svg>
          <h3 class="spec-label">Mechanism</h3>
        </div>
        <p class="text-[13px] leading-relaxed text-ink-2">
          {{ device.mechanism || 'Actuation mechanism rendering haptic feedback.' }}
        </p>
      </div>

      <Tabs v-model="activeTab" :tabs="infoTabs" :label="`${device.name} details`" variant="card" />

      <div v-if="activeTab === 'sensations'" class="flex grow flex-col justify-start" role="tabpanel">
        <VersatilityRating :audit="device.audit" />
      </div>

      <div v-else-if="activeTab === 'research'" class="flex grow flex-col justify-start" role="tabpanel">
        <div>
          <div class="mb-2 flex flex-wrap items-center justify-between gap-1">
            <h3 class="spec-label">Research Focus</h3>
            <span
              v-if="device.year"
              class="rounded-[4px] border border-line-strong px-1.5 py-0.5 font-mono text-[11px] font-medium text-ink-2"
              >{{ device.year }}</span
            >
          </div>
          <div class="mb-3 flex flex-wrap gap-1">
            <span v-for="topic in focus" :key="topic" class="tag bg-sunken text-ink">{{ topic }}</span>
          </div>
          <template v-if="device.generalUseCases.length > 0">
            <h3 class="spec-label mb-1.5">Context</h3>
            <div class="mb-1 flex flex-wrap gap-1">
              <span
                v-for="context in device.generalUseCases"
                :key="context"
                class="general-use-case-tag tag"
                >{{ context }}</span
              >
            </div>
          </template>
        </div>
      </div>

      <div v-else-if="activeTab === 'use-cases'" class="flex grow flex-col justify-start" role="tabpanel">
        <div>
          <h3 class="spec-label mb-1.5">Use Cases</h3>
          <div v-if="device.useCaseTags.length > 0" class="mb-2 flex flex-wrap gap-1">
            <span v-for="tag in device.useCaseTags" :key="tag" class="use-case-tag tag">{{ tag }}</span>
          </div>
          <p class="mt-1 text-[13px] leading-relaxed text-ink-2">{{ device.useCaseText }}</p>
        </div>
      </div>

      <div v-else class="flex grow flex-col justify-start" role="tabpanel">
        <div class="border-l-2 border-signal pl-2.5 text-xs leading-relaxed">
          <p class="font-semibold text-ink">{{ device.author || 'Author in Proceedings' }}</p>
          <p class="my-0.5 text-ink-2 italic">"{{ device.title || device.name }}"</p>
          <p class="font-mono text-[11px] text-ink-3">
            {{ device.publication || 'Proceedings' }}, {{ device.year }}
          </p>
          <a
            v-if="device.doi"
            :href="`https://doi.org/${device.doi}`"
            target="_blank"
            rel="noopener noreferrer"
            class="mt-1.5 inline-flex items-center font-semibold text-signal-ink underline-offset-2 hover:underline"
          >
            Paper
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="ml-0.5 h-3 w-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  </article>
</template>
