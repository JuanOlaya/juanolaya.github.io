<script setup lang="ts">
export interface TabItem {
  id: string;
  label: string;
  /** Shown as "(n)" next to the label. */
  count?: number;
}

defineProps<{ tabs: readonly TabItem[]; label: string; variant: 'card' | 'family' }>();
const active = defineModel<string>({ required: true });
</script>

<template>
  <div
    role="tablist"
    :aria-label="label"
    :class="
      variant === 'card'
        ? 'mb-3 flex items-center gap-1.5 rounded-full bg-[#001011]/5 p-1 text-[11px] font-medium select-none'
        : 'mb-3 flex flex-wrap items-center gap-1.5 border-b border-[#001011]/10 pb-2.5 sm:gap-2'
    "
  >
    <button
      v-for="tab in tabs"
      :key="tab.id"
      type="button"
      role="tab"
      :aria-selected="tab.id === active"
      :data-tab="tab.id"
      :class="[
        variant === 'card'
          ? 'rounded-full px-3 py-1 text-xs transition-all focus:outline-hidden'
          : 'flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition-all duration-150 select-none',
        tab.id === active
          ? variant === 'card'
            ? 'bg-[#fd5321] font-semibold text-white shadow-xs'
            : 'border-[#001011] bg-[#001011] text-white shadow-xs'
          : variant === 'card'
            ? 'text-[#001011]/70 hover:bg-[#001011]/5 hover:text-[#001011]'
            : 'border-[#001011]/10 bg-white/60 text-gray-400 hover:border-[#001011]/25 hover:bg-white hover:text-[#001011]',
      ]"
      @click="active = tab.id"
    >
      <span>{{ tab.label }}</span>
      <span
        v-if="tab.count !== undefined"
        class="text-[10px] font-semibold"
        :class="tab.id === active ? 'text-white/80' : 'text-gray-400'"
        >({{ tab.count }})</span
      >
    </button>
  </div>
</template>
