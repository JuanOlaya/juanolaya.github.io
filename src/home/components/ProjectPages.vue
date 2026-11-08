<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue';
import { projectPages } from '../projectPages.ts';
import type { Rect } from '../sketch/orbit.ts';

const emit = defineEmits<{ attract: [rect: Rect | null] }>();

// The card the background rings are circling; its box is re-sent while the page scrolls.
let activeCard: HTMLElement | null = null;

function attractTo(card: HTMLElement | null): void {
  activeCard = card;
  emit('attract', card ? card.getBoundingClientRect() : null);
}

// Touch gets plain tap navigation, without the effect.
function onPointerEnter(event: PointerEvent): void {
  if (event.pointerType !== 'touch') attractTo(event.currentTarget as HTMLElement);
}

function onPointerLeave(event: PointerEvent): void {
  if (event.pointerType !== 'touch') attractTo(null);
}

// Only keyboard focus: a mouse click already triggered the hover.
function onFocus(event: FocusEvent): void {
  const card = event.currentTarget as HTMLElement;
  if (card.matches(':focus-visible')) attractTo(card);
}

function followScroll(): void {
  if (activeCard) attractTo(activeCard);
}

onMounted(() => window.addEventListener('scroll', followScroll, { passive: true }));
onBeforeUnmount(() => window.removeEventListener('scroll', followScroll));
</script>

<template>
  <section class="projects" aria-labelledby="projects-title">
    <h2 id="projects-title" class="title projects-title">Projects</h2>
    <ul class="projects-list">
      <li v-for="page in projectPages" :key="page.href">
        <a
          class="card project-card"
          :href="page.href"
          @pointerenter="onPointerEnter"
          @pointerleave="onPointerLeave"
          @focus="onFocus"
          @blur="attractTo(null)"
        >
          <span class="project-card-title">{{ page.title }}</span>
          <span class="project-card-description">{{ page.description }}</span>
        </a>
      </li>
    </ul>
  </section>
</template>
