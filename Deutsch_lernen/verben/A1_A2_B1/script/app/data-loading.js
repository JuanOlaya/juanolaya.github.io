/** Verb data loading: local cache snapshot, background loading, group files and lazy modal data. Moved verbatim from script.js. */
import { setFooterSearchExpanded } from './layout.js';
import { autoConfigureLevelsFromGroups, getPhysicalGroupData } from './levels.js';
import { loadWortfamilieIndex } from './search.js';
import { PRELOAD_CONJUGATIONS_IN_BACKGROUND, cardsContainer, lazyExampleLoadPromises, levelOrder, searchInput, verbModal } from './shared.js';
import { state } from './state.js';
import { generateTagFilters } from './view-controls.js';
import { clearSearchAndRender } from './views.js';


 export function createCachePayload({ compact = false } = {}) {

 const payload = {

 allVerbsData: lightweightVerbData(state.allVerbsData),

 verbGroupsByLevel: state.verbGroupsByLevel,

 allGroupsIndex: state.allGroupsIndex,

 fileIndexData: state.fileIndexData,

 wortfamilieIndex: state.wortfamilieIndex,

 lastUpdated: state.appVersion || new Date().toISOString(),

 timestamp: Date.now(),

 cacheMode: compact ? 'compact' : 'full'

 };

 return compact ? compactToLevel(payload, state.currentLevel) : payload;

 }


 export function persistCacheSnapshot() {

 if (state.cachePersistenceDisabled) return;

 try {

 memoStorage.writeVerbCache(createCachePayload());

 } catch (e) {

 try {

 memoStorage.writeVerbCache(createCachePayload({ compact: true }));

 } catch (compactError) {

 state.cachePersistenceDisabled = true;

 clearTimeout(state.cachePersistTimeout);

 }

 }

 }

 export function scheduleCachePersist() {

 if (state.cachePersistenceDisabled) return;

 clearTimeout(state.cachePersistTimeout);

 state.cachePersistTimeout = setTimeout(() => {

 persistCacheSnapshot();

 }, 250);

 }

export function hydrateFromLocalCache() {

 try {

 const cached = memoStorage.readVerbCache();

 if (!cached) return false;

 const data = normalizeMojibakeDeep(cached);

 if (!data || !data.allVerbsData || !data.verbGroupsByLevel) return false;

 state.allVerbsData = data.allVerbsData;

 state.verbGroupsByLevel = data.verbGroupsByLevel;

 state.allGroupsIndex = Array.isArray(data.allGroupsIndex) ? data.allGroupsIndex : [];

 if (state.allGroupsIndex.length > 0) autoConfigureLevelsFromGroups(state.allGroupsIndex);

 state.fileIndexData = data.fileIndexData || null;

 if (data.wortfamilieIndex && typeof data.wortfamilieIndex === 'object') {

 state.wortfamilieIndex = data.wortfamilieIndex;

 }

 if (data.lastUpdated) {
    state.appVersion = data.lastUpdated.replace(/\s+/g, '_').replace(/:/g, '-');
    state.hydratedCacheVersion = data.lastUpdated;
  }

 state.cacheHydrated = true;

 return true;

 } catch (e) {

 console.warn("Failed to hydrate from local cache", e);

 state.cacheHydrated = false;

 state.hydratedCacheVersion = null;

 return false;

 }

}

 export function hasCachedGroup(levelKey, groupIndex) {

 const group = state.verbGroupsByLevel[levelKey] && state.verbGroupsByLevel[levelKey][groupIndex];

 if (!group || !Array.isArray(group.verbs)) return false;

 return group.verbs.every(verbName => !!state.allVerbsData[verbName]);

 }

 export function hasCachedLevel(levelKey) {

 const config = state.levelConfig[levelKey];

 if (!config || !state.verbGroupsByLevel[levelKey]) return false;

 for (let i = 0; i < config.groupCount; i++) {

 if (!hasCachedGroup(levelKey, i)) return false;

 }

 return true;

 }

 export function updateLoadingProgress(percentage, phase = 'cards') {

 if (!searchInput) return;

 state.loadingProgressState[phase] = Math.max(0, Math.min(100, percentage));

 const cardsProgress = Math.round(state.loadingProgressState.cards || 0);

 const conjugationsProgress = Math.round(state.loadingProgressState.conjugations || 0);

 const overallProgress = cardsProgress;

 if (phase === 'cards' && percentage < 100) {

 setFooterSearchExpanded(true, { forced: true });

 state.footerSearchShell?.classList.add('loading-active');

 searchInput.style.background = `linear-gradient(to right, rgba(250,112,154,0.65) 0%, rgba(254,225,64,0.65) ${overallProgress}%, rgba(15,23,42,0.92) ${overallProgress}%, rgba(15,23,42,0.92) 100%)`;

 searchInput.placeholder = `cards ${Math.round(percentage)}%`;

 searchInput.classList.add('loading-active');

 } else {

 if (cardsProgress >= 100 && conjugationsProgress >= 100) {

 searchInput.placeholder = "Suchen... (buscar)";

 searchInput.classList.remove('loading-active');

 searchInput.style.background = '';

 state.footerSearchShell?.classList.remove('loading-active');

 if (state.isFooterSearchForcedOpen) {

 setFooterSearchExpanded(false);

 }

 }

 }

 }

export async function loadBackgroundData() {

 let remoteVersion = null;

 // 1. Check for updates (Version Check)

 try {

    const vRes = await fetch('json/verbs_index.json?t=' + Date.now(), { cache: 'no-cache' });

 if (vRes.ok) {
    const vData = await parseJsonUtf8(vRes);
    remoteVersion = vData.lastUpdated;
    state.allGroupsIndex = Array.isArray(vData.groups) ? vData.groups : state.allGroupsIndex;
    if (state.allGroupsIndex.length > 0) autoConfigureLevelsFromGroups(state.allGroupsIndex);

    if (remoteVersion) {
      state.appVersion = remoteVersion.replace(/\s+/g, '_').replace(/:/g, '-');
    }

    console.log("Remote version:", remoteVersion);
    console.log("Actions build link: https://github.com/JuanOlaya/juanolaya.github.io/actions/");

    if (Array.isArray(vData.groups)) {
      const summary = {};
      let totalVerbs = 0;
      let totalGroups = vData.groups.length;
      const levelOrder = ["A1.1", "A1.2", "A2.1", "A2.2", "B1.1", "B2.1"];
      levelOrder.forEach(l => {
        summary[l] = { groups: 0, verbs: 0 };
      });
      vData.groups.forEach(g => {
        const lvl = g.level;
        if (!summary[lvl]) {
          summary[lvl] = { groups: 0, verbs: 0 };
        }
        summary[lvl].groups += 1;
        const count = Array.isArray(g.verbs) ? g.verbs.length : (g.verbCount || 0);
        summary[lvl].verbs += count;
        totalVerbs += count;
      });

      console.log('%cUpdating verbs index...', 'color: #9e9e9e;');
      console.log('%c✓ Index updated: %c%d verbs %cacross %c%d groups', 
                  'color: #4CAF50; font-weight: bold;', 
                  'color: #00bcd4; font-weight: bold;', totalVerbs,
                  'color: #4CAF50; font-weight: bold;',
                  'color: #00bcd4; font-weight: bold;', totalGroups);
      console.log('%cSummary by level:', 'color: #ff9800; font-weight: bold;');
      levelOrder.forEach(lvl => {
        const info = summary[lvl];
        if (info && info.groups > 0) {
          console.log(`  %c${lvl}: %c${info.groups}%c groups, %c${info.verbs}%c verbs`, 
                      'color: #e91e63; font-weight: bold;',
                      'color: #ff9800; font-weight: bold;',
                      'color: #ffffff;',
                      'color: #ff9800; font-weight: bold;',
                      'color: #ffffff;');
        }
      });
    }
  }
  try {

    const stylesLink = document.querySelector('link[href*="styles.css"]');

    const scriptTag = document.querySelector('script[src*="script.js"]');

    const stylesVersion = stylesLink ? new URL(stylesLink.href, window.location.href).searchParams.get('v') : 'unknown';

    const scriptVersion = scriptTag ? new URL(scriptTag.src, window.location.href).searchParams.get('v') : 'unknown';

    console.log("styles.css?v=" + stylesVersion);

    console.log("script.js?v=" + scriptVersion);

  } catch (err) {

    console.warn("Could not retrieve file versions from DOM:", err);

  }


 } catch (e) {

 console.warn("Version check failed (offline?)", e);

 }

 const cacheMatchesRemoteVersion =

 state.cacheHydrated && state.hydratedCacheVersion && remoteVersion && state.hydratedCacheVersion === remoteVersion;

 if (state.cacheHydrated && (!remoteVersion || cacheMatchesRemoteVersion)) {

 if (!state.wortfamilieIndex) {

 await loadWortfamilieIndex();

 scheduleCachePersist();

 }

 console.log("Skipping background load because local cache already matches the current version.");

 state.loadingProgressState = { cards: 100, conjugations: 100 };

 updateLoadingProgress(100, 'cards');

 updateLoadingProgress(100, 'conjugations');

 state.isBackgroundLoading = false;

 return;

 }

 // 2. Try to load from LocalStorage

 try {

 const cached = memoStorage.readVerbCache();

 if (cached) {

 const data = normalizeMojibakeDeep(cached);

 // Cache is valid IF:

 // a) We failed to get remote version (assume offline/safe), OR

 // b) Remote version matches cached version

 const isCacheValid = !remoteVersion || (data.lastUpdated === remoteVersion);

 if (isCacheValid && data.allVerbsData && data.verbGroupsByLevel) {

 console.log("Loaded data from LocalStorage cache (Version match).");

 state.allVerbsData = data.allVerbsData;

 state.verbGroupsByLevel = data.verbGroupsByLevel;

 if ((!Array.isArray(state.allGroupsIndex) || state.allGroupsIndex.length === 0) && Array.isArray(data.allGroupsIndex)) {

 state.allGroupsIndex = data.allGroupsIndex;

 }

 if (!state.fileIndexData && data.fileIndexData) {

 state.fileIndexData = data.fileIndexData;

 }

 if (data.wortfamilieIndex && typeof data.wortfamilieIndex === 'object') {

 state.wortfamilieIndex = data.wortfamilieIndex;

 }

 if (data.lastUpdated) {
    state.appVersion = data.lastUpdated.replace(/\s+/g, '_').replace(/:/g, '-');
  }

 if (!state.wortfamilieIndex) {

 await loadWortfamilieIndex();

 scheduleCachePersist();

 }

 state.loadingProgressState = { cards: 100, conjugations: 100 };

 updateLoadingProgress(100, 'cards');

 updateLoadingProgress(100, 'conjugations');

 state.isBackgroundLoading = false;

 generateTagFilters();
  console.log("100% of the data is loaded.");

 if (searchInput && searchInput.value.trim() !== '') {

 searchInput.dispatchEvent(new Event('input'));

 }

 return; // SKIP NETWORK LOADING

  } else {

  console.log("Cache outdated or invalid. Reloading from network.");

  state.wortfamilieIndex = null;

  if (state.allVerbsData) {

  Object.keys(state.allVerbsData).forEach(verbName => {

  if (state.allVerbsData[verbName]) {

  delete state.allVerbsData[verbName].wortfamilie;

  delete state.allVerbsData[verbName]._wortfamilieLoaded;

  delete state.allVerbsData[verbName]._deferredLoaded;

  delete state.allVerbsData[verbName].konjunktiv_ii;

  delete state.allVerbsData[verbName].praesens_examples;

  delete state.allVerbsData[verbName].praeteritum_examples;

  delete state.allVerbsData[verbName].praesens_fragen;

  }

  });

  }

  }

 }

 } catch (e) {

 console.warn("Failed to load/parse cache", e);

 }

 if (state.isBackgroundLoading) return;

 state.isBackgroundLoading = true;

 console.log("Starting background data load...");

 state.loadingProgressState = { cards: 0, conjugations: 0 };

 updateLoadingProgress(0, 'cards');

 // Collect all tasks EXCEPT current one (already loading/loaded)

 const loadTasks = [];

 let totalTasks = 0;

 levelOrder.forEach(levelKey => {

 const config = state.levelConfig[levelKey];

 for (let i = 1; i <= config.groupCount; i++) {

 loadTasks.push({ levelKey, i });

 }

 });

 totalTasks = loadTasks.length;

 let loadedTasks = 0;

 const BATCH_SIZE = 10;

 const DELAY_MS = 20;

 for (let i = 0; i < loadTasks.length; i += BATCH_SIZE) {

 const batch = loadTasks.slice(i, i + BATCH_SIZE);

 const batchPromises = batch.map(async task => {

 const levelKey = task.levelKey;

 const groupIndex = task.i - 1;

 // 1. Check if already loaded

 if (hasCachedGroup(levelKey, groupIndex)) {

 return;

 }

 const physData = getPhysicalGroupData(levelKey, groupIndex);

 if (!physData) return;

 const fileNumber = physData.fileNumber;

 // 2. Fetch Group Data

 try {

 const groupUrl = `json/groups/${physData.physicalKey}/${physData.physicalKey}_group_${fileNumber}.json${state.appVersion ? '?v=' + state.appVersion : ''}`;

 const res = await fetch(groupUrl);

 if (!res.ok) return;

 const groupData = await parseJsonUtf8(res);

 if (!state.verbGroupsByLevel[levelKey]) state.verbGroupsByLevel[levelKey] = [];

 state.verbGroupsByLevel[levelKey][groupIndex] = groupData;

 // 3. Fetch Verbs that are NEW

 const verbsToLoad = groupData.verbs || [];

 const newVerbs = (state.cacheHydrated && cacheMatchesRemoteVersion)

 ? verbsToLoad.filter(v => !state.allVerbsData[v])

 : verbsToLoad;

 if (newVerbs.length > 0) {

 const cardPromises = newVerbs.map(verbName =>

 fetch(`json/cards/${verbName}.json${state.appVersion ? '?v=' + state.appVersion : ''}`)

 .then(res => res.ok ? parseJsonUtf8(res) : {})

 .then(data => { state.allVerbsData[verbName] = data; })

 .catch(() => { state.allVerbsData[verbName] = {}; })

 );

 await Promise.all(cardPromises);

 }

 } catch (e) {

 console.warn(`Background load failed for ${levelKey} group ${task.i}`, e);

 }

 });

 await Promise.all(batchPromises);

 loadedTasks += batch.length;

 const percent = Math.min(100, (loadedTasks / totalTasks) * 100);

 updateLoadingProgress(percent, 'cards');

 // Yield

 if (i + BATCH_SIZE < loadTasks.length) {

 await new Promise(r => setTimeout(r, DELAY_MS));

 }

 }

 updateLoadingProgress(100, 'cards');

 await loadWortfamilieIndex();

 scheduleCachePersist();

 if (PRELOAD_CONJUGATIONS_IN_BACKGROUND) {

 const physicalLayers = state.physicalLevelMap[state.currentLevel] || [];

 const layersToLoad = physicalLayers.map(l => l.key);

 await loadBulkConjugations(layersToLoad, updateLoadingProgress);

 } else {

 state.loadingProgressState.conjugations = 100;

 }

 console.log("Background loading complete.");
  console.log("100% of the data is loaded.");

 updateLoadingProgress(100, 'conjugations');

 state.isBackgroundLoading = false;

 generateTagFilters();
  console.log("100% of the data is loaded.");

 // Save to LocalStorage

 try {

 memoStorage.writeVerbCache(createCachePayload());

 console.log("Saved data to LocalStorage cache");

 } catch (e) {

 try {

 persistCacheSnapshot();

 } catch (nestedError) {

 console.warn("Failed to save to cache", nestedError);

 }

 }

 // If the UI started from stale cache, repaint the current view once

 // füresh background data is ready so moved verbs/groups appear immediately.

 if (searchInput && searchInput.value.trim() === '') {

 clearSearchAndRender();

 }

 // Re-run search if user typed something while loading

 if (searchInput && searchInput.value.trim() !== '') {

 searchInput.dispatchEvent(new Event('input'));

 }

 }

 // --- OPTIMIZED LAZY LOADING ---

 export async function loadGroupData(levelKey, groupIndex, options = {}) {

 const { silent = false, includeConjugations = true } = options;

 // Validate inputs

 if (!state.levelConfig[levelKey]) return;

 // 1. Check if group is already loaded in memory

 if (hasCachedGroup(levelKey, groupIndex)) {

 return; // Data active

 }

 const physData = getPhysicalGroupData(levelKey, groupIndex);

 if (!physData) return;

 const fileNumber = physData.fileNumber;

 // Show loading state

 if (!silent) {

 cardsContainer.innerHTML = '<div class="loading-spinner">Daten werden geladen...</div>';

 }

 const groupUrl = `json/groups/${physData.physicalKey}/${physData.physicalKey}_group_${fileNumber}.json${state.appVersion ? '?v=' + state.appVersion : ''}`;

 try {

 const res = await fetch(groupUrl);

 if (!res.ok) throw new Error(`Group not found: ${groupUrl}`);

 const groupData = await parseJsonUtf8(res);

 // Initialize level array if needed

 if (!state.verbGroupsByLevel[levelKey]) {

 state.verbGroupsByLevel[levelKey] = [];

 }

 state.verbGroupsByLevel[levelKey][groupIndex] = groupData;

 // 2. Identify new verbs to load

 const verbsToLoad = groupData.verbs || [];

 // Filter out verbs we already have data for

 const newVerbs = verbsToLoad.filter(v => !state.allVerbsData[v]);

 if (newVerbs.length > 0) {

 // 3. Fetch Card Data for new verbs

 const cardPromises = newVerbs.map(verbName =>

 fetch(`json/cards/${verbName}.json${state.appVersion ? '?v=' + state.appVersion : ''}`)

 .then(res => res.ok ? parseJsonUtf8(res) : {})

 .then(data => { state.allVerbsData[verbName] = data; })

 .catch(() => { state.allVerbsData[verbName] = {}; })

 );

 await Promise.all(cardPromises);

 // 4. Fetch Conjugations for new verbs only when needed.

 // Compact mode initial render only needs the card data.

 if (includeConjugations) {

 const physData = getPhysicalGroupData(levelKey, groupIndex);

 if (physData) {

 await loadBulkConjugations([physData.physicalKey], () => {});

 }

 }

 }

 scheduleCachePersist();

 } catch (error) {

 console.error(`Failed to load group data (${levelKey} / ${groupIndex + 1}):`, error);

 if (!silent) {

 cardsContainer.innerHTML = '<p>Fehler beim Laden der Gruppe. Bitte Seite neu laden.</p>';

 }

 }

 }

 export async function loadAllGroupsForLevel(levelKey) {

 const config = state.levelConfig[levelKey];

 if (!config) return;

 const loadPromises = [];

 for (let groupIndex = 0; groupIndex < config.groupCount; groupIndex++) {

 loadPromises.push(loadGroupData(levelKey, groupIndex, { silent: true, includeConjugations: false }));

 }

 await Promise.all(loadPromises);

 }

 export async function loadFileIndex() {

 if (state.fileIndexData) return state.fileIndexData;

 try {

 const query = state.appVersion ? `?v=${encodeURIComponent(state.appVersion)}` : '';

 const response = await fetch(`json/file_index.json${query}`, { cache: 'no-cache' });

 if (!response.ok) throw new Error(`Failed to load file index: ${response.status}`);

 state.fileIndexData = await parseJsonUtf8(response);

 } catch (error) {

 console.warn('Failed to load file index, falling back to direct fetches.', error);

 state.fileIndexData = {};

 }

 return state.fileIndexData;

 }

 export function fileExistsInIndex(folder, verbName) {

 if (!state.fileIndexData || !state.fileIndexData[folder]) return true;

 return state.fileIndexData[folder].includes(verbName);

 }

 export let loadedBulkConjugations = new Set();

 export async function loadBulkConjugations(physicalLayers, progressCallback = null) {

 const layersToFetch = physicalLayers.filter(layer => !loadedBulkConjugations.has(layer));

 if (layersToFetch.length === 0) {

 if (progressCallback) progressCallback(100, 'conjugations');

 return;

 }

 let loaded = 0;

 const total = layersToFetch.length;

 for (const layer of layersToFetch) {

 try {

 const query = state.appVersion ? `?v=${state.appVersion}` : '';

 const url = `json/conjugations_bulk/${layer}_conjugations.json${query}`;

 const res = await fetch(url);

 if (res.ok) {

 const data = await parseJsonUtf8(res);

 for (const [verbName, verbData] of Object.entries(data)) {

 if (!state.allVerbsData[verbName]) state.allVerbsData[verbName] = {};

 const safeMerge = (target, source) => mergeVerbData(target, source);

 safeMerge(state.allVerbsData[verbName], verbData);

 }

 loadedBulkConjugations.add(layer);

 }

 } catch (e) {

 console.warn(`Failed to load bulk conjugations for ${layer}:`, e);

 }

 loaded++;

 if (progressCallback) {

 progressCallback(Math.min(100, (loaded / total) * 100), 'conjugations');

 }

 }

 }

 export async function loadVerbPraesensData(verbName) {

 await loadFileIndex();

 const existingData = state.allVerbsData[verbName] || {};

 if (existingData.praesens) {

 return existingData;

 }

 const query = state.appVersion ? `?v=${state.appVersion}` : '';

 const praesensData = fileExistsInIndex('praesens', verbName)

 ? await fetch(`json/praesens/${verbName}.json${query}`).then(res => res.ok ? parseJsonUtf8(res) : {}).catch(() => ({}))

 : {};

 const safeMerge = (target, source) => mergeVerbData(target, source, ['es', 'wir', 'ihr', 'sie', 'es_example', 'en_example']);

 const mergedData = { ...existingData };

 safeMerge(mergedData, praesensData);

 state.allVerbsData[verbName] = mergedData;

 return state.allVerbsData[verbName];

 }

 export async function loadVerbModalDeferredData(verbName) {

 await loadFileIndex();

 const existingData = state.allVerbsData[verbName] || {};

 const query = state.appVersion ? `?v=${state.appVersion}` : '';

 const maybeFetchJson = (folder, fallback = {}) =>

 fileExistsInIndex(folder, verbName)

 ? fetch(`json/${folder}/${verbName}.json${query}`).then(res => res.ok ? parseJsonUtf8(res) : fallback).catch(() => fallback)

 : Promise.resolve(fallback);

 const shouldRefetchWortfamilie =

 existingData._wortfamilieLoaded !== true ||

 !Array.isArray(existingData.wortfamilie) ||

 existingData.wortfamilie.length === 0;

 const [

 konjunktivData,

 wortfamilieData

 ] = await Promise.all([

 konjunktivVerbs.includes(verbName) && !existingData.konjunktiv_ii

 ? maybeFetchJson('konjunktiv_ii', {})

 : Promise.resolve({}),

 !shouldRefetchWortfamilie

 ? Promise.resolve({ wortfamilie: existingData.wortfamilie || [] })

 : maybeFetchJson('wortfamilie', { wortfamilie: [] })

 ]);

 // PROTECT CORE PROPERTIES: Ensure conjugation data (which might have rogue root "es" keys) 

 // doesn't overwrite the verb's translation and basic info.

 const safeMerge = (target, source) => mergeVerbData(target, source);

 const mergedData = { ...existingData };

 safeMerge(mergedData, konjunktivData);

 // Specific handling for word family

 mergedData.wortfamilie = Array.isArray(wortfamilieData.wortfamilie) ? wortfamilieData.wortfamilie : (mergedData.wortfamilie || []);

 mergedData._wortfamilieLoaded = true;

 mergedData._deferredLoaded = true;

 state.allVerbsData[verbName] = mergedData;

 // PERSISTENCE & RELIABILITY: Double-check if the merge created a corruption ([object Object])

 // This acts as a recovery mechanism for users with corrupted localStorage.

 if (state.allVerbsData[verbName] && typeof state.allVerbsData[verbName].es === 'object') {

 console.error(`Detected data corruption for ${verbName}. Restoring basic translation.`);

 state.allVerbsData[verbName].es = existingData.es || "hablar";

 }

 scheduleCachePersist();

 return state.allVerbsData[verbName];

 }




 export async function loadVerbExamplesData(verbName, tabId = 'infinitiv') {

 await loadFileIndex();

 const normalizedTab = normalizeModalTabId(tabId);

 const existingData = state.allVerbsData[verbName] || {};

 if (!tabNeedsLazyExamples(verbName, existingData, normalizedTab)) {

 return existingData;

 }

 const requestKey = getExampleLoadKey(verbName, normalizedTab);

 if (lazyExampleLoadPromises.has(requestKey)) {

 return lazyExampleLoadPromises.get(requestKey);

 }

 const query = state.appVersion ? `?v=${state.appVersion}` : '';

 const maybeFetchJson = (folder, fallback = {}) =>

 fileExistsInIndex(folder, verbName)

 ? fetch(`json/${folder}/${verbName}.json${query}`).then(res => res.ok ? parseJsonUtf8(res) : fallback).catch(() => fallback)

 : Promise.resolve(fallback);

 const safeMerge = (target, source) => mergeVerbData(target, source);

 const loadPromise = (async () => {

 let exampleData = {};

 /** @type {Record<string, any>} */ let conjugationData = {};

 if (normalizedTab === 'infinitiv') {

 const [praesensExamplesData, praesensQuestionData] = await Promise.all([

 !existingData.praesens_examples

 ? maybeFetchJson('examples/praesens_examples', {})

 : Promise.resolve({}),

 !existingData.praesens_fragen

 ? maybeFetchJson('examples/praesens_question_examples', {})

 : Promise.resolve({})

 ]);

 exampleData = {

 ...praesensExamplesData,

 ...praesensQuestionData

 };

 } else if (normalizedTab === 'perfekt') {

 exampleData = !existingData.perfekt_examples

 ? await maybeFetchJson('examples/perfekt_examples', {})

 : {};

 } else if (normalizedTab === 'praeteritum') {

 const [praeteritumExamplesData, praeteritumConjugationData] = await Promise.all([

 !existingData.praeteritum_examples

 ? maybeFetchJson('examples/praeteritum_examples', {})

 : Promise.resolve({}),

 !existingData.praeteritum_conjugations

 ? maybeFetchJson('praeteritum_konjugation', {})

 : Promise.resolve({})

 ]);

 exampleData = praeteritumExamplesData;

 conjugationData = praeteritumConjugationData;

 if (conjugationData.praeteritum) {

 conjugationData.praeteritum_conjugations = conjugationData.praeteritum;

 delete conjugationData.praeteritum;

 }

 if (conjugationData.praeteritum_conjugation) {

 conjugationData.praeteritum_conjugations = conjugationData.praeteritum_conjugation;

 delete conjugationData.praeteritum_conjugation;

 }

 } else if (normalizedTab === 'konjunktiv') {

 const [konjunktivExamplesData, konjunktivConjugationData] = await Promise.all([

 !existingData.konjunktiv_ii_examples

 ? maybeFetchJson('examples/konjunktiv_ii_examples', {})

 : Promise.resolve({}),

 (konjunktivVerbs.includes(verbName) && !existingData.konjunktiv_ii)

 ? maybeFetchJson('konjunktiv_ii', {})

 : Promise.resolve({})

 ]);

 exampleData = konjunktivExamplesData;

 conjugationData = konjunktivConjugationData;

 }

 const mergedData = { ...(state.allVerbsData[verbName] || {}) };

 safeMerge(mergedData, conjugationData);

 safeMerge(mergedData, exampleData);

 state.allVerbsData[verbName] = mergedData;

 scheduleCachePersist();

 return mergedData;

 })();

 lazyExampleLoadPromises.set(requestKey, loadPromise);

 try {

 return await loadPromise;

 } finally {

 lazyExampleLoadPromises.delete(requestKey);

 }

 }

 export function maybeLoadExamplesForActiveTab(verbName, tabId) {

 const normalizedTab = normalizeModalTabId(tabId);

 const verbData = state.allVerbsData[verbName] || {};

 if (!tabNeedsLazyExamples(verbName, verbData, normalizedTab)) {

 return;

 }

 const token = ++state.modalExampleLoadToken;

 const sessionId = state.modalSessionId;

 loadVerbExamplesData(verbName, normalizedTab)

 .then(() => {

 if (state.modalExampleLoadToken !== token || state.modalSessionId !== sessionId || state.currentVerbInModal !== verbName || !verbModal.classList.contains('visible')) return;

 const activeTabNow = document.querySelector('.modal-tab-btn.active')?.dataset.tab || normalizedTab;

 window.openModalForVerb(verbName, {

 skipDeferredReload: true,

 skipExampleReload: true,

 preferredTab: activeTabNow

 });

 })

 .catch(error => {

 console.error(`Failed to load lazy examples for ${verbName} (${normalizedTab}):`, error);

 });

 }
