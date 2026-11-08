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

const collapsed = ref(false);

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
    <div
      class="rounded-2xl border border-[#001011]/10 bg-[#ECEDE8] px-4 py-2.5 shadow-xs transition-all duration-300 sm:px-5 sm:py-3"
    >
      <button
        type="button"
        class="group flex w-full cursor-pointer flex-wrap items-center justify-between gap-2 text-left select-none"
        :aria-expanded="!collapsed"
        aria-controls="footer-collapsible-content"
        @click="collapsed = !collapsed"
      >
        <span class="flex items-center gap-2.5">
          <span class="text-xs font-black text-[#fd5321] transition-transform duration-200">{{
            collapsed ? '▲' : '▼'
          }}</span>
          <span
            class="text-xs font-black tracking-wider text-[#001011] uppercase transition-colors group-hover:text-[#fd5321] sm:text-sm"
          >
            Filter by mechanism family &amp; pattern ({{ patternNames.length }} total)
          </span>
        </span>
        <span class="flex items-center gap-2">
          <span
            class="rounded-full border border-[#001011]/15 bg-[#001011]/5 px-3 py-1 text-xs font-bold text-[#001011]/70"
          >
            {{ deviceCount }} Peer-Reviewed Controllers
          </span>
          <span
            class="rounded-lg bg-[#fd5321]/10 px-2 py-0.5 text-xs font-bold text-[#fd5321] transition group-hover:underline"
          >
            {{ collapsed ? 'Show' : 'Hide' }}
          </span>
        </span>
      </button>

      <div v-show="!collapsed" id="footer-collapsible-content" class="mt-3 border-t border-[#001011]/10 pt-3">
        <Tabs v-model="familyModel" :tabs="familyTabs" label="Mechanism families" variant="family" />

        <div class="flex min-h-[38px] flex-wrap items-center gap-2">
          <div v-if="activeFamilyId === ALL_FAMILIES" class="flex w-full flex-col gap-2.5">
            <div v-for="family in shownFamilies" :key="family.id" class="flex flex-wrap items-center gap-2">
              <span
                class="shrink-0 rounded-lg bg-[#001011]/5 px-2.5 py-1 text-[11px] font-black tracking-wider text-[#001011]/70 uppercase"
              >
                {{ family.name }}
              </span>
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
