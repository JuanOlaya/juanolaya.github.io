<script setup lang="ts">
import { projectPages } from '../projectPages.ts';
</script>

<template>
  <section class="projects" aria-labelledby="projects-title">
    <h2 id="projects-title" class="title projects-title">Projects</h2>
    <ul class="projects-list">
      <li v-for="page in projectPages" :key="page.href">
        <a class="card project-card" :href="page.href">
          <span class="project-card-title">{{ page.title }}</span>
          <span class="project-card-description">{{ page.description }}</span>
        </a>
      </li>
    </ul>
  </section>
</template>
