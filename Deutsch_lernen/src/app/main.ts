import '@fontsource-variable/instrument-sans/wdth.css';
import { createApp } from 'vue';
import App from './App.vue';
import { createMemoRouter } from './router.ts';
import './style.css';

createApp(App).use(createMemoRouter()).mount('#app');

// The worker is generated at build time only; its scope covers the whole MemoDeutsch tree, legacy pages included.
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  void navigator.serviceWorker.register('/Deutsch_lernen/service-worker.js', { scope: '/Deutsch_lernen/' });
}
