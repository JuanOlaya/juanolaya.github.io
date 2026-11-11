<script setup lang="ts">
import { computed } from 'vue';
import { isCutaneous } from '../data/sensations';
import type { HapticAudit } from '../data/types';
import { MAX_STARS } from '../versatility';

const props = defineProps<{ audit: HapticAudit }>();

const cutaneous = computed(() => props.audit.sensations.filter((sensation) => isCutaneous(sensation)));
const kinesthetic = computed(() => props.audit.sensations.filter((sensation) => !isCutaneous(sensation)));
</script>

<template>
  <div class="rounded-key border border-line bg-sunken/60 p-3">
    <div class="mb-2.5 flex items-center justify-between gap-3 border-b border-line pb-2">
      <span class="spec-label">Expressivity Score</span>
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

    <!-- Shape as well as hue: round = cutaneous (skin), square = kinesthetic (muscle). -->
    <div class="space-y-2">
      <div class="flex flex-col gap-1">
        <div class="flex items-center gap-1.5">
          <span class="h-1.5 w-1.5 rounded-full bg-cut" aria-hidden="true"></span>
          <span class="spec-label text-cut">Cutaneous</span>
        </div>
        <div class="flex min-h-[22px] flex-wrap items-center gap-1">
          <span
            v-for="sensation in cutaneous"
            :key="sensation"
            class="tag bg-cut-tint text-cut"
            title="Cutaneous sensation (Audited)"
          >
            <span class="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true"></span>
            {{ sensation }}
          </span>
          <span v-if="cutaneous.length === 0" class="font-mono text-xs text-ink-3">—</span>
        </div>
      </div>

      <div class="flex flex-col gap-1">
        <div class="flex items-center gap-1.5">
          <span class="h-1.5 w-1.5 rounded-none bg-kin" aria-hidden="true"></span>
          <span class="spec-label text-kin">Kinesthetic</span>
        </div>
        <div class="flex min-h-[22px] flex-wrap items-center gap-1">
          <span
            v-for="sensation in kinesthetic"
            :key="sensation"
            class="tag bg-kin-tint text-kin"
            title="Kinesthetic sensation (Audited)"
          >
            <span class="h-1.5 w-1.5 rounded-none bg-current" aria-hidden="true"></span>
            {{ sensation }}
          </span>
          <span v-if="kinesthetic.length === 0" class="font-mono text-xs text-ink-3">—</span>
        </div>
      </div>
    </div>
  </div>
</template>
