/** Rendering of the verb group views (compact, niedlich, normal, light), indicators, progress and navigation. Moved verbatim from script.js. */
import { closeConjugationSubModal } from './conjugation-modal.js';
import { loadGroupData } from './data-loading.js';
import { mobileLevelMediaQuery, syncMobileLevelToggleState } from './layout.js';
import { getGlobalGroupIndex } from './levels.js';
import { cardsContainer, groupIndicator, groupThemeIndicator, gustarButtonContainer, levelIndicator, levelOrder, levelToggleButtons, navigationWrapper, nextGroupBtn, prevGroupBtn, progressBar, reflexiveButtonContainer, searchInput, verbModal } from './shared.js';
import { state } from './state.js';
import { openThemeModal } from './verb-modal.js';


 export function closeVerbModal() {

  closeConjugationSubModal();

 state.currentVerbInModal = '';

 state.modalDeferredLoadToken += 1;

 state.modalExampleLoadToken += 1;

 state.modalSessionId += 1;

 state.isRestoringModalTab = false;

 verbModal.classList.remove('visible');

 }

 export function restoreModalActiveTab(tabId) {

 const targetTabId = tabId || 'infinitiv';

 const targetButton = document.querySelector(`.modal-tab-btn[data-tab="${targetTabId}"]`);

 if (targetButton && targetButton.style.display !== 'none') {

 state.isRestoringModalTab = true;

 targetButton.click();

 state.isRestoringModalTab = false;

 return;

 }

 const fallbackButton = document.querySelector('.modal-tab-btn[data-tab="infinitiv"]');

 if (fallbackButton) {

 state.isRestoringModalTab = true;

 fallbackButton.click();

 state.isRestoringModalTab = false;

 }

 }

 export function getAllSearchGroupEntries() {

 const groupedMap = new Map();

 if (Array.isArray(state.allGroupsIndex)) {

 state.allGroupsIndex.forEach(group => {

 if (!group || !group.level || !Array.isArray(group.verbs)) return;

 const levelKey = group.level.split('.')[0];
 const groupIndexInLevel = getGlobalGroupIndex(group.level, group.groupNumberPerLevel);

 if (!levelKey || !Number.isInteger(groupIndexInLevel) || groupIndexInLevel < 0) return;

 groupedMap.set(`${levelKey}-${groupIndexInLevel}`, {

 levelKey,

 groupIndexInLevel,

 group

 });

 });

 }

 Object.keys(state.verbGroupsByLevel).forEach(levelKey => {

 const levelGroups = state.verbGroupsByLevel[levelKey] || [];

 levelGroups.forEach((group, groupIndexInLevel) => {

 if (!group || !Array.isArray(group.verbs)) return;

 groupedMap.set(`${levelKey}-${groupIndexInLevel}`, {

 levelKey,

 groupIndexInLevel,

 group

 });

 });

 });

 return Array.from(groupedMap.values());

 }

 // --- KOMPAKT VERSION RENDER FUNCTION (Adverb Port / Slate-Mint) ---

export function createCompactCardElement(group, groupIndex, chunk, chunkIndex, chunksCount, levelKey, query = "") {
  const deSwitch = document.getElementById('de-switch');
  const esSwitch = document.getElementById('es-switch');
  const enSwitch = document.getElementById('en-switch');
  const showGerman = deSwitch ? deSwitch.checked : true;
  const showSpanish = esSwitch ? esSwitch.checked : true;
  const showEnglish = enSwitch ? enSwitch.checked : false;

  const groupName = group.theme || group.germanName || group.groupNameGerman || `Gruppe ${groupIndex + 1}`;
  const themeColor = standardColors[groupIndex % standardColors.length];

  let cardTitleHTML = groupName;
  if (chunksCount > 1) {
    cardTitleHTML += ` <span class="kompakt-pagination">(${chunkIndex + 1}/${chunksCount})</span>`;
  }

  const card = document.createElement('div');
  card.className = 'kompakt-level-card';

  const cardFront = document.createElement('div');
  cardFront.className = 'card-front';
  cardFront.style.display = 'flex';
  cardFront.style.flexDirection = 'column';
  cardFront.style.width = '100%';
  cardFront.style.height = '100%';

  if (themeColor && (themeColor.toUpperCase() === '#FFD700' || themeColor.toLowerCase() === 'gold')) {
    card.classList.add('light-header');
  }

  const header = document.createElement('div');
  header.className = 'kompakt-level-header';
  header.style.backgroundColor = themeColor;
  header.style.cursor = 'default';

  const germanSpan = document.createElement('span');
  germanSpan.className = 'kompakt-header-de';
  germanSpan.innerHTML = cardTitleHTML;
  germanSpan.style.display = showGerman ? 'inline' : 'none';
  germanSpan.style.cursor = 'pointer';
  germanSpan.title = 'Aussprache hören';
  germanSpan.onclick = (event) => {
    event.stopPropagation();
    window.speak(groupName);
  };

  const spanishSpan = document.createElement('span');
  spanishSpan.className = 'kompakt-header-es';
  spanishSpan.textContent = group.spanishName || group.groupNameSpanish || '';
  spanishSpan.style.display = showSpanish ? 'inline' : 'none';
  spanishSpan.style.cursor = 'pointer';
  spanishSpan.title = 'Themeninfos anzeigen';
  spanishSpan.onclick = (event) => {
    event.stopPropagation();
    openThemeModal(levelKey, groupIndex);
  };

  header.appendChild(germanSpan);
  header.appendChild(spanishSpan);
  cardFront.appendChild(header);

  const content = document.createElement('div');
  content.className = 'kompakt-level-content';

  chunk.forEach(verbName => {
    const verbData = state.allVerbsData[verbName];
    if (!verbData) return;

    const row = document.createElement('div');
    row.className = 'kompakt-row';
    row.setAttribute('data-verb', verbName);
    row.style.cursor = 'pointer';
    row.title = 'Details anzeigen';
    row.onclick = (e) => {
      e.stopPropagation();
      window.showVerbDetailsInCard(verbName, card);
    };

    const isReflexive = verbData.case_tags && verbData.case_tags.includes('Reflexiv');
    const reflBadge = isReflexive ? `<span class="reflexiv-badge">refl</span>` : '';
    const isDativ = verbData.case_tags && verbData.case_tags.includes('DAT');
    const datBadge = isDativ ? `<span class="dativ-badge">dat</span>` : '';
    const isIntransitive = verbData.case_tags && verbData.case_tags.includes('INTR');
    const intrBadge = isIntransitive ? `<span class="intr-badge">intr</span>` : '';
    const isIK = verbData.case_tags && verbData.case_tags.includes('IK');
    const ikBadge = isIK ? `<span class="ik-badge">IK</span>` : '';
    const isLiD = verbData.case_tags && verbData.case_tags.includes('LiD');
    const lidBadge = isLiD ? `<span class="lid-badge">LiD</span>` : '';
    const a1testTag = verbData.case_tags ? verbData.case_tags.find(t => t.startsWith('A1')) : null;
    const a1testBadge = a1testTag ? `<span style="margin-left: 5px; font-size: 0.67em;"></span>` : '';

    const germanWord = document.createElement('div');
    germanWord.className = 'kompakt-german';
    
    let displayVerbName = formatVerbPrefix(verbName);
    if (query) {
      displayVerbName = highlightVerbName(verbName, query);
      const matchHint = getMatchHint({ verb: verbName, data: verbData, levelKey: levelKey });
      if (!verbName.toLowerCase().includes(query) && matchHint) {
        displayVerbName = `${highlightBaseVerb(verbName === 'geboren werden' ? 'geboren' : formatVerbPrefix(verbName))} <span class="search-match-hint" style="font-size: 0.78em; opacity: 0.82; margin-left: 6px;">(${highlightMatch(matchHint, query)})</span>`;
      }
    }
    
    germanWord.innerHTML = `${displayVerbName}${reflBadge}${datBadge}${intrBadge}${ikBadge}${lidBadge}${a1testBadge}`;
    germanWord.style.display = showGerman ? 'block' : 'none';
    germanWord.style.cursor = 'pointer';
    germanWord.title = 'Aussprache hören';
    germanWord.onclick = (e) => {
      e.stopPropagation();
      window.speak(verbName === 'geboren werden' ? 'geboren' : verbName);
    };

    const translations = document.createElement('div');
    translations.className = 'kompakt-translations';

    const esTranslationLines = getCardTranslationLines(verbData).slice(0, 2);
    const isLong = esTranslationLines.length > 1 || (esTranslationLines[0] && esTranslationLines[0].length > 12);

    const spanishWord = document.createElement('div');
    spanishWord.className = 'kompakt-spanish' + (isLong ? ' long-translation' : '');
    
    if (query) {
      spanishWord.innerHTML = esTranslationLines.map(line => `<div class="translation-line">${highlightMatch(line, query)}</div>`).join('');
    } else {
      spanishWord.innerHTML = esTranslationLines.map(line => `<div class="translation-line">${line}</div>`).join('');
    }
    
    spanishWord.style.display = showSpanish ? 'block' : 'none';
    spanishWord.style.cursor = 'pointer';
    spanishWord.title = 'Details anzeigen';
    spanishWord.onclick = (e) => {
      e.stopPropagation();
      window.showVerbDetailsInCard(verbName, card);
    };

    const englishWord = document.createElement('div');
    englishWord.className = 'kompakt-english';
    const enTranslationRaw = (verbData.en_verb || '').replace(/^\(?(to\s+)?|\)$/gi, '').trim();
    
    if (query) {
      englishWord.innerHTML = highlightMatch(enTranslationRaw, query);
    } else {
      englishWord.textContent = enTranslationRaw;
    }
    
    englishWord.style.display = showEnglish && enTranslationRaw ? 'block' : 'none';
    englishWord.style.cursor = 'pointer';
    englishWord.title = 'Details anzeigen';
    englishWord.onclick = (e) => {
      e.stopPropagation();
      window.showVerbDetailsInCard(verbName, card);
    };

    row.appendChild(germanWord);
    translations.appendChild(spanishWord);
    translations.appendChild(englishWord);
    row.appendChild(translations);
    content.appendChild(row);
  });

  cardFront.appendChild(content);

  const footer = document.createElement('div');
  footer.className = 'card-footer';
  footer.style.backgroundColor = themeColor;

  const levelBadge = document.createElement('span');
  levelBadge.className = 'card-footer-tag card-footer-level';
  levelBadge.style.border = 'none';

  const rawLevel = group.level || levelKey;
  const formattedLevel = rawLevel.toUpperCase().replace(/([A-Z])(\d).*/, '$1$2');
  levelBadge.textContent = formattedLevel;

  const verbsLabel = document.createElement('span');
  verbsLabel.className = 'card-footer-tag';
  verbsLabel.textContent = showEnglish ? 'verbs' : 'verbos';

  footer.appendChild(levelBadge);
  footer.appendChild(verbsLabel);
  cardFront.appendChild(footer);

  card.appendChild(cardFront);

  const cardBack = document.createElement('div');
  cardBack.className = 'card-back';
  cardBack.style.display = 'none';
  card.appendChild(cardBack);

  card.style.setProperty('--card-theme', themeColor);
  const rgbString = hexToRgb(themeColor);
  card.style.setProperty('--card-theme-rgb', rgbString);

  return card;
}

export function renderCompactVersion() {
  cardsContainer.innerHTML = '';
  const allGeneratedCards = [];
  document.body.classList.add('compact-view');
  document.body.classList.remove('light-version-global-dark');

  // Disable group arrows because we show ALL groups for the current level at once
  if (navigationWrapper) {
    const groupNav = navigationWrapper.querySelector('.group-navigation');
    if (groupNav) groupNav.style.display = 'none';
  }

  const levelGroups = state.verbGroupsByLevel[state.currentLevel];
  if (!levelGroups) return;

  const levelGroupsToRender = levelGroups;

  levelGroupsToRender.forEach((group, groupIndex) => {
    if (!group || !group.verbs) return;

    const chunkSize = 7;
    const chunks = [];
    for (let i = 0; i < group.verbs.length; i += chunkSize) {
      chunks.push(group.verbs.slice(i, i + chunkSize));
    }

    chunks.forEach((chunk, chunkIndex) => {
      const card = createCompactCardElement(group, groupIndex, chunk, chunkIndex, chunks.length, state.currentLevel);
      allGeneratedCards.push(card);
    });
  });

  window.allCompactCards = allGeneratedCards;
  window.currentCompactCardIndex = 0;
  window.updateCompactView();
  updateIndicatorsForView(levelGroups[state.currentGroupInLevel] || levelGroups[0]);
}

 // Helper to update indicators (shared between Light and Compact)

 export function updateIndicatorsForView(group) {

 const displayLevel = state.levelConfig[state.currentLevel].displayName;

 levelIndicator.textContent = displayLevel;

 levelIndicator.className = 'level-indicator';

 if (displayLevel === 'A1.1') levelIndicator.classList.add('level-a1-1');

 else if (displayLevel === 'A1.2') levelIndicator.classList.add('level-a1-2');

 else if (displayLevel === 'A2.1') levelIndicator.classList.add('level-a2-1');

 else if (displayLevel === 'A2.2') levelIndicator.classList.add('level-a2-2');

 else if (displayLevel === 'B1.1') levelIndicator.classList.add('level-b1-1');

 levelToggleButtons.forEach(button => {

 const isActive = button.dataset.level === state.currentLevel;

 button.classList.toggle('active', isActive);

 button.setAttribute('aria-pressed', isActive ? 'true' : 'false');

 button.style.order = mobileLevelMediaQuery.matches

 ? (isActive ? String(levelOrder.length) : String(levelOrder.indexOf(button.dataset.level) + 1))

 : '';

 });

 syncMobileLevelToggleState();

 const themeName = group.theme || group.groupNameGerman || 'Gruppe';

 groupThemeIndicator.textContent = themeName;

 const totalGroupsInLevel = state.levelConfig[state.currentLevel].groupCount;

 const activeTheme = group.theme || group.groupNameGerman;

 const themeNameForGroupIndicator = activeTheme ? ` - ${activeTheme}` : '';

 groupIndicator.textContent = `${germanOrdinals[state.currentGroupInLevel]} Gruppe von ${totalGroupsInLevel}${themeNameForGroupIndicator}`;

 prevGroupBtn.disabled = state.currentGroupInLevel === 0 && state.currentLevel === levelOrder[0];

 nextGroupBtn.disabled = state.currentGroupInLevel === totalGroupsInLevel - 1 && state.currentLevel === levelOrder[levelOrder.length - 1];

 }

 // --- NIEDLICH (CUTE) VERSION RENDER FUNCTION ---

 export function renderNiedlichVersion(group) {

 cardsContainer.innerHTML = '';

 document.body.classList.remove('compact-view');

 document.body.classList.remove('light-version-global-dark');

 // Restore group arrows because Niedlich is paginated by group

 if (navigationWrapper) {

 const groupNav = navigationWrapper.querySelector('.group-navigation');

 if (groupNav) groupNav.style.display = 'flex';

 }

 // Check English toggle state

 const enSwitch = document.getElementById('en-switch');

 const showEnglish = enSwitch ? enSwitch.checked : false;

 const cardsHTML = group.verbs.map(verbName => {

 const verbData = state.allVerbsData[verbName];

 if (!verbData) return '';

 // Header info: Verb + Translation (No Emoji)

 const irregularMark = verbData.irregularPraesens ? '<span class="irregular-indicator">*</span>' : '';

 const esTranslation = getCardTranslation(verbData);

 const enTranslation = (verbData.en_verb || '').replace(/^\(?(to\s+)?|\)$/gi, '').trim();

 // Tag Logic (Moved to Body)

 let tagsHTML = '';

 // Only keeping critical tags for header if desired, or all tags

 if (verbData.case_tags) {

 const visibleTags = verbData.case_tags.filter(t => !t.startsWith('Präposition:'));

 tagsHTML = visibleTags.map(tag => `<span class="verb-tag">${tag}</span>`).join('');

 }

 const isReflexive = verbData.case_tags && verbData.case_tags.includes('Reflexiv');

 const reflBadge = isReflexive ? ` <span class="reflexiv-badge" style="vertical-align: super; font-size: 0.9rem; padding: 1px 4px; margin-left: 6px;">refl</span>` : '';

 const isDativ = verbData.case_tags && verbData.case_tags.includes('DAT');

 const datBadge = isDativ ? ` <span class="dativ-badge" style="vertical-align: super; font-size: 0.9rem; padding: 1px 4px; margin-left: 6px;">dat</span>` : '';

 const isIntransitive = verbData.case_tags && verbData.case_tags.includes('INTR');

 const intrBadge = isIntransitive ? ` <span class="intr-badge" style="vertical-align: super; font-size: 0.9rem; padding: 1px 4px; margin-left: 6px;">intr</span>` : '';

 const isIK = verbData.case_tags && verbData.case_tags.includes('IK');

 const ikBadge = isIK ? ` <span class="ik-badge" style="vertical-align: super; font-size: 0.9rem; padding: 1px 4px; margin-left: 6px;">IK</span>` : '';

 const isLiD = verbData.case_tags && verbData.case_tags.includes('LiD');

 const lidBadge = isLiD ? ` <span class="lid-badge" style="vertical-align: super; font-size: 0.9rem; padding: 1px 4px; margin-left: 6px;">LiD</span>` : '';

 const a1testTag = verbData.case_tags ? verbData.case_tags.find(t => t.startsWith('A1')) : null;

 const a1testBadge = a1testTag ? ` <span style="vertical-align: super; font-size: 0.6rem; margin-left: 6px;">⭐</span>` : '';

 // New Structure: Header (Word + Translation), Body (Tags Centered), No Emoji

 const displayVerb = formatVerbPrefix(verbName);

 return `

 <div class="word-item">

 <div class="card-header" onclick="event.stopPropagation(); window.speak('${verbName === 'geboren werden' ? 'geboren' : verbName}')" title="Aussprache hören" style="cursor: pointer; flex-direction: column; gap: 5px;">

 <span class="german-word" style="font-size: 1.5rem;">${displayVerb} ${irregularMark}${reflBadge}${datBadge}${intrBadge}${ikBadge}${lidBadge}${a1testBadge}</span>

 <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px;">

 <span class="spanish-translation" style="font-size: 1.1rem; color: white; font-style: italic;" onclick="event.stopPropagation(); window.showVerbDetailsInCard('${verbName}', this.closest('.kompakt-level-card'))" title="Details anzeigen">${esTranslation}</span>

 ${showEnglish ? `<span class="english-translation" style="font-size: 1.1rem; color: white; font-weight: 600;" onclick="event.stopPropagation(); window.showVerbDetailsInCard('${verbName}', this.closest('.kompakt-level-card'))" title="Details anzeigen">${enTranslation}</span>` : ''}

 </div>

 </div>

 <div class="card-body niedlich-card-body" onclick="event.stopPropagation(); window.showVerbDetailsInCard('${verbName}', this.closest('.kompakt-level-card'))" style="cursor: pointer;">

 <div class="german-word-container" style="justify-content:center; width: 100%; flex-wrap: wrap; gap: 8px;">

 ${tagsHTML}

 </div>

 </div>

 </div>`;

 }).join('');

 cardsContainer.innerHTML = cardsHTML;

 updateIndicatorsForView(group);

 // No hover listeners needed for this simplified view as text is removed

 }

 // --- NORMAL VERSION RENDER FUNCTION ---

 export function renderNormalVersion(group) {

 cardsContainer.innerHTML = '';

 document.body.classList.remove('compact-view');

 document.body.classList.remove('light-version-global-dark');

 // Restore group arrows because Normal is paginated by group

 if (navigationWrapper) {

 const groupNav = navigationWrapper.querySelector('.group-navigation');

 if (groupNav) groupNav.style.display = 'flex';

 }

 const cardsHTML = group.verbs.map(verbName => {

 const verbData = state.allVerbsData[verbName];

 if (!verbData) return '';

 const translation = getCardTranslation(verbData);

 const irregular = verbData.irregularPraesens ? '*' : '';

 const isReflexive = verbData.case_tags && verbData.case_tags.includes('Reflexiv');

 const reflBadge = isReflexive ? `<span class="reflexiv-badge" style="margin-top: 4px; margin-left: 8px;">refl</span>` : '';

 const isDativ = verbData.case_tags && verbData.case_tags.includes('DAT');

 const datBadge = isDativ ? `<span class="dativ-badge" style="margin-top: 4px; margin-left: 8px;">dat</span>` : '';

 const isIntransitive = verbData.case_tags && verbData.case_tags.includes('INTR');

 const intrBadge = isIntransitive ? `<span class="intr-badge" style="margin-top: 4px; margin-left: 8px;">intr</span>` : '';

 const isIK = verbData.case_tags && verbData.case_tags.includes('IK');

 const ikBadge = isIK ? `<span class="ik-badge" style="margin-top: 4px; margin-left: 8px;">IK</span>` : '';

 const isLiD = verbData.case_tags && verbData.case_tags.includes('LiD');

 const lidBadge = isLiD ? `<span class="lid-badge" style="margin-top: 4px; margin-left: 8px;">LiD</span>` : '';

 const a1testTag = verbData.case_tags ? verbData.case_tags.find(t => t.startsWith('A1')) : null;

 const a1testBadge = a1testTag ? `<span style="margin-top: 4px; margin-left: 8px; font-size: 0.67em;">⭐</span>` : '';

 const emoji = verbData.emoji || '🔵œÂ';

 // Cleaner, simpler card with header and emoji

 return `

 <div class="card normal-card">

 <div class="normal-card-header" onclick="event.stopPropagation(); window.speak('${verbName === 'geboren werden' ? 'geboren' : verbName}')" title="Aussprache hören" style="cursor: pointer;">

 <span class="normal-emoji">${emoji}</span>

 <h3 class="normal-german">${formatVerbPrefix(verbName)}${irregular}</h3>

 ${reflBadge}${datBadge}${intrBadge}${ikBadge}${lidBadge}${a1testBadge}

 </div>

 <div class="normal-card-content" onclick="event.stopPropagation(); window.showVerbDetailsInCard('${verbName}', this.closest('.kompakt-level-card'))" title="Details anzeigen" style="cursor: pointer;">

 <p class="normal-spanish">${translation}</p>

 </div>

 </div>`;

 }).join('');

 cardsContainer.innerHTML = cardsHTML;

 updateIndicatorsForView(group);

 }

 // --- LIGHT VERSION RENDER FUNCTION ---

 export function renderLightVersion(group) {

 cardsContainer.innerHTML = '';

 document.body.classList.remove('compact-view');

 // Restore group arrows because Light is paginated by group

 if (navigationWrapper) {

 const groupNav = navigationWrapper.querySelector('.group-navigation');

 if (groupNav) groupNav.style.display = 'flex';

 }

 // Create light version container

 const lightContainer = document.createElement('div');

 lightContainer.className = 'light-version-container';

 // Create header row

 const headerRow = document.createElement('div');

 headerRow.className = 'light-version-header';

 headerRow.innerHTML = `

 <div class="light-version-header-cell">Infinitiv</div>

 <div class="light-version-header-cell">Perfekt</div>

 <div class="light-version-header-cell">Präteritum</div>

 <div class="light-version-header-cell">Übersetzung</div>

 `;

 lightContainer.appendChild(headerRow);

 // Create data rows

 group.verbs.forEach(verbName => {

 const verbData = state.allVerbsData[verbName];

 if (!verbData) return;

 // Get clean forms

 const infinitiv = verbName;

 const perfekt = getCleanPerfekt(verbData.perfekt);

 const praeteritum = getCleanPraeteritum(verbData.praeteritum);

 const translation = getCardTranslation(verbData);

 const isReflexive = verbData.case_tags && verbData.case_tags.includes('Reflexiv');

 const reflBadge = isReflexive ? ` <span class="reflexiv-badge" style="padding: 1px 4px; font-size: 0.9rem; margin-left: 8px;">refl</span>` : '';

 const isDativ = verbData.case_tags && verbData.case_tags.includes('DAT');

 const datBadge = isDativ ? ` <span class="dativ-badge" style="padding: 1px 4px; font-size: 0.9rem; margin-left: 8px;">dat</span>` : '';

 const isIntransitive = verbData.case_tags && verbData.case_tags.includes('INTR');

 const intrBadge = isIntransitive ? ` <span class="intr-badge" style="padding: 1px 4px; font-size: 0.9rem; margin-left: 8px;">intr</span>` : '';

 const isIK = verbData.case_tags && verbData.case_tags.includes('IK');

 const ikBadge = isIK ? ` <span class="ik-badge" style="padding: 1px 4px; font-size: 0.9rem; margin-left: 8px;">IK</span>` : '';

 const isLiD = verbData.case_tags && verbData.case_tags.includes('LiD');

 const lidBadge = isLiD ? ` <span class="lid-badge" style="padding: 1px 4px; font-size: 0.9rem; margin-left: 8px;">LiD</span>` : '';

 const a1testTag = verbData.case_tags ? verbData.case_tags.find(t => t.startsWith('A1')) : null;

 const a1testBadge = a1testTag ? ` <span style="font-size: 0.6rem; margin-left: 8px;">⭐</span>` : '';

 const displayVerb = formatVerbPrefix(verbName);

 // Create row

 const row = document.createElement('div');

 row.className = 'light-version-row';

 row.innerHTML = `

 <div class="light-version-cell infinitiv" onclick="event.stopPropagation(); window.speak('${verbName === 'geboren werden' ? 'geboren' : verbName}')" title="Aussprache hören" style="cursor: pointer;">${displayVerb}${reflBadge}${datBadge}${intrBadge}${ikBadge}${lidBadge}${a1testBadge}</div>

 <div class="light-version-cell perfekt" onclick="event.stopPropagation(); window.showVerbDetailsInCard('${verbName}', this.closest('.kompakt-level-card'))" title="Details anzeigen" style="cursor: pointer;">${perfekt}</div>

 <div class="light-version-cell praeteritum" onclick="event.stopPropagation(); window.showVerbDetailsInCard('${verbName}', this.closest('.kompakt-level-card'))" title="Details anzeigen" style="cursor: pointer;">${praeteritum}</div>

 <div class="light-version-cell translation" onclick="event.stopPropagation(); window.showVerbDetailsInCard('${verbName}', this.closest('.kompakt-level-card'))" title="Details anzeigen" style="cursor: pointer;">${translation}</div>

 `;

 lightContainer.appendChild(row);

 });

 cardsContainer.appendChild(lightContainer);

 updateIndicatorsForView(group);

 }

 // --- UPDATED RENDER FUNCTION ---

 export function renderVerbGroup() {

 const levelGroups = state.verbGroupsByLevel[state.currentLevel];

 // Auto-correct out-of-bounds index

 if (levelGroups && state.currentGroupInLevel >= levelGroups.length) {

 console.warn(`Group index ${state.currentGroupInLevel} out of bounds for level ${state.currentLevel} (Max: ${levelGroups.length}). Resetting to 0.`);

 state.currentGroupInLevel = 0;

 saveProgress();

 }

 if (!levelGroups || !levelGroups[state.currentGroupInLevel]) {

 console.error(`Group data error: Level=${state.currentLevel}, GroupIndex=${state.currentGroupInLevel}, LoadedGroups=${levelGroups ? levelGroups.length : 'undefined'}`);

 cardsContainer.innerHTML = '<p>Fehler beim Laden der Verben. (Daten fehlen)</p>';

 return;

 }

 const group = levelGroups[state.currentGroupInLevel];

 if (!group.verbs) {

 console.error(`No verbs found in group`);

 cardsContainer.innerHTML = '<p>Fehler beim Laden der Verben.</p>';

 return;

 }

 // Check which version is active

 const selectedVersionRadio = document.querySelector('input[name="card-version"]:checked');

 const activeVersion = selectedVersionRadio ? selectedVersionRadio.value : 'compact';

 if (activeVersion === 'compact') {

 renderCompactVersion();

 } else if (activeVersion === 'niedlich') {

 renderNiedlichVersion(group);

 } else if (activeVersion === 'normal') {

 renderNormalVersion(group);

 } else if (activeVersion === 'light') {

 document.body.classList.add('light-version-global-dark');

 renderLightVersion(group);

 } else {

 // Default to Kompakt if match fails, or Niedlich? User said Default Kompakt.

 renderCompactVersion();

 }

 // Common post-render steps

 updateProgressBar();

 updateLevelNavigationButtons();

 saveProgress();

 return; // Important to return to avoid running the old default code below

 }

 export function setupHoverListeners() {

 const containers = document.querySelectorAll('.perfekt-hover-container');

 containers.forEach(container => {

 const perfektTexts = container.querySelectorAll('.perfekt-text');

 const praeteritumTexts = container.querySelectorAll('.praeteritum-text');

 const konjunktivTexts = container.querySelectorAll('.konjunktiv-text');

 // Add hover listeners to each perfekt text element

 perfektTexts.forEach(perfektText => {

 perfektText.addEventListener('mouseenter', () => {

 // Show full version for all perfekt texts in this container

 container.querySelectorAll('.perfekt-text').forEach(text => {

 text.textContent = text.getAttribute('data-full');

 });

 });

 perfektText.addEventListener('mouseleave', () => {

 // Show short version for all perfekt texts in this container

 container.querySelectorAll('.perfekt-text').forEach(text => {

 text.textContent = text.getAttribute('data-short');

 });

 });

 });

 // Add hover listeners to each präteritum text element

 praeteritumTexts.forEach(praeteritumText => {

 praeteritumText.addEventListener('mouseenter', () => {

 // Show full version for all präteritum texts in this container

 container.querySelectorAll('.praeteritum-text').forEach(text => {

 text.textContent = text.getAttribute('data-full');

 });

 });

 praeteritumText.addEventListener('mouseleave', () => {

 // Show short version for all präteritum texts in this container

 container.querySelectorAll('.praeteritum-text').forEach(text => {

 text.textContent = text.getAttribute('data-short');

 });

 });

 });

 // Add hover listeners to each konjunktiv text element

 konjunktivTexts.forEach(konjunktivText => {

 konjunktivText.addEventListener('mouseenter', () => {

 // Show full version for all konjunktiv texts in this container

 container.querySelectorAll('.konjunktiv-text').forEach(text => {

 text.textContent = text.getAttribute('data-full');

 });

 });

 konjunktivText.addEventListener('mouseleave', () => {

 // Show short version for all konjunktiv texts in this container

 container.querySelectorAll('.konjunktiv-text').forEach(text => {

 text.textContent = text.getAttribute('data-short');

 });

 });

 });

 });

 // Update gustar button visibility

 updateGustarButtonVisibility();

 }

 export function updateGustarButtonVisibility() {
  if (gustarButtonContainer) gustarButtonContainer.style.display = 'block';
  if (reflexiveButtonContainer) reflexiveButtonContainer.style.display = 'block';
 }

 export function setupProgressBar() {

 progressBar.innerHTML = '';

 const totalGroupsInLevel = state.levelConfig[state.currentLevel].groupCount;

 for (let i = 0; i < totalGroupsInLevel; i++) {

 const step = document.createElement('div');

 step.classList.add('progress-step');

 progressBar.appendChild(step);

 }

 }

 export function updateProgressBar() {

 setupProgressBar(); // Rebuild for current level

 const steps = progressBar.querySelectorAll('.progress-step');

 steps.forEach((step, i) => {

 step.classList.toggle('active', i <= state.currentGroupInLevel);

 });

 }

 export function updateLevelNavigationButtons() {

 const prevLevelBtn = document.getElementById('prev-level-btn');

 const nextLevelBtn = document.getElementById('next-level-btn');

 const currentLevelIndex = levelOrder.indexOf(state.currentLevel);

 prevLevelBtn.disabled = currentLevelIndex === 0;

 nextLevelBtn.disabled = currentLevelIndex === levelOrder.length - 1;

 }

 // Helper functions for progress tracking

 export function saveProgress() {

 memoStorage.saveProgress(state.currentLevel, state.currentGroupInLevel);


 }

 export function loadProgress() {

 // Load saved progress

 const savedLevel = memoStorage.getCurrentLevel();

 // Retrieve group using level-specific key first (legacy), or generic (new)

 // Actually, previous code used `progress_${currentLevel}`. We should stick to that or migrate.

 // Let's rely on `progress_${level}` to allow independent progress per level.

 if (savedLevel && state.levelConfig[savedLevel]) {

 state.currentLevel = savedLevel;

 } else {

 // Fallback/Correction

 state.currentLevel = 'A1';

 }

 const savedGroup = memoStorage.getSavedGroup(state.currentLevel) ?? NaN;

 const maxGroups = state.levelConfig[state.currentLevel].groupCount;

 if (!isNaN(savedGroup) && savedGroup >= 0 && savedGroup < maxGroups) {

 state.currentGroupInLevel = savedGroup;

 } else {

 console.warn(`Resetting invalid/missing saved group for level ${state.currentLevel}`);

 state.currentGroupInLevel = 0;

 }

 }

 export function getSavedGroupForLevel(levelKey) {

 const maxGroups = state.levelConfig[levelKey] ? state.levelConfig[levelKey].groupCount : 0;

 const savedGroup = memoStorage.getSavedGroup(levelKey) ?? NaN;

 if (!isNaN(savedGroup) && savedGroup >= 0 && savedGroup < maxGroups) {

 return savedGroup;

 }

 return 0;

 }

 export async function navigateToLevel(targetLevel) {

 if (!state.levelConfig[targetLevel]) return;

 const targetGroup = getSavedGroupForLevel(targetLevel);

 await loadGroupData(targetLevel, targetGroup);

 state.currentLevel = targetLevel;

 state.currentGroupInLevel = targetGroup;

 state.isLevelMenuExpanded = false;

 syncMobileLevelToggleState();

 clearSearchAndRender();

 }

 export function clearSearchAndRender() {

 if (searchInput) {

 searchInput.value = '';

 }

 const clearSearchBtn = document.getElementById('clear-search');

 const searchCounter = document.getElementById('search-counter');

 if (clearSearchBtn) clearSearchBtn.classList.remove('visible');

 if (searchCounter) searchCounter.textContent = '';

 if (levelIndicator) {

 levelIndicator.style.opacity = '1';

 levelIndicator.style.pointerEvents = 'auto';

 }

 cardsContainer.style.transform = 'translateX(0) scale(1)';

 renderVerbGroup();

 }
