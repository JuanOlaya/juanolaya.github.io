<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
</script>

<template>
  <header
    class="sticky top-0 z-50 flex min-h-14 items-center justify-between gap-3 border-b border-border bg-bg/80 px-[clamp(16px,5vw,64px)] backdrop-blur-[6px]"
  >
    <nav class="flex min-w-0 items-center" aria-label="Volver">
      <a
        href="/"
        class="inline-flex min-h-11 shrink-0 items-center px-2 text-link no-underline underline-offset-2 hover:underline"
        aria-label="Volver a la portada"
      >
        ← Inicio
      </a>
      <a
        href="../"
        class="inline-flex min-h-11 items-center truncate px-2 text-link no-underline underline-offset-2 hover:underline"
      >
        MemoDeutsch
      </a>
    </nav>
    <RouterLink
      :to="{ name: 'home' }"
      class="inline-flex min-h-11 shrink-0 items-center px-2 font-medium text-ink no-underline hover:underline"
    >
      App
    </RouterLink>
  </header>
  <main class="mx-auto max-w-6xl px-[clamp(16px,5vw,64px)] py-6">
    <RouterView />
  </main>
</template>
