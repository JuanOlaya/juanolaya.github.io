<script setup lang="ts">
import { isCutaneous } from '../data/sensations';
import type { HapticAudit } from '../data/types';
import { MAX_STARS } from '../versatility';

defineProps<{ audit: HapticAudit }>();
</script>

<template>
  <div class="mb-3 rounded-key border border-line bg-sunken/60 p-3 pb-2.5">
    <div class="mb-2 flex items-center justify-between gap-3">
      <span class="spec-label">Haptic Versatility</span>
      <!-- A segmented level meter instead of stars: reads like an instrument readout. -->
      <div
        class="flex items-center gap-2"
        :title="`${audit.score} of 10 canonical sensations verified in audit`"
        :aria-label="`${audit.score} of ${MAX_STARS} stars`"
        role="img"
      >
        <span class="flex items-center gap-[3px]" aria-hidden="true">
          <span
            v-for="segment in MAX_STARS"
            :key="segment"
            class="h-3 w-2.5 rounded-[1.5px]"
            :class="segment <= audit.score ? 'bg-signal-bright' : 'bg-line-strong/50'"
          ></span>
        </span>
        <span class="font-mono text-xs font-medium text-ink tabular-nums" aria-hidden="true"
          >{{ audit.score }}<span class="text-ink-3">/{{ MAX_STARS }}</span></span
        >
      </div>
    </div>

    <div class="flex flex-wrap gap-1">
      <span
        v-for="sensation in audit.sensations"
        :key="sensation"
        class="tag"
        :class="isCutaneous(sensation) ? 'bg-cut-tint text-cut' : 'bg-kin-tint text-kin'"
        :title="`${isCutaneous(sensation) ? 'Cutaneous' : 'Kinesthetic'} sensation (Audited)`"
      >
        <!-- Shape as well as hue: round = cutaneous (skin), square = kinesthetic (muscle). -->
        <span
          class="h-1.5 w-1.5 bg-current"
          :class="isCutaneous(sensation) ? 'rounded-full' : 'rounded-none'"
          aria-hidden="true"
        ></span>
        {{ sensation }}
      </span>
      <span v-if="audit.sensations.length === 0" class="text-[11px] text-ink-3 italic"
        >No coded sensations in audit</span
      >
    </div>
  </div>
</template>
