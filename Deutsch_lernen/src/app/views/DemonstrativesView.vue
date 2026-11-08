<script setup lang="ts">
import { computed, ref } from 'vue';
import { RouterLink } from 'vue-router';
import DemonstrativeTable from '../components/DemonstrativeTable.vue';
import { demonstrativeCases } from '../demonstratives/cases.ts';
import { FAELLE, isFall } from '../demonstratives/types.ts';

/** Without `fall` this is the all-cases page; with it, one case, replacing four near-identical HTML pages. */
const props = defineProps<{ fall?: string }>();

const single = computed(() => (isFall(props.fall) ? demonstrativeCases[props.fall] : null));
const showAll = ref(false);
</script>

<template>
  <section class="mx-auto max-w-7xl">
    <nav class="mb-4 flex flex-wrap gap-2 text-sm" aria-label="Fälle">
      <RouterLink
        :to="{ name: 'demonstratives' }"
        class="rounded-full border border-gray-300 px-3 py-1"
        exact-active-class="bg-gray-800 text-white"
      >
        Alle Fälle
      </RouterLink>
      <RouterLink
        v-for="other in FAELLE"
        :key="other"
        :to="{ name: 'demonstrative', params: { fall: other } }"
        class="rounded-full border border-gray-300 px-3 py-1"
        exact-active-class="bg-gray-800 text-white"
      >
        {{ demonstrativeCases[other].label }}
      </RouterLink>
    </nav>

    <template v-if="single">
      <h1 class="mb-2 text-3xl font-bold text-gray-800">{{ single.title }}</h1>
      <p class="mb-6 text-gray-600">{{ single.intro }}</p>
      <DemonstrativeTable :entry="single" :rows="single.rows" :show-all="showAll" />
    </template>

    <template v-else>
      <h1 class="mb-3 text-center text-4xl font-bold text-gray-800">
        German Demonstratives - All Cases (A1–A2)
      </h1>
      <p class="mb-8 text-center text-lg text-gray-600">
        Demostrativos en alemán: <strong>dieser</strong> (este/esta), <strong>jener</strong> (aquel/aquella),
        <strong>jeder</strong> (cada), <strong>welcher</strong> (cuál) - Todos los casos
      </p>
      <div v-for="other in FAELLE" :key="other" class="mb-16">
        <h2 :class="demonstrativeCases[other].theme.heading" class="mb-4 text-center text-3xl font-bold">
          {{ demonstrativeCases[other].label }} Case
        </h2>
        <p class="mb-8 text-center text-gray-600">{{ demonstrativeCases[other].description }}</p>
        <DemonstrativeTable
          :entry="demonstrativeCases[other]"
          :rows="demonstrativeCases[other].overviewRows"
          :show-all="showAll"
        />
      </div>
    </template>

    <div class="mt-6 flex justify-end">
      <button
        type="button"
        class="rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white shadow-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
        @click="showAll = !showAll"
      >
        {{ showAll ? 'Ocultar todas las traducciones' : 'Mostrar todas las traducciones' }}
      </button>
    </div>
  </section>
</template>
