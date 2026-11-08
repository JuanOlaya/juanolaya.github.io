<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import AboutScreen from './components/AboutScreen.vue';
import CityPanel from './components/CityPanel.vue';
import { CITIES, cameraUrl } from './cities.ts';
import { formatCityClock } from './clock.ts';
import { stepIndex } from './selection.ts';
import { fetchCityWeather, type WeatherView } from './weather.ts';

const CLOCK_REFRESH_MS = 10_000;
const proxyUrl = import.meta.env.VITE_WEATHER_PROXY_URL ?? '';

const activeIndex = ref(0);
const aboutOpen = ref(true);
const isFullscreen = ref(false);
const now = ref(new Date());
const weatherBySlug = reactive<Record<string, WeatherView | null>>({});

const clocks = computed(() => CITIES.map((city) => formatCityClock(now.value, city.timeZone)));

let clockTimer: ReturnType<typeof setInterval> | undefined;

function showCity(delta: number): void {
  activeIndex.value = stepIndex(activeIndex.value, delta, CITIES.length);
}

async function toggleFullscreen(): Promise<void> {
  if (document.fullscreenElement) await document.exitFullscreen();
  else await document.documentElement.requestFullscreen();
}

function syncFullscreen(): void {
  isFullscreen.value = document.fullscreenElement !== null;
}

async function loadWeather(): Promise<void> {
  await Promise.all(
    CITIES.map(async (city) => {
      weatherBySlug[city.slug] = await fetchCityWeather(proxyUrl, city.slug);
    }),
  );
}

onMounted(() => {
  clockTimer = setInterval(() => (now.value = new Date()), CLOCK_REFRESH_MS);
  document.addEventListener('fullscreenchange', syncFullscreen);
  void loadWeather();
});

onBeforeUnmount(() => {
  clearInterval(clockTimer);
  document.removeEventListener('fullscreenchange', syncFullscreen);
});
</script>

<template>
  <!-- Every camera stays mounted, as in the original page, so switching city does not reload its stream. -->
  <section>
    <iframe
      v-for="(city, index) in CITIES"
      v-show="index === activeIndex"
      :id="`${city.key}Cam`"
      :key="city.slug"
      class="window"
      :title="city.title"
      :src="cameraUrl(city)"
      :width="city.width"
      :height="city.height"
      allow="autoplay"
      frameborder="0"
    ></iframe>
  </section>

  <section class="marginFrameBackground"><div id="frameBehind" class="frameBackground"></div></section>
  <section class="marginFrame"><div class="frame"></div></section>
  <section class="marginBoxCity"><div class="boxCity"></div></section>
  <section class="marginBoxInfoLeft"><div class="boxInfoLeft"></div></section>

  <span
    id="leftArrowIcon"
    class="material-icons-round span_no_selection"
    role="button"
    aria-label="Previous city"
    @click="showCity(-1)"
    >arrow_left</span
  >
  <span
    id="rightArrowIcon"
    class="material-icons-round span_no_selection"
    role="button"
    aria-label="Next city"
    @click="showCity(1)"
    >arrow_right</span
  >
  <span
    id="fullscreenIcon"
    class="material-icons-round span_no_selection"
    role="button"
    aria-label="Toggle fullscreen"
    @click="toggleFullscreen"
    >{{ isFullscreen ? 'fullscreen_exit' : 'fullscreen' }}</span
  >
  <span
    id="infoIcon"
    class="material-icons-outlined span_no_selection"
    role="button"
    aria-label="About Balconity"
    @click="aboutOpen = !aboutOpen"
    >help_outline</span
  >

  <CityPanel
    v-for="(city, index) in CITIES"
    :key="city.slug"
    :city="city"
    :clock="clocks[index]"
    :weather="weatherBySlug[city.slug] ?? null"
    :active="index === activeIndex"
  />

  <AboutScreen v-if="aboutOpen" @close="aboutOpen = false" />
</template>
