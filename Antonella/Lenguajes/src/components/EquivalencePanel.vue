<script setup lang="ts">
import TabGroup from '@shared/components/TabGroup.vue';
import { type Component, computed, ref } from 'vue';
import type { EquivalenceTab } from '../content';
import RichTextView from './RichTextView.vue';

const props = defineProps<{
  tabs: readonly EquivalenceTab[];
  icon: Component;
  title: string;
  subtitle: string;
  tone: 'spanish' | 'german';
}>();

const active = ref(props.tabs[0].id);
const activeTab = computed(() => props.tabs.find((tab) => tab.id === active.value) ?? props.tabs[0]);

// The two cards share layout but each keeps the exact colours of the original page.
const styles = {
  spanish: {
    card: 'bg-[#F87171] border-red-300 text-slate-900',
    iconBox: 'bg-white/20 text-slate-900',
    title: 'text-slate-950',
    subtitle: 'text-slate-900/80',
    activeTab: 'text-slate-950 bg-white border-white/50 shadow-sm',
    idleTab: 'text-slate-900/70 border-white/20 bg-white/20',
    heading: 'text-red-600',
    explanation: 'text-slate-700',
    label: 'text-slate-950',
    strong: 'font-bold text-red-700',
    note: 'text-slate-700',
  },
  german: {
    card: 'bg-[#FBBF24] border-amber-300 text-amber-950',
    iconBox: 'bg-white/25 text-amber-950',
    title: 'text-amber-950',
    subtitle: 'text-amber-950/80',
    activeTab: 'text-amber-950 bg-white border-white/50 shadow-sm',
    idleTab: 'text-amber-900/75 border-white/20 bg-white/20',
    heading: 'text-amber-600',
    explanation: 'text-slate-800',
    label: 'text-amber-950',
    strong: 'font-bold text-amber-800',
    note: 'text-slate-600',
  },
};
const style = computed(() => styles[props.tone]);

function tabClass(isActive: boolean): string {
  const base = 'px-2 py-3 text-[10px] md:text-xs font-black uppercase tracking-wider rounded-xl transition-all border';
  return `${base} ${isActive ? style.value.activeTab : style.value.idleTab}`;
}
</script>

<template>
  <div :class="['rounded-3xl p-6 md:p-8 border shadow-xl', style.card]">
    <div class="flex items-center gap-3 mb-6">
      <div :class="['p-2 rounded-xl', style.iconBox]">
        <component :is="icon" class="w-5 h-5" />
      </div>
      <div>
        <h3 :class="['font-black text-lg', style.title]">{{ title }}</h3>
        <p :class="['text-xs font-medium', style.subtitle]">{{ subtitle }}</p>
      </div>
    </div>

    <TabGroup v-model="active" :tabs="tabs" :label="title" list-class="grid grid-cols-3 gap-2 mb-6" :tab-class="tabClass">
      <div class="space-y-4">
        <div class="p-4 rounded-2xl bg-white/95 border border-white/20 shadow-inner">
          <span :class="['text-[9px] font-black uppercase tracking-widest block mb-1', style.heading]">
            {{ activeTab.heading }}
          </span>
          <p :class="['text-xs leading-relaxed', style.explanation]">
            <RichTextView :text="activeTab.explanation" />
          </p>
        </div>
        <div class="grid grid-cols-1 gap-3 text-xs">
          <div v-for="example in activeTab.examples" :key="example.label" class="p-3 rounded-xl border border-white/10 bg-white/40">
            <span :class="['font-black block', style.label]">{{ example.label }}</span>
            <RichTextView :text="example.text" :strong-class="style.strong" />
            <template v-if="example.note">
              {{ ' ' }}<span :class="['text-[10px] font-medium', style.note]">{{ example.note }}</span>
            </template>
          </div>
        </div>
      </div>
    </TabGroup>
  </div>
</template>
