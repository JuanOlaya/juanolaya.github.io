import '@fontsource-variable/instrument-sans/wdth.css';
import { createApp } from 'vue';
import App from './App.vue';
import { createMemoRouter } from './router.ts';
import './style.css';

createApp(App).use(createMemoRouter()).mount('#app');
