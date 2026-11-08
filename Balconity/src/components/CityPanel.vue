<script setup lang="ts">
import type { City } from '../cities.ts';
import type { CityClock } from '../clock.ts';
import type { WeatherView } from '../weather.ts';

defineProps<{
  city: City;
  clock: CityClock;
  weather: WeatherView | null;
  active: boolean;
}>();
</script>

<template>
  <section v-show="active" :id="`${city.key}Title`" :class="city.titleClass">
    {{ city.title }}
  </section>
  <section v-show="active" :id="`${city.key}Info`">
    <div v-if="weather">
      <div class="cityIcon">
        <img :src="weather.iconUrl" alt="Weather Icon" width="75" height="75" />
      </div>
      <div class="cityTemperature">{{ weather.temperature }}° C</div>
    </div>
    <div class="cityTime">{{ clock.time }}</div>
    <div class="cityDate">{{ clock.date }}</div>
  </section>
</template>
