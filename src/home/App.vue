<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, useTemplateRef } from 'vue';
import BouncingBallsBackground from './components/BouncingBallsBackground.vue';
import HomeControls from './components/HomeControls.vue';
import ProfileCard from './components/ProfileCard.vue';
import ProjectGrid from './components/ProjectGrid.vue';
import SocialLinks from './components/SocialLinks.vue';

const gridVisible = ref(true);
const background = useTemplateRef<InstanceType<typeof BouncingBallsBackground>>('background');

// Space hides the cards so the animation can be watched on its own.
function toggleGridOnSpace(event: KeyboardEvent): void {
  if (event.code === 'Space') gridVisible.value = !gridVisible.value;
}

onMounted(() => document.addEventListener('keyup', toggleGridOnSpace));
onBeforeUnmount(() => document.removeEventListener('keyup', toggleGridOnSpace));
</script>

<template>
  <BouncingBallsBackground ref="background" />
  <div v-show="gridVisible" id="cardGrid" class="center">
    <div class="grid-container">
      <ProfileCard />
      <ProjectGrid />
      <SocialLinks />
    </div>
  </div>
  <HomeControls
    :grid-visible="gridVisible"
    @show-grid="gridVisible = true"
    @refresh="background?.refresh()"
  />
</template>
