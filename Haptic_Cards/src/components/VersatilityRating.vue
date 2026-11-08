<script setup lang="ts">
import { isCutaneous } from '../data/sensations';
import type { HapticAudit } from '../data/types';
import { MAX_STARS } from '../versatility';

defineProps<{ audit: HapticAudit }>();

const STAR_PATH =
  'M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z';
</script>

<template>
  <div class="mb-3 rounded-xl border border-[#001011]/10 bg-white/80 p-3 pb-2.5 shadow-xs">
    <div class="mb-1.5 flex items-center justify-between">
      <span class="text-[9.5px] font-bold tracking-wider text-[#001011]/60 uppercase"
        >Haptic Versatility</span
      >
      <div
        class="flex items-center"
        :title="`${audit.score} of 10 canonical sensations verified in audit`"
        :aria-label="`${audit.score} of ${MAX_STARS} stars`"
        role="img"
      >
        <svg
          v-for="star in MAX_STARS"
          :key="star"
          class="h-3.5 w-3.5 fill-current"
          :class="star <= audit.score ? 'text-amber-400 drop-shadow-xs' : 'text-gray-300 opacity-60'"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path :d="STAR_PATH" />
        </svg>
      </div>
    </div>

    <div class="flex flex-wrap gap-1 border-t border-slate-100 pt-1">
      <span
        v-for="sensation in audit.sensations"
        :key="sensation"
        class="inline-flex items-center gap-1 rounded-sm border px-1.5 py-0.5 text-[10px] font-medium"
        :class="
          isCutaneous(sensation)
            ? 'border-green-200 bg-green-50 text-green-800'
            : 'border-red-200 bg-red-50 text-red-800'
        "
        :title="`${isCutaneous(sensation) ? 'Cutaneous' : 'Kinesthetic'} sensation (Audited)`"
      >
        <span
          class="h-1.5 w-1.5 rounded-full"
          :class="isCutaneous(sensation) ? 'bg-green-500' : 'bg-red-500'"
        ></span>
        {{ sensation }}
      </span>
      <span v-if="audit.sensations.length === 0" class="text-[10px] text-gray-400 italic"
        >No coded sensations in audit</span
      >
    </div>
  </div>
</template>
