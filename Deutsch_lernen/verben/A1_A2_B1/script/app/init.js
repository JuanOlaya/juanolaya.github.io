/** Page start-up: initializeApp wires controls and renders the first group. Moved verbatim from script.js. */
import { hasCachedGroup, hasCachedLevel, hydrateFromLocalCache, loadAllGroupsForLevel, loadBackgroundData, loadGroupData } from './data-loading.js';
import { mobileLevelMediaQuery, scheduleLevelMenuIdleCollapse, scheduleSearchIdleCollapse, setFooterSearchExpanded, syncMobileLevelToggleState } from './layout.js';
import { loadWortfamilieIndex, performSearch } from './search.js';
import { cardsContainer, closeInfoModalButton, closeThemeModalBtn, closeThemeModalX, closeVerbModalButton, closeVerbModalXButton, groupThemeIndicator, gustarButton, gustarCloseBtn, gustarCloseFooterBtn, gustarModal, infoButton, infoModal, levelIndicator, levelOrder, levelToggleButtons, levelToggleContainer, mainContainer, nextGroupBtn, prevGroupBtn, reflexiveButton, reflexiveCloseBtn, reflexiveCloseFooterBtn, reflexiveModal, searchInput, storyButton, storyContainer, storyContent, themeModal, verbModal } from './shared.js';
import { state } from './state.js';
import { openThemeModal, setupTabs, speak } from './verb-modal.js';
import { closeVerbModal, loadProgress, navigateToLevel, renderVerbGroup, setupProgressBar } from './views.js';


 export function initializeApp() {

 // Load saved progress from localStorage

 loadProgress();

 // Handle URL parameters (override saved progress)

 const urlParams = new URLSearchParams(window.location.search);

 const urlLevel = urlParams.get('level');

 if (urlLevel) {

 // Convert 'A1.2' format to 'A1_2'

 const levelKey = urlLevel.replace('.', '_');

 if (state.levelConfig[levelKey]) {

 state.currentLevel = levelKey;

 state.currentGroupInLevel = 0;

 }

 }

 setupProgressBar();

 let initialViewMode = memoStorage.getCardVersion() || 'compact';

 if (!document.querySelector(`input[name="card-version"][value="${initialViewMode}"]`)) {

 initialViewMode = 'compact';

 }

 // Load Verb Types global data

 fetch('json/verb_types.json')

 .then(res => res.ok ? parseJsonUtf8(res) : {})

 .then(data => { state.verbTypesData = data || {}; })

 .catch(() => { state.verbTypesData = {}; });

 // Hydrate from cache first so returning to the app feels instant on mobile.

 const hydratedFromCache = hydrateFromLocalCache();

 const hasInitialDataInCache = hydratedFromCache && (

 initialViewMode === 'compact'

 ? hasCachedLevel(state.currentLevel)

 : hasCachedGroup(state.currentLevel, state.currentGroupInLevel)

 );

 // Load enough data for the initial view only if cache cannot already render it.

 const initialLoadPromise = hasInitialDataInCache

 ? Promise.resolve()

 : (initialViewMode === 'compact'

 ? loadAllGroupsForLevel(state.currentLevel)

 : loadGroupData(state.currentLevel, state.currentGroupInLevel));

 const initialWortfamiliePromise = state.wortfamilieIndex

 ? Promise.resolve(state.wortfamilieIndex)

 : loadWortfamilieIndex().catch(() => null);

 Promise.all([initialLoadPromise, initialWortfamiliePromise])

 .then(() => {

 renderVerbGroup();

 // Start background loading after initial render

 loadBackgroundData();

 prevGroupBtn.addEventListener('click', async () => {

 let newLevel = state.currentLevel;

 let newGroupIndex = state.currentGroupInLevel;

 if (state.currentGroupInLevel > 0) {

 // Previous group in current level

 newGroupIndex--;

 } else {

 // Go to previous level's last group

 const currentLevelIndex = levelOrder.indexOf(state.currentLevel);

 if (currentLevelIndex > 0) {

 newLevel = levelOrder[currentLevelIndex - 1];

 newGroupIndex = state.levelConfig[newLevel].groupCount - 1;

 } else {

 return; // Start of content

 }

 }

 // Load new data BEFORE switching

 await loadGroupData(newLevel, newGroupIndex);

 // Update state and render

 state.currentLevel = newLevel;

 state.currentGroupInLevel = newGroupIndex;

 clearSearchAndRender();

 });

 nextGroupBtn.addEventListener('click', async () => {

 let newLevel = state.currentLevel;

 let newGroupIndex = state.currentGroupInLevel;

 const totalGroupsInLevel = state.levelConfig[state.currentLevel].groupCount;

 if (state.currentGroupInLevel < totalGroupsInLevel - 1) {

 // Next group in current level

 newGroupIndex++;

 } else {

 // Go to next level's first group

 const currentLevelIndex = levelOrder.indexOf(state.currentLevel);

 if (currentLevelIndex < levelOrder.length - 1) {

 newLevel = levelOrder[currentLevelIndex + 1];

 newGroupIndex = 0;

 } else {

 return; // End of content

 }

 }

 // Load new data BEFORE switching

 await loadGroupData(newLevel, newGroupIndex);

 // Update state and render

 state.currentLevel = newLevel;

 state.currentGroupInLevel = newGroupIndex;

 clearSearchAndRender();

 });

 // Helper function to clear search and render

 function clearSearchAndRender() {

 const searchInput = document.getElementById('verb-search');

 const clearSearchBtn = document.getElementById('clear-search');

 if (searchInput) {

 searchInput.value = '';

 clearSearchBtn.classList.remove('visible');

 document.getElementById('search-counter').textContent = '';

 }

 // Reset transform before rendering new group

 cardsContainer.style.transform = '';

 cardsContainer.style.transition = '';

 renderVerbGroup();

 }

 // Level navigation arrow handlers

 const prevLevelBtn = document.getElementById('prev-level-btn');

 const nextLevelBtn = document.getElementById('next-level-btn');

 prevLevelBtn.addEventListener('click', async () => {

 const currentLevelIndex = levelOrder.indexOf(state.currentLevel);

 if (currentLevelIndex > 0) {

 await navigateToLevel(levelOrder[currentLevelIndex - 1]);

 }

 });

 nextLevelBtn.addEventListener('click', async () => {

 const currentLevelIndex = levelOrder.indexOf(state.currentLevel);

 if (currentLevelIndex < levelOrder.length - 1) {

 await navigateToLevel(levelOrder[currentLevelIndex + 1]);

 }

 });

 levelToggleButtons.forEach(button => {

 button.addEventListener('click', async () => {

 const targetLevel = button.dataset.level;

 if (!targetLevel) return;

 if (targetLevel === state.currentLevel) {

 state.isLevelMenuExpanded = !state.isLevelMenuExpanded;

 syncMobileLevelToggleState();

 return;

 }

 await navigateToLevel(targetLevel);

 state.isLevelMenuExpanded = false;

 syncMobileLevelToggleState();

 });

 });

 if (state.footerSearchToggle) {

 state.footerSearchToggle.addEventListener('click', () => {

 if (state.isFooterSearchExpanded && !state.isFooterSearchForcedOpen && (!searchInput || !searchInput.value.trim())) {

 setFooterSearchExpanded(false);

 return;

 }

 setFooterSearchExpanded(true);

 if (searchInput) searchInput.focus();

 });

 }

 if (searchInput) {

 searchInput.addEventListener('focus', () => setFooterSearchExpanded(true));

 searchInput.addEventListener('input', () => {

 if (!searchInput.value.trim()) {

 scheduleSearchIdleCollapse();

 } else {

 clearTimeout(state.searchIdleTimeout);

 }

 });

 searchInput.addEventListener('blur', () => {

 scheduleSearchIdleCollapse();

 });

 }

 if (levelToggleContainer) {

 ['pointermove', 'focusin', 'touchstart'].forEach(eventName => {

 levelToggleContainer.addEventListener(eventName, () => {

 if (state.isLevelMenuExpanded && !state.isFooterSearchExpanded) {

 scheduleLevelMenuIdleCollapse();

 }

 }, { passive: true });

 });

 }

 if (state.footerSearchShell) {

 ['pointermove', 'focusin', 'touchstart'].forEach(eventName => {

 state.footerSearchShell.addEventListener(eventName, () => {

 if (state.isFooterSearchExpanded && !state.isFooterSearchForcedOpen) {

 scheduleSearchIdleCollapse();

 }

 }, { passive: true });

 });

 }

 document.addEventListener('click', (event) => {

 if (state.isLevelMenuExpanded && levelToggleContainer && !levelToggleContainer.contains(/** @type {Node} */ (event.target))) {

 state.isLevelMenuExpanded = false;

 syncMobileLevelToggleState();

 }

 if (state.footerSearchShell && state.isFooterSearchExpanded && !state.isFooterSearchForcedOpen && !state.footerSearchShell.contains(event.target) && (!searchInput || !searchInput.value.trim())) {

 setFooterSearchExpanded(false);

 }

 });

 mobileLevelMediaQuery.addEventListener('change', () => {

 if (!mobileLevelMediaQuery.matches) {

 state.isLevelMenuExpanded = false;

 }

 syncMobileLevelToggleState();

 });

 // Keyboard navigation for levels (Up/Down arrows)

 document.addEventListener('keydown', async (e) => {

 // Only handle if not typing in search input

 if (document.activeElement.tagName === 'INPUT') return;

 const currentLevelIndex = levelOrder.indexOf(state.currentLevel);

 if (e.key === 'ArrowUp') {

 e.preventDefault();

 if (currentLevelIndex > 0) {

 await navigateToLevel(levelOrder[currentLevelIndex - 1]);

 }

 } else if (e.key === 'ArrowDown') {

 e.preventDefault();

 if (currentLevelIndex < levelOrder.length - 1) {

 await navigateToLevel(levelOrder[currentLevelIndex + 1]);

 }

 }

 });

 })

 .catch(error => {

 console.error("Failed to load verb data:", error);

 cardsContainer.innerHTML = '<p>Ein Fehler ist beim Laden der Verben aufgetreten. Bitte versuchen Sie es später erneut.</p>';

 });

 const toggles = document.querySelectorAll('.visibility-toggle');

 const verbModalContent = document.querySelector('#verb-modal .modal-content');

 toggles.forEach(toggle => {

 const toggleClass = toggle.dataset.toggleClass;

 const toggleId = toggle.id;

 // Load saved state from localStorage

 const savedState = memoStorage.getToggle(toggleId);

 if (savedState !== null) {

 toggle.checked = savedState;

 } else {

 // Set default state: Toggles off by default (Active Recall), except Spanish

 if (toggleId === 'en-switch' || toggleId === 'recall-switch') {

 toggle.checked = false;

 } else if (toggleId === 'es-switch' || toggleId === 'de-switch') {

 toggle.checked = true;

 }

 }

 // Apply initial state

 mainContainer.classList.toggle(toggleClass, !toggle.checked);

 verbModalContent.classList.toggle(toggleClass, !toggle.checked);

 // Add change event listener

 toggle.addEventListener('change', (event) => {

 const isChecked = event.currentTarget.checked;

 mainContainer.classList.toggle(toggleClass, !isChecked);

 verbModalContent.classList.toggle(toggleClass, !isChecked);

 // Save to localStorage

 memoStorage.setToggle(toggleId, isChecked);

 if (state.currentViewMode === 'compact' || state.currentViewMode === 'kompakt') {

 if (searchInput && searchInput.value.trim() !== '') {

 performSearch();

 } else {

 renderVerbGroup();

 }

 }

 });

 });

 // Kompakt Light Mode Selector

 const kompaktLightSwitch = document.getElementById('kompakt-light-switch');

 if (kompaktLightSwitch) {

 const savedLightState = memoStorage.getToggle('kompakt-light');

 kompaktLightSwitch.checked = savedLightState === true;

 document.body.classList.toggle('compact-light-mode', kompaktLightSwitch.checked);

 kompaktLightSwitch.addEventListener('change', (e) => {

 const isChecked = e.currentTarget.checked;

 document.body.classList.toggle('compact-light-mode', isChecked);

 memoStorage.setToggle('kompakt-light', isChecked);

 });

 }

 // Version selector (Normal, Leichte, Niedliche)

 const versionRadios = document.querySelectorAll('input[name="card-version"]');

 // Load saved state from localStorage (default to 'compact')

 let savedVersion = memoStorage.getCardVersion() || 'compact';

 // Validate against available options

 if (!document.querySelector(`input[name="card-version"][value="${savedVersion}"]`)) {

 savedVersion = 'compact'; // Fallback if invalid

 }

 state.currentViewMode = savedVersion; // Initialize global state

 const savedRadio = document.querySelector(`input[name="card-version"][value="${savedVersion}"]`);

 if (savedRadio) {

 savedRadio.checked = true;

 mainContainer.classList.remove('light-version', 'cute-version');

 if (savedVersion === 'light') {

 mainContainer.classList.add('light-version');

 } else if (savedVersion === 'cute') {

 mainContainer.classList.add('cute-version');

 }

 }

 // Event listeners for version changes

 versionRadios.forEach(radio => {

 radio.addEventListener('change', (event) => {

 const selectedVersion = event.target.value;

 state.currentViewMode = selectedVersion; // Update global state

 // Remove all version classes

 mainContainer.classList.remove('light-version', 'cute-version');

 // Add appropriate class

 if (selectedVersion === 'light') {

 mainContainer.classList.add('light-version');

 } else if (selectedVersion === 'cute') {

 mainContainer.classList.add('cute-version');

 }

 // Save to localStorage

 memoStorage.setCardVersion(selectedVersion);

 renderVerbGroup();

 });

 });

 storyButton.addEventListener('click', () => {

 storyContainer.style.display = 'block';

 storyContent.innerHTML = savedStories[state.storyClickCounter];

 state.storyClickCounter = (state.storyClickCounter + 1) % savedStories.length;

 });

 infoButton.addEventListener('click', () => infoModal.classList.add('visible'));

 closeInfoModalButton.addEventListener('click', () => infoModal.classList.remove('visible'));

 infoModal.addEventListener('click', (e) => { if (e.target === infoModal) infoModal.classList.remove('visible'); });

 if (closeVerbModalButton) {

 closeVerbModalButton.addEventListener('click', closeVerbModal);

 }

 closeVerbModalXButton.addEventListener('click', closeVerbModal);

 verbModal.addEventListener('click', (e) => { if (e.target === verbModal) closeVerbModal(); });

 // Theme badge click handler - using event delegation since badge is created dynamically

 // Note: We attach to header tags container now

 const headerTagsContainer = document.getElementById('modal-header-tags');

 headerTagsContainer.addEventListener('click', (e) => {

 // Check if clicked element is the theme badge

 if (e.target && e.target.id === 'modal-theme-badge') {

 e.stopPropagation(); // Prevent modal header click (TTS)

 const targetLevel = e.target.dataset.level;

 const targetGroup = parseInt(e.target.dataset.group);

 if (targetLevel && targetGroup) {

 // Convert display level (e.g., "A1.1") to unified macro level ("A1")

 const macroLevel = targetLevel.split('.')[0];

 const levelKey = targetLevel.replace('.', '_');

 // Calculate the unified global index

 let newGroupIndex = targetGroup - 1; // 0-indexed local

 const layers = state.physicalLevelMap[macroLevel] || [];

 for (let layer of layers) {

 if (layer.key === levelKey) break;

 newGroupIndex += layer.count;

 }

 // Close the verb modal

 verbModal.classList.remove('visible');

 // Clear search input and reset UI

 const searchInput = document.getElementById('verb-search');

 const clearSearchBtn = document.getElementById('clear-search');

 const searchCounter = document.getElementById('search-counter');

 if (searchInput) {

 searchInput.value = '';

 if (clearSearchBtn) clearSearchBtn.classList.remove('visible');

 if (searchCounter) searchCounter.textContent = '';

 }

 // Re-enable level indicator

 if (levelIndicator) {

 levelIndicator.style.opacity = '1';

 levelIndicator.style.pointerEvents = 'auto';

 }

 // Navigate to the target level and group

 state.currentLevel = macroLevel;

 state.currentGroupInLevel = newGroupIndex;

 // Reset transform before rendering new group

 cardsContainer.style.transform = 'translateX(0) scale(1)';

 // Update UI - render the verb group

 renderVerbGroup();

 }

 }

 });

 // Gustar modal event listeners

 gustarButton.addEventListener('click', () => gustarModal.classList.add('visible'));

 gustarCloseBtn.addEventListener('click', () => gustarModal.classList.remove('visible'));

 gustarCloseFooterBtn.addEventListener('click', () => gustarModal.classList.remove('visible'));

 gustarModal.addEventListener('click', (e) => { if (e.target === gustarModal) gustarModal.classList.remove('visible'); });

 // Reflexive modal event listeners

 if (reflexiveButton) {

 reflexiveButton.addEventListener('click', () => reflexiveModal.classList.add('visible'));

 }

 if (reflexiveCloseBtn) {

 reflexiveCloseBtn.addEventListener('click', () => reflexiveModal.classList.remove('visible'));

 }

 if (reflexiveCloseFooterBtn) {

 reflexiveCloseFooterBtn.addEventListener('click', () => reflexiveModal.classList.remove('visible'));

 }

 if (reflexiveModal) {

 reflexiveModal.addEventListener('click', (e) => { if (e.target === reflexiveModal) reflexiveModal.classList.remove('visible'); });

 }

 // Modal event listeners (Removed invalid generic listeners)

 // TTS on Modal Header

 const modalHeader = document.querySelector('.modal-header');

 if (modalHeader) {

 modalHeader.style.cursor = 'pointer';

 modalHeader.title = 'Aussprache hören';

 modalHeader.addEventListener('click', (e) => {

 e.preventDefault();

 e.stopPropagation();

 const verbText = document.getElementById('modal-verb-infinitive').textContent;

 if (verbText) {

 speak(verbText);

 }

 });

 }

 // Theme modal event listeners

 groupThemeIndicator.addEventListener('click', openThemeModal);

 closeThemeModalX.addEventListener('click', () => themeModal.classList.remove('visible'));

 closeThemeModalBtn.addEventListener('click', () => themeModal.classList.remove('visible'));

 themeModal.addEventListener('click', (e) => { if (e.target === themeModal) themeModal.classList.remove('visible'); });

 // Setup Tabs

 setupTabs();

 }
