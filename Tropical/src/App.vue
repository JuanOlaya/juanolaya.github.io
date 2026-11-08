<script setup lang="ts">
import AboutSection from './components/AboutSection.vue';
import FlavorsSection from './components/FlavorsSection.vue';
import HeroSection from './components/HeroSection.vue';
import SiteNav from './components/SiteNav.vue';
import VisitFooter from './components/VisitFooter.vue';
import { useLanguage } from './use-language';

const { fading } = useLanguage();
</script>

<template>
  <div :class="{ 'lang-fading': fading }">
    <SiteNav />
    <HeroSection />
    <AboutSection />
    <FlavorsSection />
    <VisitFooter />
  </div>
</template>
