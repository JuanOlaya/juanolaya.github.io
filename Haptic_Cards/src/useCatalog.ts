import { computed, ref, watch } from 'vue';
import * as catalog from './catalog';
import { queryFromState, stateFromQuery } from './query';

/** Where the state is read from and written to; the browser location by default, a fake in tests. */
export interface QueryStore {
  read(): string;
  write(query: string): void;
}

export const locationStore: QueryStore = {
  read: () => window.location.search,
  // replaceState keeps Back meaning "leave the page" instead of replaying every click.
  write: (query) =>
    window.history.replaceState(null, '', `${window.location.pathname}${query}${window.location.hash}`),
};

export function useCatalog(store: QueryStore = locationStore) {
  const state = ref(stateFromQuery(store.read()));
  const update = (change: (current: catalog.CatalogState) => catalog.CatalogState) => {
    state.value = change(state.value);
  };

  watch(state, (current) => store.write(queryFromState(current)), { flush: 'sync' });

  const pattern = computed(() => catalog.patternAt(state.value.patternIndex));
  return {
    state,
    pattern,
    patternDevices: computed(() => catalog.devicesOf(pattern.value)),
    pageDevices: computed(() => catalog.pageDevices(state.value)),
    pageCount: computed(() => catalog.pageCount(pattern.value)),
    activeFamilyId: computed(() => catalog.activeFamilyId(state.value)),
    next: () => update(catalog.next),
    previous: () => update(catalog.previous),
    goToPage: (page: number) => update((current) => catalog.goToPage(current, page)),
    selectPattern: (index: number) => update((current) => catalog.selectPattern(current, index)),
    selectFamily: (id: string) => update((current) => catalog.selectFamily(current, id)),
  };
}
