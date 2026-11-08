<script setup lang="ts">
import { Users } from 'lucide-vue-next';
import { useDarkMode } from '../use-dark-mode';
import SectionHeading from './SectionHeading.vue';

const { isDark } = useDarkMode();
</script>

<template>
  <SectionHeading :icon="Users" icon-class="bg-purple-500" spacing="mb-10" centered>
    <template #title>5. Diagrama de Intersección</template>

    <div
      class="p-10 rounded-3xl border inline-block w-full transition-colors bg-slate-50 border-slate-200 dark:bg-black/20 dark:border-white/5"
    >
      <svg
        viewBox="0 0 400 300"
        class="w-full max-w-md mx-auto drop-shadow-2xl"
        role="img"
        aria-label="Diagrama de Venn: español, alemán e inglés se cruzan en el cerebro trilingüe"
      >
        <circle cx="150" cy="120" r="85" fill="#EF4444" fill-opacity="0.1" stroke="#EF4444" stroke-width="3" />
        <text x="95" y="75" fill="#EF4444" font-size="14" font-weight="900" letter-spacing="0.05em">ESPAÑOL</text>
        <circle cx="250" cy="120" r="85" fill="#F59E0B" fill-opacity="0.1" stroke="#F59E0B" stroke-width="3" />
        <text x="250" y="75" fill="#F59E0B" font-size="14" font-weight="900" letter-spacing="0.05em">ALEMÁN</text>
        <circle
          cx="200"
          cy="185"
          r="85"
          fill="#3B82F6"
          fill-opacity="0.1"
          stroke="#3B82F6"
          stroke-width="3"
          stroke-dasharray="6"
        />
        <text x="175" y="255" fill="#3B82F6" font-size="14" font-weight="900" letter-spacing="0.05em">INGLÉS</text>
        <text x="180" y="145" :fill="isDark ? '#FFFFFF' : '#1E293B'" font-size="10" font-weight="900" text-anchor="middle">
          CEREBRO
        </text>
        <text x="180" y="158" :fill="isDark ? '#FFFFFF' : '#1E293B'" font-size="10" font-weight="900" text-anchor="middle">
          TRILINGÜE
        </text>
      </svg>
      <p class="mt-8 text-sm max-w-lg mx-auto leading-relaxed text-slate-600 dark:text-slate-400">
        El inglés ocupa el espacio central: se beneficia de la
        <strong class="text-red-500">sofisticación del español</strong> y la
        <strong class="text-amber-600">estructura del alemán</strong>.
      </p>
    </div>
  </SectionHeading>
</template>
