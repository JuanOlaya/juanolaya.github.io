<script setup lang="ts">
import { projects, publishedProjects } from '../projects.ts';

const visibleProjects = publishedProjects(projects);
</script>

<!-- Renders the cards straight into the parent grid, between the profile and the links cards. -->
<template>
  <div v-for="project in visibleProjects" :key="project.title" class="card">
    <div class="title">{{ project.title }}</div>
    <br />
    <img v-if="project.image" class="card-image" :src="project.image" :alt="project.title" />
    <p class="description">{{ project.description }}</p>
    <br />
    <template v-for="(link, index) in project.links" :key="link.url">
      <br v-if="index > 0" />
      <a :href="link.url" target="_blank">{{ link.label }}</a>
    </template>
  </div>
</template>
