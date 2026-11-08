<script setup lang="ts">
import { Globe } from 'lucide-vue-next';
import SectionHeading from './SectionHeading.vue';
</script>

<template>
  <SectionHeading :icon="Globe" icon-class="bg-teal-500">
    <template #title>6. Mapa de Lenguas y Raíces (Europa y Américas)</template>

    <p class="text-sm md:text-base leading-relaxed mb-8 text-slate-600 dark:text-slate-300">
      La historia personal de tu hija conecta continentes. Sus raíces combinan la solidez de las lenguas germánicas de
      Europa con la rica herencia de las lenguas romances de Europa que florecieron en toda América Latina.
    </p>

    <div class="p-6 md:p-8 rounded-3xl border transition-colors bg-slate-50 border-slate-200 dark:bg-black/20 dark:border-white/5">
      <div class="w-full overflow-hidden">
            <svg viewBox="0 0 800 420" class="w-full h-auto text-slate-800 dark:text-slate-200" role="img" aria-label="Mapa de lenguas: del tronco indoeuropeo a las ramas germánica y romance, el inglés como puente y su expansión a las Américas">
              <rect width="800" height="420" rx="20" fill="none" />
              <path d="M 50 100 Q 400 200 750 100" stroke="rgba(99, 102, 241, 0.1)" stroke-width="2" fill="none" />
              <path d="M 50 250 Q 400 350 750 250" stroke="rgba(99, 102, 241, 0.1)" stroke-width="2" fill="none" />

              <g id="europe-nodes">
                <rect x="30" y="170" width="130" height="50" rx="10" fill="rgba(99, 102, 241, 0.15)" stroke="#6366F1" stroke-width="2" />
                <text x="95" y="195" fill="currentColor" font-size="11" font-weight="bold" text-anchor="middle">TRONCO INDOEUROPEO</text>
                <text x="95" y="210" fill="currentColor" font-size="8" class="opacity-75" text-anchor="middle">Origen de las familias</text>

                <path d="M 160 195 L 210 115" stroke="currentColor" stroke-width="1.5" stroke-dasharray="3" class="opacity-40" />
                <path d="M 160 195 L 210 275" stroke="currentColor" stroke-width="1.5" stroke-dasharray="3" class="opacity-40" />

                <rect x="210" y="85" width="120" height="60" rx="10" fill="rgba(245, 158, 11, 0.15)" stroke="#F59E0B" stroke-width="2" />
                <text x="270" y="108" fill="#F59E0B" font-size="12" font-weight="black" text-anchor="middle">G. GERMÁNICA</text>
                <text x="270" y="123" fill="currentColor" font-size="9" text-anchor="middle">Alemán</text>
                <text x="270" y="135" fill="currentColor" font-size="8" class="opacity-75" text-anchor="middle">Sintaxis y Fonemas</text>

                <rect x="210" y="245" width="120" height="60" rx="10" fill="rgba(239, 68, 68, 0.15)" stroke="#EF4444" stroke-width="2" />
                <text x="270" y="268" fill="#EF4444" font-size="12" font-weight="black" text-anchor="middle">G. ROMANCE</text>
                <text x="270" y="283" fill="currentColor" font-size="9" text-anchor="middle">Español (Casa)</text>
                <text x="270" y="295" fill="currentColor" font-size="8" class="opacity-75" text-anchor="middle">Vocabulario Académico</text>
              </g>

              <g id="english-bridge">
                <path d="M 330 115 L 430 170" stroke="#F59E0B" stroke-width="2.5" />
                <path d="M 330 275 L 430 220" stroke="#EF4444" stroke-width="2.5" />

                <circle cx="465" cy="195" r="45" fill="rgba(59, 130, 246, 0.15)" stroke="#3B82F6" stroke-width="3" />
                <text x="465" y="193" fill="#3B82F6" font-size="14" font-weight="black" text-anchor="middle">INGLÉS</text>
                <text x="465" y="208" fill="currentColor" font-size="9" font-weight="bold" text-anchor="middle">Puente Global</text>
                <text x="465" y="220" fill="currentColor" font-size="8" class="opacity-75" text-anchor="middle">Híbrido de ambos</text>
              </g>

              <g id="americas-flow">
                <path d="M 465 150 Q 580 80 660 120" stroke="#3B82F6" stroke-width="2" stroke-dasharray="5,5" />
                <path d="M 330 290 Q 520 380 660 300" stroke="#EF4444" stroke-width="2" stroke-dasharray="5,5" />

                <rect x="660" y="90" width="110" height="50" rx="8" fill="rgba(59, 130, 246, 0.1)" stroke="#3B82F6" stroke-width="1.5" />
                <text x="715" y="112" fill="currentColor" font-size="10" font-weight="bold" text-anchor="middle">AMÉRICA DEL NORTE</text>
                <text x="715" y="126" fill="currentColor" font-size="9" class="opacity-75" text-anchor="middle">Inglés (25,000 p.)</text>

                <rect x="660" y="260" width="110" height="50" rx="8" fill="rgba(239, 68, 68, 0.1)" stroke="#EF4444" stroke-width="1.5" />
                <text x="715" y="282" fill="currentColor" font-size="10" font-weight="bold" text-anchor="middle">AMÉRICA LATINA</text>
                <text x="715" y="296" fill="currentColor" font-size="9" class="opacity-75" text-anchor="middle">Español (30,000 p.)</text>
              </g>
            </svg>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
        <div>
          <strong class="text-amber-500">Raíces Germánicas (Alemán/Inglés):</strong> Comparten el léxico básico de
          supervivencia (agua, tierra, familia). El alemán aporta a su inglés el pragmatismo estructural de la frase.
        </div>
        <div>
          <strong class="text-red-500">Raíces Románicas (Español/Inglés):</strong> El latín y el francés normando
          inyectaron al inglés más del 40% de su vocabulario complejo. El español le facilita la adquisición del inglés
          formal y académico.
        </div>
      </div>
    </div>
  </SectionHeading>
</template>
