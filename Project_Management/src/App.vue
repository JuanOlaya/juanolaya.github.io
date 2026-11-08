<script setup lang="ts">
import { ref } from 'vue';
import ArtifactsSection from './components/ArtifactsSection.vue';
import DomainsPanel from './components/DomainsPanel.vue';
import ProposalGuide from './components/ProposalGuide.vue';
import PrinciplesPanel from './components/PrinciplesPanel.vue';
import TopicModal from './components/TopicModal.vue';
import type { TopicId } from './content';

const openTopic = ref<TopicId | null>(null);

function showTopic(id: TopicId): void {
  openTopic.value = id;
}
</script>

<template>
  <TopicModal :topic-id="openTopic" @close="openTopic = null" />

  <div class="max-w-6xl mx-auto">
    <header class="text-center mb-10">
      <h1 class="text-4xl font-extrabold text-slate-800 mb-2">PMBOK 7: Guía Gestión de Proyectos</h1>
      <p class="text-lg text-slate-600 italic">
        Estructura profesional: Del "Ser" (Ética) al "Hacer" (Ejecución y Artefactos)
      </p>
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
      <PrinciplesPanel @select="showTopic" />
      <DomainsPanel @select="showTopic" />
    </div>

    <ArtifactsSection />
    <ProposalGuide @select="showTopic" />

    <footer class="text-center text-slate-400 text-[10px] pb-4 italic">
      "El éxito se encuentra en la intersección entre un Ser ético y un Hacer técnico impecable."
    </footer>
  </div>
</template>
