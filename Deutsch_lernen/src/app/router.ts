import { createRouter, createWebHashHistory, type RouteRecordRaw, type RouterHistory } from 'vue-router';
import { demonstrativeCases } from './demonstratives/cases.ts';
import { isFall } from './demonstratives/types.ts';

const APP_TITLE = 'MemoDeutsch';

/**
 * Hash history: the app lives in the legacy `Deutsch_lernen/` tree on GitHub Pages, which has no SPA
 * fallback, so `/Deutsch_lernen/app/#/…` is the only form that survives a reload or a shared link.
 */
export const routes: RouteRecordRaw[] = [
  { path: '/', name: 'home', component: () => import('./views/HomeView.vue'), meta: { title: APP_TITLE } },
  {
    path: '/demonstrativ',
    name: 'demonstratives',
    component: () => import('./views/DemonstrativesView.vue'),
    meta: { title: 'German Demonstratives - All Cases (A1–A2)' },
  },
  {
    path: '/demonstrativ/:fall',
    name: 'demonstrative',
    component: () => import('./views/DemonstrativesView.vue'),
    props: true,
    // An unknown case falls back to the all-cases table instead of an empty page.
    beforeEnter: (to) => (isFall(to.params.fall) ? true : { name: 'demonstratives' }),
  },
  { path: '/:unknown(.*)*', redirect: { name: 'home' } },
];

export function titleFor(params: Record<string, unknown>, metaTitle: unknown): string {
  if (isFall(params.fall)) return demonstrativeCases[params.fall].title;
  return typeof metaTitle === 'string' ? metaTitle : APP_TITLE;
}

export function createMemoRouter(history: RouterHistory = createWebHashHistory()) {
  const router = createRouter({ history, routes });
  router.afterEach((to) => {
    if (typeof document !== 'undefined') document.title = titleFor(to.params, to.meta.title);
  });
  return router;
}
