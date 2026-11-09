<script setup lang="ts">
import { computed, ref } from 'vue';
import { ALL_FAMILIES, devicesOf, familyOf } from '../catalog';
import { mechanismFamilies } from '../data/families';
import { patternNames } from '../data/patterns';
import type { MechanismFamily, PatternName } from '../data/types';
import Pills, { type PillItem } from './Pills.vue';
import Tabs from './Tabs.vue';

const props = defineProps<{ activePattern: PatternName; activeFamilyId: string; deviceCount: number }>();
const emit = defineEmits<{ selectFamily: [id: string]; selectPattern: [pattern: PatternName] }>();

const collapsed = ref(true);

const familyTabs = [
  { id: ALL_FAMILIES, label: 'All Families', count: patternNames.length },
  ...mechanismFamilies.map((family) => ({
    id: family.id,
    label: family.name,
    count: family.patterns.length,
  })),
];

const familyModel = computed({
  get: () => props.activeFamilyId,
  set: (id: string) => emit('selectFamily', id),
});

const pillsOf = (family: MechanismFamily): PillItem[] =>
  family.patterns.map((pattern) => ({ pattern, count: devicesOf(pattern).length }));

const shownFamilies = computed(() =>
  props.activeFamilyId === ALL_FAMILIES ? mechanismFamilies : [familyOf(props.activePattern)],
);
</script>

<template>
  <footer class="mt-auto">
    <div class="rounded-panel border border-line bg-surface shadow-[var(--hc-shadow)]">
      <button
        type="button"
        class="group flex min-h-12 w-full flex-wrap items-center justify-between gap-2 rounded-panel px-4 py-2.5 text-left select-none sm:px-5"
        :aria-expanded="!collapsed"
        aria-controls="footer-collapsible-content"
        @click="collapsed = !collapsed"
      >
        <span class="flex items-center gap-2.5">
          <svg
            viewBox="0 0 24 24"
            class="h-4 w-4 text-signal-ink transition-transform duration-200"
            :class="{ '-rotate-90': collapsed }"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            aria-hidden="true"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="m6 9 6 6 6-6" />
          </svg>
          <span
            class="text-sm font-semibold tracking-tight text-ink transition-colors group-hover:text-signal-ink"
          >
            Filter by mechanism family &amp; pattern
            <span class="font-mono text-xs font-normal text-ink-3">({{ patternNames.length }} total)</span>
          </span>
        </span>
        <span class="flex items-center gap-3">
          <span class="font-mono text-[11px] text-ink-2">
            <span class="font-medium text-ink">{{ deviceCount }}</span> Peer-Reviewed Controllers
          </span>
          <span class="spec-label text-signal-ink group-hover:underline">
            {{ collapsed ? 'Show' : 'Hide' }}
          </span>
        </span>
      </button>

      <div
        v-show="!collapsed"
        id="footer-collapsible-content"
        class="border-t border-line px-4 pt-3 pb-4 sm:px-5"
      >
        <Tabs v-model="familyModel" :tabs="familyTabs" label="Mechanism families" variant="family" />

        <div class="flex min-h-[38px] flex-wrap items-center gap-2 border-t border-dashed border-line pt-3">
          <div v-if="activeFamilyId === ALL_FAMILIES" class="flex w-full flex-col gap-2.5">
            <div
              v-for="family in shownFamilies"
              :key="family.id"
              class="grid grid-cols-1 items-start gap-1.5 sm:grid-cols-[11rem_1fr] sm:gap-3"
            >
              <span class="spec-label pt-1 sm:pt-2.5">{{ family.name }}</span>
              <Pills
                :pills="pillsOf(family)"
                :active="activePattern"
                compact
                @select="emit('selectPattern', $event)"
              />
            </div>
          </div>
          <Pills
            v-else
            :pills="pillsOf(shownFamilies[0])"
            :active="activePattern"
            :compact="false"
            @select="emit('selectPattern', $event)"
          />
        </div>
      </div>
    </div>
  </footer>
</template>
