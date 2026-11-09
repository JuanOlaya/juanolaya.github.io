<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import TabGroup, { type TabOption } from '@shared/components/TabGroup.vue';
import { gemini } from '../gemini';
import { scrollBehaviorFor, watchReducedMotion } from '../motion';
import { IDLE_SWIPE, beginSwipe, cancelSwipe, endSwipe, type SwipePointer, type SwipeState } from '../swipe';
import { tabIndexAfterSwipe } from '../tab-gestures';
import { CARD, EYEBROW } from '../ui';
import AuditTab from './AuditTab.vue';
import GroundingTab from './GroundingTab.vue';
import InterviewTab from './InterviewTab.vue';
import PrototypeTab from './PrototypeTab.vue';
import QuizTab from './QuizTab.vue';

type AiTabId = 'audit' | 'proto' | 'interview' | 'grounding' | 'quiz';

const tabs: readonly TabOption<AiTabId>[] = [
  { id: 'audit', label: '🔍 Auditor & Rediseño UI' },
  { id: 'proto', label: '🎨 Generar Prototipo (Imagen 4)' },
  { id: 'interview', label: '🇩🇪 Entrevista UX Alemán' },
  { id: 'grounding', label: '🌐 Consultor UX (Grounding)' },
  { id: 'quiz', label: '🎲 Examen UX (JSON)' },
];

const activeTab = ref<AiTabId>('audit');
const root = ref<HTMLElement | null>(null);
const reducedMotion = ref(false);
let swipe: SwipeState = IDLE_SWIPE;
let stopMotionWatch = (): void => {};

onMounted(() => {
  stopMotionWatch = watchReducedMotion((reduced) => (reducedMotion.value = reduced));
});
onBeforeUnmount(() => stopMotionWatch());

function tabClass(active: boolean): string {
  const base =
    'inline-flex min-h-11 shrink-0 items-center rounded-button px-4 text-caption font-medium whitespace-nowrap motion-safe:transition-colors';
  return active
    ? `${base} bg-accent text-on-accent`
    : `${base} border border-white/15 bg-white/5 text-ink hover:bg-white/10`;
}

function pointerOf(event: PointerEvent): SwipePointer {
  return {
    pointerId: event.pointerId,
    x: event.clientX,
    y: event.clientY,
    pointerType: event.pointerType,
    isPrimary: event.isPrimary,
  };
}

function onPointerDown(event: PointerEvent): void {
  swipe = beginSwipe(swipe, pointerOf(event));
}

function onPointerUp(event: PointerEvent): void {
  const result = endSwipe(swipe, pointerOf(event));
  swipe = result.state;
  const current = tabs.findIndex((tab) => tab.id === activeTab.value);
  const next = tabIndexAfterSwipe(result.direction, current, tabs.length);
  if (next !== null) activeTab.value = tabs[next].id;
}

function onPointerCancel(): void {
  swipe = cancelSwipe();
}

// Arrow keys and swipes can select a tab that sits outside the scrollable strip.
watch(activeTab, async () => {
  await nextTick();
  root.value?.querySelector<HTMLElement>('[role="tab"][aria-selected="true"]')?.scrollIntoView({
    behavior: scrollBehaviorFor(reducedMotion.value),
    inline: 'nearest',
    block: 'nearest',
  });
});
</script>

<template>
  <section id="gemini-hub" ref="root" :class="`${CARD} scroll-mt-20 space-y-8`">
    <div>
      <div :class="`${EYEBROW} flex items-center gap-2 text-ink-2`">
        <span :class="['h-2 w-2 rounded-full', gemini.isAvailable ? 'bg-success' : 'bg-ink-2']"></span>
        <span>{{ gemini.isAvailable ? 'Módulo Copilot activo' : 'Módulo Copilot sin conexión' }}</span>
      </div>
      <h2 class="mt-1 text-[clamp(20px,1.1rem+0.5vw,26px)] leading-tight font-medium">
        Centro Inteligente Gemini AI
      </h2>
    </div>

    <div
      v-if="!gemini.isAvailable"
      role="status"
      class="rounded-card border border-accent/40 bg-bg p-4 text-[0.92em] text-ink-2"
    >
      <strong class="block font-medium text-accent-text">AI Hub desactivado en esta versión pública.</strong>
      No hay un proxy de Gemini configurado, así que las funciones de IA no responden. Puedes recorrer las
      cinco herramientas para ver qué hacen; el resto de la infografía funciona con normalidad.
    </div>

    <TabGroup
      v-model="activeTab"
      :tabs="tabs"
      label="Herramientas del AI Hub"
      list-class="scroll-row mb-6 flex gap-2 border-b border-border pb-4"
      :tab-class="tabClass"
    >
      <template #default="{ active }">
        <p class="mb-4 hidden text-caption text-ink-2 pointer-coarse:block">
          Desliza hacia los lados para cambiar de herramienta.
        </p>
        <!--
          Swipe handlers live on this wrapper (the shared TabGroup is used as is). `touch-pan-y` keeps
          vertical scrolling native; the browser then cancels our pointer when it takes over.
        -->
        <div
          class="touch-pan-y"
          @pointerdown="onPointerDown"
          @pointerup="onPointerUp"
          @pointercancel="onPointerCancel"
        >
          <!-- v-show keeps each tool's state when switching tabs, as the original did. -->
          <div v-show="active === 'audit'" class="fade-in"><AuditTab /></div>
          <div v-show="active === 'proto'" class="fade-in"><PrototypeTab /></div>
          <div v-show="active === 'interview'" class="fade-in">
            <InterviewTab :active="active === 'interview'" />
          </div>
          <div v-show="active === 'grounding'" class="fade-in"><GroundingTab /></div>
          <div v-show="active === 'quiz'" class="fade-in"><QuizTab /></div>
        </div>
      </template>
    </TabGroup>
  </section>
</template>
