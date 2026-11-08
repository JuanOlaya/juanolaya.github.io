<script setup lang="ts">
import { ref } from 'vue';
import { stepIndex } from '../selection.ts';

const emit = defineEmits<{ close: [] }>();

const SLIDES = [
  {
    icon: 'wb_incandescent',
    text: 'The incubation effect refers to a process where you set aside an unsolved problem to divert attention and then return to it later. This helps rearranging the problem and finding a solution.',
  },
  {
    icon: 'psychology',
    text: 'Evidence in psychology shows that engaging in simple tasks during break times increases the incubation effect.',
  },
  {
    icon: 'explore',
    text: 'This digital experience invites you to divert attention by evoking the curiosity of observing another place in real time. How does it look there? Close this window to find out.',
  },
] as const;

// The parent mounts this screen with v-if, so every opening starts again at the first slide.
const slideIndex = ref(0);

function step(delta: number): void {
  slideIndex.value = stepIndex(slideIndex.value, delta, SLIDES.length);
}
</script>

<template>
  <section id="infoScreen">
    <div class="marginFrame screenInfo">
      <br />
      <div id="aboutTitle">Balconity: The place to find inspiration</div>
      <br /><br /><br /><br />
      <div class="slideshow-container">
        <!-- Inline display because the original CSS hides every .mySlides by default. -->
        <div
          v-for="(slide, index) in SLIDES"
          :key="slide.icon"
          class="mySlides fade"
          :style="{ display: index === slideIndex ? 'block' : 'none' }"
        >
          <div class="aboutIconMargin">
            <span class="aboutIcon material-icons span_no_selection">{{ slide.icon }}</span>
          </div>
          <br /><br /><br /><br />
          <div class="text">{{ slide.text }}</div>
        </div>
      </div>
      <div>
        <span
          id="leftArrowAboutIcon"
          class="material-icons-round span_no_selection"
          role="button"
          aria-label="Previous slide"
          @click="step(-1)"
          >arrow_left</span
        >
        <span
          id="rightArrowAboutIcon"
          class="material-icons-round span_no_selection"
          role="button"
          aria-label="Next slide"
          @click="step(1)"
          >arrow_right</span
        >
      </div>
      <br />
      <div class="marginDot">
        <!-- The explicit space reproduces the gap the original markup had between inline dots. -->
        <template v-for="(slide, index) in SLIDES" :key="slide.icon">
          <span
            class="dot"
            :class="{ active: index === slideIndex }"
            role="button"
            :aria-label="`Slide ${index + 1}`"
            @click="slideIndex = index"
          ></span
          >{{ ' ' }}
        </template>
      </div>
      <span
        id="cancelInfoScreen"
        class="material-icons-round span_no_selection"
        role="button"
        aria-label="Close"
        @click="emit('close')"
        >highlight_off</span
      >
    </div>
  </section>
</template>
