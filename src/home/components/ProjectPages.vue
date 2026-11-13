<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue';
import { projectCategories } from '../projectPages.ts';
import type { Rect } from '../sketch/orbit.ts';

const emit = defineEmits<{ attract: [rect: Rect | null] }>();

// The card the background rings are circling; its box is re-sent when the page scrolls or resizes.
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

function followCard(): void {
  if (activeCard) attractTo(activeCard);
}

onMounted(() => {
  window.addEventListener('scroll', followCard, { passive: true });
  window.addEventListener('resize', followCard);
});
onBeforeUnmount(() => {
  window.removeEventListener('scroll', followCard);
  window.removeEventListener('resize', followCard);
});
</script>

<template>
  <section class="projects" aria-label="Projects by category">
    <div
      v-for="category in projectCategories"
      :key="category.name"
      class="project-category"
      :aria-labelledby="'category-' + category.name.toLowerCase()"
    >
      <h2 :id="'category-' + category.name.toLowerCase()" class="title category-title">
        {{ category.name }}
      </h2>
      <ul class="projects-list">
        <li v-for="page in category.projects" :key="category.name + '-' + page.href">
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
    </div>
  </section>
</template>
