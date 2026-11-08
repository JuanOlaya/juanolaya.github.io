/** Verb and Wortfamilie search. Moved verbatim from script.js. */
import { hasCachedGroup, loadBulkConjugations, loadGroupData, scheduleCachePersist } from './data-loading.js';
import { getGlobalGroupIndex } from './levels.js';
import { cardsContainer, levelIndicator, levelOrder, searchInput } from './shared.js';
import { state } from './state.js';
import { createCompactCardElement, getAllSearchGroupEntries, renderVerbGroup } from './views.js';


 // --- SEARCH FUNCTIONALITY ---

 // searchInput moved to top

 export const clearSearchBtn = document.getElementById('clear-search');

 export const searchCounter = document.getElementById('search-counter');

export async function loadWortfamilieIndex() {

 if (state.wortfamilieIndex) return state.wortfamilieIndex;

 if (state.isLoadingWortfamilie) return null; // Prevent double loading

 state.isLoadingWortfamilie = true;

 try {

 const url = state.appVersion

 ? `json/wortfamilie_index.json?v=${encodeURIComponent(state.appVersion)}`

 : 'json/wortfamilie_index.json';

 const response = await fetch(url);

 if (!response.ok) {

 throw new Error(`HTTP error! status: ${response.status} ${response.statusText}`);

 }

 state.wortfamilieIndex = await parseJsonUtf8(response);

 scheduleCachePersist();

 return state.wortfamilieIndex;

 } catch (error) {

 console.error("Failed to load Wortfamilie index:", error);

 console.error("Error details:", error.message, error.name);

 // Fallback or retry logic could go here

 return null;

 } finally {

 state.isLoadingWortfamilie = false;

 }

 }

 // --- Whole-Word Regex Highlighter ---





 export async function performSearch() {

 if (!searchInput) return;
  console.log("performSearch called with query:", searchInput.value);
const searchTerm = normalizeSearchValue(searchInput.value.trim());

 // Unified Search: We now search both Verbs and Wortfamilie

 // 1. Wortfamilie Search (start async)

 const wortfamiliePromise = loadWortfamilieIndex()

 .then(() => performWortfamilieSearch(searchTerm, true)) // true = return results only, don't render yet

 .catch(err => {

 console.error("Wortfamilie search failed", err);

 return [];

 });

 // Show/hide clear button

 if (clearSearchBtn) {

 if (searchTerm.length > 0) {

 clearSearchBtn.classList.add('visible');

 } else {

 clearSearchBtn.classList.remove('visible');

 }

 }

 // Only search if 2+ characters

  if (searchTerm.length < 2) {
    renderVerbGroup();
    if (searchCounter) searchCounter.textContent = '';
    // Re-enable level indicator
    if (levelIndicator) {
      levelIndicator.style.opacity = '1';
      levelIndicator.style.pointerEvents = 'auto';
    }
    return;
  }

 // Disable level indicator during search

 if (levelIndicator) {

 levelIndicator.style.opacity = '0.3';

 levelIndicator.style.pointerEvents = 'none';

 }

 // Search across ALL groups in all levels

 const searchPromises = [];

 const groupEntries = getAllSearchGroupEntries();

 for (const entry of groupEntries) {

 const levelKey = entry.levelKey;

 const groupIndexInLevel = entry.groupIndexInLevel;

 let group = entry.group;

 if (!group || !Array.isArray(group.verbs)) continue;

 // Check if group name matches search term (German, Spanish, or English)

 const groupNameMatch = (group.theme && normalizeSearchValue(group.theme).includes(searchTerm)) ||

 (group.germanName && normalizeSearchValue(group.germanName).includes(searchTerm)) ||

 (group.spanishName && normalizeSearchValue(group.spanishName).includes(searchTerm)) ||

 (group.englishName && normalizeSearchValue(group.englishName).includes(searchTerm)) ||

 (group.groupNameGerman && normalizeSearchValue(group.groupNameGerman).includes(searchTerm)) ||

 (group.groupNameSpanish && normalizeSearchValue(group.groupNameSpanish).includes(searchTerm)) ||

 (group.groupNameEnglish && normalizeSearchValue(group.groupNameEnglish).includes(searchTerm));

 if (groupNameMatch && !hasCachedGroup(levelKey, groupIndexInLevel)) {

 try {

 await loadGroupData(levelKey, groupIndexInLevel, { silent: true });

 const hydratedGroup = state.verbGroupsByLevel[levelKey] && state.verbGroupsByLevel[levelKey][groupIndexInLevel];

 if (hydratedGroup && Array.isArray(hydratedGroup.verbs)) {

 group = hydratedGroup;

 }

 } catch (e) {

 console.warn(`Failed to silently hydrate search group ${levelKey}/${groupIndexInLevel + 1}`, e);

 }

 }

 if (groupNameMatch) {

 }

 group.verbs.forEach(verbName => {
   let verbData = state.allVerbsData[verbName];
   // Create a promise for each verb to search (including lazy-loaded praesens)
   const searchPromise = (async () => {
     try {
       if (!verbData) {
         if (groupNameMatch || normalizeSearchValue(verbName).includes(searchTerm)) {
           try {
             const res = await fetch(`json/cards/${verbName}.json${state.appVersion ? '?v=' + state.appVersion : ''}`);
             if (res.ok) {
               verbData = await parseJsonUtf8(res);
               state.allVerbsData[verbName] = verbData;
             }
           } catch (e) {}
         }
       }
       if (!verbData) return null;

 // If the group matches, return this verb immediately as a match

 if (groupNameMatch) {

 return {

 verb: verbName,

 data: verbData,

 levelKey: levelKey,

 groupIndexInLevel: groupIndexInLevel

 };

 }

 // Helper function to check if search term is contained as a word in text

 const containsWord = (text, term) => Boolean(findMatchingWordInText(text, term));

 let matchedPraesensForm = '';

 let matchedPerfektForm = '';

 let matchedPraeteritumForm = '';

 let matchedKonjunktivForm = '';

 // Search in German infinitive and Spanish translation

 const germanMatch = normalizeSearchValue(verbName).includes(searchTerm);

 let spanishMatch = containsWord(verbData.es, searchTerm);

 // Also search in searchable Spanish variants

 if (!spanishMatch && verbData.es_searchable) {

 spanishMatch = verbData.es_searchable.some(variant =>

 containsWord(variant, searchTerm)

 );

 }

 // Search in Perfekt (German and Spanish)

 let perfektMatch = false;

 if (verbData.perfekt && typeof verbData.perfekt === 'string') {

 const perfektWords = verbData.perfekt.toLowerCase().split(' ');

 // Exclude auxiliary verbs "hat" and "ist" from search

 const filteredPerfektWords = perfektWords.filter(word => word !== 'hat' && word !== 'ist');

 perfektMatch = filteredPerfektWords.some(word => word.startsWith(searchTerm));

 if (perfektMatch) {

 matchedPerfektForm = filteredPerfektWords.find(word => word.startsWith(searchTerm)) || '';

 }

 }

 if (!perfektMatch && state.allVerbsData[verbName].perfekt_examples) {

 const perfektEntries = Object.values(state.allVerbsData[verbName].perfekt_examples);

 matchedPerfektForm = findMatchingTextEntry(perfektEntries, searchTerm, (entry) => entry && entry.de);

 perfektMatch = Boolean(matchedPerfektForm);

 }

 // Search in Spanish Perfekt forms (he dado, ha dado, etc.)

 if (!perfektMatch && verbData.es_perfekt) {

 perfektMatch = containsWord(verbData.es_perfekt, searchTerm);

 }

 if (!perfektMatch && verbData.es_perfekt_searchable) {

 perfektMatch = verbData.es_perfekt_searchable.some(variant =>

 containsWord(variant, searchTerm)

 );

 }

 // TAG SEARCH LOGIC

 let tagMatch = false;

 if (searchTerm.startsWith('tag:')) {

 const tagTerm = searchTerm.replace('tag:', '').toLowerCase();

 const caseTagsMatch = verbData.case_tags && verbData.case_tags.some(tag => tag.toLowerCase() === tagTerm);

 const generalTagsMatch = verbData.tags && verbData.tags.some(tag => tag.toLowerCase() === tagTerm);

 if (caseTagsMatch || generalTagsMatch) {

 tagMatch = true;

 }

 } else {

 // General search includes filtering by tag naming too

 const caseTagsMatch = verbData.case_tags && verbData.case_tags.some(tag => tag.toLowerCase().includes(searchTerm));

 const generalTagsMatch = verbData.tags && verbData.tags.some(tag => tag.toLowerCase().includes(searchTerm));

 if (caseTagsMatch || generalTagsMatch) {

 tagMatch = true;

 }

 }

 const needsConjugationData =

 !state.allVerbsData[verbName].praesens ||

 !state.allVerbsData[verbName].praeteritum_conjugations ||

 (konjunktivVerbs.includes(verbName) && !state.allVerbsData[verbName].konjunktiv_ii);

 const baseMatchAlreadyFound = germanMatch || spanishMatch || perfektMatch || tagMatch;

 const shouldAttemptConjugationSearch = !baseMatchAlreadyFound && searchTerm.length >= 3;

 if (shouldAttemptConjugationSearch && needsConjugationData) {

 const physicalLayer = (state.allVerbsData[verbName].level || '').replace('.', '_');

 if (physicalLayer) {

 await loadBulkConjugations([physicalLayer]);

 }

 }

 // Search in Praesens conjugations (pre-loaded when needed)

 let praesensMatch = false;

 if (shouldAttemptConjugationSearch && state.allVerbsData[verbName].praesens) {

 const conjugations = Object.values(state.allVerbsData[verbName].praesens);

 matchedPraesensForm = findMatchingTextEntry(conjugations, searchTerm);

 praesensMatch = Boolean(matchedPraesensForm);

 }

 // Search in Praeteritum conjugations (pre-loaded when needed)

 let praeteritumMatch = false;

 if (shouldAttemptConjugationSearch && state.allVerbsData[verbName].praeteritum_conjugations) {

 const conjugations = Object.values(state.allVerbsData[verbName].praeteritum_conjugations);

 matchedPraeteritumForm = findMatchingTextEntry(conjugations, searchTerm, (conj) => {

 if (typeof conj === 'string') return conj;

 return conj && conj.de ? conj.de : '';

 });

 praeteritumMatch = Boolean(matchedPraeteritumForm);

 }

 // Search in Spanish Praeteritum forms

 if (!praeteritumMatch && verbData.es_praeteritum) {

 praeteritumMatch = containsWord(verbData.es_praeteritum, searchTerm);

 }

 // Also search in searchable Praeteritum variants

 if (!praeteritumMatch && verbData.es_praeteritum_searchable) {

 praeteritumMatch = verbData.es_praeteritum_searchable.some(variant =>

 containsWord(variant, searchTerm)

 );

 }

 // Search in Konjunktiv II conjugations (pre-loaded when needed)

 let konjunktivMatch = false;

 if (shouldAttemptConjugationSearch && state.allVerbsData[verbName].konjunktiv_ii) {

 const conjugations = Object.values(state.allVerbsData[verbName].konjunktiv_ii);

 matchedKonjunktivForm = findMatchingTextEntry(conjugations, searchTerm);

 konjunktivMatch = Boolean(matchedKonjunktivForm);

 }

 if (germanMatch || spanishMatch || perfektMatch || praesensMatch || praeteritumMatch || konjunktivMatch || tagMatch) {

 return {

 verb: verbName,

 data: verbData,

 levelKey: levelKey,

 groupIndexInLevel: groupIndexInLevel,

 matchedPraesensForm,

 matchedPerfektForm,

 matchedPraeteritumForm,

 matchedKonjunktivForm

 };

 }

 return null;

 } catch (e) {

 console.error(`Error searching verb ${verbName}:`, e);

 return null;

 }

 })();

  searchPromises.push(searchPromise);
 });

 }

 // Wait for both searches to complete

 const [verbResults, wfResults] = await Promise.all([

 Promise.all(searchPromises).then(results => results.filter(r => r !== null)),

 wortfamiliePromise

 ]);

 // Flatten verb results

 let finalVerbResults = verbResults.flat();

 // Merge logic:

 const uniqueVerbsMap = new Map();

 // Add direct verb matches

 finalVerbResults.forEach(res => {

 uniqueVerbsMap.set(res.verb, res);

 });

 // Add Wortfamilie matches

 // Add Wortfamilie matches

 const wfPromises = wfResults.map(async wfRes => {

 if (!uniqueVerbsMap.has(wfRes.verb)) {

 // We need to fetch the verb data for this result

 const levelData = findVerbLevelAndGroup(wfRes.verb);

 if (levelData) {

 // Check if data is loaded

 if (!state.allVerbsData[wfRes.verb]) {

 try {

 const res = await fetch(`json/cards/${wfRes.verb}.json?v=${state.appVersion || '1'}`);

 if (res.ok) {

 state.allVerbsData[wfRes.verb] = await parseJsonUtf8(res);

 }

 } catch (e) {

 console.warn("Failed to load verb data for search result", wfRes.verb);

 }

 }

 if (state.allVerbsData[wfRes.verb]) {

 uniqueVerbsMap.set(wfRes.verb, {

 verb: wfRes.verb,

 data: state.allVerbsData[wfRes.verb],

 levelKey: levelData.levelKey,

 groupIndexInLevel: levelData.groupIndex,

 matchedRelatedForm: wfRes.matchedWord || ''

 });

 }

 }

 } else {

 const existing = uniqueVerbsMap.get(wfRes.verb);

 if (existing && !existing.matchedRelatedForm) {

 existing.matchedRelatedForm = wfRes.matchedWord || '';

 uniqueVerbsMap.set(wfRes.verb, existing);

 }

 }

 });

 await Promise.all(wfPromises);

 const matchingVerbs = Array.from(uniqueVerbsMap.values());
  console.log("performSearch resolved matching verbs:", matchingVerbs.length, matchingVerbs.map(m => m.verb));

 // SORTING LOGIC: Level Priority (A1.1 -> B2.1) then Alphabetical

 matchingVerbs.sort((a, b) => {

 const levelIndexA = levelOrder.indexOf(a.levelKey);

 const levelIndexB = levelOrder.indexOf(b.levelKey);

 // 1. Primary Sort: Level

 if (levelIndexA !== levelIndexB) {

 // If one level is unknown (-1), put it last

 if (levelIndexA === -1) return 1;

 if (levelIndexB === -1) return -1;

 return levelIndexA - levelIndexB;

 }

 // 2. Secondary Sort: Alphabetical

 return a.verb.localeCompare(b.verb);

 });

 // Clear current cards and display matching verbs

 cardsContainer.innerHTML = '';

 // Show count

 if (searchCounter) searchCounter.textContent = matchingVerbs.length.toString();

 const countEl = document.getElementById('search-results-count');

 if (matchingVerbs.length > 0) {

 countEl.textContent = `${matchingVerbs.length} Ergebnis${matchingVerbs.length !== 1 ? 'se' : ''}`;

 countEl.style.display = 'block';

 } else {

 countEl.style.display = 'none';

 cardsContainer.innerHTML = '<div class="no-results">Keine Ergebnisse gefunden / No results found</div>';

 }

 const verbsToShow = matchingVerbs; // Show all results, or slice if pagination needed

 const htmlFragments = [];


 const renderFullSearchCards = false;

  if (matchingVerbs.length > 0) {
    // Ensure all groups for matching verbs are loaded into memory
    const groupLoadPromises = [];
    const requestedGroups = new Set();
    verbsToShow.forEach(match => {
      const verbData = match.data || {};
      const level = match.levelKey || (verbData.level ? verbData.level.split('.')[0] : 'A1');
      const groupIndex = Number.isInteger(match.groupIndexInLevel)
        ? match.groupIndexInLevel
        : getGlobalGroupIndex(verbData.level, verbData.group);
      const key = `${level}-${groupIndex}`;
      if (!requestedGroups.has(key)) {
        requestedGroups.add(key);
        if (!state.verbGroupsByLevel[level] || !state.verbGroupsByLevel[level][groupIndex]) {
          groupLoadPromises.push(loadGroupData(level, groupIndex, { silent: true }).catch(() => {}));
        }
      }
    });
    if (groupLoadPromises.length > 0) {
      await Promise.all(groupLoadPromises);
    }

    const groupedMatches = {};
    verbsToShow.forEach(match => {
      const verbData = match.data || {};
      const level = match.levelKey || (verbData.level ? verbData.level.split('.')[0] : 'A1');
      const groupIndex = Number.isInteger(match.groupIndexInLevel)
        ? match.groupIndexInLevel
        : getGlobalGroupIndex(verbData.level, verbData.group);
      const resolvedGroup = state.verbGroupsByLevel[level] && state.verbGroupsByLevel[level][groupIndex]
        ? state.verbGroupsByLevel[level][groupIndex]
        : null;
      let theme = resolvedGroup
        ? (resolvedGroup.theme || resolvedGroup.germanName || resolvedGroup.groupNameGerman || 'Gruppe')
        : (verbData.theme || 'Gruppe');
      const groupKey = `${level}-${groupIndex}`;
      if (!groupedMatches[groupKey]) {
        const spanishName = resolvedGroup
          ? (resolvedGroup.spanishName || resolvedGroup.groupNameSpanish || '')
          : '';
        const fullGroupVerbs = resolvedGroup && Array.isArray(resolvedGroup.verbs)
          ? resolvedGroup.verbs.map(groupVerbName => ({
              verb: groupVerbName,
              data: state.allVerbsData[groupVerbName] || {},
              levelKey: level,
              groupIndexInLevel: groupIndex
            }))
          : [];
        groupedMatches[groupKey] = {
          level: level,
          theme: theme,
          spanishName: spanishName,
          groupIndex: groupIndex,
          verbs: fullGroupVerbs.length > 0 ? fullGroupVerbs : [match]
        };
      }
    });

    const searchGeneratedCards = [];
    Object.values(groupedMatches).forEach((group) => {
      const resolvedGroup = state.verbGroupsByLevel[group.level] && state.verbGroupsByLevel[group.level][group.groupIndex]
        ? state.verbGroupsByLevel[group.level][group.groupIndex]
        : null;
      if (!resolvedGroup) return;

      const chunkSize = 7;
      const chunks = [];
      for (let i = 0; i < group.verbs.length; i += chunkSize) {
        chunks.push(group.verbs.slice(i, i + chunkSize));
      }

      chunks.forEach((chunk, chunkIndex) => {
        const chunkVerbsOnly = chunk.map(v => v.verb);
        const card = createCompactCardElement(resolvedGroup, group.groupIndex, chunkVerbsOnly, chunkIndex, chunks.length, group.level, searchTerm);
        searchGeneratedCards.push(card);
      });
    });

    document.body.classList.add('compact-view');
    window.allCompactCards = searchGeneratedCards;
    window.currentCompactCardIndex = 0;
    window.updateCompactView();

    // Setup click listeners for row clicking inside the generated cards
    cardsContainer.querySelectorAll('.kompakt-row[data-verb]').forEach((row) => {
      const verbName = row.dataset.verb;
      row.onclick = () => window.showVerbDetailsInCard(verbName, row.closest('.kompakt-level-card'));
      const germanWord = row.querySelector('.kompakt-german');
      if (germanWord) {
        germanWord.onclick = (e) => {
          e.stopPropagation();
          window.speak(verbName === 'geboren werden' ? 'geboren' : verbName);
        };
      }
      const spanishWord = row.querySelector('.kompakt-spanish');
      if (spanishWord) {
        spanishWord.onclick = (e) => {
          e.stopPropagation();
          window.showVerbDetailsInCard(verbName, row.closest('.kompakt-level-card'));
        };
      }
    });

    // Update search counter
    if (searchCounter) {
      const totalMatches = matchingVerbs.length;
      searchCounter.textContent = `${totalMatches} ${totalMatches === 1 ? 'Verb' : 'Verben'} gefunden`;
    }
  }
 }

 export function clearSearch() {

 if (!searchInput) return;

 searchInput.value = '';

 if (clearSearchBtn) clearSearchBtn.classList.remove('visible');

 if (searchCounter) searchCounter.textContent = '';

 // Re-enable level indicator

 if (levelIndicator) {

 levelIndicator.style.opacity = '1';

 levelIndicator.style.pointerEvents = 'auto';

 }

 // Restore the current group

 renderVerbGroup();

 }

  // Register click listener for top search toggle button to fix search feature not working
  export const searchToggleBtn = document.getElementById('search-toggle-btn');
  export const topSearchRowEl = document.getElementById('top-search-row-el');

  // Helper to find verb location (needed for WF matches that weren't in direct search)

 export function findVerbLevelAndGroup(verbName) {

 for (const levelKey in state.verbGroupsByLevel) {

 const groups = state.verbGroupsByLevel[levelKey];

 for (let i = 0; i < groups.length; i++) {

 if (groups[i].verbs.includes(verbName)) {

 return { levelKey: levelKey, groupIndex: i };

 }

 }

 }

 for (const group of state.allGroupsIndex) {

 if (group && Array.isArray(group.verbs) && group.verbs.includes(verbName)) {

 const levelKey = group.level ? group.level.split('.')[0] : '';

 const groupIndex = Number(group.groupNumberPerLevel) - 1;

 if (levelKey && Number.isInteger(groupIndex) && groupIndex >= 0) {

 return { levelKey, groupIndex };

 }

 }

 }

 return null;

 }

 export function resolveWortfamilieVerbs(word, data) {

 if (!data || typeof data !== 'object') return [];

 if (Array.isArray(data.verbs)) {

 return data.verbs.filter(Boolean);

 }

 if (Array.isArray(data.base)) {

 return data.base.filter(Boolean);

 }

 // Root entries in the newer index can use { related: [...] } without an explicit

 // verbs/base array. In that case, fall back to the matched word itself if it is a verb.

 if (Array.isArray(data.related) && state.allVerbsData[word]) {

 return [word];

 }

 return [];

 }

 // Modified to support returning results instead of rendering

 export function performWortfamilieSearch(term, returnOnly = false) {

 if (!state.wortfamilieIndex) return returnOnly ? [] : null;

 const results = [];

 const seenResults = new Set();

 const termLower = term.toLowerCase();

 for (const [word, data] of Object.entries(state.wortfamilieIndex)) {

 // Check if the word matches (contains) the search term

 if (normalizeSearchValue(word).includes(termLower)) {

 const candidateVerbs = resolveWortfamilieVerbs(word, data);

 candidateVerbs.forEach(verb => {

 const resultKey = `${verb}::${word}`;

 if (seenResults.has(resultKey)) return;

 seenResults.add(resultKey);

 results.push({

 verb: verb,

 matchedWord: word,

 type: data.type

 });

 });

 }

 }

 if (returnOnly) return results;

 }

/** Start-up listeners of this part of the page, attached in the original order by script.js. */
export function wireSearchControls() {

 if (searchInput) {

 searchInput.addEventListener('input', () => {

 clearTimeout(state.searchTimeout);

 state.searchTimeout = setTimeout(() => performSearch(), 300); // 300ms debounce

 });

 }

 if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', clearSearch);
  }
  if (searchToggleBtn && topSearchRowEl) {
    searchToggleBtn.addEventListener('click', () => {
      topSearchRowEl.classList.toggle('visible');
      const isVisible = topSearchRowEl.classList.contains('visible');
      if (isVisible) {
        if (searchInput) searchInput.focus();
      } else {
        clearSearch();
      }
    });
  }
}
