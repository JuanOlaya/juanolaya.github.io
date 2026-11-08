/**
 * Mutable page state that several verben modules reassign. ES modules cannot assign each other's bindings,
 * so the former closure `let`s live on this object.
 */
export const state = {
  // --- GLOBAL STATE ---
  allVerbsData: /** @type {Record<string, any>} */ ({}), // Global Data Containers
  verbGroupsByLevel: /** @type {Record<string, any>} */ ({}), // Global Data Containers
  verbTypesData: {}, // Verb types and notes data
  allGroupsIndex: [], // Full groups index from verbs_index.json for reliable theme search
  fileIndexData: null, // Existing JSON files by folder to avoid noisy 404 fetches
  wortfamilieIndex: null, // Search-ready Wortfamilie index hydrated from cache/background load
  physicalLevelMap: /** @type {Record<string, any>} */ ({

 'A1': [

 { key: 'A1_1', count: 16, fileNumbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16] },

 { key: 'A1_2', count: 18, fileNumbers: [15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32] }

 ],

 'A2': [

 { key: 'A2_1', count: 13, fileNumbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13] },

 { key: 'A2_2', count: 19, fileNumbers: [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31] }

 ],

 'B1': [{ key: 'B1_1', count: 26, fileNumbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26] }],

        'B2': [{ key: 'B2_1', count: 15, fileNumbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15] }]

 }),
  levelConfig: /** @type {Record<string, any>} */ ({

 'A1': { groupCount: 30, displayName: 'A1' },

 'A2': { groupCount: 28, displayName: 'A2' },

 'B1': { groupCount: 26, displayName: 'B1' },

        'B2': { groupCount: 15, displayName: 'B2' }

 }),
  currentLevel: 'A1',
  currentGroupInLevel: 0, // 0-indexed position within current level
  currentVerbInModal: '',
  modalDeferredLoadToken: 0,
  modalExampleLoadToken: 0,
  modalSessionId: 0,
  isRestoringModalTab: false,
  storyClickCounter: 0,
  currentViewMode: 'compact', // Tracks active view: 'normal', 'compact', 'niedlich', 'light'
  cachePersistTimeout: null,
  cachePersistenceDisabled: false,
  cacheHydrated: false,
  hydratedCacheVersion: null,
  // Theme data storage
  currentThemeData: null,
  appVersion: '1.6_static', // Stable version; replaced by verbs_index.lastUpdated when available
  isLevelMenuExpanded: false,
  footerUtilityBar: null,
  footerSearchShell: null,
  footerSearchPanel: null,
  footerSearchToggle: null,
  isFooterSearchExpanded: false,
  isFooterSearchForcedOpen: false,
  levelMenuIdleTimeout: null,
  searchIdleTimeout: null,
  // --- BACKGROUND LOADING & PROGRESS ---
  isBackgroundLoading: false,
  loadingProgressState: { cards: 0, conjugations: 0 },
  // --- UNIFIED SEARCH LOGIC ---
  // wortfamilieIndex is preloaded for search and refreshed through cache/version checks
  isLoadingWortfamilie: false,
  // Event listeners with debouncing for search
  searchTimeout: undefined,
};
