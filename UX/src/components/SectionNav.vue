<script setup lang="ts">
import { sectionLinks } from '../content';

const linkClass =
  'inline-flex min-h-11 shrink-0 items-center whitespace-nowrap rounded-button px-3 text-caption ' +
  'font-medium text-ink-2 no-underline hover:bg-white/10 hover:text-ink motion-safe:transition-colors';
</script>

<template>
  <!-- The root carries only the scroll container so the parent can toggle its display per breakpoint. -->
  <nav aria-label="Secciones de la infografía" class="scroll-row">
    <div class="flex items-center gap-1">
      <a v-for="link in sectionLinks" :key="link.href" :href="link.href" :class="linkClass">{{
        link.label
      }}</a>
      <a
        href="#gemini-hub"
        :class="`${linkClass} border border-white/15 bg-white/5 text-accent-text hover:text-accent-text`"
        >✦ Gemini AI Hub</a
      >
    </div>
  </nav>
</template>
