<script setup lang="ts">
import InfoCard from '@shared/components/InfoCard.vue';
import { GraduationCap, Target } from 'lucide-vue-next';
import { horizonCards } from '../content';
import SectionHeading from './SectionHeading.vue';
</script>

<template>
  <SectionHeading :icon="Target" icon-class="bg-emerald-500">
    <template #title>4. Horizonte: Los 18 Años</template>

    <p class="text-sm md:text-base leading-relaxed mb-8 text-slate-600 dark:text-slate-300">
      Aunque los tres idiomas alcancen la madurez nativa (~20k-30k palabras), cada uno cumplirá una función distinta en
      su vida. Así se proyecta su dominio equilibrado:
    </p>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <InfoCard
        v-for="card in horizonCards"
        :key="card.language"
        :class="[
          'p-8 rounded-3xl shadow-2xl border border-white/10 hover:-translate-y-2 transition-transform duration-300 text-white',
          card.cardClass,
        ]"
      >
        <div class="flex items-center gap-3 mb-4">
          <div class="bg-white/20 p-2 rounded-xl backdrop-blur-md flex items-center justify-center">
            <GraduationCap class="w-5 h-5 text-white" />
          </div>
          <span class="font-black uppercase tracking-wider text-sm">{{ card.language }}</span>
        </div>
        <div class="font-black text-4xl mb-2">{{ card.words }}</div>
        <div class="text-[10px] font-black bg-black/30 inline-block px-3 py-1 rounded-full mb-6 border border-white/10">
          {{ card.level }}
        </div>
        <div class="space-y-3 pt-4 border-t border-white/10">
          <span class="text-xs font-black block italic">{{ card.role }}</span>
          <p class="text-[11px] text-white/80 leading-relaxed font-medium">{{ card.description }}</p>
        </div>
      </InfoCard>
    </div>
  </SectionHeading>
</template>
