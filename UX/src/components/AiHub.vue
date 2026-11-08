<script setup lang="ts">
import { ref } from 'vue';
import TabGroup, { type TabOption } from '@shared/components/TabGroup.vue';
import { gemini } from '../gemini';
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

function tabClass(active: boolean): string {
  const base = 'text-xs font-bold px-4 py-2.5 rounded-xl transition-all';
  return active
    ? `${base} bg-indigo-600 hover:bg-indigo-700 text-white`
    : `${base} bg-slate-800 hover:bg-indigo-950/40 text-slate-300 border border-indigo-900`;
}
</script>

<template>
  <section
    id="gemini-hub"
    class="bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white rounded-3xl p-6 md:p-10 shadow-xl border border-indigo-800 space-y-8 scroll-mt-20"
  >
    <div>
      <div class="flex items-center gap-2 text-indigo-400">
        <span class="h-2 w-2 rounded-full bg-indigo-400 animate-ping"></span>
        <span class="text-xs font-bold tracking-widest uppercase">Módulo Copilot Activo</span>
      </div>
      <h2
        class="text-2xl md:text-3xl font-extrabold tracking-tight mt-1 text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-indigo-300"
      >
        Centro Inteligente Gemini AI
      </h2>
    </div>

    <div
      v-if="!gemini.isAvailable"
      role="status"
      class="bg-amber-100 text-amber-900 border border-amber-300 rounded-2xl p-4 text-sm"
    >
      <strong>AI Hub desactivado.</strong> Esta versión pública no tiene un proxy de Gemini configurado, así
      que las funciones de IA no están disponibles. El resto de la infografía funciona con normalidad.
    </div>

    <TabGroup
      v-model="activeTab"
      :tabs="tabs"
      label="Herramientas del AI Hub"
      list-class="flex flex-wrap gap-2 border-b border-indigo-800 pb-6 mb-8"
      :tab-class="tabClass"
    >
      <template #default="{ active }">
        <!-- v-show keeps each tool's state when switching tabs, as the original did. -->
        <div v-show="active === 'audit'" class="fade-in"><AuditTab /></div>
        <div v-show="active === 'proto'" class="fade-in"><PrototypeTab /></div>
        <div v-show="active === 'interview'" class="fade-in">
          <InterviewTab :active="active === 'interview'" />
        </div>
        <div v-show="active === 'grounding'" class="fade-in"><GroundingTab /></div>
        <div v-show="active === 'quiz'" class="fade-in"><QuizTab /></div>
      </template>
    </TabGroup>
  </section>
</template>
