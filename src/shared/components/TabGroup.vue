<script setup lang="ts" generic="T extends string">
import { ref } from 'vue';
import { nextTabIndex } from './tab-navigation';

export interface TabOption<Id extends string> {
  id: Id;
  label: string;
}

const props = defineProps<{
  tabs: readonly TabOption<T>[];
  /** Accessible name of the tablist. */
  label: string;
  listClass?: string;
  tabClass: (active: boolean) => string;
}>();
const active = defineModel<T>({ required: true });
const buttons = ref<HTMLButtonElement[]>([]);
const uid = `tabs-${Math.random().toString(36).slice(2, 8)}`;

function onKeydown(event: KeyboardEvent, index: number): void {
  const next = nextTabIndex(event.key, index, props.tabs.length);
  if (next === null) return;
  event.preventDefault();
  active.value = props.tabs[next].id;
  buttons.value[next]?.focus();
}
</script>

<template>
  <div>
    <div role="tablist" :aria-label="label" :class="listClass">
      <button
        v-for="(tab, index) in tabs"
        :id="`${uid}-${tab.id}`"
        :key="tab.id"
        ref="buttons"
        type="button"
        role="tab"
        :aria-selected="active === tab.id"
        :aria-controls="`${uid}-panel`"
        :tabindex="active === tab.id ? 0 : -1"
        :class="tabClass(active === tab.id)"
        @click="active = tab.id"
        @keydown="onKeydown($event, index)"
      >
        <slot name="tab" :tab="tab" :active="active === tab.id">{{ tab.label }}</slot>
      </button>
    </div>
    <div :id="`${uid}-panel`" role="tabpanel" :aria-labelledby="`${uid}-${active}`">
      <slot :active="active" />
    </div>
  </div>
</template>
