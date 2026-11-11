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
      class="mb-5 grid grid-cols-1 items-center gap-4 border-b border-line-strong pb-4 md:grid-cols-[1fr_auto_1fr] md:gap-6"
    >
      <div class="flex items-center gap-3">
        <div
          class="flex h-11 w-11 shrink-0 items-center justify-center rounded-key bg-plate text-signal-bright"
          aria-hidden="true"
        >
          <!-- A contact point radiating pulses: the brand mark for "haptic". -->
          <svg viewBox="0 0 24 24" class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="1.75">
            <circle cx="12" cy="12" r="2.25" fill="currentColor" stroke="none" />
            <path stroke-linecap="round" d="M8 8.5a5 5 0 0 0 0 7M16 8.5a5 5 0 0 1 0 7" />
            <path
              stroke-linecap="round"
              opacity="0.55"
              d="M5 5.5a9.2 9.2 0 0 0 0 13M19 5.5a9.2 9.2 0 0 1 0 13"
            />
          </svg>
        </div>
        <div class="min-w-0">
          <p class="spec-label">HCI &middot; Handheld haptics catalogue</p>
          <h1
            class="text-2xl leading-none font-semibold tracking-tight text-ink [font-stretch:85%] sm:text-[1.75rem]"
          >
            Haptic VR Controllers
          </h1>
        </div>
      </div>

      <div class="flex flex-col items-center">
        <div class="flex w-full items-center justify-center gap-2 sm:gap-3">
          <button
            type="button"
            title="Previous set"
            aria-label="Previous set"
            class="keycap nav-btn"
            @click="catalog.previous()"
          >
            <svg
              viewBox="0 0 24 24"
              class="h-5 w-5"
              fill="none"
              stroke="currentColor"
              stroke-width="2.25"
              aria-hidden="true"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 18 9 12l6-6" />
            </svg>
          </button>
          <div
            class="flex h-11 w-[250px] min-w-0 shrink items-center gap-2.5 rounded-key border border-line bg-surface px-2 shadow-[inset_0_1px_2px_rgb(0_0_0/0.06)] sm:w-[340px]"
          >
            <span
              class="flex h-8 w-8 shrink-0 items-center justify-center rounded-[4px] bg-sunken text-lg select-none"
              data-testid="hero-icon"
              >{{ icon }}</span
            >
            <span
              class="min-w-0 grow truncate text-sm font-semibold tracking-tight text-ink sm:text-base"
              data-testid="hero-title"
              >{{ pattern }}</span
            >
            <span
              v-if="patternDevices.length > 0"
              class="shrink-0 rounded-[4px] bg-signal-tint px-1.5 py-0.5 font-mono text-xs font-medium text-signal-ink"
              data-testid="hero-count"
              >{{ patternDevices.length }}</span
            >
          </div>
          <button
            type="button"
            title="Next set"
            aria-label="Next set"
            class="keycap nav-btn"
            @click="catalog.next()"
          >
            <svg
              viewBox="0 0 24 24"
              class="h-5 w-5"
              fill="none"
              stroke="currentColor"
              stroke-width="2.25"
              aria-hidden="true"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>

        <div class="mt-2 flex min-h-[24px] items-center justify-center gap-2" data-testid="page-dots">
          <template v-if="pageCount > 1">
            <div class="flex items-center">
              <!-- Thin visual bars inside a 24px hit area so the page buttons stay tappable. -->
              <button
                v-for="(_, page) in pageCount"
                :key="page"
                type="button"
                :title="pageTitle(page)"
                :aria-label="pageTitle(page)"
                :aria-current="page === state.page"
                class="group flex h-6 items-center px-1"
                @click="catalog.goToPage(page)"
              >
                <span
                  class="block h-1 rounded-[1px] transition-all duration-200"
                  :class="page === state.page ? 'w-6 bg-signal' : 'w-3 bg-line-strong group-hover:bg-ink-3'"
                ></span>
              </button>
            </div>
            <span class="font-mono text-[11px] text-ink-3 select-none"
              >{{ rangeLabel }} of {{ patternDevices.length }} controllers</span
            >
          </template>
        </div>
      </div>

      <div class="flex items-center justify-center md:justify-end">
        <button
          type="button"
          class="keycap flex h-10 items-center gap-2 px-3.5 text-sm font-semibold"
          @click="introOpen = true"
        >
          <svg
            viewBox="0 0 24 24"
            class="h-4 w-4 text-signal-ink"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="9" />
            <path stroke-linecap="round" d="M12 11v5.5M12 7.6v.1" />
          </svg>
          <span>Categorization Info</span>
        </button>
      </div>
    </header>

    <main class="my-auto flex grow flex-col justify-center pb-5">
      <div
        class="cards-grid grid min-h-[500px] w-full grid-cols-1 items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-4"
        data-testid="cards"
      >
        <DeviceCard v-for="device in pageDevices" :key="device.name" :device="device" />
        <div
          v-if="pageDevices.length === 0"
          class="col-span-full flex flex-col items-center justify-center rounded-panel border border-dashed border-line-strong bg-surface py-16 text-center"
        >
          <span class="mb-2 text-4xl" aria-hidden="true">{{ icon }}</span>
          <p class="font-medium text-ink-2">No controllers registered in this pattern yet.</p>
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
