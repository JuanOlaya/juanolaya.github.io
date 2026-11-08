<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { CARDS_PER_PAGE } from './catalog';
import DeviceCard from './components/DeviceCard.vue';
import FilterBar from './components/FilterBar.vue';
import IntroModal from './components/IntroModal.vue';
import { devices } from './data/devices';
import { patternNames, patterns } from './data/patterns';
import type { PatternName } from './data/types';
import { useCatalog } from './useCatalog';

const catalog = useCatalog();
const { state, pattern, patternDevices, pageDevices, pageCount, activeFamilyId } = catalog;
const introOpen = ref(false);

const icon = computed(() => patterns.find((candidate) => candidate.name === pattern.value)?.icon ?? '⚙️');
const firstShown = computed(() => state.value.page * CARDS_PER_PAGE + 1);
const lastShown = computed(() => firstShown.value + pageDevices.value.length - 1);
const rangeLabel = computed(() =>
  firstShown.value === lastShown.value ? `${lastShown.value}` : `${firstShown.value}–${lastShown.value}`,
);

function pageTitle(page: number): string {
  const total = patternDevices.value.length;
  return `Controllers ${page * CARDS_PER_PAGE + 1}–${Math.min((page + 1) * CARDS_PER_PAGE, total)}`;
}

function selectPattern(name: PatternName): void {
  catalog.selectPattern(patternNames.indexOf(name));
}

function onKeydown(event: KeyboardEvent): void {
  if (event.key === 'ArrowRight') catalog.goToPage(state.value.page + 1);
  else if (event.key === 'ArrowLeft') catalog.goToPage(state.value.page - 1);
  else if (event.key === 'Escape') introOpen.value = false;
}

onMounted(() => window.addEventListener('keydown', onKeydown));
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown));
</script>

<template>
  <div class="mx-auto flex w-full max-w-[1600px] grow flex-col">
    <header
      class="mb-4 flex flex-col items-center justify-between gap-4 rounded-2xl border border-[#001011]/10 bg-[#ECEDE8] px-5 py-3.5 shadow-xs md:flex-row"
    >
      <div class="flex w-full items-center justify-start gap-3 md:w-auto md:flex-1">
        <div
          class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#001011] text-xl text-white shadow-md select-none"
        >
          🎮
        </div>
        <div>
          <h1 class="text-xl leading-none font-black tracking-tight text-[#001011] sm:text-2xl">
            Haptic VR Controllers
          </h1>
          <p class="mt-0.5 text-xs font-medium text-[#001011]/70">
            Categorization &bull; 21 Pattern Dashboard
          </p>
        </div>
      </div>

      <div class="flex w-full flex-col items-center justify-center md:w-auto md:flex-initial lg:flex-1">
        <div class="flex w-full items-center justify-center gap-2 sm:gap-3">
          <button
            type="button"
            title="Previous set"
            aria-label="Previous set"
            class="nav-btn"
            @click="catalog.previous()"
          >
            <span class="-ml-0.5 leading-none select-none">◀</span>
          </button>
          <div
            class="flex w-[280px] shrink-0 items-center justify-center gap-2 rounded-xl border border-[#001011]/10 bg-white/80 px-3 py-2 text-center shadow-xs sm:w-[320px] md:w-[340px]"
          >
            <span class="shrink-0 text-xl select-none" data-testid="hero-icon">{{ icon }}</span>
            <span
              class="truncate text-xs font-black tracking-tight text-[#001011] sm:text-sm md:text-base"
              data-testid="hero-title"
              >{{ pattern }}</span
            >
            <span
              v-if="patternDevices.length > 0"
              class="ml-1 rounded-full bg-[#fd5321]/10 px-2 py-0.5 text-[11px] font-bold text-[#fd5321]"
              data-testid="hero-count"
              >{{ patternDevices.length }}</span
            >
          </div>
          <button
            type="button"
            title="Next set"
            aria-label="Next set"
            class="nav-btn"
            @click="catalog.next()"
          >
            <span class="-mr-0.5 leading-none select-none">▶</span>
          </button>
        </div>

        <div class="mt-1.5 flex min-h-[16px] items-center justify-center gap-1.5" data-testid="page-dots">
          <template v-if="pageCount > 1">
            <div class="flex items-center gap-1.5">
              <button
                v-for="(_, page) in pageCount"
                :key="page"
                type="button"
                :title="pageTitle(page)"
                :aria-label="pageTitle(page)"
                :aria-current="page === state.page"
                class="cursor-pointer transition-all duration-200"
                :class="
                  page === state.page
                    ? 'h-2 w-5 rounded-full bg-[#fd5321]'
                    : 'h-2 w-2 rounded-full bg-[#001011]/25 hover:bg-[#001011]/60'
                "
                @click="catalog.goToPage(page)"
              ></button>
            </div>
            <span class="ml-1.5 text-xs font-semibold text-[#001011]/60 select-none"
              >{{ rangeLabel }} of {{ patternDevices.length }} controllers</span
            >
          </template>
        </div>
      </div>

      <div class="flex w-full items-center justify-center md:w-auto md:flex-1 md:justify-end">
        <button
          type="button"
          class="flex items-center gap-1.5 rounded-xl bg-[#fd5321] px-3 py-1.5 text-xs font-bold text-white shadow-xs transition-all hover:bg-[#e04818] active:scale-95"
          @click="introOpen = true"
        >
          <span>ℹ️</span> <span>Categorization Info</span>
        </button>
      </div>
    </header>

    <main class="my-auto flex grow flex-col justify-center py-2">
      <div
        class="grid min-h-[500px] w-full grid-cols-1 items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-4"
        data-testid="cards"
      >
        <DeviceCard v-for="device in pageDevices" :key="device.name" :device="device" />
        <div
          v-if="pageDevices.length === 0"
          class="col-span-full flex flex-col items-center justify-center rounded-2xl border border-[#001011]/15 bg-white/70 py-16 text-center"
        >
          <span class="mb-2 text-4xl">{{ icon }}</span>
          <p class="font-medium text-gray-600">No controllers registered in this pattern yet.</p>
        </div>
      </div>
    </main>

    <FilterBar
      :active-pattern="pattern"
      :active-family-id="activeFamilyId"
      :device-count="devices.length"
      @select-family="catalog.selectFamily"
      @select-pattern="selectPattern"
    />
  </div>

  <IntroModal v-if="introOpen" @close="introOpen = false" />
</template>
