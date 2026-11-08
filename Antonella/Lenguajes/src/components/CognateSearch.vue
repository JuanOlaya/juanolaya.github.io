<script setup lang="ts">
import { Search } from 'lucide-vue-next';
import { computed, ref } from 'vue';
import { cognates } from '../content';
import { findCognate } from '../vocabulary';
import LabCard from './LabCard.vue';

const query = ref('');
const isEmpty = computed(() => query.value.trim() === '');
const match = computed(() => findCognate(cognates, query.value));
const isLatin = computed(() => match.value?.type === 'latin');
</script>

<template>
  <LabCard
    :icon="Search"
    icon-class="bg-blue-500/10 text-blue-500"
    title="2. Analizador de Puentes Trilingües"
    hint="Busca palabras para verificar por qué vía se asimilan."
  >
    <div class="relative mb-4">
      <input
        v-model="query"
        type="text"
        placeholder="Ej: problema, milch, familia, haus..."
        aria-label="Buscar una palabra"
        class="w-full px-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 dark:bg-slate-950 dark:border-slate-800 dark:text-white dark:placeholder-slate-600"
      />
    </div>

    <div aria-live="polite">
      <div v-if="isEmpty" class="text-center py-6 text-slate-500 text-xs italic">
        Escribe una palabra de ejemplo para ver el anclaje lingüístico exacto.
      </div>
      <div
        v-else-if="match"
        :class="[
          'p-4 rounded-2xl border text-left transition-all bg-slate-50 dark:bg-slate-900/60',
          isLatin ? 'border-red-500/20' : 'border-amber-500/20',
        ]"
      >
        <div class="flex justify-between items-center mb-2">
          <span
            :class="[
              'text-xs font-black uppercase px-2 py-0.5 rounded',
              isLatin ? 'text-red-500 bg-red-500/10' : 'text-amber-500 bg-amber-500/10',
            ]"
          >
            {{ isLatin ? 'Puente Latino' : 'Puente Germánico' }}
          </span>
          <span class="text-xs font-bold text-slate-400">
            Inglés: <strong class="text-blue-500 italic font-black">{{ match.en }}</strong>
          </span>
        </div>
        <p class="text-xs leading-relaxed text-slate-600 dark:text-slate-300">{{ match.explanation }}</p>
      </div>
      <div v-else class="text-center py-6 text-indigo-500 text-xs font-medium">
        No se encontraron cognados exactos para '{{ query }}'. Prueba con 'haus', 'wasser', 'familia' o 'problema'.
      </div>
    </div>
  </LabCard>
</template>
