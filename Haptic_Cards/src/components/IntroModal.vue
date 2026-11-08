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
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
    @click.self="$emit('close')"
  >
    <div
      class="relative w-full max-w-2xl rounded-2xl border border-[#001011]/15 bg-white p-6 shadow-2xl"
      role="dialog"
      aria-modal="true"
      aria-labelledby="intro-title"
    >
      <button
        type="button"
        class="absolute top-4 right-4 p-1 text-xl font-bold text-gray-400 hover:text-gray-700"
        aria-label="Close"
        @click="$emit('close')"
      >
        &times;
      </button>
      <div class="mb-3">
        <span class="text-xs font-bold tracking-widest text-[#001011]/70 uppercase">{{
          intro.category
        }}</span>
        <h2 id="intro-title" class="text-2xl font-bold text-[#001011]">{{ intro.name }}</h2>
      </div>

      <div class="flex min-h-[300px] flex-col justify-between">
        <div class="relative grow">
          <div v-if="slide === 0" class="transition-all duration-300">
            <p class="mb-2 text-sm font-medium text-blue-800">Enhancing Virtual Reality Realism</p>
            <p class="text-xs leading-relaxed text-gray-700">
              Active haptic controllers use computer-controlled actuation to render haptic feedback in
              response to virtual events in real time.
            </p>
            <div class="mt-3 rounded-sm border-l-4 border-blue-500 bg-blue-50 p-3">
              <p class="text-xs leading-relaxed font-semibold text-blue-900">
                This categorization organizes prior work across 21 Mechanism Patterns and 10 canonical
                sensations from peer-reviewed literature for handheld controllers.
              </p>
            </div>
            <div class="mt-3 rounded-xl border border-amber-200/90 bg-amber-50/80 p-3 text-xs">
              <div class="mb-1 flex items-center gap-1.5 font-bold text-amber-900">
                <span>🧤</span> Wearable Devices Categorization
              </div>
              <p class="text-xs leading-relaxed text-amber-900/90">
                For haptic categorization of <strong>wearable devices</strong> (fingertip and hand-worn
                systems), see:
              </p>
              <a
                :href="WEARABLE_SURVEY"
                target="_blank"
                rel="noopener noreferrer"
                class="mt-1.5 inline-flex items-center gap-1 font-bold text-blue-700 hover:text-blue-900 hover:underline"
              >
                <span
                  >Pacchierotti et al. (2017) &ndash; Wearable Haptic Systems for the Fingertip and the Hand:
                  Taxonomy, Review, and Perspectives</span
                >
                <span class="text-[11px]">↗</span>
              </a>
            </div>
          </div>

          <div v-else class="transition-all duration-300">
            <p class="mb-2 text-[11px] leading-relaxed text-gray-700">
              We classify controllers according to their haptic modality (cutaneous or kinesthetic) and the
              sensations they render.
            </p>
            <div class="space-y-2 rounded-sm border border-slate-200 bg-slate-50 p-2">
              <div
                class="mb-1.5 border-b border-slate-200 pb-0.5 text-center text-[10px] font-bold text-blue-800"
              >
                Haptic Modality Categorization (10 Sensations)
              </div>
              <div class="grid grid-cols-2 gap-2 text-center">
                <div class="flex flex-col rounded-sm border border-green-200 bg-green-50/50 p-1.5">
                  <div
                    class="mb-1 flex items-center justify-center gap-1 border-b border-green-200 pb-0.5 text-[9px] font-semibold text-green-800"
                  >
                    <span>👆</span> Cutaneous (4)
                  </div>
                  <div class="space-y-0.5 pl-1 text-left text-[9px] font-medium text-green-700">
                    <div>• Thermal</div>
                    <div>• Stiffness</div>
                    <div>• Friction</div>
                    <div>• Vibration</div>
                  </div>
                </div>
                <div class="flex flex-col rounded-sm border border-red-200 bg-red-50/50 p-1.5">
                  <div
                    class="mb-1 flex items-center justify-center gap-1 border-b border-red-200 pb-0.5 text-[9px] font-semibold text-red-800"
                  >
                    <span>💪</span> Kinesthetic (6)
                  </div>
                  <div class="space-y-0.5 pl-1 text-left text-[9px] font-medium text-red-700">
                    <div>• Impact</div>
                    <div>• Motion</div>
                    <div>• Resistance</div>
                    <div>• Weight Amount</div>
                    <div>• Weight Dist.</div>
                    <div>• Shape</div>
                  </div>
                </div>
              </div>
              <div
                class="flex flex-wrap items-center justify-between gap-1 border-t border-slate-200/80 px-1 pt-1.5 text-left text-[10px] text-slate-600"
              >
                <span>For wearable devices:</span>
                <a
                  :href="WEARABLE_SURVEY"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-0.5 font-bold text-blue-700 hover:underline"
                >
                  Pacchierotti et al. (IEEE ToH 2017) ↗
                </a>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-4 flex justify-center gap-2 border-t border-slate-100 pt-2 select-none">
          <button
            v-for="(title, index) in slides"
            :key="title"
            type="button"
            class="intro-dot h-2.5 w-2.5 rounded-full focus:outline-hidden"
            :class="index === slide ? 'bg-blue-600' : 'bg-slate-300 hover:bg-slate-400'"
            :title="title"
            :aria-label="`Show ${title}`"
            :aria-current="index === slide"
            @click="slide = index"
          ></button>
        </div>
      </div>
    </div>
  </div>
</template>
