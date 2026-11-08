<script setup lang="ts">
import { onMounted, ref } from 'vue';
import AiHub from './components/AiHub.vue';
import CognitiveOverloadSection from './components/CognitiveOverloadSection.vue';
import HickLawSection from './components/HickLawSection.vue';
import ProgressiveDisclosureSection from './components/ProgressiveDisclosureSection.vue';
import { LAWS_OF_UX_URL, sectionLinks } from './content';
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
    class="bg-gradient-to-r from-indigo-950 via-indigo-900 to-slate-900 text-white py-12 px-6 relative overflow-hidden border-b border-indigo-950"
  >
    <div
      class="absolute inset-0 opacity-10 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px]"
    ></div>
    <div class="max-w-6xl mx-auto relative z-10 text-center md:text-left">
      <div class="flex flex-wrap items-center gap-2 mb-3 justify-center md:justify-start">
        <span
          class="bg-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-indigo-500/30 animate-pulse"
        >
          Centro de Experiencia UX + Gemini AI Hub (4.0)
        </span>
        <a
          :href="LAWS_OF_UX_URL"
          target="_blank"
          rel="noopener noreferrer"
          class="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-3 py-1 rounded-full border border-slate-700 flex items-center gap-1 transition-all"
        >
          <span>Visitar Laws of UX ↗</span>
        </a>
      </div>
      <h1 class="text-3xl md:text-5xl font-extrabold mt-1 tracking-tight">
        La Anatomía de la Experiencia de Usuario
      </h1>
      <p class="text-slate-300 mt-4 text-base md:text-lg max-w-3xl leading-relaxed">
        Explora visual e interactivamente los problemas de navegación tradicionales. Ahora potenciado con un
        <strong>Super-Hub de Inteligencia Artificial de Google Gemini</strong> para auditar interfaces,
        rediseñar layouts, generar prototipos y simular entrevistas bilingües.
      </p>
    </div>
  </header>

  <nav class="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-200 z-50">
    <div class="max-w-6xl mx-auto px-4 py-3 flex flex-wrap gap-2 justify-center sm:justify-start">
      <a
        v-for="link in sectionLinks"
        :key="link.href"
        :href="link.href"
        class="text-xs font-semibold px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
        >{{ link.label }}</a
      >
      <span class="w-px h-4 bg-slate-300 self-center hidden sm:inline"></span>
      <a
        href="#gemini-hub"
        class="text-xs font-bold px-3 py-1.5 rounded-lg text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors flex items-center gap-1"
      >
        <svg class="w-3.5 h-3.5 fill-indigo-600" viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M12 2a1 1 0 0 1 .897.553l1.832 3.662 4.04.587a1 1 0 0 1 .554 1.706l-2.923 2.85 1.05 4.341a1 1 0 0 1-1.496 1.087L12 14.828l-3.954 2.08a1 1 0 0 1-1.496-1.087l1.05-4.341-2.923-2.85a1 1 0 0 1 .554-1.706l4.04-.587 1.832-3.662A1 1 0 0 1 12 2z"
          />
        </svg>
        Gemini AI Hub
      </a>
    </div>
  </nav>

  <main ref="main" class="max-w-6xl mx-auto px-4 py-8 space-y-16">
    <CognitiveOverloadSection />
    <ProgressiveDisclosureSection />
    <HickLawSection />
    <AiHub />
  </main>

  <footer class="bg-slate-900 text-slate-400 py-12 px-6 text-center text-sm border-t border-slate-800">
    <div class="max-w-6xl mx-auto space-y-4">
      <p class="font-semibold text-slate-200">"La simplicidad es la máxima sofisticación." — Steve Jobs</p>
      <p>
        Diseñado para explicar conceptos fundamentales de UX mediante interacción práctica. Visita
        <a
          :href="LAWS_OF_UX_URL"
          target="_blank"
          rel="noopener noreferrer"
          class="text-indigo-400 hover:underline"
          >Laws of UX</a
        >
        para más información.
      </p>
    </div>
  </footer>
</template>
