<script setup lang="ts">
import { ref } from 'vue';
import { intro } from '../data/intro';

defineEmits<{ close: [] }>();

const slides = ['Definition', 'Categorization'] as const;
const slide = ref(0);
const WEARABLE_SURVEY = 'https://ieeexplore.ieee.org/document/7922602';
</script>

<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0d0c]/70 p-4 backdrop-blur-xs"
    @click.self="$emit('close')"
  >
    <div
      class="relative w-full max-w-2xl overflow-hidden rounded-panel border border-line bg-surface shadow-2xl"
      role="dialog"
      aria-modal="true"
      aria-labelledby="intro-title"
    >
      <div class="h-1 bg-signal-bright" aria-hidden="true"></div>
      <div class="p-6">
        <button
          type="button"
          class="keycap absolute top-4 right-4 flex h-9 w-9 items-center justify-center"
          aria-label="Close"
          @click="$emit('close')"
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
        <div class="mb-4 pr-12">
          <span class="spec-label">{{ intro.category }}</span>
          <h2 id="intro-title" class="text-2xl font-semibold tracking-tight text-ink [font-stretch:88%]">
            {{ intro.name }}
          </h2>
        </div>

        <div class="flex min-h-[300px] flex-col justify-between">
          <div class="relative grow">
            <div v-if="slide === 0">
              <p class="mb-2 text-sm font-semibold text-signal-ink">Enhancing Virtual Reality Realism</p>
              <p class="text-sm leading-relaxed text-ink-2">
                Active haptic controllers use computer-controlled actuation to render haptic feedback in
                response to virtual events in real time.
              </p>
              <div class="mt-3 border-l-2 border-signal bg-sunken/70 p-3">
                <p class="text-sm leading-relaxed font-medium text-ink">
                  This categorization organizes prior work across 21 Mechanism Patterns and 10 canonical
                  sensations from peer-reviewed literature for handheld controllers.
                </p>
              </div>
              <div class="mt-3 rounded-key border border-dashed border-line-strong p-3 text-sm">
                <div class="spec-label mb-1 text-ink">Wearable Devices Categorization</div>
                <p class="leading-relaxed text-ink-2">
                  For haptic categorization of <strong class="text-ink">wearable devices</strong> (fingertip
                  and hand-worn systems), see:
                </p>
                <a
                  :href="WEARABLE_SURVEY"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="mt-1.5 inline-flex items-center gap-1 font-semibold text-signal-ink underline-offset-2 hover:underline"
                >
                  <span
                    >Pacchierotti et al. (2017) &ndash; Wearable Haptic Systems for the Fingertip and the
                    Hand: Taxonomy, Review, and Perspectives</span
                  >
                  <span class="text-[11px]" aria-hidden="true">↗</span>
                </a>
              </div>
            </div>

            <div v-else>
              <p class="mb-3 text-sm leading-relaxed text-ink-2">
                We classify controllers according to their haptic modality (cutaneous or kinesthetic) and the
                sensations they render.
              </p>
              <div class="rounded-key border border-line bg-sunken/60 p-3">
                <div class="spec-label mb-2 text-center">Haptic Modality Categorization (10 Sensations)</div>
                <div class="grid grid-cols-2 gap-2">
                  <div class="rounded-key bg-cut-tint p-2.5 text-cut">
                    <div
                      class="mb-1.5 flex items-center gap-1.5 border-b border-current/25 pb-1 text-xs font-semibold"
                    >
                      <span class="h-2 w-2 rounded-full bg-current" aria-hidden="true"></span> Cutaneous (4)
                    </div>
                    <ul class="space-y-0.5 text-xs">
                      <li>Thermal</li>
                      <li>Stiffness</li>
                      <li>Friction</li>
                      <li>Vibration</li>
                    </ul>
                  </div>
                  <div class="rounded-key bg-kin-tint p-2.5 text-kin">
                    <div
                      class="mb-1.5 flex items-center gap-1.5 border-b border-current/25 pb-1 text-xs font-semibold"
                    >
                      <span class="h-2 w-2 bg-current" aria-hidden="true"></span> Kinesthetic (6)
                    </div>
                    <ul class="space-y-0.5 text-xs">
                      <li>Impact</li>
                      <li>Motion</li>
                      <li>Resistance</li>
                      <li>Weight Amount</li>
                      <li>Weight Dist.</li>
                      <li>Shape</li>
                    </ul>
                  </div>
                </div>
                <div
                  class="mt-2 flex flex-wrap items-center justify-between gap-1 border-t border-line pt-2 text-xs text-ink-2"
                >
                  <span>For wearable devices:</span>
                  <a
                    :href="WEARABLE_SURVEY"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center gap-0.5 font-semibold text-signal-ink underline-offset-2 hover:underline"
                  >
                    Pacchierotti et al. (IEEE ToH 2017) <span aria-hidden="true">↗</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-4 flex justify-center gap-1 border-t border-line pt-2 select-none">
            <button
              v-for="(title, index) in slides"
              :key="title"
              type="button"
              class="intro-dot group flex h-8 items-center px-1.5"
              :title="title"
              :aria-label="`Show ${title}`"
              :aria-current="index === slide"
              @click="slide = index"
            >
              <span
                class="block h-1 rounded-[1px] transition-all duration-200"
                :class="index === slide ? 'w-6 bg-signal' : 'w-3 bg-line-strong group-hover:bg-ink-3'"
              ></span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
