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
  { id: 'versatility', label: 'Haptic Versatility' },
  { id: 'research', label: 'Research' },
  { id: 'use-cases', label: 'Use Cases' },
] as const;

const activeTab = ref<string>('versatility');
const referenceOpen = ref(false);
const focus = computed(() => researchFocus(props.device));
const hasReference = computed(() =>
  Boolean(props.device.doi || props.device.publication || props.device.year),
);
</script>

<template>
  <article
    class="card-item relative flex flex-col overflow-hidden rounded-2xl border border-[#001011]/10 bg-[#ECEDE8] shadow-xs transition-all duration-300 ease-in-out hover:shadow-lg"
    :data-pattern="device.category"
  >
    <div class="flex flex-col border-b border-black bg-[#001011]">
      <div class="flex items-center justify-between gap-2 px-4 pt-3.5 pb-3">
        <h2 class="truncate text-base leading-snug font-bold text-white sm:text-lg" :title="device.name">
          {{ device.name }}
        </h2>
        <span
          class="shrink-0 rounded-full border border-white/20 bg-white/15 px-2.5 py-0.5 text-right text-[10px] font-medium tracking-wider whitespace-nowrap text-white/95 uppercase shadow-xs"
        >
          {{ device.category }}
        </span>
      </div>
      <Carousel :media="device.media" :fallback-icon="MECHANISM_ICON" />
    </div>

    <div class="flex grow flex-col justify-between p-4">
      <div>
        <Tabs v-model="activeTab" :tabs="infoTabs" :label="`${device.name} details`" variant="card" />

        <div v-if="activeTab === 'versatility'" class="flex grow flex-col justify-start" role="tabpanel">
          <VersatilityRating :audit="device.audit" />
          <div class="mb-2.5 space-y-1 border-b border-gray-200 pb-2">
            <div class="flex items-center gap-1.5">
              <h3 class="text-[11px] font-semibold tracking-wider text-[#001011]/60 uppercase">Mechanism:</h3>
              <span
                class="inline-flex items-center justify-center rounded-full border border-[#001011]/15 bg-[#001011]/5 p-0.5 text-xs"
                :title="device.category"
                >{{ MECHANISM_ICON }}</span
              >
            </div>
            <p class="text-xs leading-relaxed font-medium text-gray-800">
              {{ device.mechanism || 'Actuation mechanism rendering haptic feedback.' }}
            </p>
          </div>
        </div>

        <div v-else-if="activeTab === 'research'" class="flex grow flex-col justify-start" role="tabpanel">
          <div class="mb-3 border-b border-gray-200 pb-3">
            <div class="mb-2 flex flex-wrap items-center justify-between gap-1">
              <h3 class="text-[11px] font-semibold tracking-wider text-[#001011]/60 uppercase">
                Research Focus
              </h3>
              <span
                v-if="device.year"
                class="rounded-full border border-[#001011]/15 bg-[#001011]/5 px-2 py-0.5 text-[10px] font-semibold text-[#001011]/80"
                >📅 {{ device.year }}</span
              >
            </div>
            <div class="mb-2 flex flex-wrap gap-1">
              <span
                v-for="topic in focus"
                :key="topic"
                class="rounded-full border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-[11px] font-medium text-indigo-700 shadow-xs"
                >{{ topic }}</span
              >
            </div>
            <template v-if="device.generalUseCases.length > 0">
              <h3 class="mt-2 mb-1 text-[11px] font-semibold tracking-wider text-[#001011]/60 uppercase">
                Context
              </h3>
              <div class="mb-1 flex flex-wrap gap-1">
                <span
                  v-for="context in device.generalUseCases"
                  :key="context"
                  class="general-use-case-tag rounded-full px-2 py-0.5 text-[11px] font-medium text-white"
                  >{{ context }}</span
                >
              </div>
            </template>
          </div>
        </div>

        <div v-else class="flex grow flex-col justify-start" role="tabpanel">
          <div class="mb-3 border-b border-gray-200 pb-3">
            <h3 class="mb-1 text-[11px] font-semibold tracking-wider text-[#001011]/60 uppercase">
              Use Cases
            </h3>
            <div v-if="device.useCaseTags.length > 0" class="mb-2 flex flex-wrap gap-1">
              <span
                v-for="tag in device.useCaseTags"
                :key="tag"
                class="use-case-tag rounded-full px-2 py-0.5 text-[11px] font-medium text-white"
                >{{ tag }}</span
              >
            </div>
            <p class="mt-1 text-xs leading-relaxed text-gray-700">{{ device.useCaseText }}</p>
          </div>
        </div>
      </div>

      <div v-if="hasReference" class="mt-auto border-t border-slate-200/60 pt-2 text-xs text-gray-600">
        <button
          type="button"
          class="flex w-full items-center justify-between text-left text-[10.5px] font-semibold tracking-wider text-[#001011]/60 uppercase focus:outline-hidden"
          :aria-expanded="referenceOpen"
          @click="referenceOpen = !referenceOpen"
        >
          <span>Reference</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-3.5 w-3.5 transition-transform duration-200"
            :class="{ 'rotate-180': referenceOpen }"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <div v-show="referenceOpen" class="mt-1.5 text-[11px]">
          <p class="font-semibold text-gray-800">{{ device.author || 'Author in Proceedings' }}</p>
          <p class="my-0.5 text-gray-600 italic">"{{ device.title || device.name }}"</p>
          <p class="text-[#001011]/60">{{ device.publication || 'Proceedings' }}, {{ device.year }}</p>
          <a
            v-if="device.doi"
            :href="`https://doi.org/${device.doi}`"
            target="_blank"
            rel="noopener noreferrer"
            class="mt-1 inline-flex items-center font-semibold text-[#fd5321] transition-colors hover:underline"
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
