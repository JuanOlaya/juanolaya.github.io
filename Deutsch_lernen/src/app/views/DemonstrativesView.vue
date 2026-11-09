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

const pill =
  'inline-flex min-h-11 items-center rounded-full border border-white/15 bg-white/5 px-4 font-medium text-ink no-underline hover:bg-white/10 motion-safe:transition-colors';
const activePill = 'border-accent-hover bg-accent-hover/20';
</script>

<template>
  <section class="mx-auto max-w-7xl">
    <nav class="mb-4 flex flex-wrap gap-2" aria-label="Fälle">
      <RouterLink :to="{ name: 'demonstratives' }" :class="pill" :exact-active-class="activePill">
        Alle Fälle
      </RouterLink>
      <RouterLink
        v-for="other in FAELLE"
        :key="other"
        :to="{ name: 'demonstrative', params: { fall: other } }"
        :class="pill"
        :exact-active-class="activePill"
      >
        {{ demonstrativeCases[other].label }}
      </RouterLink>
    </nav>

    <template v-if="single">
      <h1 class="mb-2 text-[clamp(26px,1.4rem+1vw,36px)] leading-[1.1] font-medium text-ink">
        {{ single.title }}
      </h1>
      <p class="mb-6 text-ink-2">{{ single.intro }}</p>
      <DemonstrativeTable :entry="single" :rows="single.rows" :show-all="showAll" />
    </template>

    <template v-else>
      <h1 class="mb-3 text-[clamp(26px,1.4rem+1vw,36px)] leading-[1.1] font-medium text-ink">
        German Demonstratives - All Cases (A1–A2)
      </h1>
      <p class="mb-8 text-ink-2">
        Demostrativos en alemán: <strong>dieser</strong> (este/esta), <strong>jener</strong> (aquel/aquella),
        <strong>jeder</strong> (cada), <strong>welcher</strong> (cuál) - Todos los casos
      </p>
      <div v-for="other in FAELLE" :key="other" class="mb-16">
        <h2
          :class="demonstrativeCases[other].theme.heading"
          class="mb-2 text-[clamp(20px,1.1rem+0.5vw,26px)] leading-none font-medium"
        >
          {{ demonstrativeCases[other].label }} Case
        </h2>
        <p class="mb-6 text-ink-2">{{ demonstrativeCases[other].description }}</p>
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
        class="inline-flex min-h-11 min-w-11 items-center gap-1.5 rounded-button bg-accent px-4 font-medium text-on-accent hover:bg-accent-hover motion-safe:transition-colors"
        @click="showAll = !showAll"
      >
        {{ showAll ? 'Ocultar todas las traducciones' : 'Mostrar todas las traducciones' }}
      </button>
    </div>
  </section>
</template>
