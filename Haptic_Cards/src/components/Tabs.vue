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
        ? 'mb-3 flex items-stretch border-b border-line select-none'
        : 'mb-3 flex flex-wrap items-center gap-1.5 sm:gap-2'
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
          ? '-mb-px min-h-9 border-b-2 px-2 text-xs font-semibold transition-colors first:pl-0'
          : 'keycap flex min-h-9 items-center gap-1.5 px-3 text-xs font-semibold select-none',
        variant === 'card' &&
          (tab.id === active
            ? 'border-signal text-ink'
            : 'border-transparent text-ink-3 hover:border-line-strong hover:text-ink'),
      ]"
      @click="active = tab.id"
    >
      <span>{{ tab.label }}</span>
      <span
        v-if="tab.count !== undefined"
        class="font-mono text-[10px] font-medium"
        :class="tab.id === active ? '' : 'text-ink-3'"
        >({{ tab.count }})</span
      >
    </button>
  </div>
</template>
