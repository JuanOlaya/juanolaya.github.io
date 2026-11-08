<script setup lang="ts">
defineProps<{ title: string; href: string }>();
</script>

<template>
  <div class="p-4 bg-slate-50 rounded-xl border border-slate-200 hover:shadow-md transition-all">
    <div class="flex justify-between items-start">
      <h4 class="text-xs font-bold text-indigo-900 uppercase flex items-center gap-1">
        {{ title }}
        <slot name="badge" />
      </h4>
      <a
        :href="href"
        target="_blank"
        rel="noopener noreferrer"
        class="text-[10px] text-slate-400 hover:text-indigo-600 transition-all font-semibold"
        >Leer ley ↗</a
      >
    </div>
    <p class="text-xs text-slate-600 mt-1.5 leading-relaxed">
      <slot />
    </p>
  </div>
</template>
