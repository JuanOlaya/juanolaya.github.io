<script setup lang="ts">
import { ref } from 'vue';
import AgileCases from './components/AgileCases.vue';
import ArtifactsSection from './components/ArtifactsSection.vue';
import DomainsPanel from './components/DomainsPanel.vue';
import FlowDiagram from './components/FlowDiagram.vue';
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

  <header class="pm-header">
    <a href="/" class="pm-header__home" aria-label="Volver a la portada">← Inicio</a>
    <span class="pm-header__title">PMBOK 7 · Gestión de Proyectos</span>
  </header>

  <main class="pm-main">
    <section class="grid gap-2">
      <h1>Guía de Gestión de Proyectos según PMBOK 7</h1>
      <p class="text-ink-2 m-0">
        Del «Ser» (principios y ética) al «Hacer» (dominios de desempeño, artefactos y práctica ágil).
      </p>
    </section>

    <FlowDiagram />

    <div class="grid gap-[clamp(16px,2.5vw,32px)] lg:grid-cols-2">
      <PrinciplesPanel @select="showTopic" />
      <DomainsPanel @select="showTopic" />
    </div>

    <ArtifactsSection />
    <AgileCases />
    <ProposalGuide @select="showTopic" />

    <footer class="text-ink-2 text-[13px] text-center">
      «El éxito se encuentra en la intersección entre un Ser ético y un Hacer técnico impecable.»
    </footer>
  </main>
</template>
