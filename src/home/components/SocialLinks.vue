<script setup lang="ts">
interface SocialLink {
  label: string;
  url: string;
}

const links: SocialLink[] = [
  { label: 'OpenProcessing', url: 'https://openprocessing.org/user/65585' },
  { label: 'Github', url: 'https://github.com/JuanOlaya/' },
  { label: 'Youtube', url: 'https://www.youtube.com/playlist?list=PLBD3ein1xee3-U3jtAEAsn_oqIB82Vh5B' },
  { label: 'ResearchGate', url: 'https://www.researchgate.net/profile/Juan-Olaya-Figueroa' },
  { label: 'CV', url: '/CV/JuanOlaya.pdf' },
];
</script>

<template>
  <div class="card">
    <div class="title">Find me on:</div>
    <br />
    <template v-for="link in links" :key="link.url">
      <a :href="link.url" target="_blank">{{ link.label }}</a>
      <br />
    </template>
    Berlin, Germany
  </div>
</template>
