<script setup lang="ts">
import { onMounted, ref } from 'vue';
import AiHub from './components/AiHub.vue';
import CognitiveOverloadSection from './components/CognitiveOverloadSection.vue';
import HickLawSection from './components/HickLawSection.vue';
import ProgressiveDisclosureSection from './components/ProgressiveDisclosureSection.vue';
import SectionNav from './components/SectionNav.vue';
import { LAWS_OF_UX_URL } from './content';
import { typesetMath } from './mathjax';

const main = ref<HTMLElement | null>(null);

onMounted(async () => {
  if (!main.value) return;
  try {
    await typesetMath(main.value);
  } catch (error) {
    // The formulas stay readable as raw TeX, so a MathJax failure is not fatal.
    console.error('MathJax error:', error);
  }
});
</script>

<template>
  <header
    class="sticky top-0 z-50 flex min-h-14 items-center justify-between gap-3 border-b border-border bg-bg/80 px-[clamp(16px,5vw,64px)] backdrop-blur-[6px]"
  >
    <a
      href="/"
      aria-label="Volver a la portada"
      class="inline-flex min-h-11 shrink-0 items-center px-2 text-link no-underline underline-offset-2 hover:underline"
      >← Inicio</a
    >
    <span class="min-w-0 flex-1 truncate text-center font-medium lg:text-left">Infografía UX</span>
    <SectionNav class="hidden lg:block" />
  </header>

  <section class="mx-auto max-w-6xl px-[clamp(16px,5vw,64px)] pt-8 pb-4 sm:pt-12">
    <div class="flex flex-wrap items-center gap-2">
      <span class="rounded-full border border-border px-3 py-1 text-caption text-ink-2">
        Centro de Experiencia UX + Gemini AI Hub
      </span>
      <a
        :href="LAWS_OF_UX_URL"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex min-h-11 items-center text-caption text-link"
        >Visitar Laws of UX ↗</a
      >
    </div>
    <h1 class="mt-4 text-[clamp(26px,1.4rem+1vw,36px)] leading-[1.1] font-medium">
      La Anatomía de la Experiencia de Usuario
    </h1>
    <p class="mt-4 max-w-[65ch] text-ink-2">
      Explora visual e interactivamente los problemas de navegación tradicionales. Ahora potenciado con un
      <strong class="font-medium text-ink">Super-Hub de Inteligencia Artificial de Google Gemini</strong>
      para auditar interfaces, rediseñar layouts, generar prototipos y simular entrevistas bilingües.
    </p>
  </section>

  <div class="mx-auto max-w-6xl px-[clamp(16px,5vw,64px)] lg:hidden">
    <SectionNav />
  </div>

  <main ref="main" class="mx-auto max-w-6xl space-y-[clamp(16px,2.5vw,32px)] px-[clamp(16px,5vw,64px)] py-8">
    <CognitiveOverloadSection />
    <ProgressiveDisclosureSection />
    <HickLawSection />
    <AiHub />
  </main>

  <footer class="border-t border-border px-[clamp(16px,5vw,64px)] py-12 text-ink-2">
    <div class="mx-auto max-w-6xl space-y-3">
      <p class="font-medium text-ink">"La simplicidad es la máxima sofisticación." — Steve Jobs</p>
      <p class="text-[0.92em]">
        Diseñado para explicar conceptos fundamentales de UX mediante interacción práctica. Visita
        <a :href="LAWS_OF_UX_URL" target="_blank" rel="noopener noreferrer">Laws of UX</a>
        para más información.
      </p>
    </div>
  </footer>
</template>
