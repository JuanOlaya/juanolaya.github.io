document.addEventListener('DOMContentLoaded', () => {

 // --- GLOBAL STATE ---

 let allVerbsData = {}; // Global Data Containers

 let verbGroupsByLevel = {}; // Global Data Containers

 let verbTypesData = {}; // Verb types and notes data

 let allGroupsIndex = []; // Full groups index from verbs_index.json for reliable theme search

 let fileIndexData = null; // Existing JSON files by folder to avoid noisy 404 fetches

 let searchScope = 'verbs'; // 'verbs' or 'wortfamilie'

let wortfamilieIndex = null; // Search-ready Wortfamilie index hydrated from cache/background load

 const germanOrdinals = ["Erste", "Zweite", "Dritte", "Vierte", "Fünfte", "Sechste", "Siebte", "Achte", "Neunte", "Zehnte", "Elfte", "Zwölfte", "Dreizehnte"];

 const germanExampleOrdinals = ["Erstes", "Zweites", "Drittes", "Viertes", "Fünftes", "Sechstes", "Siebtes", "Achtes"];

 const savedStories = [

 `<p>Gestern <span class="highlighted-word">bin ich</span> in Berlin <span class="highlighted-word">gewesen</span>. Ich <span class="highlighted-word">bin</span> mit dem Zug <span class="highlighted-word">gefahren</span>. In der Stadt <span class="highlighted-word">habe ich</span> eine Freundin <span class="highlighted-word">gesehen</span>. Wir <span class="highlighted-word">haben</span> in einem Café <span class="highlighted-word">gesprochen</span> und einen Kaffee <span class="highlighted-word">getrunken</span>. Danach <span class="highlighted-word">habe ich</span> ein Buch <span class="highlighted-word">gekauft</span> und mit Karte <span class="highlighted-word">bezahlt</span>. Es <span class="highlighted-word">hat</span> viel Spaß <span class="highlighted-word">gemacht</span>!</p>`,

 `<p>Heute Morgen <span class="highlighted-word">habe ich</span> lange <span class="highlighted-word">geschlafen</span>. Zum Frühstück <span class="highlighted-word">habe ich</span> ein Brötchen <span class="highlighted-word">gegessen</span>. Dann <span class="highlighted-word">habe ich</span> eine E-Mail an meine Familie <span class="highlighted-word">geschrieben</span>. Ich <span class="highlighted-word">habe</span> ihnen <span class="highlighted-word">gesagt</span>, dass ich bald nach Hause <span class="highlighted-word">komme</span>. Später <span class="highlighted-word">habe ich</span> die Zeitung <span class="highlighted-word">gelesen</span>.</p>`,

 `<p>Am Wochenende <span class="highlighted-word">habe ich</span> zu Hause <span class="highlighted-word">gearbeitet</span>. Ich <span class="highlighted-word">habe</span> für eine Prüfung <span class="highlighted-word">gelernt</span>. Ich <span class="highlighted-word">habe</span> eine Frage nicht <span class="highlighted-word">gewusst</span>, also <span class="highlighted-word">habe ich</span> meinen Lehrer <span class="highlighted-word">gefüragt</span>. Er <span class="highlighted-word">hat</span> mir alles gut erklärt. Ich <span class="highlighted-word">habe</span> die Antwort schnell <span class="highlighted-word">gefunden</span>.</p>`

 ];

 let physicalLevelMap = {

 'A1': [

 { key: 'A1_1', count: 16, fileNumbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16] },

 { key: 'A1_2', count: 18, fileNumbers: [15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32] }

 ],

 'A2': [

 { key: 'A2_1', count: 13, fileNumbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13] },

 { key: 'A2_2', count: 19, fileNumbers: [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31] }

 ],

 'B1': [{ key: 'B1_1', count: 26, fileNumbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26] }],

 'B2': [{ key: 'B2_1', count: 14, fileNumbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14] }]

 };

 const standardColors = ['#8b5cf6', '#ec4899', '#f59e0b', '#3b82f6', '#ea580c', '#22C55E', '#a855f7', '#facc15'];

 const separablePrefixesMap = {

 "abbiegen": "ab", "abfahren": "ab", "abfliegen": "ab", "abgeben": "ab", "abhalten": "ab", "abheben": "ab", "abholen": "ab", "absagen": "ab", "abschließen": "ab", "ablehnen": "ab", "abnehmen": "ab", "abschaffen": "ab", "absichern": "ab", "abreisen": "ab",

 "anbieten": "an", "anfahren": "an", "anfangen": "an", "ankommen": "an", "ankreuzen": "an", "anprobieren": "an", "anrufen": "an", "ansehen": "an", "anziehen": "an", "anklagen": "an", "anklicken": "an", "anmachen": "an", "anmelden": "an", "anregen": "an", "anwenden": "an", "anreisen": "an",

 "aufbauen": "auf", "aufhören": "auf", "aufmachen": "auf", "aufpassen": "auf", "aufräumen": "auf", "aufstehen": "auf", "aufwachen": "auf", "aufwachsen": "auf", "aufgeben": "auf", "aufregen": "auf", "aufsuchen": "auf",

 "ausfallen": "aus", "ausfüllen": "aus", "ausgehen": "aus", "ausgeben": "aus", "auslegen": "aus", "ausleihen": "aus", "auspacken": "aus", "ausruhen": "aus", "aussehen": "aus", "aussprechen": "aus", "aussteigen": "aus", "aussuchen": "aus", "auswählen": "aus", "ausziehen": "aus", "ausgrenzen": "aus", "auslösen": "aus", "ausmachen": "aus", "ausschalten": "aus",

 "beitreten": "bei", "dabeihaben": "dabei", "durchstreichen": "durch",

 "darlegen": "dar",

 "eingreifen": "ein", "einkaufen": "ein", "einladen": "ein", "einmachen": "ein", "einpacken": "ein", "einrichten": "ein", "einschlafen": "ein", "einsteigen": "ein", "eintragen": "ein", "einziehen": "ein", "einhalten": "ein", "einlegen": "ein", "einordnen": "ein", "einreichen": "ein", "einschalten": "ein", "einschränken": "ein", "einstellen": "ein", "einwenden": "ein",

 "fernsehen": "fern", "fertigmachen": "fertig", "herstellen": "her", "hineingehen": "hinein", "hinzufügen": "hinzu",

 "feststellen": "fest", "herunterladen": "herunter", "hochladen": "hoch",

 "kennenlernen": "kennen",

 "mitbringen": "mit", "mitkommen": "mit", "mitmachen": "mit", "mitnehmen": "mit", "mitteilen": "mit", "mitwirken": "mit",

 "nachholen": "nach", "stattfinden": "statt",

 "teilnehmen": "teil",

 "umsteigen": "um", "umtauschen": "um", "umziehen": "um",

 "vorbereiten": "vor", "vorhaben": "vor", "weiterhelfen": "weiter", "vorschlagen": "vor", "vorstellen": "vor",

 "wegtun": "weg", "wegwerfen": "weg", "wehtun": "weh", "wohlfühlen": "wohl",

 "zuhören": "zu", "zumachen": "zu", "zuordnen": "zu", "zunehmen": "zu", "zustimmen": "zu",

 "zurückbringen": "zurück", "zurückgeben": "zurück", "zurückkommen": "zurück"

 };

 function formatVerbPrefix(verbName, isModal = false) {

  if (verbName === 'geboren werden' && !isModal) {

    return 'geboren';

  }

  if (separablePrefixesMap[verbName]) {

    const prefix = separablePrefixesMap[verbName];

    if (verbName.startsWith(prefix)) {

      return `<span class="separable-prefix">${prefix}</span>${verbName.slice(prefix.length)}`;

    }

  }

  return verbName;

 }

 function getPhysicalGroupData(macroLevel, globalIndex) {

 const layers = physicalLevelMap[macroLevel] || [];

 let offset = 0;

 for (let i = 0; i < layers.length; i++) {

 let layer = layers[i];

 if (globalIndex < offset + layer.count) {

 const localIndex = globalIndex - offset;

 const fileNumber = Array.isArray(layer.fileNumbers)

 ? layer.fileNumbers[localIndex]

 : globalIndex + 1;

 return { physicalKey: layer.key, localIndex, fileNumber };

 }

 offset += layer.count;

 }

 return null;

 }

 function getThemeColorForVerbData(verbData) {

 if (!verbData || !verbData.level || !verbData.group) {

 return '#4682B4';

 }

 const macroLevel = verbData.level.split('.')[0];

 const physicalKey = verbData.level.replace('.', '_');

 const layers = physicalLevelMap[macroLevel] || [];

 let globalGroupIndex = Number(verbData.group) - 1;

 for (let i = 0; i < layers.length; i++) {

 const layer = layers[i];

 if (layer.key === physicalKey) {

 break;

 }

 globalGroupIndex += layer.count;

 }

 return standardColors[((globalGroupIndex % standardColors.length) + standardColors.length) % standardColors.length];

 }

 function hexToRgb(hex) {

 if (!hex) return null;

 const normalized = hex.replace('#', '').trim();

 const full = normalized.length === 3

 ? normalized.split('').map(ch => ch + ch).join('')

 : normalized;

 const int = parseInt(full, 16);

 if (Number.isNaN(int) || full.length !== 6) return null;

 return {

 r: (int >> 16) & 255,

 g: (int >> 8) & 255,

 b: int & 255

 };

 }

 function rgbToHex({ r, g, b }) {

 const toHex = (value) => Math.max(0, Math.min(255, Math.round(value))).toString(16).padStart(2, '0');

 return `#${toHex(r)}${toHex(g)}${toHex(b)}`;

 }

 function mixHexColors(colorA, colorB, weight = 0.5) {

 const a = hexToRgb(colorA);

 const b = hexToRgb(colorB);

 if (!a) return colorB;

 if (!b) return colorA;

 return rgbToHex({

 r: a.r * (1 - weight) + b.r * weight,

 g: a.g * (1 - weight) + b.g * weight,

 b: a.b * (1 - weight) + b.b * weight

 });

 }

 function hexToRgb(hex) {

  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;

  hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

  return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '59, 130, 246';

}

function applyModalThemePalette(verbData) {

 const modalContentEl = document.querySelector('#verb-modal .modal-content');

 const modalHeaderEl = document.querySelector('#verb-modal .modal-header');

 if (!modalContentEl) return;

 const themeColor = getThemeColorForVerbData(verbData);

 const softColor = mixHexColors(themeColor, '#ffffff', 0.78);

 const paleColor = mixHexColors(themeColor, '#ffffff', 0.9);

 const strongColor = mixHexColors(themeColor, '#0f172a', 0.22);

 const borderColor = mixHexColors(themeColor, '#cbd5e1', 0.55);

 modalContentEl.style.setProperty('--modal-theme', themeColor);

 modalContentEl.style.setProperty('--modal-theme-soft', softColor);

 modalContentEl.style.setProperty('--modal-theme-pale', paleColor);

 modalContentEl.style.setProperty('--modal-theme-strong', strongColor);

 modalContentEl.style.setProperty('--modal-theme-border', borderColor);

  const rgbString = hexToRgb(themeColor);

  modalContentEl.style.setProperty('--modal-theme-rgb', rgbString);

 if (modalHeaderEl) {

 modalHeaderEl.style.backgroundColor = themeColor;

 }

 }

 let levelConfig = {

 'A1': { groupCount: 30, displayName: 'A1' },

 'A2': { groupCount: 28, displayName: 'A2' },

 'B1': { groupCount: 26, displayName: 'B1' },

 'B2': { groupCount: 14, displayName: 'B2' }

 };

 function autoConfigureLevelsFromGroups(groupsArray) {

 if (!Array.isArray(groupsArray) || groupsArray.length === 0) return;

 const previousPhysicalMap = physicalLevelMap;

 const tempPhysicalMap = {};

 const tempLevelConfig = {};

 groupsArray.forEach(group => {

 if (!group || !group.level) return;

 const parts = String(group.level).split('.');

 const macroLevel = parts[0];

 const physicalKey = String(group.level).replace('.', '_');

 if (!tempPhysicalMap[macroLevel]) tempPhysicalMap[macroLevel] = [];

 if (!tempLevelConfig[macroLevel]) tempLevelConfig[macroLevel] = { groupCount: 0, displayName: macroLevel };

 tempLevelConfig[macroLevel].groupCount++;

 let layer = tempPhysicalMap[macroLevel].find(l => l.key === physicalKey);

 if (!layer) { layer = { key: physicalKey, count: 0, fileNumbers: [] }; tempPhysicalMap[macroLevel].push(layer); }

 layer.count++;

 });

 Object.values(tempPhysicalMap).forEach(layers => {

 layers.forEach(layer => {

 const macroLevel = layer.key.split('_')[0];

 const previousLayer = (previousPhysicalMap[macroLevel] || []).find(item => item.key === layer.key);

 if (previousLayer && Array.isArray(previousLayer.fileNumbers)) {

 if (layer.count > previousLayer.fileNumbers.length) {

 const lastNum = previousLayer.fileNumbers.length > 0 ? previousLayer.fileNumbers[previousLayer.fileNumbers.length - 1] : 0;

 const diff = layer.count - previousLayer.fileNumbers.length;

 const extension = Array.from({ length: diff }, (_, index) => lastNum + index + 1);

 layer.fileNumbers = [...previousLayer.fileNumbers, ...extension];

 } else {

 layer.fileNumbers = previousLayer.fileNumbers.slice(0, layer.count);

 }

 } else {

 layer.fileNumbers = Array.from({ length: layer.count }, (_, index) => index + 1);

 }

 });

 });

 physicalLevelMap = tempPhysicalMap;

 levelConfig = tempLevelConfig;

 }

 const levelOrder = ['A1', 'A2', 'B1', 'B2'];

 // Verbs that support Konjunktiv II

 const konjunktivVerbs = ['sein', 'haben', 'werden', 'dürfen', 'müssen', 'wollen', 'sollen', 'mögen', 'können'];

 let currentLevel = 'A1';

 let currentGroupInLevel = 0; // 0-indexed position within current level

 let currentVerbInModal = '';

 let currentIndexInModal = 0;

 let modalDeferredLoadToken = 0;

 let modalExampleLoadToken = 0;

 let modalSessionId = 0;

 let isRestoringModalTab = false;

 let storyClickCounter = 0;

let currentViewMode = 'compact'; // Tracks active view: 'normal', 'compact', 'niedlich', 'light'

const CACHE_KEY = 'verbAppCache_v46_wortfamilie_search_ready';

const SETTINGS_MIGRATION_KEY = 'verbenSettingsMigration_v1_show_ik_lid';

let cachePersistTimeout = null;

let cachePersistenceDisabled = false;

let cacheHydrated = false;

let hydratedCacheVersion = null;

const PRELOAD_CONJUGATIONS_IN_BACKGROUND = true;

const PRELOAD_CONJUGATIONS_SCOPE = 'current-group';

const lazyExampleLoadPromises = new Map();

 const HEAVY_VERB_DATA_KEYS = [

 'praesens_examples',

 'praeteritum_examples',

 'praesens_fragen',

 'wortfamilie'

 ];

 // --- DOM ELEMENTS ---

 const mainContainer = document.getElementById('main-container');

 const cardsContainer = document.getElementById('cards-container');

 const levelIndicator = document.getElementById('level-indicator');

 const controlsContainer = document.querySelector('.controls-container');

 const headerSearchContainer = document.querySelector('.controls-container .search-container');

 const levelToggleContainer = document.querySelector('.level-toggle-container');

 const levelToggleFooter = document.querySelector('.level-toggle-footer');

 const levelToggleButtons = document.querySelectorAll('.level-toggle-footer .level-option');

 const groupThemeIndicator = document.getElementById('group-theme-indicator');

 const groupIndicator = document.getElementById('group-indicator');

 const progressBar = document.getElementById('progress-bar');

 const prevGroupBtn = document.getElementById('prev-group-btn');

 const nextGroupBtn = document.getElementById('next-group-btn');

 const navigationWrapper = document.querySelector('.navigation-wrapper');

 const storyButton = document.getElementById('story-button');

 const storyContainer = document.getElementById('story-container');

 const storyContent = document.getElementById('story-content');

 const searchInput = document.getElementById('verb-search');

 const settingsBtn = document.getElementById('settings-btn');

 const verbModal = document.getElementById('verb-modal');

 const infoModal = document.getElementById('info-modal');

 const closeVerbModalButton = document.getElementById('close-verb-modal');

 const closeVerbModalXButton = document.getElementById('close-verb-modal-x');

 const infoButton = document.getElementById('info-button');

 const closeInfoModalButton = document.getElementById('close-info-modal');

 const gustarButtonContainer = document.getElementById('gustar-button-container');

 const gustarButton = document.getElementById('gustar-button');

 const gustarModal = document.getElementById('gustar-modal');

 const gustarCloseBtn = document.getElementById('gustar-close-btn');

 const gustarCloseFooterBtn = document.getElementById('gustar-close-footer-btn');

 const reflexiveButtonContainer = document.getElementById('reflexive-button-container');

 const reflexiveButton = document.getElementById('reflexive-button');

 const reflexiveModal = document.getElementById('reflexive-modal');

 const reflexiveCloseBtn = document.getElementById('reflexive-close-btn');

 const reflexiveCloseFooterBtn = document.getElementById('reflexive-close-footer-btn');

 // Theme modal elements

 const themeModal = document.getElementById('theme-modal');

 const closeThemeModalX = document.getElementById('close-theme-modal-x');

 const closeThemeModalBtn = document.getElementById('close-theme-modal-btn');

 function setupModalHeaderLayout() {

 const modalHeader = document.querySelector('#verb-modal .modal-header');

 const translationsEl = document.getElementById('modal-verb-translations');

 const tagsToggle = document.getElementById('modal-tags-toggle');

 if (!modalHeader || !translationsEl || !tagsToggle) return;

 let translationRow = modalHeader.querySelector('.modal-translation-row');

 if (!translationRow) {

 translationRow = document.createElement('div');

 translationRow.className = 'modal-translation-row';

 modalHeader.insertBefore(translationRow, translationsEl);

 }

  translationRow.appendChild(translationsEl);

  translationRow.appendChild(tagsToggle);

  }

 setupModalHeaderLayout();

 // Header Tags Toggle Listener

 const modalTagsToggle = document.getElementById('modal-tags-toggle');

 if (modalTagsToggle) {

 modalTagsToggle.addEventListener('click', (e) => {

 e.stopPropagation();

 const wrapper = document.getElementById('modal-tags-collapsible');

 const dots = modalTagsToggle.querySelector('.dots-icon');

 const chevron = modalTagsToggle.querySelector('.chevron-icon');

 if (wrapper) {

 const isCollapsed = wrapper.classList.toggle('collapsed');

 if (isCollapsed) {

 dots.style.display = 'inline';

 chevron.style.display = 'none';

 } else {

 dots.style.display = 'none';

 chevron.style.display = 'inline';

 }

 }

 });

 }

 // Theme data storage

 let currentThemeData = null;

 let appVersion = '1.6_static'; // Stable version; replaced by verbs_index.lastUpdated when available

 let isLevelMenuExpanded = false;

 const mobileLevelMediaQuery = window.matchMedia('(max-width: 600px)');

 let footerUtilityBar = null;

 let footerSearchShell = null;

 let footerSearchPanel = null;

 let footerSearchToggle = null;

 let isFooterSearchExpanded = false;

 let isFooterSearchForcedOpen = false;

 let levelMenuIdleTimeout = null;

 let searchIdleTimeout = null;

 async function parseJsonUtf8(response) {

 const buffer = await response.arrayBuffer();

 const text = new TextDecoder('utf-8').decode(buffer);

 return normalizeMojibakeDeep(JSON.parse(text));

 }

 function normalizeMojibakeString(value) {

 if (typeof value !== 'string') return value;

 let normalized = value;

 const replacements = [

 ['íÃ†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¾', 'Ä'],

 ['Ö', 'Ö'],

 ['íÃ†â€™Ãƒâ€¦Ã¢â‚¬Å“', 'Ü'],

 ['ä', 'ä'],

 ['ö', 'ö'],

 ['ü', 'ü'],

 ['ß', 'ß'],

 ['á', 'á'],

 ['é', 'é'],

 ['í', 'í'],

 ['ó', 'ó'],

 ['ú', 'ú'],

 ['ñ', 'ñ'],

 ['íÃ†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â°', 'Ãƒâ€°'],

 ['íÃ¢â‚¬Å¾', 'Ä'],

 ['íÃ¢â‚¬â€œ', 'Ö'],

 ['íÃ…â€œ', 'Ü'],

 ['ä', 'ä'],

 ['ö', 'ö'],

 ['ü', 'ü'],

 ['ß', 'ß'],

 ['á', 'á'],

 ['é', 'é'],

 ['í', 'í'],

 ['ó', 'ó'],

 ['ú', 'ú'],

 ['ñ', 'ñ'],

 ['Ã‚Â¿', 'Ã‚Â¿'],

 ['Ã‚Â¡', 'Ã‚Â¡'],

 // Mojibake for emojis (UTF-8 bytes read as Windows-1252)

 ['ÃƒÂ°Ã…Â¸Ã¢â‚¬Å“Ã…Â¡', '🔵œÅ¡'],

 ['🏡', '🏡'],

 ['ÃƒÂ°Ã…Â¸Ã¢â‚¬â„¢Ã‚Â¼', '🔵™Â¼'],

 ['ÃƒÂ°Ã…Â¸Ã…Â¡Ã‚Â¢', 'Ã°Å¸Å¡Â¢'],

 ['ÃƒÂ°Ã…Â¸Ã…Â¡Ã¢â€šÂ¬', '🚀'],

 ['ÃƒÂ°Ã…Â¸Ã¢â‚¬â„¢Ã‚Â¬', '🔵™Â¬'],

 ['ÃƒÂ°Ã…Â¸Ã¢â‚¬Å“Ã¢â‚¬â€œ', '🔵œâ€“'],

 ['ÃƒÂ°Ã…Â¸Ã¢â‚¬â„¢Ã‚Â¡', '💡']

 ];

 for (let pass = 0; pass < 3; pass++) {

 let changed = false;

 for (const [broken, fixed] of replacements) {

 if (normalized.includes(broken)) {

 normalized = normalized.split(broken).join(fixed);

 changed = true;

 }

 }

 if (!changed) break;

 }

 return normalized;

 }

 function normalizeMojibakeDeep(value) {

 if (typeof value === 'string') {

 return normalizeMojibakeString(value);

 }

 if (Array.isArray(value)) {

 return value.map(item => normalizeMojibakeDeep(item));

 }

 if (!value || typeof value !== 'object') {

 return value;

 }

 const normalizedObject = {};

 Object.entries(value).forEach(([key, entryValue]) => {

 normalizedObject[normalizeMojibakeString(key)] = normalizeMojibakeDeep(entryValue);

 });

 return normalizedObject;

 }

 function setupFooterUtilityBar() {

 if (!levelToggleContainer || !headerSearchContainer || !controlsContainer) return;

 const settingsButton = settingsBtn;

 if (settingsButton && settingsButton.parentElement === headerSearchContainer) {

 controlsContainer.appendChild(settingsButton);

 }

 footerUtilityBar = document.createElement('div');

 footerUtilityBar.className = 'footer-utility-bar';

 const footerSearch = document.createElement('div');

 footerSearch.className = 'footer-search-shell footer-search-collapsed';

 footerSearch.innerHTML = `

 <div class="footer-search-panel">

 </div>

 <button id="footer-search-toggle" class="footer-search-toggle" type="button" aria-expanded="false" aria-label="Search">

 <span class="footer-search-arrow">‹</span>

 <span class="footer-search-icon">⌕</span>

 </button>

 `;

 footerSearchPanel = footerSearch.querySelector('.footer-search-panel');

 footerSearchToggle = footerSearch.querySelector('#footer-search-toggle');

 headerSearchContainer.classList.add('footer-search-container');

 footerSearchPanel.prepend(headerSearchContainer);

 const settingsModal = document.getElementById('settings-modal');

 const footerParent = settingsModal?.parentElement || document.body;

 footerParent.insertBefore(footerUtilityBar, settingsModal || null);

 footerUtilityBar.appendChild(levelToggleContainer);

 footerUtilityBar.appendChild(footerSearch);

 footerSearchShell = footerSearch;

 }

 function scheduleLevelMenuIdleCollapse() {

 clearTimeout(levelMenuIdleTimeout);

 if (!isLevelMenuExpanded || isFooterSearchExpanded) return;

 levelMenuIdleTimeout = setTimeout(() => {

 isLevelMenuExpanded = false;

 syncMobileLevelToggleState();

 }, 1800);

 }

 function scheduleSearchIdleCollapse() {

 clearTimeout(searchIdleTimeout);

 if (!isFooterSearchExpanded || isFooterSearchForcedOpen) return;

 if (searchInput && searchInput.value.trim()) return;

 searchIdleTimeout = setTimeout(() => {

 if (searchInput && document.activeElement === searchInput) return;

 if (searchInput && searchInput.value.trim()) return;

 setFooterSearchExpanded(false);

 }, 1800);

 }

 function setFooterSearchExpanded(expanded, { forced = false } = {}) {

 if (!footerSearchShell || !footerSearchToggle) return;

 isFooterSearchExpanded = expanded;

 isFooterSearchForcedOpen = forced ? expanded : (expanded && isFooterSearchForcedOpen);

 if (!expanded) {

 isFooterSearchForcedOpen = false;

 } else {

 isLevelMenuExpanded = false;

 }

 footerSearchShell.classList.toggle('footer-search-expanded', expanded);

 footerSearchShell.classList.toggle('footer-search-collapsed', !expanded);

 footerSearchToggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');

 if (expanded) {

 scheduleSearchIdleCollapse();

 } else {

 clearTimeout(searchIdleTimeout);

 }

 syncMobileLevelToggleState();

 }

 setupFooterUtilityBar();

 function syncMobileLevelToggleState() {

    return; // disabled collapse

 if (!levelToggleFooter) return;

 const isMobile = mobileLevelMediaQuery.matches;

 const isCollapsed = !isLevelMenuExpanded || isFooterSearchExpanded;

 levelToggleFooter.classList.toggle('mobile-collapsed', isCollapsed);

 levelToggleFooter.classList.toggle('mobile-expanded', !isCollapsed);

 levelToggleFooter.classList.toggle('selector-collapsed', isCollapsed);

 levelToggleFooter.classList.toggle('selector-expanded', !isCollapsed);

 levelToggleFooter.classList.toggle('search-collapsed', isFooterSearchExpanded);

 levelToggleContainer?.classList.toggle('mobile-right-docked', isMobile);

 if (isCollapsed) {

 clearTimeout(levelMenuIdleTimeout);

 } else {

 scheduleLevelMenuIdleCollapse();

 }

 }

 function createLightweightVerbDataSnapshot(source = allVerbsData) {

 const snapshot = {};

 Object.entries(source || {}).forEach(([verbName, verbData]) => {

 if (!verbData || typeof verbData !== 'object' || Array.isArray(verbData)) return;

 const compactVerbData = { ...verbData };

 HEAVY_VERB_DATA_KEYS.forEach(key => {

 delete compactVerbData[key];

 });

 snapshot[verbName] = compactVerbData;

 });

 return snapshot;

 }

 function createCachePayload({ compact = false } = {}) {

 const lightweightVerbs = createLightweightVerbDataSnapshot(allVerbsData);

 const payload = {

 allVerbsData: lightweightVerbs,

 verbGroupsByLevel,

 allGroupsIndex,

 fileIndexData,

 wortfamilieIndex,

 lastUpdated: appVersion || new Date().toISOString(),

 timestamp: Date.now(),

 cacheMode: compact ? 'compact' : 'full'

 };

 if (!compact) {

 return payload;

 }

 const compactGroups = {};

 const compactVerbsData = {};

 const groups = verbGroupsByLevel[currentLevel] || [];

 compactGroups[currentLevel] = groups;

 groups.forEach(group => {

 if (!group || !Array.isArray(group.verbs)) return;

 group.verbs.forEach(verbName => {

 if (lightweightVerbs[verbName]) {

 compactVerbsData[verbName] = lightweightVerbs[verbName];

 }

 });

 });

 return {

 ...payload,

 allVerbsData: compactVerbsData,

 verbGroupsByLevel: compactGroups

 };

 }

 function persistCacheSnapshot() {

 if (cachePersistenceDisabled) return;

 try {

 localStorage.setItem(CACHE_KEY, JSON.stringify(createCachePayload()));

 } catch (e) {

 try {

 localStorage.setItem(CACHE_KEY, JSON.stringify(createCachePayload({ compact: true })));

 } catch (compactError) {

 cachePersistenceDisabled = true;

 clearTimeout(cachePersistTimeout);

 }

 }

 }

 function scheduleCachePersist() {

 if (cachePersistenceDisabled) return;

 clearTimeout(cachePersistTimeout);

 cachePersistTimeout = setTimeout(() => {

 persistCacheSnapshot();

 }, 250);

 }

function hydrateFromLocalCache() {

 try {

 const cached = localStorage.getItem(CACHE_KEY);

 if (!cached) return false;

 const data = normalizeMojibakeDeep(JSON.parse(cached));

 if (!data || !data.allVerbsData || !data.verbGroupsByLevel) return false;

 allVerbsData = data.allVerbsData;

 verbGroupsByLevel = data.verbGroupsByLevel;

 allGroupsIndex = Array.isArray(data.allGroupsIndex) ? data.allGroupsIndex : [];

 if (allGroupsIndex.length > 0) autoConfigureLevelsFromGroups(allGroupsIndex);

 fileIndexData = data.fileIndexData || null;

 if (data.wortfamilieIndex && typeof data.wortfamilieIndex === 'object') {

 wortfamilieIndex = data.wortfamilieIndex;

 }

 if (data.lastUpdated) {
    appVersion = data.lastUpdated.replace(/\s+/g, '_').replace(/:/g, '-');
    hydratedCacheVersion = data.lastUpdated;
  }

 cacheHydrated = true;

 return true;

 } catch (e) {

 console.warn("Failed to hydrate from local cache", e);

 cacheHydrated = false;

 hydratedCacheVersion = null;

 return false;

 }

}

 function hasCachedGroup(levelKey, groupIndex) {

 const group = verbGroupsByLevel[levelKey] && verbGroupsByLevel[levelKey][groupIndex];

 if (!group || !Array.isArray(group.verbs)) return false;

 return group.verbs.every(verbName => !!allVerbsData[verbName]);

 }

 function hasCachedLevel(levelKey) {

 const config = levelConfig[levelKey];

 if (!config || !verbGroupsByLevel[levelKey]) return false;

 for (let i = 0; i < config.groupCount; i++) {

 if (!hasCachedGroup(levelKey, i)) return false;

 }

 return true;

 }

 // --- BACKGROUND LOADING & PROGRESS ---

 let isBackgroundLoading = false;

 let loadingProgressState = { cards: 0, conjugations: 0 };

 function updateLoadingProgress(percentage, phase = 'cards') {

 if (!searchInput) return;

 loadingProgressState[phase] = Math.max(0, Math.min(100, percentage));

 const cardsProgress = Math.round(loadingProgressState.cards || 0);

 const conjugationsProgress = Math.round(loadingProgressState.conjugations || 0);

 const overallProgress = cardsProgress;

 if (phase === 'cards' && percentage < 100) {

 setFooterSearchExpanded(true, { forced: true });

 footerSearchShell?.classList.add('loading-active');

 searchInput.style.background = `linear-gradient(to right, rgba(250,112,154,0.65) 0%, rgba(254,225,64,0.65) ${overallProgress}%, rgba(15,23,42,0.92) ${overallProgress}%, rgba(15,23,42,0.92) 100%)`;

 searchInput.placeholder = `cards ${Math.round(percentage)}%`;

 searchInput.classList.add('loading-active');

 } else {

 if (cardsProgress >= 100 && conjugationsProgress >= 100) {

 searchInput.placeholder = "Suchen... (buscar)";

 searchInput.classList.remove('loading-active');

 searchInput.style.background = '';

 footerSearchShell?.classList.remove('loading-active');

 if (isFooterSearchForcedOpen) {

 setFooterSearchExpanded(false);

 }

 }

 }

 }

async function loadBackgroundData() {

 let remoteVersion = null;

 // 1. Check for updates (Version Check)

 try {

    const vRes = await fetch('json/verbs_index.json?t=' + Date.now(), { cache: 'no-cache' });

 if (vRes.ok) {
    const vData = await parseJsonUtf8(vRes);
    remoteVersion = vData.lastUpdated;
    allGroupsIndex = Array.isArray(vData.groups) ? vData.groups : allGroupsIndex;
    if (allGroupsIndex.length > 0) autoConfigureLevelsFromGroups(allGroupsIndex);

    if (remoteVersion) {
      appVersion = remoteVersion.replace(/\s+/g, '_').replace(/:/g, '-');
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

 cacheHydrated && hydratedCacheVersion && remoteVersion && hydratedCacheVersion === remoteVersion;

 if (cacheHydrated && (!remoteVersion || cacheMatchesRemoteVersion)) {

 if (!wortfamilieIndex) {

 await loadWortfamilieIndex();

 scheduleCachePersist();

 }

 console.log("Skipping background load because local cache already matches the current version.");

 loadingProgressState = { cards: 100, conjugations: 100 };

 updateLoadingProgress(100, 'cards');

 updateLoadingProgress(100, 'conjugations');

 isBackgroundLoading = false;

 return;

 }

 // 2. Try to load from LocalStorage

 try {

 const cached = localStorage.getItem(CACHE_KEY);

 if (cached) {

 const data = normalizeMojibakeDeep(JSON.parse(cached));

 // Cache is valid IF:

 // a) We failed to get remote version (assume offline/safe), OR

 // b) Remote version matches cached version

 const isCacheValid = !remoteVersion || (data.lastUpdated === remoteVersion);

 if (isCacheValid && data.allVerbsData && data.verbGroupsByLevel) {

 console.log("Loaded data from LocalStorage cache (Version match).");

 allVerbsData = data.allVerbsData;

 verbGroupsByLevel = data.verbGroupsByLevel;

 if ((!Array.isArray(allGroupsIndex) || allGroupsIndex.length === 0) && Array.isArray(data.allGroupsIndex)) {

 allGroupsIndex = data.allGroupsIndex;

 }

 if (!fileIndexData && data.fileIndexData) {

 fileIndexData = data.fileIndexData;

 }

 if (data.wortfamilieIndex && typeof data.wortfamilieIndex === 'object') {

 wortfamilieIndex = data.wortfamilieIndex;

 }

 if (data.lastUpdated) {
    appVersion = data.lastUpdated.replace(/\s+/g, '_').replace(/:/g, '-');
  }

 if (!wortfamilieIndex) {

 await loadWortfamilieIndex();

 scheduleCachePersist();

 }

 loadingProgressState = { cards: 100, conjugations: 100 };

 updateLoadingProgress(100, 'cards');

 updateLoadingProgress(100, 'conjugations');

 isBackgroundLoading = false;

 generateTagFilters();
  console.log("100% of the data is loaded.");

 if (searchInput && searchInput.value.trim() !== '') {

 searchInput.dispatchEvent(new Event('input'));

 }

 return; // SKIP NETWORK LOADING

  } else {

  console.log("Cache outdated or invalid. Reloading from network.");

  wortfamilieIndex = null;

  if (allVerbsData) {

  Object.keys(allVerbsData).forEach(verbName => {

  if (allVerbsData[verbName]) {

  delete allVerbsData[verbName].wortfamilie;

  delete allVerbsData[verbName]._wortfamilieLoaded;

  delete allVerbsData[verbName]._deferredLoaded;

  delete allVerbsData[verbName].konjunktiv_ii;

  delete allVerbsData[verbName].praesens_examples;

  delete allVerbsData[verbName].praeteritum_examples;

  delete allVerbsData[verbName].praesens_fragen;

  }

  });

  }

  }

 }

 } catch (e) {

 console.warn("Failed to load/parse cache", e);

 }

 if (isBackgroundLoading) return;

 isBackgroundLoading = true;

 console.log("Starting background data load...");

 loadingProgressState = { cards: 0, conjugations: 0 };

 updateLoadingProgress(0, 'cards');

 // Collect all tasks EXCEPT current one (already loading/loaded)

 const loadTasks = [];

 let totalTasks = 0;

 levelOrder.forEach(levelKey => {

 const config = levelConfig[levelKey];

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

 const groupUrl = `json/groups/${physData.physicalKey}/${physData.physicalKey}_group_${fileNumber}.json${appVersion ? '?v=' + appVersion : ''}`;

 const res = await fetch(groupUrl);

 if (!res.ok) return;

 const groupData = await parseJsonUtf8(res);

 if (!verbGroupsByLevel[levelKey]) verbGroupsByLevel[levelKey] = [];

 verbGroupsByLevel[levelKey][groupIndex] = groupData;

 // 3. Fetch Verbs that are NEW

 const verbsToLoad = groupData.verbs || [];

 const newVerbs = (cacheHydrated && cacheMatchesRemoteVersion)

 ? verbsToLoad.filter(v => !allVerbsData[v])

 : verbsToLoad;

 if (newVerbs.length > 0) {

 const cardPromises = newVerbs.map(verbName =>

 fetch(`json/cards/${verbName}.json${appVersion ? '?v=' + appVersion : ''}`)

 .then(res => res.ok ? parseJsonUtf8(res) : {})

 .then(data => { allVerbsData[verbName] = data; })

 .catch(() => { allVerbsData[verbName] = {}; })

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

 const physicalLayers = physicalLevelMap[currentLevel] || [];

 const layersToLoad = physicalLayers.map(l => l.key);

 await loadBulkConjugations(layersToLoad, updateLoadingProgress);

 } else {

 loadingProgressState.conjugations = 100;

 }

 console.log("Background loading complete.");
  console.log("100% of the data is loaded.");

 updateLoadingProgress(100, 'conjugations');

 isBackgroundLoading = false;

 generateTagFilters();
  console.log("100% of the data is loaded.");

 // Save to LocalStorage

 try {

 localStorage.setItem(CACHE_KEY, JSON.stringify(createCachePayload()));

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

 async function loadGroupData(levelKey, groupIndex, options = {}) {

 const { silent = false, includeConjugations = true } = options;

 // Validate inputs

 if (!levelConfig[levelKey]) return;

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

 const groupUrl = `json/groups/${physData.physicalKey}/${physData.physicalKey}_group_${fileNumber}.json${appVersion ? '?v=' + appVersion : ''}`;

 try {

 const res = await fetch(groupUrl);

 if (!res.ok) throw new Error(`Group not found: ${groupUrl}`);

 const groupData = await parseJsonUtf8(res);

 // Initialize level array if needed

 if (!verbGroupsByLevel[levelKey]) {

 verbGroupsByLevel[levelKey] = [];

 }

 verbGroupsByLevel[levelKey][groupIndex] = groupData;

 // 2. Identify new verbs to load

 const verbsToLoad = groupData.verbs || [];

 // Filter out verbs we already have data for

 const newVerbs = verbsToLoad.filter(v => !allVerbsData[v]);

 if (newVerbs.length > 0) {

 // 3. Fetch Card Data for new verbs

 const cardPromises = newVerbs.map(verbName =>

 fetch(`json/cards/${verbName}.json${appVersion ? '?v=' + appVersion : ''}`)

 .then(res => res.ok ? parseJsonUtf8(res) : {})

 .then(data => { allVerbsData[verbName] = data; })

 .catch(() => { allVerbsData[verbName] = {}; })

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

 async function loadAllGroupsForLevel(levelKey) {

 const config = levelConfig[levelKey];

 if (!config) return;

 const loadPromises = [];

 for (let groupIndex = 0; groupIndex < config.groupCount; groupIndex++) {

 loadPromises.push(loadGroupData(levelKey, groupIndex, { silent: true, includeConjugations: false }));

 }

 await Promise.all(loadPromises);

 }

 async function loadFileIndex() {

 if (fileIndexData) return fileIndexData;

 try {

 const query = appVersion ? `?v=${encodeURIComponent(appVersion)}` : '';

 const response = await fetch(`json/file_index.json${query}`, { cache: 'no-cache' });

 if (!response.ok) throw new Error(`Failed to load file index: ${response.status}`);

 fileIndexData = await parseJsonUtf8(response);

 } catch (error) {

 console.warn('Failed to load file index, falling back to direct fetches.', error);

 fileIndexData = {};

 }

 return fileIndexData;

 }

 function fileExistsInIndex(folder, verbName) {

 if (!fileIndexData || !fileIndexData[folder]) return true;

 return fileIndexData[folder].includes(verbName);

 }

 let loadedBulkConjugations = new Set();

 async function loadBulkConjugations(physicalLayers, progressCallback = null) {

 const layersToFetch = physicalLayers.filter(layer => !loadedBulkConjugations.has(layer));

 if (layersToFetch.length === 0) {

 if (progressCallback) progressCallback(100, 'conjugations');

 return;

 }

 let loaded = 0;

 const total = layersToFetch.length;

 for (const layer of layersToFetch) {

 try {

 const query = appVersion ? `?v=${appVersion}` : '';

 const url = `json/conjugations_bulk/${layer}_conjugations.json${query}`;

 const res = await fetch(url);

 if (res.ok) {

 const data = await parseJsonUtf8(res);

 for (const [verbName, verbData] of Object.entries(data)) {

 if (!allVerbsData[verbName]) allVerbsData[verbName] = {};

 const safeMerge = (target, source) => {

 if (!source || typeof source !== 'object') return;

 Object.entries(source).forEach(([key, value]) => {

 if (['es', 'wir', 'ihr', 'sie'].includes(key) && typeof value === 'object' && !['cards'].includes(key)) return;

 if (['es', 'en_verb', 'level', 'theme', 'group'].includes(key) && typeof target[key] === 'string' && target[key] !== '') return;

 target[key] = value;

 });

 };

 safeMerge(allVerbsData[verbName], verbData);

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

 async function loadVerbPraesensData(verbName) {

 await loadFileIndex();

 const existingData = allVerbsData[verbName] || {};

 if (existingData.praesens) {

 return existingData;

 }

 const query = appVersion ? `?v=${appVersion}` : '';

 const praesensData = fileExistsInIndex('praesens', verbName)

 ? await fetch(`json/praesens/${verbName}.json${query}`).then(res => res.ok ? parseJsonUtf8(res) : {}).catch(() => ({}))

 : {};

 const safeMerge = (target, source) => {

 if (!source || typeof source !== 'object') return;

 Object.entries(source).forEach(([key, value]) => {

 // Ignore if the key is a German pronoun at root level (likely a rogue JSON structure)

 if (['es', 'wir', 'ihr', 'sie', 'es_example', 'en_example'].includes(key) && typeof value === 'object') {

 return;

 }

 // Protect established core strings

 if (['es', 'en_verb', 'level', 'theme', 'group'].includes(key) && typeof target[key] === 'string' && target[key] !== '') {

 return;

 }

 target[key] = value;

 });

 };

 const mergedData = { ...existingData };

 safeMerge(mergedData, praesensData);

 allVerbsData[verbName] = mergedData;

 return allVerbsData[verbName];

 }

 async function loadVerbModalDeferredData(verbName) {

 await loadFileIndex();

 const existingData = allVerbsData[verbName] || {};

 const query = appVersion ? `?v=${appVersion}` : '';

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

 const safeMerge = (target, source) => {

 if (!source || typeof source !== 'object') return;

 Object.entries(source).forEach(([key, value]) => {

 // Ignore if the key is a German pronoun at root level (likely a rogue JSON structure)

 if (['es', 'wir', 'ihr', 'sie'].includes(key) && typeof value === 'object' && !['cards'].includes(key)) {

 return;

 }

 // Protect established core strings

 if (['es', 'en_verb', 'level', 'theme', 'group'].includes(key) && typeof target[key] === 'string' && target[key] !== '') {

 return;

 }

 target[key] = value;

 });

 };

 const mergedData = { ...existingData };

 safeMerge(mergedData, konjunktivData);

 // Specific handling for word family

 mergedData.wortfamilie = Array.isArray(wortfamilieData.wortfamilie) ? wortfamilieData.wortfamilie : (mergedData.wortfamilie || []);

 mergedData._wortfamilieLoaded = true;

 mergedData._deferredLoaded = true;

 allVerbsData[verbName] = mergedData;

 // PERSISTENCE & RELIABILITY: Double-check if the merge created a corruption ([object Object])

 // This acts as a recovery mechanism for users with corrupted localStorage.

 if (allVerbsData[verbName] && typeof allVerbsData[verbName].es === 'object') {

 console.error(`Detected data corruption for ${verbName}. Restoring basic translation.`);

 allVerbsData[verbName].es = existingData.es || "hablar";

 }

 scheduleCachePersist();

 return allVerbsData[verbName];

 }

 function getExampleLoadKey(verbName, tabId) {

 return `${verbName}::${tabId}`;

 }

 function normalizeModalTabId(tabId) {

 return tabId === 'praesens' ? 'infinitiv' : (tabId || 'infinitiv');

 }

 function tabNeedsLazyExamples(verbName, verbData, tabId) {

 const normalizedTab = normalizeModalTabId(tabId);

 if (!verbData) return false;

 if (normalizedTab === 'infinitiv') {

 return !verbData.praesens_examples || !verbData.praesens_fragen;

 }

 if (normalizedTab === 'perfekt') {

 return !verbData.perfekt_examples;

 }

 if (normalizedTab === 'praeteritum') {

 return !verbData.praeteritum_conjugations || !verbData.praeteritum_examples;

 }

 if (normalizedTab === 'konjunktiv') {

 return konjunktivVerbs.includes(verbName) &&

 (!verbData.konjunktiv_ii || !verbData.konjunktiv_ii_examples);

 }

 return false;

 }

 async function loadVerbExamplesData(verbName, tabId = 'infinitiv') {

 await loadFileIndex();

 const normalizedTab = normalizeModalTabId(tabId);

 const existingData = allVerbsData[verbName] || {};

 if (!tabNeedsLazyExamples(verbName, existingData, normalizedTab)) {

 return existingData;

 }

 const requestKey = getExampleLoadKey(verbName, normalizedTab);

 if (lazyExampleLoadPromises.has(requestKey)) {

 return lazyExampleLoadPromises.get(requestKey);

 }

 const query = appVersion ? `?v=${appVersion}` : '';

 const maybeFetchJson = (folder, fallback = {}) =>

 fileExistsInIndex(folder, verbName)

 ? fetch(`json/${folder}/${verbName}.json${query}`).then(res => res.ok ? parseJsonUtf8(res) : fallback).catch(() => fallback)

 : Promise.resolve(fallback);

 const safeMerge = (target, source) => {

 if (!source || typeof source !== 'object') return;

 Object.entries(source).forEach(([key, value]) => {

 if (['es', 'wir', 'ihr', 'sie'].includes(key) && typeof value === 'object') {

 return;

 }

 if (['es', 'en_verb', 'level', 'theme', 'group'].includes(key) && typeof target[key] === 'string' && target[key] !== '') {

 return;

 }

 target[key] = value;

 });

 };

 const loadPromise = (async () => {

 let exampleData = {};

 let conjugationData = {};

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

 const mergedData = { ...(allVerbsData[verbName] || {}) };

 safeMerge(mergedData, conjugationData);

 safeMerge(mergedData, exampleData);

 allVerbsData[verbName] = mergedData;

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

 function maybeLoadExamplesForActiveTab(verbName, tabId) {

 const normalizedTab = normalizeModalTabId(tabId);

 const verbData = allVerbsData[verbName] || {};

 if (!tabNeedsLazyExamples(verbName, verbData, normalizedTab)) {

 return;

 }

 const token = ++modalExampleLoadToken;

 const sessionId = modalSessionId;

 loadVerbExamplesData(verbName, normalizedTab)

 .then(() => {

 if (modalExampleLoadToken !== token || modalSessionId !== sessionId || currentVerbInModal !== verbName || !verbModal.classList.contains('visible')) return;

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

 function closeVerbModal() {

  closeConjugationSubModal();

 currentVerbInModal = '';

 modalDeferredLoadToken += 1;

 modalExampleLoadToken += 1;

 modalSessionId += 1;

 isRestoringModalTab = false;

 verbModal.classList.remove('visible');

 }

 function restoreModalActiveTab(tabId) {

 const targetTabId = tabId || 'infinitiv';

 const targetButton = document.querySelector(`.modal-tab-btn[data-tab="${targetTabId}"]`);

 if (targetButton && targetButton.style.display !== 'none') {

 isRestoringModalTab = true;

 targetButton.click();

 isRestoringModalTab = false;

 return;

 }

 const fallbackButton = document.querySelector('.modal-tab-btn[data-tab="infinitiv"]');

 if (fallbackButton) {

 isRestoringModalTab = true;

 fallbackButton.click();

 isRestoringModalTab = false;

 }

 }

 function findMatchingTextEntry(entries, searchTerm, extractor = null) {

 if (!entries) return '';

 for (const entry of entries) {

 const text = extractor ? extractor(entry) : entry;

 if (typeof text === 'string' && findMatchingWordInText(text, searchTerm)) {

 return text;

 }

 }

 return '';

 }

 function normalizeSearchValue(value) {

 if (value === null || value === undefined) return '';

 return String(value)

 .normalize('NFD')

 .replace(/[\u0300-\u036f]/g, '')

 .toLowerCase();

 }

 function findMatchingWordInText(text, searchTerm) {

 if (!text || typeof text !== 'string') return '';

 const normalized = text.replace(/[()]/g, '');

 const words = normalized.split(/[\s,/]+/).filter(Boolean);

 return words.find(word => normalizeSearchValue(word).startsWith(searchTerm)) || '';

 }

 function getAllSearchGroupEntries() {

 const groupedMap = new Map();

 if (Array.isArray(allGroupsIndex)) {

 allGroupsIndex.forEach(group => {

 if (!group || !group.level || !Array.isArray(group.verbs)) return;

 const levelKey = group.level.split('.')[0];

 const groupIndexInLevel = Number(group.groupNumberPerLevel) - 1;

 if (!levelKey || !Number.isInteger(groupIndexInLevel) || groupIndexInLevel < 0) return;

 groupedMap.set(`${levelKey}-${groupIndexInLevel}`, {

 levelKey,

 groupIndexInLevel,

 group

 });

 });

 }

 Object.keys(verbGroupsByLevel).forEach(levelKey => {

 const levelGroups = verbGroupsByLevel[levelKey] || [];

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

 // Helper function to dynamically parse and strip parentheses from translations

 function removeParentheses(text) {

 if (!text) return text;

 // Strip starting parenthesis block: ^\(([^)]+)\)\s*

 let parsed = text.replace(/^\(([^)]+)\)\s*/, (match, innerWord) => {

 // Discard (sich) completely

 if (innerWord.toLowerCase() === 'sich') {

 return '';

 }

 // Strip parentheses but keep the word for anything else

 return innerWord + ' ';

 });

 // Standardize explicit " o " strings into localized slashes

 parsed = parsed.replace(/ o /g, ' / ');

 return parsed.trim();

 }

 function getPrimaryTranslation(text) {

 const cleaned = removeParentheses(text || '');

 if (!cleaned) return cleaned;

 return cleaned.split('/')[0].trim();

 }

 function getCardTranslation(verbData) {

 return (verbData && verbData.card_es) || getPrimaryTranslation((verbData && verbData.es) || '');

 }

 function getCardTranslationLines(verbData) {

 if (!verbData) return [];

 let text = verbData.card_es;

 if (!text) {

 text = getCardTranslation(verbData);

 }

 if (!text) return [];

 return text.split(/[,/\n\r]+/).map(p => p.trim()).filter(p => p.length > 0);

 }

 // Helper function to extract clean Perfekt (remove auxiliary verb)

 function getCleanPerfekt(perfekt) {

 if (!perfekt || perfekt === '---') return '---';

 // Remove any conjugated auxiliary of haben/sein from the beginning

 const cleaned = perfekt.replace(/^(habe|hast|hat|haben|habt|bin|bist|ist|sind|seid|sein)\s+/i, '');

 return cleaned;

 }

 // Helper function to extract clean Präteritum (remove pronouns)

 function getCleanPraeteritum(praeteritum) {

 if (!praeteritum || praeteritum === '---') return '---';

 // Remove "er/sie/es " from the beginning

 const cleaned = praeteritum.replace(/^(er\/sie\/es)\s+/, '');

 return cleaned;

 }

 // --- KOMPAKT VERSION RENDER FUNCTION (Adverb Port / Slate-Mint) ---

function createCompactCardElement(group, groupIndex, chunk, chunkIndex, chunksCount, levelKey, query = "") {
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
    const verbData = allVerbsData[verbName];
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

function renderCompactVersion() {
  cardsContainer.innerHTML = '';
  const allGeneratedCards = [];
  document.body.classList.add('compact-view');
  document.body.classList.remove('light-version-global-dark');

  // Disable group arrows because we show ALL groups for the current level at once
  if (navigationWrapper) {
    const groupNav = navigationWrapper.querySelector('.group-navigation');
    if (groupNav) groupNav.style.display = 'none';
  }

  const levelGroups = verbGroupsByLevel[currentLevel];
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
      const card = createCompactCardElement(group, groupIndex, chunk, chunkIndex, chunks.length, currentLevel);
      allGeneratedCards.push(card);
    });
  });

  window.allCompactCards = allGeneratedCards;
  window.currentCompactCardIndex = 0;
  window.updateCompactView();
  updateIndicatorsForView(levelGroups[currentGroupInLevel] || levelGroups[0]);
}

 // Helper to update indicators (shared between Light and Compact)

 function updateIndicatorsForView(group) {

 const displayLevel = levelConfig[currentLevel].displayName;

 levelIndicator.textContent = displayLevel;

 levelIndicator.className = 'level-indicator';

 if (displayLevel === 'A1.1') levelIndicator.classList.add('level-a1-1');

 else if (displayLevel === 'A1.2') levelIndicator.classList.add('level-a1-2');

 else if (displayLevel === 'A2.1') levelIndicator.classList.add('level-a2-1');

 else if (displayLevel === 'A2.2') levelIndicator.classList.add('level-a2-2');

 else if (displayLevel === 'B1.1') levelIndicator.classList.add('level-b1-1');

 levelToggleButtons.forEach(button => {

 const isActive = button.dataset.level === currentLevel;

 button.classList.toggle('active', isActive);

 button.setAttribute('aria-pressed', isActive ? 'true' : 'false');

 button.style.order = mobileLevelMediaQuery.matches

 ? (isActive ? String(levelOrder.length) : String(levelOrder.indexOf(button.dataset.level) + 1))

 : '';

 });

 syncMobileLevelToggleState();

 const themeName = group.theme || group.groupNameGerman || 'Gruppe';

 groupThemeIndicator.textContent = themeName;

 const totalGroupsInLevel = levelConfig[currentLevel].groupCount;

 const activeTheme = group.theme || group.groupNameGerman;

 const themeNameForGroupIndicator = activeTheme ? ` - ${activeTheme}` : '';

 groupIndicator.textContent = `${germanOrdinals[currentGroupInLevel]} Gruppe von ${totalGroupsInLevel}${themeNameForGroupIndicator}`;

 prevGroupBtn.disabled = currentGroupInLevel === 0 && currentLevel === levelOrder[0];

 nextGroupBtn.disabled = currentGroupInLevel === totalGroupsInLevel - 1 && currentLevel === levelOrder[levelOrder.length - 1];

 }

 // --- NIEDLICH (CUTE) VERSION RENDER FUNCTION ---

 function renderNiedlichVersion(group) {

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

 const verbData = allVerbsData[verbName];

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

 function renderNormalVersion(group) {

 cardsContainer.innerHTML = '';

 document.body.classList.remove('compact-view');

 document.body.classList.remove('light-version-global-dark');

 // Restore group arrows because Normal is paginated by group

 if (navigationWrapper) {

 const groupNav = navigationWrapper.querySelector('.group-navigation');

 if (groupNav) groupNav.style.display = 'flex';

 }

 const cardsHTML = group.verbs.map(verbName => {

 const verbData = allVerbsData[verbName];

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

 function renderLightVersion(group) {

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

 const verbData = allVerbsData[verbName];

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

 function renderVerbGroup() {

 const levelGroups = verbGroupsByLevel[currentLevel];

 // Auto-correct out-of-bounds index

 if (levelGroups && currentGroupInLevel >= levelGroups.length) {

 console.warn(`Group index ${currentGroupInLevel} out of bounds for level ${currentLevel} (Max: ${levelGroups.length}). Resetting to 0.`);

 currentGroupInLevel = 0;

 saveProgress();

 }

 if (!levelGroups || !levelGroups[currentGroupInLevel]) {

 console.error(`Group data error: Level=${currentLevel}, GroupIndex=${currentGroupInLevel}, LoadedGroups=${levelGroups ? levelGroups.length : 'undefined'}`);

 cardsContainer.innerHTML = '<p>Fehler beim Laden der Verben. (Daten fehlen)</p>';

 return;

 }

 const group = levelGroups[currentGroupInLevel];

 if (!group.verbs) {

 console.error(`No verbs found in group`);

 cardsContainer.innerHTML = '<p>Fehler beim Laden der Verben.</p>';

 return;

 }

 // Check which version is active

 const selectedVersionRadio = document.querySelector('input[name="card-version"]:checked');

 const activeVersion = selectedVersionRadio ? selectedVersionRadio.value : 'compact';

 if (activeVersion === 'compact') {

 renderCompactVersion(group);

 } else if (activeVersion === 'niedlich') {

 renderNiedlichVersion(group);

 } else if (activeVersion === 'normal') {

 renderNormalVersion(group);

 } else if (activeVersion === 'light') {

 document.body.classList.add('light-version-global-dark');

 renderLightVersion(group);

 } else {

 // Default to Kompakt if match fails, or Niedlich? User said Default Kompakt.

 renderCompactVersion(group);

 }

 // Common post-render steps

 updateProgressBar();

 updateLevelNavigationButtons();

 saveProgress();

 return; // Important to return to avoid running the old default code below

 }

 function setupHoverListeners() {

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

 function updateGustarButtonVisibility() {
  if (gustarButtonContainer) gustarButtonContainer.style.display = 'block';
  if (reflexiveButtonContainer) reflexiveButtonContainer.style.display = 'block';
 }

 function setupProgressBar() {

 progressBar.innerHTML = '';

 const totalGroupsInLevel = levelConfig[currentLevel].groupCount;

 for (let i = 0; i < totalGroupsInLevel; i++) {

 const step = document.createElement('div');

 step.classList.add('progress-step');

 progressBar.appendChild(step);

 }

 }

 function updateProgressBar() {

 setupProgressBar(); // Rebuild for current level

 const steps = progressBar.querySelectorAll('.progress-step');

 steps.forEach((step, i) => {

 step.classList.toggle('active', i <= currentGroupInLevel);

 });

 }

 function updateLevelNavigationButtons() {

 const prevLevelBtn = document.getElementById('prev-level-btn');

 const nextLevelBtn = document.getElementById('next-level-btn');

 const currentLevelIndex = levelOrder.indexOf(currentLevel);

 prevLevelBtn.disabled = currentLevelIndex === 0;

 nextLevelBtn.disabled = currentLevelIndex === levelOrder.length - 1;

 }

 // Helper functions for progress tracking

 function saveProgress() {

 localStorage.setItem(`progress_${currentLevel}`, currentGroupInLevel);

 localStorage.setItem('currentLevel', currentLevel);

 }

 function loadProgress() {

 // Load saved progress

 const savedLevel = localStorage.getItem('currentLevel');

 // Retrieve group using level-specific key first (legacy), or generic (new)

 // Actually, previous code used `progress_${currentLevel}`. We should stick to that or migrate.

 // Let's rely on `progress_${level}` to allow independent progress per level.

 if (savedLevel && levelConfig[savedLevel]) {

 currentLevel = savedLevel;

 } else {

 // Fallback/Correction

 currentLevel = 'A1';

 }

 const savedGroup = parseInt(localStorage.getItem(`progress_${currentLevel}`));

 const maxGroups = levelConfig[currentLevel].groupCount;

 if (!isNaN(savedGroup) && savedGroup >= 0 && savedGroup < maxGroups) {

 currentGroupInLevel = savedGroup;

 } else {

 console.warn(`Resetting invalid/missing saved group for level ${currentLevel}`);

 currentGroupInLevel = 0;

 }

 }

 function getSavedGroupForLevel(levelKey) {

 const maxGroups = levelConfig[levelKey] ? levelConfig[levelKey].groupCount : 0;

 const savedGroup = parseInt(localStorage.getItem(`progress_${levelKey}`));

 if (!isNaN(savedGroup) && savedGroup >= 0 && savedGroup < maxGroups) {

 return savedGroup;

 }

 return 0;

 }

 async function navigateToLevel(targetLevel) {

 if (!levelConfig[targetLevel]) return;

 const targetGroup = getSavedGroupForLevel(targetLevel);

 await loadGroupData(targetLevel, targetGroup);

 currentLevel = targetLevel;

 currentGroupInLevel = targetGroup;

 isLevelMenuExpanded = false;

 syncMobileLevelToggleState();

 clearSearchAndRender();

 }

 function clearSearchAndRender() {

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

 function initializeApp() {

 // Load saved progress from localStorage

 loadProgress();

 // Handle URL parameters (override saved progress)

 const urlParams = new URLSearchParams(window.location.search);

 const urlLevel = urlParams.get('level');

 if (urlLevel) {

 // Convert 'A1.2' format to 'A1_2'

 const levelKey = urlLevel.replace('.', '_');

 if (levelConfig[levelKey]) {

 currentLevel = levelKey;

 currentGroupInLevel = 0;

 }

 }

 setupProgressBar();

 let initialViewMode = localStorage.getItem('verben-card-version') || 'compact';

 if (!document.querySelector(`input[name="card-version"][value="${initialViewMode}"]`)) {

 initialViewMode = 'compact';

 }

 // Load Verb Types global data

 fetch('json/verb_types.json')

 .then(res => res.ok ? parseJsonUtf8(res) : {})

 .then(data => { verbTypesData = data || {}; })

 .catch(() => { verbTypesData = {}; });

 // Hydrate from cache first so returning to the app feels instant on mobile.

 const hydratedFromCache = hydrateFromLocalCache();

 const hasInitialDataInCache = hydratedFromCache && (

 initialViewMode === 'compact'

 ? hasCachedLevel(currentLevel)

 : hasCachedGroup(currentLevel, currentGroupInLevel)

 );

 // Load enough data for the initial view only if cache cannot already render it.

 const initialLoadPromise = hasInitialDataInCache

 ? Promise.resolve()

 : (initialViewMode === 'compact'

 ? loadAllGroupsForLevel(currentLevel)

 : loadGroupData(currentLevel, currentGroupInLevel));

 const initialWortfamiliePromise = wortfamilieIndex

 ? Promise.resolve(wortfamilieIndex)

 : loadWortfamilieIndex().catch(() => null);

 Promise.all([initialLoadPromise, initialWortfamiliePromise])

 .then(() => {

 renderVerbGroup();

 // Start background loading after initial render

 loadBackgroundData();

 prevGroupBtn.addEventListener('click', async () => {

 let newLevel = currentLevel;

 let newGroupIndex = currentGroupInLevel;

 if (currentGroupInLevel > 0) {

 // Previous group in current level

 newGroupIndex--;

 } else {

 // Go to previous level's last group

 const currentLevelIndex = levelOrder.indexOf(currentLevel);

 if (currentLevelIndex > 0) {

 newLevel = levelOrder[currentLevelIndex - 1];

 newGroupIndex = levelConfig[newLevel].groupCount - 1;

 } else {

 return; // Start of content

 }

 }

 // Load new data BEFORE switching

 await loadGroupData(newLevel, newGroupIndex);

 // Update state and render

 currentLevel = newLevel;

 currentGroupInLevel = newGroupIndex;

 clearSearchAndRender();

 });

 nextGroupBtn.addEventListener('click', async () => {

 let newLevel = currentLevel;

 let newGroupIndex = currentGroupInLevel;

 const totalGroupsInLevel = levelConfig[currentLevel].groupCount;

 if (currentGroupInLevel < totalGroupsInLevel - 1) {

 // Next group in current level

 newGroupIndex++;

 } else {

 // Go to next level's first group

 const currentLevelIndex = levelOrder.indexOf(currentLevel);

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

 currentLevel = newLevel;

 currentGroupInLevel = newGroupIndex;

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

 const currentLevelIndex = levelOrder.indexOf(currentLevel);

 if (currentLevelIndex > 0) {

 await navigateToLevel(levelOrder[currentLevelIndex - 1]);

 }

 });

 nextLevelBtn.addEventListener('click', async () => {

 const currentLevelIndex = levelOrder.indexOf(currentLevel);

 if (currentLevelIndex < levelOrder.length - 1) {

 await navigateToLevel(levelOrder[currentLevelIndex + 1]);

 }

 });

 levelToggleButtons.forEach(button => {

 button.addEventListener('click', async () => {

 const targetLevel = button.dataset.level;

 if (!targetLevel) return;

 if (targetLevel === currentLevel) {

 isLevelMenuExpanded = !isLevelMenuExpanded;

 syncMobileLevelToggleState();

 return;

 }

 await navigateToLevel(targetLevel);

 isLevelMenuExpanded = false;

 syncMobileLevelToggleState();

 });

 });

 if (footerSearchToggle) {

 footerSearchToggle.addEventListener('click', () => {

 if (isFooterSearchExpanded && !isFooterSearchForcedOpen && (!searchInput || !searchInput.value.trim())) {

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

 clearTimeout(searchIdleTimeout);

 }

 });

 searchInput.addEventListener('blur', () => {

 scheduleSearchIdleCollapse();

 });

 }

 if (levelToggleContainer) {

 ['pointermove', 'focusin', 'touchstart'].forEach(eventName => {

 levelToggleContainer.addEventListener(eventName, () => {

 if (isLevelMenuExpanded && !isFooterSearchExpanded) {

 scheduleLevelMenuIdleCollapse();

 }

 }, { passive: true });

 });

 }

 if (footerSearchShell) {

 ['pointermove', 'focusin', 'touchstart'].forEach(eventName => {

 footerSearchShell.addEventListener(eventName, () => {

 if (isFooterSearchExpanded && !isFooterSearchForcedOpen) {

 scheduleSearchIdleCollapse();

 }

 }, { passive: true });

 });

 }

 document.addEventListener('click', (event) => {

 if (isLevelMenuExpanded && levelToggleContainer && !levelToggleContainer.contains(event.target)) {

 isLevelMenuExpanded = false;

 syncMobileLevelToggleState();

 }

 if (footerSearchShell && isFooterSearchExpanded && !isFooterSearchForcedOpen && !footerSearchShell.contains(event.target) && (!searchInput || !searchInput.value.trim())) {

 setFooterSearchExpanded(false);

 }

 });

 mobileLevelMediaQuery.addEventListener('change', () => {

 if (!mobileLevelMediaQuery.matches) {

 isLevelMenuExpanded = false;

 }

 syncMobileLevelToggleState();

 });

 // Keyboard navigation for levels (Up/Down arrows)

 document.addEventListener('keydown', async (e) => {

 // Only handle if not typing in search input

 if (document.activeElement.tagName === 'INPUT') return;

 const currentLevelIndex = levelOrder.indexOf(currentLevel);

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

 // Newer visibility tags should default to visible even for users carrying older localStorage.

 // We migrate once so stale hidden states do not keep IK/LiD invisible forever in the app.

 if (!localStorage.getItem(SETTINGS_MIGRATION_KEY)) {

 localStorage.setItem('toggle-ik-switch', 'true');

 localStorage.setItem('toggle-lid-switch', 'true');

 localStorage.setItem(SETTINGS_MIGRATION_KEY, 'true');

 }

 toggles.forEach(toggle => {

 const toggleClass = toggle.dataset.toggleClass;

 const toggleId = toggle.id;

 // Load saved state from localStorage

 const savedState = localStorage.getItem(`toggle-${toggleId}`);

 if (savedState !== null) {

 toggle.checked = savedState === 'true';

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

 localStorage.setItem(`toggle-${toggleId}`, isChecked);

 if (currentViewMode === 'compact' || currentViewMode === 'kompakt') {

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

 const savedLightState = localStorage.getItem('toggle-kompakt-light');

 kompaktLightSwitch.checked = (savedLightState === 'true');

 document.body.classList.toggle('compact-light-mode', kompaktLightSwitch.checked);

 kompaktLightSwitch.addEventListener('change', (e) => {

 const isChecked = e.currentTarget.checked;

 document.body.classList.toggle('compact-light-mode', isChecked);

 localStorage.setItem('toggle-kompakt-light', isChecked);

 });

 }

 // Version selector (Normal, Leichte, Niedliche)

 const versionRadios = document.querySelectorAll('input[name="card-version"]');

 // Load saved state from localStorage (default to 'compact')

 let savedVersion = localStorage.getItem('verben-card-version') || 'compact';

 // Validate against available options

 if (!document.querySelector(`input[name="card-version"][value="${savedVersion}"]`)) {

 savedVersion = 'compact'; // Fallback if invalid

 }

 currentViewMode = savedVersion; // Initialize global state

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

 currentViewMode = selectedVersion; // Update global state

 // Remove all version classes

 mainContainer.classList.remove('light-version', 'cute-version');

 // Add appropriate class

 if (selectedVersion === 'light') {

 mainContainer.classList.add('light-version');

 } else if (selectedVersion === 'cute') {

 mainContainer.classList.add('cute-version');

 }

 // Save to localStorage

 localStorage.setItem('verben-card-version', selectedVersion);

 renderVerbGroup();

 });

 });

 storyButton.addEventListener('click', () => {

 storyContainer.style.display = 'block';

 storyContent.innerHTML = savedStories[storyClickCounter];

 storyClickCounter = (storyClickCounter + 1) % savedStories.length;

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

 const layers = physicalLevelMap[macroLevel] || [];

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

 currentLevel = macroLevel;

 currentGroupInLevel = newGroupIndex;

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

 // --- TAB FUNCTIONALITY ---

 function setupTabs() {

 const tabBtns = Array.from(document.querySelectorAll('.modal-tab-btn'));

 const tabContents = document.querySelectorAll('.tab-content');

 const modalTabsNav = document.querySelector('.modal-tabs-nav');

 // Mobile Carousel State

 let currentCarouselIndex = 0;

 const visibleTabCount = 3;

 // Create Arrows if they don't exist

 if (!document.querySelector('.mobile-tab-arrow')) {

 const leftArrow = document.createElement('div');

 leftArrow.className = 'mobile-tab-arrow left';

 leftArrow.innerHTML = '&#10094;'; // <

 const rightArrow = document.createElement('div');

 rightArrow.className = 'mobile-tab-arrow right';

 rightArrow.innerHTML = '&#10095;'; // >

 modalTabsNav.appendChild(leftArrow);

 modalTabsNav.appendChild(rightArrow);

 leftArrow.addEventListener('click', (e) => {

 e.stopPropagation(); // Prevent tab click

 navigateCarousel(-1);

 });

 rightArrow.addEventListener('click', (e) => {

 e.stopPropagation();

 navigateCarousel(1);

 });

 }

 // Helper to update visibility

 function updateCarousel() {

 // Filter only currently relevant tabs (e.g. valid Konjunktiv)

 // Note: Konjunktiv tab might be hidden via display:none style if not applicable.

 // We should only consider visible tabs for the carousel.

 // However, the display style is set dynamically in openModalForVerb.

 // We need to re-evaluate this when modal opens.

 // For now, let's just assume we operate on buttons that are not 'display: none' via inline style.

 const visibleButtons = tabBtns.filter(btn => btn.style.display !== 'none');

 // Adjust index if out of bounds

 if (currentCarouselIndex < 0) currentCarouselIndex = 0;

 if (currentCarouselIndex > Math.max(0, visibleButtons.length - visibleTabCount)) {

 currentCarouselIndex = Math.max(0, visibleButtons.length - visibleTabCount);

 }

 // Update classes

 tabBtns.forEach(btn => btn.classList.remove('visible-tab'));

 visibleButtons.forEach((btn, index) => {

 if (index >= currentCarouselIndex && index < currentCarouselIndex + visibleTabCount) {

 btn.classList.add('visible-tab');

 }

 });

 // Toggle arrows visibility (optional: hide if at ends)

 // For simple carousel, always show if count > visibleTabCount?

 // User requested explicit arrows. 

 const arrows = document.querySelectorAll('.mobile-tab-arrow');

 const shouldShowArrows = visibleButtons.length > visibleTabCount && window.innerWidth <= 600;

 arrows.forEach(arrow => {

 arrow.style.display = shouldShowArrows ? 'flex' : 'none';

 });

 }

 function navigateCarousel(direction) {

 const visibleButtons = tabBtns.filter(btn => btn.style.display !== 'none');

 const maxIndex = Math.max(0, visibleButtons.length - visibleTabCount);

 currentCarouselIndex += direction;

 if (currentCarouselIndex < 0) currentCarouselIndex = 0;

 if (currentCarouselIndex > maxIndex) currentCarouselIndex = maxIndex;

 updateCarousel();

 }

 // Expose update function to be called when modal opens

 window.updateTabCarousel = updateCarousel;

 tabBtns.forEach(btn => {

 btn.addEventListener('click', () => {

 // Remove active class from all buttons and contents

 tabBtns.forEach(b => b.classList.remove('active'));

 tabContents.forEach(c => c.classList.remove('active'));

 // Add active class to clicked button

 btn.classList.add('active');

 // Show corresponding content

 const tabId = btn.getAttribute('data-tab');

 const contentId = `${tabId}-tab-content`;

 const content = document.getElementById(contentId);

 if (content) {

 content.classList.add('active');

 content.style.display = 'block';

 }

 // Hide other contents

 tabContents.forEach(c => {

 if (c.id !== contentId) {

 c.style.display = 'none';

 }

 });

 if (!isRestoringModalTab && currentVerbInModal && verbModal.classList.contains('visible')) {

 maybeLoadExamplesForActiveTab(currentVerbInModal, tabId);

  }

  if (!isRestoringModalTab) {

    // openConjugationSubModal(tabId);

  }

  });

  });

 // Initialize

 updateCarousel();

 window.addEventListener('resize', updateCarousel);

 }

 // --- THEME MODAL FUNCTION ---

 async function openThemeModal(optLevelKey, optGroupIndex) {

 if ('speechSynthesis' in window) {

 window.speechSynthesis.cancel();

 }

 // Read explicitly passed variables or fallback to the global UI state

 const levelKey = (typeof optLevelKey === 'string') ? optLevelKey : currentLevel;

 const groupIndex = (typeof optGroupIndex === 'number') ? optGroupIndex : currentGroupInLevel;

 const groupNum = groupIndex + 1; // 1-indexed

 // Use pre-loaded group data from memory

 const groupData = verbGroupsByLevel[levelKey][groupIndex];

 if (!groupData) {

 console.error(`Group data not found for ${levelKey} group index ${groupIndex}`);

 return;

 }

 currentThemeData = groupData;

 const themeData = groupData;

 const themeColor = standardColors[groupIndex % standardColors.length];

 const themeModalContent = themeModal.querySelector('.theme-modal-content');

 if (themeModalContent) {

 themeModalContent.style.setProperty('--theme-modal-accent', themeColor);

 }

 // Populate modal with theme data

 document.getElementById('theme-modal-german-name').textContent = themeData.theme || themeData.germanName;

 document.getElementById('theme-modal-spanish-name').textContent = themeData.spanishName || themeData.groupNameSpanish;

 const englishObj = document.getElementById('theme-modal-english-name');

 if (englishObj && themeData.groupNameEnglish) {

 englishObj.textContent = themeData.groupNameEnglish;

 englishObj.style.display = 'block';

 } else if (englishObj) {

 englishObj.style.display = 'none';

 }

 document.getElementById('theme-modal-level').textContent = themeData.level;

 const defaultDescription = [themeData.group ? `Grupo ${themeData.group}` : '', themeData.shortName || ''].filter(Boolean).join(' · ');

 const customDescription = (themeData.theme === 'Schicksal' || themeData.germanName === 'Schicksal')

 ? 'circunstancias inevitables de la vida'

 : defaultDescription;

 document.getElementById('theme-modal-description').textContent = customDescription;

 document.getElementById('theme-modal-german-desc').textContent = themeData.germanDescription;

 document.getElementById('theme-modal-spanish-desc').textContent = themeData.spanishDescription;

 // Populate B1 rating and exam context

 const ratingBadge = document.getElementById('theme-modal-rating');

 ratingBadge.textContent = themeData.b1Rating || 'N/A';

 // Add appropriate class based on rating type

 ratingBadge.className = 'theme-rating-badge';

 if (themeData.b1Rating) {

 if (themeData.b1Rating.includes('Critical')) {

 ratingBadge.classList.add('critical');

 } else if (themeData.b1Rating.includes('High')) {

 ratingBadge.classList.add('high');

 } else if (themeData.b1Rating.includes('Medium')) {

 ratingBadge.classList.add('medium');

 }

 }

 document.getElementById('theme-modal-exam-context').textContent = themeData.examContext || 'No exam context available.';

 document.getElementById('theme-modal-exam-context-es').textContent = themeData.examContextEs || '';

 // Show the modal

 themeModal.classList.add('visible');

 }

 window.openThemeModal = openThemeModal;

 // --- TTS FUNCTION ---

 function speak(text, lang = 'de-DE', rate = 0.9) {

   if ('speechSynthesis' in window) {

     // Cancel previous and resume in case browser is in stuck paused state

     window.speechSynthesis.cancel();

     if (window.speechSynthesis.paused) {

       window.speechSynthesis.resume();

     }

     // Small delay prevents immediate cancellation bug in Chromium-based browsers

     setTimeout(() => {

       const voices = window.speechSynthesis.getVoices();

       // Helper to get best voice

       const getVoice = () => {

         return voices.find(voice => voice.lang === lang && voice.name.includes('Google')) ||

                voices.find(voice => voice.lang === lang && voice.name.includes('Microsoft')) ||

                voices.find(voice => voice.lang === lang) ||

                voices.find(voice => voice.lang === lang.replace('-', '_')) ||

                voices.find(voice => voice.lang.startsWith(lang.substring(0, 2)));

       };

       const targetVoice = getVoice();

       // Helper to create and speak utterance

       const speakUtterance = (txt, pitchVal, rateVal) => {

         const u = new SpeechSynthesisUtterance(txt);

         u.rate = rateVal;

         u.pitch = pitchVal;

         if (targetVoice) {

           u.voice = targetVoice;

           u.lang = targetVoice.lang;

         } else {

           u.lang = lang;

         }

         window.speechSynthesis.speak(u);

       };

       const isQuestion = text.trim().endsWith('?');

       // Experimental: For questions, split the last word to force pitch rise

       if (isQuestion && text.trim().includes(' ')) {

         const parts = text.trim().lastIndexOf(' ');

         const firstPart = text.substring(0, parts);

         const lastPart = text.substring(parts + 1);

         speakUtterance(firstPart, 1.0, rate);

         speakUtterance(lastPart, 1.3, rate);

       } else if (isQuestion) {

         speakUtterance(text, 1.2, rate);

       } else {

         speakUtterance(text, 1.0, rate);

       }

     }, 50);

   } else {

     console.error("Speech synthesis not supported in this browser.");

   }

 }

 window.speak = speak;

 // --- UPDATED MODAL FUNCTION WITH LAZY LOADING ---

 window.openModalForVerb = async function (verb, options = {}) {

 const { skipDeferredReload = false, skipExampleReload = false, preferredTab = null } = options;

 const data = allVerbsData[verb];

 if (!data) return;

 currentVerbInModal = verb;

 const activeTabBeforeRefresh = preferredTab || document.querySelector('.modal-tab-btn.active')?.dataset.tab || 'infinitiv';

 // Open the modal fast with Präsens first, then load the rest in the background.

 if (!data.praesens) {

 try {

 await loadVerbPraesensData(verb);

 } catch (error) {

 console.error(`Failed to load Präsens data for ${verb}:`, error);

 }

 }

 // Get the updated data reference

 const updatedData = allVerbsData[verb];

 const needsDeferredModalData =

 updatedData._wortfamilieLoaded !== true ||

 (konjunktivVerbs.includes(verb) && !updatedData.konjunktiv_ii);

 // Set infinitive with case tags

 const infinitiveElement = document.getElementById('modal-verb-infinitive');

 // const irregularMark = updatedData.irregularPraesens ? '<span class="irregular-indicator">*</span>' : '';

 // Removed asterisk as requested

 infinitiveElement.innerHTML = formatVerbPrefix(verb, true);

 // Reset tags collapse state

 const tagsCollapsible = document.getElementById('modal-tags-collapsible');

 const tagsToggle = document.getElementById('modal-tags-toggle');

 if (tagsCollapsible && tagsToggle) {

 tagsCollapsible.classList.add('collapsed');

 tagsToggle.querySelector('.dots-icon').style.display = 'inline';

 tagsToggle.querySelector('.chevron-icon').style.display = 'none';

 }

 // Add case tags below translations

 const caseTagsContainer = document.getElementById('modal-case-tags-container');

 caseTagsContainer.innerHTML = ''; // Clear previous tags

 // ROW 1: Theme badge - MOVED TO HEADER

 const headerTagsContainer = document.getElementById('modal-header-tags');

 headerTagsContainer.innerHTML = ''; // Clear previous header tags

 // Attributes (Separable/Notes) - MOVED OUTSIDE HEADER

 const extraTagsContainer = document.getElementById('modal-extra-tags');

 if (extraTagsContainer) extraTagsContainer.innerHTML = '';

 if (updatedData.theme && updatedData.group) {

 const themeBadge = document.createElement('span');

 themeBadge.id = 'modal-theme-badge';

 themeBadge.className = 'modal-theme-badge case-tag';

 themeBadge.title = 'Zum Thema navigieren (Navigate to theme)';

 themeBadge.textContent = updatedData.theme;

 themeBadge.style.display = 'inline-block';

 themeBadge.dataset.level = updatedData.level;

 themeBadge.dataset.group = updatedData.group;

 // Add refined styles for header context

 themeBadge.style.backgroundColor = 'rgba(255, 255, 255, 0.25)';

 themeBadge.style.border = '1px solid rgba(255, 255, 255, 0.4)';

 themeBadge.style.color = 'white';

 themeBadge.style.backdropFilter = 'blur(4px)';

 headerTagsContainer.appendChild(themeBadge);

 }

 // ROW 2: Case tags (Dativ, Akkusativ, Intrans, Prep, etc.) AND New Classification Tags

 const allTags = [

 ...(updatedData.case_tags || []),

 ...(updatedData.tags || [])

 ];

 if (allTags.length > 0) {

 const tagsContainer = document.createElement('div');

 tagsContainer.className = 'modal-tags-container';

 const groups = {

 'Hilfsverb': [],

 'Kasus': [],

 'Reflexivität': [],

 'Struktur': [],

 'Präpositionen': []

 };

 // Remove duplicates just in case

 const uniqueTags = [...new Set(allTags)];

 uniqueTags.forEach(tag => {

 if (['Akkusativ', 'Dativ', 'Nominativ', 'Genitiv', 'Intransitive', 'intrans'].includes(tag)) groups['Kasus'].push(tag);

 else if (tag === 'Reflexive') groups['Reflexivität'].push(tag);

 else if (['Separable', 'Regular', 'Irregular'].includes(tag)) groups['Struktur'].push(tag);

 else if (tag.startsWith('Präposition:')) groups['Präpositionen'].push(tag.replace('Präposition: ', ''));

 else if (tag.includes('Movimiento') || tag.includes('Estático') || tag.includes('🚀') || tag.includes('🏡')) groups['Hilfsverb'].push(tag);

 else groups['Struktur'].push(tag); // Fallback

 });

 Object.keys(groups).forEach(category => {

 if (groups[category].length === 0) return;

 const row = document.createElement('div');

 row.className = 'tag-row';

 const label = document.createElement('span');

 label.className = 'tag-category-label';

 label.textContent = category + ':';

 const tagGroup = document.createElement('div');

 tagGroup.className = 'tag-group';

 groups[category].forEach(tag => {

 const tagSpan = document.createElement('span');

 // Create specific class based on tag name, remove special chars

 // For emojis like 🚀, it might result in empty or invalid class if not careful, 

 // but usually only affects CSS selector matching. 

 // Let's make it robust:

 const safeTagClass = tag.toLowerCase().replace(/[^a-z0-9]/g, '');

 tagSpan.className = `modal-tag tag-${safeTagClass}`;

 tagSpan.textContent = tag;

 // Add Click-to-Search logic

 tagSpan.addEventListener('click', (e) => {

 e.stopPropagation();

 const verbModal = document.getElementById('verb-modal');

 if (verbModal) verbModal.classList.remove('visible');

 if (searchInput) {

 searchInput.value = `tag:${tag}`;

 performSearch();

 }

 });

 tagGroup.appendChild(tagSpan);

 });

 row.appendChild(label);

 row.appendChild(tagGroup);

 tagsContainer.appendChild(row);

 });

 caseTagsContainer.appendChild(tagsContainer);

 }

 // ROW 3: Verb type and notes (Separable/Non-Separable + Notes)

 // Render Usage Note (Custom rich text note)

 const usageNoteContainer = document.getElementById('modal-usage-note-container');

 if (usageNoteContainer) {

 usageNoteContainer.innerHTML = ''; // Clear previous

 if (updatedData.usage_note) {

 const noteDiv = document.createElement('div');

 noteDiv.className = 'verb-usage-note';

 noteDiv.style.marginBottom = '15px'; // Spacing bottom

 noteDiv.style.padding = '12px';

 noteDiv.style.backgroundColor = '#f0f4f8';

 noteDiv.style.borderLeft = '4px solid #4682B4';

 noteDiv.style.fontSize = '0.95rem';

 noteDiv.style.color = '#333';

 noteDiv.style.textAlign = 'left';

 noteDiv.style.borderRadius = '4px';

 noteDiv.style.lineHeight = '1.5';

 noteDiv.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';

 noteDiv.innerHTML = updatedData.usage_note;

 usageNoteContainer.appendChild(noteDiv);

 }

 }

 document.getElementById('modal-verb-perfekt').textContent = updatedData.perfekt || '---';

 document.getElementById('modal-verb-praeteritum').textContent = updatedData.praeteritum || '---';

 // Update Tab Buttons (Dynamic Labels)

 const tabBtnInfinitiv = document.getElementById('tab-btn-infinitiv');

 const tabBtnPerfekt = document.getElementById('tab-btn-perfekt');

 const tabBtnPraeteritum = document.getElementById('tab-btn-praeteritum');

 if (tabBtnInfinitiv) {

 tabBtnInfinitiv.textContent = verb;

 tabBtnInfinitiv.classList.add('active'); // Reset to active

 }

 if (tabBtnPerfekt) {

 tabBtnPerfekt.textContent = getCleanPerfekt(updatedData.perfekt);

 tabBtnPerfekt.classList.remove('active');

 }

 if (tabBtnPraeteritum) {

 tabBtnPraeteritum.textContent = getCleanPraeteritum(updatedData.praeteritum);

 tabBtnPraeteritum.classList.remove('active');

 }

 // Reset Tab Content Visibility

 document.getElementById('praesens-tab-content').classList.add('active');

 document.getElementById('praesens-tab-content').style.display = 'block';

 document.getElementById('perfekt-tab-content').classList.remove('active');

 document.getElementById('perfekt-tab-content').style.display = 'none';

 document.getElementById('praeteritum-tab-content').classList.remove('active');

 document.getElementById('praeteritum-tab-content').style.display = 'none';

 document.getElementById('konjunktiv-tab-content').classList.remove('active');

 document.getElementById('konjunktiv-tab-content').style.display = 'none';

 // Show/Hide Konjunktiv Tab Button and Set Label

 const tabBtnKonjunktiv = document.getElementById('tab-btn-konjunktiv');

 if (tabBtnKonjunktiv) {

 if (konjunktivVerbs.includes(verb) && updatedData.konjunktiv_ii && updatedData.konjunktiv_ii.ich) {

 tabBtnKonjunktiv.style.display = 'inline-block';

 tabBtnKonjunktiv.textContent = updatedData.konjunktiv_ii.ich;

 tabBtnKonjunktiv.classList.remove('active');

 } else {

 tabBtnKonjunktiv.style.display = 'none';

 }

 }

 applyModalThemePalette(updatedData);

 // Emoji with TTS

 const modalEmojiEl = document.getElementById('modal-emoji');

 if (modalEmojiEl) modalEmojiEl.textContent = updatedData.emoji || '❔';

 if (modalEmojiEl) modalEmojiEl.onclick = (e) => {

 e.stopPropagation();

 speak(verb);

 };

 if (modalEmojiEl) modalEmojiEl.title = "Aussprache hören";

 const esSwitch = document.getElementById('es-switch');

  const enSwitch = document.getElementById('en-switch');

  const showSpanish = esSwitch ? esSwitch.checked : true;

  const showEnglish = enSwitch ? enSwitch.checked : false;

  const translations = [];

  if (showSpanish && updatedData.es) translations.push(updatedData.es);

  if (showEnglish && updatedData.en_verb) translations.push(updatedData.en_verb);

  const translationsEl = document.getElementById('modal-verb-translations');

  if (translationsEl) {

      translationsEl.textContent = translations.join(', ');

  }

 document.getElementById('modal-verb-perfekt-es').textContent = updatedData.es_perfekt || '';

 document.getElementById('modal-verb-praeteritum-es').textContent = updatedData.es_praeteritum || '';

 document.getElementById('modal-verb-english-perfekt').textContent = updatedData.en_perfekt || '';

 document.getElementById('modal-verb-english-praeteritum').textContent = updatedData.en_praeteritum || '';

 const levelText = updatedData.level || 'A1';

  const macroLevel = levelText.split('.')[0];

  document.getElementById('modal-level-badge').textContent = macroLevel;

 // --- NEW NOTE LOGIC ---

 // 1. General Card Note (displayed below Wortfamilie)

 // Use 'note' attribute or fallback to 'note_es'

 const generalNoteElement = document.getElementById('modal-general-note');

  if (generalNoteElement) {

      generalNoteElement.style.display = 'none';

  }

 // 2. Present Tense Note (displayed below conjugation table)

 const praesensNote = updatedData.praesens_note;

 const praesensNoteElement = document.getElementById('modal-praesens-note');

 if (praesensNote) {

 praesensNoteElement.innerHTML = praesensNote;

 praesensNoteElement.style.display = 'block';

 } else {

 praesensNoteElement.style.display = 'none';

 }

 // 3. Perfekt Note (displayed below Perfekt conjugation table)

 const perfektNote = updatedData.note_perfekt;

 const perfektNoteElement = document.getElementById('modal-perfekt-note');

 if (perfektNoteElement) {

 if (perfektNote) {

 perfektNoteElement.innerHTML = perfektNote;

 perfektNoteElement.style.display = 'block';

 } else {

 perfektNoteElement.style.display = 'none';

 }

 }

 // 4. Präteritum Note (displayed below Präteritum conjugation table)

 const praeteritumNote = updatedData.praeteritum_note;

 const praeteritumNoteElement = document.getElementById('modal-praeteritum-note');

 if (praeteritumNoteElement) {

 if (praeteritumNote) {

 praeteritumNoteElement.innerHTML = praeteritumNote;

 praeteritumNoteElement.style.display = 'block';

 } else {

 praeteritumNoteElement.style.display = 'none';

 }

 }

 // Display note_es if it exists (REMOVED/REPLACED by General Note above)

 // keeping the element ref just in case but logic is handled above

 const oldNoteElement = document.getElementById('modal-verb-note');

 if (oldNoteElement) {

 oldNoteElement.style.display = 'none'; // Ensure old element is hidden

 }

 // Helper to parse string format: "word (Level) = translation"

 const parseWordString = (str) => {

 // Match "Word (Level) = Translation" or similar

 // e.g., "verheiratet (A2) = casado/a (adjetivo)"

 // e.g., "der Ehemann / die Ehefürau (A2) = esposo / esposa"

 const match = str.match(/^(.*?)\s*\((\w+)\)\s*=\s*(.*)$/);

 if (match) {

 return {

 word: match[1].trim(),

 level: match[2].trim(), // e.g. "A2"

 type: '', // Type inferred from context or left empty

 es: match[3].trim()

 };

 }

 // Fallback if format doesn't match

 return {

 word: str,

 level: 'Extras',

 type: '',

 es: ''

 };

 };

 // Helper to toggle Mental Trick visibility

 window.toggleTrick = function (btn) {

 const content = btn.parentElement.nextElementSibling;

 if (content && content.classList.contains('truco-content')) {

 const isHidden = content.style.display === 'none';

 content.style.display = isHidden ? 'block' : 'none';

 btn.textContent = isHidden ? '▼' : '▶';

 }

 };

 // Helper to render standard Word List UI

 const renderStandardWordList = (container, contentEl, wordObjects) => {

 if (!container || !contentEl) return;

 if (!wordObjects || wordObjects.length === 0) {

 container.style.display = 'none';

 return;

 }

 container.style.display = 'block';

 // Group words by level

 const wordsByLevel = { 'A1': [], 'A2': [], 'B1': [] };

 const extraLevels = {};

 wordObjects.forEach(wordData => {

 const lvl = wordData.level;

 if (wordsByLevel[lvl]) {

 wordsByLevel[lvl].push(wordData);

 } else {

 if (!extraLevels[lvl]) extraLevels[lvl] = [];

 extraLevels[lvl].push(wordData);

 }

 });

 const typeAbbrev = { 'noun': 'n', 'adjective': 'a', 'adverb': 'adv', 'verb': 'v' };

 let contentHTML = '';

 // Render standard levels

 ['A1', 'A2', 'B1'].forEach(level => {

 if (wordsByLevel[level].length > 0) {

 contentHTML += `<div class="wf-level-section">`;

 contentHTML += `<div class="wf-level-header">${level}</div>`;

 wordsByLevel[level].forEach(wordData => {

 const abbrev = typeAbbrev[wordData.type] || wordData.type || '';

 contentHTML += `<div class="wf-word-item">`;

 contentHTML += `<div class="wf-word-line">`;

 // Safe stringify for onclick

 const safeWord = wordData.word.replace(/'/g, "\\'");

 contentHTML += `• <span class="wf-word-german" onclick="speak('${safeWord}')" title="Aussprache hören">${wordData.word}</span>`;

 if (abbrev) contentHTML += ` <span class="wf-word-type">${abbrev}</span>`;

 contentHTML += `</div>`;

 // Translation + Toggle Button

 contentHTML += `<div class="wf-word-translation">`;

 contentHTML += `${wordData.es}`;

 if (wordData.truco) {

 contentHTML += ` <span class="truco-toggle-btn" onclick="toggleTrick(this)" style="cursor: pointer; margin-left: 5px; user-select: none;">▶</span>`;

 }

 // Optional Example

 if (wordData.example) {

 contentHTML += `<div style="font-size: 0.9em; color: #666; font-style: italic; margin-top: 2px;">${wordData.example}</div>`;

 }

 contentHTML += `</div>`;

 // Hidden Truco Content

 if (wordData.truco) {

 contentHTML += `<div class="truco-content" style="display: none; margin-left: 15px; font-style: italic; color: #555; background-color: #f9f9f9; padding: 5px; border-left: 3px solid #ffd700; margin-top: 5px; border-radius: 4px;">`;

 contentHTML += `💡 <strong>Truco:</strong> ${wordData.truco}`;

 contentHTML += `</div>`;

 }

 contentHTML += `</div>`;

 });

 contentHTML += `</div>`;

 }

 });

 // Render extra levels

 Object.keys(extraLevels).forEach(level => {

 if (extraLevels[level].length > 0) {

 contentHTML += `<div class="wf-level-section">`;

 contentHTML += `<div class="wf-level-header">${level}</div>`;

 extraLevels[level].forEach(wordData => {

 const abbrev = typeAbbrev[wordData.type] || wordData.type || '';

 contentHTML += `<div class="wf-word-item">`;

 contentHTML += `<div class="wf-word-line">`;

 // Safe stringify for onclick

 const safeWord = wordData.word.replace(/'/g, "\\'");

 contentHTML += `• <span class="wf-word-german" onclick="speak('${safeWord}')" title="Aussprache hören">${wordData.word}</span>`;

 if (abbrev) contentHTML += ` <span class="wf-word-type">${abbrev}</span>`;

 contentHTML += `</div>`;

 // Translation + Toggle Button

 contentHTML += `<div class="wf-word-translation">`;

 contentHTML += `${wordData.es}`;

 if (wordData.truco) {

 contentHTML += ` <span class="truco-toggle-btn" onclick="toggleTrick(this)" style="cursor: pointer; margin-left: 5px; user-select: none;">▶</span>`;

 }

 // Optional Example

 if (wordData.example) {

 contentHTML += `<div style="font-size: 0.9em; color: #666; font-style: italic; margin-top: 2px;">${wordData.example}</div>`;

 }

 contentHTML += `</div>`;

 // Hidden Truco Content

 if (wordData.truco) {

 contentHTML += `<div class="truco-content" style="display: none; margin-left: 15px; font-style: italic; color: #555; background-color: #f9f9f9; padding: 5px; border-left: 3px solid #ffd700; margin-top: 5px; border-radius: 4px;">`;

 contentHTML += `💡 <strong>Truco:</strong> ${wordData.truco}`;

 contentHTML += `</div>`;

 }

 contentHTML += `</div>`;

 });

 contentHTML += `</div>`;

 }

 });

 contentEl.innerHTML = contentHTML;

 };

 // Populate Wortfamilie section

 const wortfamilieContainer = document.getElementById('wortfamilie-container');

 const wortfamilieContent = document.getElementById('wortfamilie-content');

 let wortfamilieItems = [];

 if (updatedData.wortfamilie && Array.isArray(updatedData.wortfamilie) && updatedData.wortfamilie.length > 0) {

 wortfamilieItems = updatedData.wortfamilie.map(item => {

 if (typeof item === 'string') {

 return parseWordString(item);

 }

 return item;

 });

 }

 renderStandardWordList(wortfamilieContainer, wortfamilieContent, wortfamilieItems);

 // Populate Wortfeld section

 const wortfeldContainer = document.getElementById('wortfeld-container');

 const wortfeldContent = document.getElementById('wortfeld-content');

 let wortfeldItems = [];

 if (updatedData.wortfeld && Array.isArray(updatedData.wortfeld) && updatedData.wortfeld.length > 0) {

 wortfeldItems = updatedData.wortfeld.map(item => {

 if (typeof item === 'string') {

 return parseWordString(item);

 }

 return item;

 });

 }

 renderStandardWordList(wortfeldContainer, wortfeldContent, wortfeldItems);

  renderSaetzeSection(updatedData);

 const praesensTableContainer = document.getElementById('modal-praesens-table');

 if (updatedData.praesens) {

 // Define the desired pronoun order with Spanish translations

 const pronounOrder = [

 { key: 'ich', display: 'ich', spanish: 'yo' },

 { key: 'du', display: 'du', spanish: 'tú' },

 { key: 'er', display: 'er', spanish: 'él' },

 { key: 'sie', display: 'sie', spanish: 'ella' },

 { key: 'es', display: 'es', spanish: 'neutro' },

 { key: 'wir', display: 'wir', spanish: 'nosotr@s' },

 { key: 'ihr', display: 'ihr', spanish: 'vosotr@s' },

 { key: 'sie (plural)', display: 'sie', spanish: 'ell@s' },

 { key: 'Sie (formal)', display: 'Sie', spanish: 'usted(es)' }

 ];

 const hasAussageExamples = !!(updatedData.praesens_examples && Object.keys(updatedData.praesens_examples).length);

 const hasFrageExamples = !!(updatedData.praesens_fragen && Object.keys(updatedData.praesens_fragen).length);

 const hasDativExamples = !!(updatedData.praesens_dativ && Object.keys(updatedData.praesens_dativ).length);

 const beispielModes = [

 hasAussageExamples ? { key: 'aussage', label: 'Aussage' } : null,

 hasFrageExamples ? { key: 'frage', label: 'Frage' } : null,

 hasDativExamples ? { key: 'dativ', label: 'Dativ' } : null

 ].filter(Boolean);

 let tableHTML = '<table>';

 tableHTML += `<tr><th>Pron.</th><th>Konjugation</th><th>Beispiel <span id="beispiel-mode-tag" class="beispiel-mode-tag">${beispielModes[0]?.label || 'Aussage'}</span><button id="toggle-beispiel-type" class="toggle-beispiel-btn" title="Beispielmodus wechseln">&#8644;</button></th></tr>`;

 for (const { key, display, spanish } of pronounOrder) {

 const conjugation = updatedData.praesens[key];

 if (conjugation) {

 const example = updatedData.praesens_examples && updatedData.praesens_examples[key];

 const frage = updatedData.praesens_fragen && updatedData.praesens_fragen[key];

 const dativ = updatedData.praesens_dativ && updatedData.praesens_dativ[key];

 let exampleCell = '';

 if (example || frage || dativ) {

 exampleCell = `<div class="example-cell">`;

 // Aussage (statement) examples

 if (example) {

 exampleCell += `<div class="example-aussage" style="display: block;">`;

 if (example.de) exampleCell += `<div class="example-de">${example.de}</div>`;

 if (example.en) exampleCell += `<div class="example-translation example-en">${example.en}</div>`;

 if (example.es) exampleCell += `<div class="example-translation example-es">${example.es}</div>`;

 exampleCell += `</div>`;

 }

 // Frage (question) examples

 if (frage) {

 exampleCell += `<div class="example-frage" style="display: none;">`;

 if (frage.de) exampleCell += `<div class="example-de">${frage.de}</div>`;

 if (frage.en) exampleCell += `<div class="example-translation example-en">${frage.en}</div>`;

 if (frage.es) exampleCell += `<div class="example-translation example-es">${frage.es}</div>`;

 exampleCell += `</div>`;

 }

 if (dativ) {

 exampleCell += `<div class="example-dativ" style="display: none;">`;

 if (dativ.de) exampleCell += `<div class="example-de">${dativ.de}</div>`;

 if (dativ.en) exampleCell += `<div class="example-translation example-en">${dativ.en}</div>`;

 if (dativ.es) exampleCell += `<div class="example-translation example-es">${dativ.es}</div>`;

 exampleCell += `</div>`;

 }

 exampleCell += `</div>`;

 }

 // Create pronoun cell with German pronoun and Spanish translation

 let pronounCell = `<div class="pronoun-de">${display}</div>`;

 if (spanish) {

 pronounCell += `<div class="pronoun-es">${spanish}</div>`;

 }

 // Add special classes for er/sie/es rows and hide conjugation for er and es

 // Also hide conjugation for sie (plural) since it's same as Sie (formal)

 let rowClass = '';

 let conjugationCell = conjugation;

 if (key === 'er') {

 rowClass = ' class="pronoun-row-er"';

 conjugationCell = ''; // Hide conjugation for er

 } else if (key === 'sie') {

 rowClass = ' class="pronoun-row-sie"';

 } else if (key === 'es') {

 rowClass = ' class="pronoun-row-es"';

 conjugationCell = ''; // Hide conjugation for es

 } else if (key === 'sie (plural)') {

 rowClass = ' class="pronoun-row-sie-plural"';

 conjugationCell = ''; // Hide conjugation for sie (plural)

 } else if (key === 'Sie (formal)') {

 rowClass = ' class="pronoun-row-Sie-formal"';

 }

 if (conjugationCell) {

     const safeConjugation = conjugationCell.replace(/'/g, "\\'");

     conjugationCell = `<span class="german-word conjugation-cell-speak" onclick="event.stopPropagation(); window.speak('${safeConjugation}')" title="Aussprache hören" style="cursor: pointer; display: inline-block;">${conjugationCell}</span>`;

 }

 tableHTML += `<tr${rowClass}><td>${pronounCell}</td><td>${conjugationCell}</td><td>${exampleCell}</td></tr>`;

 }

 }

 tableHTML += '</table>';

 // Add additional grammar note if it exists

 if (updatedData.additionalNote) {

 tableHTML += `<div class="additional-note">${updatedData.additionalNote}</div>`;

 }

 praesensTableContainer.innerHTML = tableHTML;

 // Add event listener for toggle button

 const toggleBtn = document.getElementById('toggle-beispiel-type');

 if (toggleBtn) {

 let currentModeIndex = 0;

 const modeTag = document.getElementById('beispiel-mode-tag');

 const updateExampleMode = () => {

 const currentMode = beispielModes[currentModeIndex] || { key: 'aussage', label: 'Aussage' };

 const aussageExamples = document.querySelectorAll('.example-aussage');

 const frageExamples = document.querySelectorAll('.example-frage');

 const dativExamples = document.querySelectorAll('.example-dativ');

 aussageExamples.forEach(el => {

 el.style.display = currentMode.key === 'aussage' ? 'block' : 'none';

 });

 frageExamples.forEach(el => {

 el.style.display = currentMode.key === 'frage' ? 'block' : 'none';

 });

 dativExamples.forEach(el => {

 el.style.display = currentMode.key === 'dativ' ? 'block' : 'none';

 });

 if (modeTag) {

 modeTag.textContent = currentMode.label;

 }

 toggleBtn.title = `Beispielmodus: ${currentMode.label}`;

 };

 updateExampleMode();

 toggleBtn.addEventListener('click', () => {

 if (beispielModes.length <= 1) return;

 currentModeIndex = (currentModeIndex + 1) % beispielModes.length;

 updateExampleMode();

 });

 }

 } else {

 praesensTableContainer.innerHTML = '';

 }

 const praesensExamplesContainer = document.getElementById('praesens-examples-container');

 if (praesensExamplesContainer) praesensExamplesContainer.style.display = 'none';

 // Generate Perfekt examples table

 const perfektExamplesTableContainer = document.getElementById('modal-perfekt-examples-table');

 if (updatedData.perfekt) {

 // Determine if verb uses haben or sein

 const usesHaben = updatedData.perfekt && updatedData.perfekt.startsWith('hat');

 const usesSein = updatedData.perfekt && updatedData.perfekt.startsWith('ist');

 // Auxiliary verb conjugations

 const auxHaben = ['habe', 'hast', 'hat', 'haben', 'habt', 'haben', 'haben'];

 const auxSein = ['bin', 'bist', 'ist', 'sind', 'seid', 'sind', 'sind'];

 const pronounOrder = [

 { key: 'ich', display: 'ich', spanish: 'yo', auxIndex: 0 },

 { key: 'du', display: 'du', spanish: 'tú', auxIndex: 1 },

 { key: 'er', display: 'er', spanish: 'él', auxIndex: 2 },

 { key: 'sie', display: 'sie', spanish: 'ella', auxIndex: 2 },

 { key: 'es', display: 'es', spanish: 'neutro', auxIndex: 2 },

 { key: 'wir', display: 'wir', spanish: 'nosotr@s', auxIndex: 3 },

 { key: 'ihr', display: 'ihr', spanish: 'vosotr@s', auxIndex: 4 },

 { key: 'sie (plural)', display: 'sie', spanish: 'ell@s', auxIndex: 5 },

 { key: 'Sie (formal)', display: 'Sie', spanish: 'usted(es)', auxIndex: 6 }

 ];

 const perfektPartizip = getCleanPerfekt(updatedData.perfekt);

 let perfektTableHTML = '<table>';

 perfektTableHTML += '<tr><th>Pron.</th><th>Konjugation</th><th>Beispiel</th></tr>';

 for (const { key, display, spanish, auxIndex } of pronounOrder) {

 const example = updatedData.perfekt_examples && updatedData.perfekt_examples[key];

 let exampleCell = '';

 if (example) {

 exampleCell = `<div class="example-cell">`;

 if (example.de) exampleCell += `<div class="example-de">${example.de}</div>`;

 if (example.en) exampleCell += `<div class="example-translation example-en">${example.en}</div>`;

 if (example.es) exampleCell += `<div class="example-translation example-es">${example.es}</div>`;

 exampleCell += `</div>`;

 }

 // Create pronoun cell with German pronoun and Spanish translation

 let pronounCell = `<div class="pronoun-de">${display}</div>`;

 if (spanish) {

 pronounCell += `<div class="pronoun-es">${spanish}</div>`;

 }

 // Build full Perfekt form with auxiliary + Partizip II

 let auxVerb = '';

 if (usesSein) {

 auxVerb = auxSein[auxIndex];

 } else {

 auxVerb = auxHaben[auxIndex];

 }

 const perfektKonjugation = perfektPartizip && perfektPartizip !== '---'

 ? `${auxVerb} ${perfektPartizip}`

 : auxVerb;

 let perfektConjugationCell = perfektKonjugation;

  if (perfektConjugationCell) {

    const safeConjugation = perfektConjugationCell.replace(/'/g, "\\'");

    perfektConjugationCell = `<span class="german-word conjugation-cell-speak" onclick="event.stopPropagation(); window.speak('${safeConjugation}')" title="Aussprache hören" style="cursor: pointer; display: inline-block;">${perfektConjugationCell}</span>`;

  }

 // Add special classes for er/sie/es rows

 let rowClass = '';

 if (key === 'er') {

 rowClass = ' class="pronoun-row-er"';

 } else if (key === 'sie') {

 rowClass = ' class="pronoun-row-sie"';

 } else if (key === 'es') {

 rowClass = ' class="pronoun-row-es"';

 } else if (key === 'sie (plural)') {

 rowClass = ' class="pronoun-row-sie-plural"';

 } else if (key === 'Sie (formal)') {

 rowClass = ' class="pronoun-row-Sie-formal"';

 }

 perfektTableHTML += `<tr${rowClass}><td>${pronounCell}</td><td class="aux-verb">${perfektConjugationCell}</td><td>${exampleCell}</td></tr>`;

 }

 perfektTableHTML += '</table>';

 perfektExamplesTableContainer.innerHTML = perfektTableHTML;

 } else {

 perfektExamplesTableContainer.innerHTML = '';

 }

 // Generate Präteritum conjugation and examples table

 const praeteritumKonjugationTableContainer = document.getElementById('modal-praeteritum-konjugation-table');

 if (updatedData.praeteritum_conjugations) {

 const pronounOrder = [

 { key: 'ich', display: 'ich', spanish: 'yo' },

 { key: 'du', display: 'du', spanish: 'tú' },

 { key: 'er', display: 'er', spanish: 'él' },

 { key: 'sie', display: 'sie', spanish: 'ella' },

 { key: 'es', display: 'es', spanish: 'neutro' },

 { key: 'wir', display: 'wir', spanish: 'nosotr@s' },

 { key: 'ihr', display: 'ihr', spanish: 'vosotr@s' },

 { key: 'sie (plural)', display: 'sie', spanish: 'ell@s' },

 { key: 'Sie (formal)', display: 'Sie', spanish: 'usted(es)' }

 ];

 let praeteritumTableHTML = '<table>';

 praeteritumTableHTML += '<tr><th>Pron.</th><th>Konjugation</th><th>Beispiel</th></tr>';

 for (const { key, display, spanish } of pronounOrder) {

 const conjugation = updatedData.praeteritum_conjugations[key];

 const example = updatedData.praeteritum_examples && updatedData.praeteritum_examples[key];

 if (conjugation || example) {

 let exampleCell = '';

 if (example) {

 exampleCell = `<div class="example-cell">`;

 if (example.de) exampleCell += `<div class="example-de">${example.de}</div>`;

 if (example.en) exampleCell += `<div class="example-translation example-en">${example.en}</div>`;

 if (example.es) exampleCell += `<div class="example-translation example-es">${example.es}</div>`;

 exampleCell += `</div>`;

 }

 // Create pronoun cell with German pronoun and Spanish translation

 let pronounCell = `<div class="pronoun-de">${display}</div>`;

 if (spanish) {

 pronounCell += `<div class="pronoun-es">${spanish}</div>`;

 }

 // Add special classes for er/sie/es rows and hide conjugation for duplicates

 let rowClass = '';

 let conjugationCell = conjugation || '';

 if (key === 'er') {

 rowClass = ' class="pronoun-row-er"';

 } else if (key === 'sie') {

 rowClass = ' class="pronoun-row-sie"';

 } else if (key === 'es') {

 rowClass = ' class="pronoun-row-es"';

 conjugationCell = ''; // Hide if same as er/sie

 } else if (key === 'sie (plural)') {

 rowClass = ' class="pronoun-row-sie-plural"';

 conjugationCell = ''; // Hide if same as Sie (formal)

 } else if (key === 'Sie (formal)') {

 rowClass = ' class="pronoun-row-Sie-formal"';

 }

  if (conjugationCell) {

    const safeConjugation = conjugationCell.replace(/'/g, "\\'");

    conjugationCell = `<span class="german-word conjugation-cell-speak" onclick="event.stopPropagation(); window.speak('${safeConjugation}')" title="Aussprache hören" style="cursor: pointer; display: inline-block;">${conjugationCell}</span>`;

  }

 praeteritumTableHTML += `<tr${rowClass}><td>${pronounCell}</td><td>${conjugationCell}</td><td>${exampleCell}</td></tr>`;

 }

 }

 praeteritumTableHTML += '</table>';

 praeteritumKonjugationTableContainer.innerHTML = praeteritumTableHTML;

 } else {

 praeteritumKonjugationTableContainer.innerHTML = '';

 }

 // Generate Konjunktiv II conjugation table (only for specific verbs)

 const konjunktivKonjugationTableContainer = document.getElementById('modal-konjunktiv-konjugation-table-tab');

 const konjunktivKonjugationContainer = document.getElementById('konjunktiv-konjugation-container-tab');

 if (konjunktivVerbs.includes(verb) && updatedData.konjunktiv_ii && updatedData.konjunktiv_ii_examples) {

 // Show the Konjunktiv II container for these verbs

 konjunktivKonjugationContainer.style.display = 'block';

 const pronounOrder = [

 { key: 'ich', display: 'ich', spanish: 'yo' },

 { key: 'du', display: 'du', spanish: 'tú' },

 { key: 'er_sie_es', display: 'er/sie/es', spanish: 'él/ella' },

 { key: 'wir', display: 'wir', spanish: 'nosotr@s' },

 { key: 'ihr', display: 'ihr', spanish: 'vosotr@s' },

 { key: 'sie_Sie', display: 'sie/Sie', spanish: 'ell@s/usted(es)' }

 ];

 let konjunktivTableHTML = '<table>';

 konjunktivTableHTML += '<tr><th>Pron.</th><th>Konjugation</th><th>Beispiel</th></tr>';

 for (const { key, display, spanish } of pronounOrder) {

 const conjugation = updatedData.konjunktiv_ii[key];

 const example = updatedData.konjunktiv_ii_examples[key];

 if (conjugation || example) {

 // Create pronoun cell with German pronoun and Spanish translation

 let pronounCell = `<div class="pronoun-de">${display}</div>`;

 if (spanish) {

 pronounCell += `<div class="pronoun-es">${spanish}</div>`;

 }

 // Create example cell with German, English, and Spanish

 let exampleCell = '';

 if (example) {

 exampleCell = `<div class="example-cell">`;

 if (example.de) exampleCell += `<div class="example-de">${example.de}</div>`;

 if (example.en) exampleCell += `<div class="example-translation example-en">${example.en}</div>`;

 if (example.es) exampleCell += `<div class="example-translation example-es">${example.es}</div>`;

 exampleCell += `</div>`;

 }

  let conjugationCell = conjugation || '';

  if (conjugationCell) {

    const safeConjugation = conjugationCell.replace(/'/g, "\\'");

    conjugationCell = `<span class="german-word conjugation-cell-speak" onclick="event.stopPropagation(); window.speak('${safeConjugation}')" title="Aussprache hören" style="cursor: pointer; display: inline-block;">${conjugationCell}</span>`;

  }

  konjunktivTableHTML += `<tr><td>${pronounCell}</td><td>${conjugationCell}</td><td>${exampleCell}</td></tr>`;

 }

 }

 konjunktivTableHTML += '</table>';

 konjunktivKonjugationTableContainer.innerHTML = konjunktivTableHTML;

 } else {

 // Hide the Konjunktiv II container for verbs that don't support it

 konjunktivKonjugationContainer.style.display = 'none';

 konjunktivKonjugationTableContainer.innerHTML = '';

 }

 const verbModalContent = document.querySelector('#verb-modal .modal-content');

 verbModalContent.classList.remove('hide-perfekt', 'hide-praeteritum', 'hide-konjunktiv', 'hide-translation');

 // Add hide-konjunktiv class if verb doesn't support Konjunktiv II

 if (!konjunktivVerbs.includes(verb)) {

 verbModalContent.classList.add('hide-konjunktiv');

 }

 document.getElementById('praesens-details-container').open = true;

 document.getElementById('modal-verb-infinitive').onclick = (e) => {

 e.stopPropagation();

 speak(verb);

 };

 document.getElementById('modal-verb-infinitive').style.cursor = 'pointer';

 document.getElementById('modal-verb-infinitive').title = 'Aussprache hören';

 document.getElementById('modal-verb-perfekt').onclick = (e) => {

 e.stopPropagation();

 speak(updatedData.perfekt);

 };

 document.getElementById('modal-verb-perfekt').style.cursor = 'pointer';

 document.getElementById('modal-verb-perfekt').title = 'Aussprache hören';

 document.getElementById('modal-verb-praeteritum').onclick = (e) => {

 e.stopPropagation();

 speak(updatedData.praeteritum);

 };

 document.getElementById('modal-verb-praeteritum').style.cursor = 'pointer';

 document.getElementById('modal-verb-praeteritum').title = 'Aussprache hören';

 // modal-text removed as per user request

 // document.getElementById('modal-text').onclick = ...

 if (window.updateTabCarousel) window.updateTabCarousel();

 verbModal.classList.add('visible');

 restoreModalActiveTab(activeTabBeforeRefresh);

 if (!skipExampleReload) {

 const activeTabNow = document.querySelector('.modal-tab-btn.active')?.dataset.tab || activeTabBeforeRefresh;

 maybeLoadExamplesForActiveTab(verb, activeTabNow);

 }

 if (!skipDeferredReload && needsDeferredModalData) {

 const token = ++modalDeferredLoadToken;

 loadVerbModalDeferredData(verb)

 .then(() => {

 if (modalDeferredLoadToken !== token || currentVerbInModal !== verb) return;

 const activeTabNow = document.querySelector('.modal-tab-btn.active')?.dataset.tab || activeTabBeforeRefresh;

 window.openModalForVerb(verb, {

 skipDeferredReload: true,

 preferredTab: activeTabNow

 });

 })

 .catch(error => {

 console.error(`Failed to load deferred modal data for ${verb}:`, error);

 });

 }

 }

 // --- SEARCH FUNCTIONALITY ---

 // searchInput moved to top

 const clearSearchBtn = document.getElementById('clear-search');

 const searchCounter = document.getElementById('search-counter');

 // --- UNIFIED SEARCH LOGIC ---

 // wortfamilieIndex is preloaded for search and refreshed through cache/version checks

 let isLoadingWortfamilie = false;

async function loadWortfamilieIndex() {

 if (wortfamilieIndex) return wortfamilieIndex;

 if (isLoadingWortfamilie) return null; // Prevent double loading

 isLoadingWortfamilie = true;

 try {

 const url = appVersion

 ? `json/wortfamilie_index.json?v=${encodeURIComponent(appVersion)}`

 : 'json/wortfamilie_index.json';

 const response = await fetch(url);

 if (!response.ok) {

 throw new Error(`HTTP error! status: ${response.status} ${response.statusText}`);

 }

 wortfamilieIndex = await parseJsonUtf8(response);

 scheduleCachePersist();

 return wortfamilieIndex;

 } catch (error) {

 console.error("Failed to load Wortfamilie index:", error);

 console.error("Error details:", error.message, error.name);

 // Fallback or retry logic could go here

 return null;

 } finally {

 isLoadingWortfamilie = false;

 }

 }

 // --- Whole-Word Regex Highlighter ---

 function highlightMatch(text, query) {

 if (!query || !text) return text;

 const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

 // Matches any whole word (\b...\b) containing the query sequence including trailing/leading German characters

 const regex = new RegExp(`([\\wäöüÄÖÜß]*${escapedQuery}[\\wäöüÄÖÜß]*)`, 'gi');

 return text.replace(regex, (match) =>

 `<span style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); color: #6e4e00; padding: 0;">${match}</span>`

 );

 }

 function highlightBaseVerb(text) {

 if (!text) return text;

 return `<span style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); color: #6e4e00; padding: 0;">${text}</span>`;

 }

 function highlightVerbName(verbName, query) {
   if (!verbName) return '';
   
   if (verbName === 'geboren werden') {
     const escapedQuery = query.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&');
     const regex = new RegExp(`([\\wäöüÄÖÜß]*${escapedQuery}[\\wäöüÄÖÜß]*)`, 'gi');
     if (query && regex.test('geboren')) {
       return `<span style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); color: #6e4e00; padding: 0;">geboren</span> werden`;
     }
     return 'geboren werden';
   }

   const prefix = separablePrefixesMap[verbName];
   const isSeparable = prefix && verbName.startsWith(prefix);
   
   if (!query) {
     if (isSeparable) {
       return `<span class="separable-prefix">${prefix}</span>${verbName.slice(prefix.length)}`;
     }
     return verbName;
   }
   
   const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
   const regex = new RegExp(`([\\wäöüÄÖÜß]*${escapedQuery}[\\wäöüÄÖÜß]*)`, 'gi');
   
   if (regex.test(verbName)) {
     if (isSeparable) {
       return `<span style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); color: #6e4e00; padding: 0;"><span class="separable-prefix">${prefix}</span>${verbName.slice(prefix.length)}</span>`;
     } else {
       return `<span style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); color: #6e4e00; padding: 0;">${verbName}</span>`;
     }
   }
   
   if (isSeparable) {
     return `<span class="separable-prefix">${prefix}</span>${verbName.slice(prefix.length)}`;
   }
   return verbName;
 }

 function getMatchHint(match) {

 return match.matchedPraesensForm ||

 match.matchedPerfektForm ||

 match.matchedPraeteritumForm ||

 match.matchedKonjunktivForm ||

 match.matchedRelatedForm ||

 '';

 }

 async function performSearch() {

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

 const hydratedGroup = verbGroupsByLevel[levelKey] && verbGroupsByLevel[levelKey][groupIndexInLevel];

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

 const verbData = allVerbsData[verbName];

 if (verbData) {

 // Create a promise for each verb to search (including lazy-loaded praesens)

 const searchPromise = (async () => {

 try {

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

 if (!perfektMatch && allVerbsData[verbName].perfekt_examples) {

 const perfektEntries = Object.values(allVerbsData[verbName].perfekt_examples);

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

 !allVerbsData[verbName].praesens ||

 !allVerbsData[verbName].praeteritum_conjugations ||

 (konjunktivVerbs.includes(verbName) && !allVerbsData[verbName].konjunktiv_ii);

 const baseMatchAlreadyFound = germanMatch || spanishMatch || perfektMatch || tagMatch;

 const shouldAttemptConjugationSearch = !baseMatchAlreadyFound && searchTerm.length >= 3;

 if (shouldAttemptConjugationSearch && needsConjugationData) {

 const physicalLayer = (allVerbsData[verbName].level || '').replace('.', '_');

 if (physicalLayer) {

 await loadBulkConjugations([physicalLayer]);

 }

 }

 // Search in Praesens conjugations (pre-loaded when needed)

 let praesensMatch = false;

 if (shouldAttemptConjugationSearch && allVerbsData[verbName].praesens) {

 const conjugations = Object.values(allVerbsData[verbName].praesens);

 matchedPraesensForm = findMatchingTextEntry(conjugations, searchTerm);

 praesensMatch = Boolean(matchedPraesensForm);

 }

 // Search in Praeteritum conjugations (pre-loaded when needed)

 let praeteritumMatch = false;

 if (shouldAttemptConjugationSearch && allVerbsData[verbName].praeteritum_conjugations) {

 const conjugations = Object.values(allVerbsData[verbName].praeteritum_conjugations);

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

 if (shouldAttemptConjugationSearch && allVerbsData[verbName].konjunktiv_ii) {

 const conjugations = Object.values(allVerbsData[verbName].konjunktiv_ii);

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

 }

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

 if (!allVerbsData[wfRes.verb]) {

 try {

 const res = await fetch(`json/cards/${wfRes.verb}.json?v=${appVersion || '1'}`);

 if (res.ok) {

 allVerbsData[wfRes.verb] = await parseJsonUtf8(res);

 }

 } catch (e) {

 console.warn("Failed to load verb data for search result", wfRes.verb);

 }

 }

 if (allVerbsData[wfRes.verb]) {

 uniqueVerbsMap.set(wfRes.verb, {

 verb: wfRes.verb,

 data: allVerbsData[wfRes.verb],

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
    const groupedMatches = {};
    verbsToShow.forEach(match => {
      const verbData = match.data;
      const level = match.levelKey || (verbData.level ? verbData.level.split('.')[0] : 'A1');
      const groupIndex = Number.isInteger(match.groupIndexInLevel)
        ? match.groupIndexInLevel
        : (verbData.group ? verbData.group - 1 : 0);
      const resolvedGroup = verbGroupsByLevel[level] && verbGroupsByLevel[level][groupIndex]
        ? verbGroupsByLevel[level][groupIndex]
        : null;
      let theme = resolvedGroup
        ? (resolvedGroup.theme || resolvedGroup.germanName || resolvedGroup.groupNameGerman || 'Gruppe')
        : (verbData.theme || 'Gruppe');
      const groupKey = `${level}-${theme}`;
      if (!groupedMatches[groupKey]) {
        const spanishName = resolvedGroup
          ? (resolvedGroup.spanishName || resolvedGroup.groupNameSpanish || '')
          : '';
        const fullGroupVerbs = resolvedGroup && Array.isArray(resolvedGroup.verbs)
          ? resolvedGroup.verbs.map(groupVerbName => ({
              verb: groupVerbName,
              data: allVerbsData[groupVerbName] || {},
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
      const resolvedGroup = verbGroupsByLevel[group.level] && verbGroupsByLevel[group.level][group.groupIndex]
        ? verbGroupsByLevel[group.level][group.groupIndex]
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

  function performWortfamilieSearch(searchTerm, returnResultsOnly = false) {
    if (!wortfamilieIndex) return [];
    if (!returnResultsOnly && clearSearchBtn) {
      if (searchTerm.length > 0) {
        clearSearchBtn.classList.add('visible');
      } else {
        clearSearchBtn.classList.remove('visible');
      }
    }
    if (searchTerm.length < 2) {
      if (!returnResultsOnly) {
        cardsContainer.innerHTML = '<div class="cards-placeholder" style="text-align:center; padding: 20px; color: #666;">Geben Sie mindestens 2 Buchstaben ein, um in Wortfamilien zu suchen.</div>';
        if (searchCounter) searchCounter.textContent = '';
      }
      return [];
    }
    try {
      const results = wortfamilieIndex.filter(item => {
        const word = item.word || '';
        const es = item.es || '';
        return normalizeSearchValue(word).includes(searchTerm) ||
               normalizeSearchValue(es).includes(searchTerm);
      });
      if (returnResultsOnly) {
        return results;
      }
      cardsContainer.innerHTML = '';
      if (results.length === 0) {
        cardsContainer.innerHTML = '<div class="no-results" style="text-align:center; padding: 20px;">Keine Ergebnisse gefunden.</div>';
        if (searchCounter) searchCounter.textContent = '0 Ergebnisse';
        return [];
      }
      const maxResults = 50;
      results.slice(0, maxResults).forEach(item => {
        const card = document.createElement('div');
        card.className = 'wf-result-card';
        card.onclick = () => openModalForVerb(item.verb);
        card.innerHTML = `
          <div class="wf-main-info">
            <span class="wf-word">${item.word}</span>
            <span class="wf-translation">${item.es}</span>
            <div class="wf-relationship">
              Gehört zu: <strong>${item.verb}</strong> <span class="wf-arrow"></span>
            </div>
          </div>
        `;
        cardsContainer.appendChild(card);
      });
      if (searchCounter) {
        if (results.length > maxResults) {
          searchCounter.textContent = `${maxResults} von ${results.length} Ergebnisse angezeigt`;
        } else {
          searchCounter.textContent = `${results.length} Ergebnisse`;
        }
      }
      return results;
    } catch (error) {
      console.error("Error in Wortfamilie search:", error);
      if (!returnResultsOnly) {
        cardsContainer.innerHTML = '<div class="error-message" style="text-align:center; padding: 20px;">Ein Fehler ist aufgetreten.</div>';
      }
      return [];
    }
  }

 function clearSearch() {

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

 // Event listeners with debouncing for search

 let searchTimeout;

 if (searchInput) {

 searchInput.addEventListener('input', () => {

 clearTimeout(searchTimeout);

 searchTimeout = setTimeout(() => performSearch(), 300); // 300ms debounce

 });

 }

 if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', clearSearch);
  }

  // Register click listener for top search toggle button to fix search feature not working
  const searchToggleBtn = document.getElementById('search-toggle-btn');
  const topSearchRowEl = document.getElementById('top-search-row-el');
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

  // Helper to find verb location (needed for WF matches that weren't in direct search)

 function findVerbLevelAndGroup(verbName) {

 for (const levelKey in verbGroupsByLevel) {

 const groups = verbGroupsByLevel[levelKey];

 for (let i = 0; i < groups.length; i++) {

 if (groups[i].verbs.includes(verbName)) {

 return { levelKey: levelKey, groupIndex: i };

 }

 }

 }

 for (const group of allGroupsIndex) {

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

 function resolveWortfamilieVerbs(word, data) {

 if (!data || typeof data !== 'object') return [];

 if (Array.isArray(data.verbs)) {

 return data.verbs.filter(Boolean);

 }

 if (Array.isArray(data.base)) {

 return data.base.filter(Boolean);

 }

 // Root entries in the newer index can use { related: [...] } without an explicit

 // verbs/base array. In that case, fall back to the matched word itself if it is a verb.

 if (Array.isArray(data.related) && allVerbsData[word]) {

 return [word];

 }

 return [];

 }

 // Modified to support returning results instead of rendering

 function performWortfamilieSearch(term, returnOnly = false) {

 if (!wortfamilieIndex) return returnOnly ? [] : null;

 const results = [];

 const seenResults = new Set();

 const termLower = term.toLowerCase();

 for (const [word, data] of Object.entries(wortfamilieIndex)) {

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

 // --- START THE APP ---

 initializeApp();

 // --- TAG FILTER IMPLEMENTATION ---

 function generateTagFilters() {

 const container = document.getElementById('tag-filters-container');

 if (!container) return;

 container.innerHTML = ''; // Clear existing

 const allTags = new Set();

 const tagCounts = {};

 // Collect tags

 Object.values(allVerbsData).forEach(verb => {

 if (verb.case_tags && Array.isArray(verb.case_tags)) {

 verb.case_tags.forEach(tag => {

 allTags.add(tag);

 tagCounts[tag] = (tagCounts[tag] || 0) + 1;

 });

 }

 // Also collect from general 'tags' (for Motion/Static)

 if (verb.tags && Array.isArray(verb.tags)) {

 verb.tags.forEach(tag => {

 allTags.add(tag);

 tagCounts[tag] = (tagCounts[tag] || 0) + 1;

 });

 }

 });

 const customOrder = ['Akkusativ', 'Dativ', 'Reflexive', 'Separable', 'Nominativ', 'Genitiv', 'Regular', 'Irregular', '🚀 Movimiento', '🏡 Estático'];

 const whitelistedTags = ['Akkusativ', 'Dativ', 'Reflexive', 'Separable', 'Nominativ', 'Genitiv', 'Regular', 'Irregular', 'Intransitive', '🚀 Movimiento', '🏡 Estático'];

 const sortedTags = Array.from(allTags)

 .filter(tag => whitelistedTags.includes(tag) || tag.startsWith('Präposition:'))

 .sort((a, b) => {

 const indexA = customOrder.indexOf(a);

 const indexB = customOrder.indexOf(b);

 if (indexA !== -1 && indexB !== -1) return indexA - indexB;

 if (indexA !== -1) return -1;

 if (indexB !== -1) return 1;

 return a.localeCompare(b);

 });

 sortedTags.forEach(tag => {

 const pill = document.createElement('div');

 pill.className = 'tag-filter-pill';

 pill.textContent = `${tag} (${tagCounts[tag]})`;

 pill.addEventListener('click', () => {

 const isActive = pill.classList.contains('active');

 document.querySelectorAll('.tag-filter-pill').forEach(p => p.classList.remove('active'));

 if (!isActive) {

 pill.classList.add('active');

 if (searchInput) {

 searchInput.value = `tag:${tag}`;

 performSearch();

 }

 } else {

 if (searchInput) {

 searchInput.value = '';

 performSearch();

 }

 }

 });

 container.appendChild(pill);

 });

 }

 // --- EVENT LISTENERS FOR VIEW SWITCHER ---

 const viewSwitchers = document.querySelectorAll('input[name="card-version"]');

 viewSwitchers.forEach(radio => {

 radio.addEventListener('change', () => {

 renderVerbGroup();

 });

 });

 // --- LISTENER FOR ENGLISH TOGGLE ---

 const enSwitch = document.getElementById('en-switch');

 if (enSwitch) {

 enSwitch.addEventListener('change', () => {

 // Re-render if in Niedlich mode (or generally to update views)

 renderVerbGroup();

 });

 }

  // === REDESIGNED MODAL HELPERS ===

  function restoreConjugationTables() {

    const praesensTable = document.getElementById('modal-praesens-table');

    const perfektTable = document.getElementById('modal-perfekt-examples-table');

    const praeteritumTable = document.getElementById('modal-praeteritum-konjugation-table');

    const konjunktivTable = document.getElementById('modal-konjunktiv-konjugation-table-tab');

    const praesensContainer = document.getElementById('praesens-details-container');

    const perfektContainer = document.getElementById('perfekt-examples-container');

    const praeteritumContainer = document.getElementById('praeteritum-konjugation-container');

    const konjunktivContainer = document.getElementById('konjunktiv-konjugation-container-tab');

    if (praesensTable && praesensContainer) {

      praesensContainer.appendChild(praesensTable);

    }

    if (perfektTable && perfektContainer) {

      perfektContainer.appendChild(perfektTable);

    }

    if (praeteritumTable && praeteritumContainer) {

      praeteritumContainer.appendChild(praeteritumTable);

    }

    if (konjunktivTable && konjunktivContainer) {

      konjunktivContainer.appendChild(konjunktivTable);

    }

  }

  function closeConjugationSubModal() {

    const subModal = document.getElementById('conjugation-sub-modal');

    if (subModal) {

      subModal.classList.remove('visible');

    }

    restoreConjugationTables();

    // Deactivate active tab btn in footer

    document.querySelectorAll('.modal-tab-btn').forEach(btn => btn.classList.remove('active'));

  }

  function openConjugationSubModal(tabId) {

    const subModal = document.getElementById('conjugation-sub-modal');

    const subModalTitle = document.getElementById('sub-modal-title');

    const subModalTableContainer = document.getElementById('sub-modal-table-container');

    const subModalNote = document.getElementById('sub-modal-note');

    if (!subModal || !subModalTitle || !subModalTableContainer || !subModalNote) return;

    // First restore any tables that were previously moved to the sub-modal

    restoreConjugationTables();

    subModalTableContainer.innerHTML = '';

    subModalNote.style.display = 'none';

    subModalNote.innerHTML = '';

    let titleText = '';

    let sourceTableId = '';

    let sourceNoteId = '';

    if (tabId === 'praesens') {

      titleText = `${currentVerbInModal} - Präsens`;

      sourceTableId = 'modal-praesens-table';

      sourceNoteId = 'modal-praesens-note';

    } else if (tabId === 'perfekt') {

      titleText = `${currentVerbInModal} - Perfekt`;

      sourceTableId = 'modal-perfekt-examples-table';

      sourceNoteId = 'modal-perfekt-note';

    } else if (tabId === 'praeteritum') {

      titleText = `${currentVerbInModal} - Präteritum`;

      sourceTableId = 'modal-praeteritum-konjugation-table';

      sourceNoteId = 'modal-praeteritum-note';

    } else if (tabId === 'konjunktiv') {

      titleText = `${currentVerbInModal} - Konjunktiv II`;

      sourceTableId = 'modal-konjunktiv-konjugation-table-tab';

    }

    const sourceTable = document.getElementById(sourceTableId);

    if (sourceTable) {

      subModalTableContainer.appendChild(sourceTable);

    }

    const sourceNote = document.getElementById(sourceNoteId);

    if (sourceNote && sourceNote.innerHTML.trim() !== '') {

      subModalNote.innerHTML = sourceNote.innerHTML;

      subModalNote.style.display = 'block';

    }

    subModalTitle.textContent = titleText;

    subModal.classList.add('visible');

  }

  const renderSaetzeSection = (verbData) => {

    const container = document.getElementById('saetze-container');

    const contentEl = document.getElementById('saetze-content');

    if (!container || !contentEl) return;

    const hasSaetze = verbData.saetze && Object.keys(verbData.saetze).length > 0;

    const hasNote = !!(verbData.note || verbData.note_es);

    if (!hasSaetze && !hasNote) {

      container.style.display = 'none';

      return;

    }

    container.style.display = 'block';

    let contentHTML = '';

    // Render note if present

    if (hasNote) {

      let noteText = verbData.note_es || verbData.note;

      const a1testTag = verbData.case_tags ? verbData.case_tags.find(t => t.startsWith('A1')) : null;

      if (a1testTag) {

        const badgeHTML = `<span class="a1test-badge case-tag-${a1testTag}" style="display: inline-block; padding: 1.5px 5px; font-size: 0.74rem; border-radius: 4px; font-weight: 800; margin-right: 5px;">${a1testTag}</span>`;

        if (noteText.includes('<br>')) {

          noteText = noteText.replace('<br>', `<br>${badgeHTML} `);

        } else {

          noteText = badgeHTML + ' ' + noteText;

        }

      }

      contentHTML += `<div class="note-highlight-card">${noteText}</div>`;

    }

    // Render level-classified sentences/expressions

    if (hasSaetze) {

      const levels = ['A1', 'A2', 'B1'];

      levels.forEach(level => {

        const items = verbData.saetze[level];

        if (items && items.length > 0) {

          const levelCircle = level === 'A1' ? '🟢' : level === 'A2' ? '🟡' : '🟠';

          let levelName = '';

          if (level === 'A1') levelName = 'Acciones básicas';

          else if (level === 'A2') levelName = 'Vida cotidiana y estados';

          else if (level === 'B1') levelName = 'Expresiones idiomáticas y abstractas';

          contentHTML += `<div class="saetze-level-section">`;

          contentHTML += `<div class="saetze-level-header level-${level.toLowerCase()}">`;

          contentHTML += `<span>${levelCircle}</span> Nivel ${level} (${levelName})`;

          contentHTML += `</div>`;

          items.forEach(item => {

            contentHTML += `<div class="saetze-item">`;

            contentHTML += `<div class="saetze-expression-line">`;

            const safeExpr = item.expression.replace(/'/g, "\\'");

            contentHTML += `• <span class="saetze-expression-de" onclick="speak('${safeExpr}')" title="Aussprache hören">${item.expression}</span>: `;

            contentHTML += `<span class="saetze-expression-translation">${item.translation}</span>`;

            contentHTML += `</div>`;

            if (item.example) {

              contentHTML += `<div class="saetze-example-box">`;

              const safeEx = item.example.replace(/'/g, "\\'");

              contentHTML += `Ejemplo: "<span class="saetze-example-de" onclick="speak('${safeEx}')" title="Aussprache hören">${item.example}</span>"`;

              if (item.example_es) {

                contentHTML += ` <span class="saetze-example-translation">(${item.example_es})</span>`;

              }

              contentHTML += `</div>`;

            }

            contentHTML += `</div>`;

          });

          contentHTML += `</div>`;

        }

      });

    }

    contentEl.innerHTML = contentHTML;

  };

  // Bind close events for conjugation sub-modal

  const subModal = document.getElementById('conjugation-sub-modal');

  const closeSubModalX = document.getElementById('close-conjugation-modal-x');

  if (closeSubModalX && subModal) {

    closeSubModalX.addEventListener('click', closeConjugationSubModal);

    subModal.addEventListener('click', (e) => {

      if (e.target === subModal) closeConjugationSubModal();

    });

  }

  // --- NEW INLINE CARD FLIP BODY TABS DETAILS CODE ---

  window.showVerbDetailsInCard = async function (verbName, cardEl) {

    const cardFront = cardEl.querySelector('.card-front');

    const cardBack = cardEl.querySelector('.card-back');

    if (!cardFront || !cardBack) return;

    cardFront.style.display = 'none';

    cardBack.style.display = 'flex';

    // Set initial loading layout

    cardBack.innerHTML = `

      <div class="card-back-header">

        <span class="card-back-level-badge">Lade...</span>

        <button class="card-back-close-btn">&times;</button>

        <h2 class="card-back-infinitive">${verbName}</h2>

        <p class="card-back-translation"></p>

      </div>

      <div class="card-back-body">

        <p style="text-align: center; color: #94a3b8; font-size: 0.8rem; margin-top: 20px;">Lade Daten...</p>

      </div>

    `;

    cardBack.querySelector('.card-back-close-btn').onclick = (e) => {

      e.stopPropagation();

      cardBack.style.display = 'none';

      cardFront.style.display = 'flex';

    };

    // Load full verb data if not already fully loaded

    let data = allVerbsData[verbName];

    if (!data) return;

    // Load Praesens if needed

    if (!data.praesens) {

      try { await loadVerbPraesensData(verbName); } catch(e) {}

    }

    // Load Konjunktiv / Wortfamilie deferred data if needed

    if (!data.konjunktiv_ii || !data.wortfamilie) {

      try { await loadVerbModalDeferredData(verbName); } catch(e) {}

    }

    data = allVerbsData[verbName] || data;

    // Setup the card back HTML structure

    cardBack.innerHTML = `

      <div class="card-back-header">

        <span class="card-back-level-badge">${data.level || 'A1'}</span>

        <button class="card-back-close-btn">&times;</button>

        <h2 class="card-back-infinitive">${verbName}</h2>

        <p class="card-back-translation">${data.spanishName || data.groupNameSpanish || data.es || ''}</p>

      </div>

      <div class="card-back-body">

        <div class="card-back-content-area" id="card-back-content-area-el"></div>

      </div>

    `;

    // Re-bind close button

    cardBack.querySelector('.card-back-close-btn').onclick = (e) => {

      e.stopPropagation();

      cardBack.style.display = 'none';

      cardFront.style.display = 'flex';

    };

    // Render the initial main card back menu

    window.renderCardBackMenu(verbName, cardEl);

  };

  window.renderCardBackMenu = function (verbName, cardEl) {
    const cardFront = cardEl.querySelector('.card-front');
    const cardBack = cardEl.querySelector('.card-back');
    if (!cardFront || !cardBack) return;
    const contentArea = cardBack.querySelector('#card-back-content-area-el');
    if (!contentArea) return;
    const data = allVerbsData[verbName];
    if (!data) return;

    // Configure top-right button as Close button (x)
    const actionBtn = cardBack.querySelector('#card-back-header-action-btn') || cardBack.querySelector('.card-back-close-btn');
    if (actionBtn) {
      actionBtn.innerHTML = '&times;';
      actionBtn.onclick = (e) => {
        e.stopPropagation();
        cardBack.style.display = 'none';
        cardFront.style.display = 'flex';
      };
    }

    const wfList = data.wortfamilie || [];
    const wfeldList = data.word_field || [];
    const hasVocab = wfList.length > 0 || wfeldList.length > 0;
    const saetze = data.saetze || {};
    const hasSaetze = Object.values(saetze).some(arr => arr && arr.length > 0);
    const hasNote = !!(data.note || data.note_es);
    const hasSaetzeSection = hasSaetze || hasNote;

    // Conjugation values helper (removes pronouns like er/sie/es and reflexive pronouns like sich)
    const cleanVerbForm = (phrase) => {
      if (!phrase) return '';
      // Remove pronouns
      let clean = phrase.replace(/\b(er\/sie\/es|er|sie|es|ich|du|wir|ihr|Sie)\s+/gi, '');
      // Remove reflexive pronouns (sich, mich, dich, uns, euch)
      clean = clean.replace(/\b(sich|mich|dich|uns|euch)\s+/gi, '');
      return clean.trim().replace(/\s+/g, ' ');
    };

    const praesensObj = data.praesens;
    const erPraesensRaw = praesensObj ? (praesensObj["er"] || praesensObj.er || '') : '';
    const erPraesens = cleanVerbForm(erPraesensRaw);

    const praeteritumForm = data.praeteritum || '';
    const erPraeteritum = cleanVerbForm(praeteritumForm);

    // Perfekt: REMOVE the auxiliary (only show the participle form)
    const perfektForm = data.perfekt || '';
    let erPerfekt = '';
    if (perfektForm) {
      const cleanPerf = perfektForm.replace(/^(hat|ist|haben|sein)\s+/gi, '');
      erPerfekt = cleanVerbForm(cleanPerf);
    }

    const konjunktivObj = data.konjunktiv_ii;
    const erKonjunktivRaw = konjunktivObj ? (konjunktivObj["er_sie_es"] || konjunktivObj["er/sie/es"] || konjunktivObj.er_sie_es || konjunktivObj.er || konjunktivObj.sie || konjunktivObj.es || '') : '';
    const erKonjunktiv = cleanVerbForm(erKonjunktivRaw);

    let html = `<div style="display: flex; flex-direction: column; flex-grow: 1; height: 100%; justify-content: space-between;">`;

    // Horizontal Tenses Row
    html += `<div class="card-back-tenses-row" style="margin-top: 6px;">`;
    if (erPraesens) {
      html += `<button class="tense-menu-btn" data-target="zeit_praesens"><span class="tense-btn-word">${erPraesens}</span><span class="tense-btn-label">präsens</span></button>`;
    }
    if (erPerfekt) {
      html += `<button class="tense-menu-btn" data-target="zeit_perfekt"><span class="tense-btn-word">${erPerfekt}</span><span class="tense-btn-label">perfekt</span></button>`;
    }
    if (erPraeteritum) {
      html += `<button class="tense-menu-btn" data-target="zeit_praeteritum"><span class="tense-btn-word">${erPraeteritum}</span><span class="tense-btn-label">präteritum</span></button>`;
    }
    if (erKonjunktiv) {
      html += `<button class="tense-menu-btn" data-target="zeit_konjunktiv"><span class="tense-btn-word">${erKonjunktiv}</span><span class="tense-btn-label">konj. ii</span></button>`;
    }
    html += `</div>`;

    // Center container for Wortschatz and Sätze buttons
    html += `<div style="display: flex; flex-direction: column; justify-content: center; gap: 10px; flex-grow: 1;">`;

    // Wortschatz button (full width with orange triangle)
    if (hasVocab) {
      html += `
        <button class="card-back-menu-btn" data-target="wortschatz">
          <span class="btn-left">📚 Wortschatz</span>
          <span class="btn-triangle">▶</span>
        </button>
      `;
    }

    // Sätze button (full width with orange triangle)
    if (hasSaetzeSection) {
      html += `
        <button class="card-back-menu-btn" data-target="saetze">
          <span class="btn-left">📝 Sätze</span>
          <span class="btn-triangle">▶</span>
        </button>
      `;
    }

    html += `</div></div>`;
    contentArea.innerHTML = html;

    // Reset scroll to top
    const bodyEl = cardBack.querySelector('.card-back-body');
    if (bodyEl) bodyEl.scrollTop = 0;

    // Bind click events for navigation
    const menuBtns = contentArea.querySelectorAll('.tense-menu-btn, .card-back-menu-btn');
    menuBtns.forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const target = btn.dataset.target;
        window.renderCardBackTabContent(verbName, cardEl, target);
      };
    });
  };

  window.renderCardBackTabContent = function (verbName, cardEl, tabId) {
    const cardBack = cardEl.querySelector('.card-back');
    if (!cardBack) return;
    const contentArea = cardBack.querySelector('#card-back-content-area-el');
    if (!contentArea) return;
    const data = allVerbsData[verbName];
    if (!data) return;

    // Configure top-right button as Back button (larr/flip icon)
    const actionBtn = cardBack.querySelector('#card-back-header-action-btn') || cardBack.querySelector('.card-back-close-btn');
    if (actionBtn) {
      actionBtn.innerHTML = `<svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3h9a2 2 0 0 1 2 2v9" opacity="0.4"></path><rect x="4" y="8" width="10" height="11" rx="1.5"></rect><path d="M14 10c2-1 4 .5 4 2.5v1.5"></path><polyline points="16 13 18 15 20 13"></polyline></svg>`;
      actionBtn.onclick = (e) => {
        e.stopPropagation();
        window.renderCardBackMenu(verbName, cardEl);
      };
    }

    // Reset scroll to top of sub-screen
    const bodyEl = cardBack.querySelector('.card-back-body');
    if (bodyEl) bodyEl.scrollTop = 0;

    if (tabId.startsWith('zeit_')) {
      const tenseId = tabId.replace('zeit_', ''); // 'praesens', 'praeteritum', 'perfekt', 'konjunktiv'
      
      // Determine available tenses in order
      const cleanVerbForm = (phrase) => {
        if (!phrase) return '';
        let clean = phrase.replace(/\b(er\/sie\/es|er|sie|es|ich|du|wir|ihr|Sie)\s+/gi, '');
        clean = clean.replace(/\b(sich|mich|dich|uns|euch)\s+/gi, '');
        return clean.trim().replace(/\s+/g, ' ');
      };
      
      const tensesOrder = [];
      if (data.praesens) tensesOrder.push('praesens');
      if (data.perfekt) tensesOrder.push('perfekt');
      if (data.praeteritum) tensesOrder.push('praeteritum');
      
      const konjunktivObj = data.konjunktiv_ii;
      const erKonjunktivRaw = konjunktivObj ? (konjunktivObj["er_sie_es"] || konjunktivObj["er/sie/es"] || konjunktivObj.er_sie_es || konjunktivObj.er || konjunktivObj.sie || konjunktivObj.es || '') : '';
      const erKonjunktiv = cleanVerbForm(erKonjunktivRaw);
      if (erKonjunktiv) tensesOrder.push('konjunktiv');

      const currentIdx = tensesOrder.indexOf(tenseId);
      const prevTense = currentIdx > 0 ? tensesOrder[currentIdx - 1] : null;
      const nextTense = currentIdx < tensesOrder.length - 1 ? tensesOrder[currentIdx + 1] : null;

      let title = '';
      if (tenseId === 'praesens') title = 'Präsens';
      else if (tenseId === 'praeteritum') title = 'Präteritum';
      else if (tenseId === 'perfekt') title = 'Perfekt';
      else if (tenseId === 'konjunktiv') title = 'Konjunktiv II';

      contentArea.innerHTML = `
        <div style="margin-top: 10px; margin-bottom: 15px;">
          <div class="tense-nav-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <button class="tense-nav-arrow-btn prev-tense-btn" style="background: none; border: none; color: #94a3b8; font-size: 1.25rem; cursor: pointer; padding: 4px 12px; transition: color 0.2s; visibility: ${prevTense ? 'visible' : 'hidden'};" title="Vorherige Zeitform">◀</button>
            <h3 style="color: #ffffff; font-size: 1.15rem; font-weight: 700; margin: 0;">${title}</h3>
            <button class="tense-nav-arrow-btn next-tense-btn" style="background: none; border: none; color: #94a3b8; font-size: 1.25rem; cursor: pointer; padding: 4px 12px; transition: color 0.2s; visibility: ${nextTense ? 'visible' : 'hidden'};" title="Nächste Zeitform">▶</button>
          </div>
          <div class="tiempos-full-table-wrapper" id="card-back-subtab-table-el"></div>
        </div>
      `;

      // Bind arrow navigation clicks
      const prevBtn = contentArea.querySelector('.prev-tense-btn');
      if (prevBtn && prevTense) {
        prevBtn.onclick = (e) => {
          e.stopPropagation();
          window.renderCardBackTabContent(verbName, cardEl, 'zeit_' + prevTense);
        };
        prevBtn.onmouseover = () => { prevBtn.style.color = '#ffffff'; };
        prevBtn.onmouseout = () => { prevBtn.style.color = '#94a3b8'; };
      }
      
      const nextBtn = contentArea.querySelector('.next-tense-btn');
      if (nextBtn && nextTense) {
        nextBtn.onclick = (e) => {
          e.stopPropagation();
          window.renderCardBackTabContent(verbName, cardEl, 'zeit_' + nextTense);
        };
        nextBtn.onmouseover = () => { nextBtn.style.color = '#ffffff'; };
        nextBtn.onmouseout = () => { nextBtn.style.color = '#94a3b8'; };
      }

      window.renderCardBackSubTabTable(verbName, cardEl, tenseId);
    } else if (tabId === 'wortschatz') {
      const wfList = data.wortfamilie || [];
      const wfeldList = data.word_field || [];
      let activeVocab = window.activeWortschatzTab?.[verbName] || (wfList.length > 0 ? 'wf' : 'wfeld');
      let togglesHTML = `
        <div class="wortschatz-toggles-container">
          ${wfList.length > 0 ? `<button class="wortschatz-toggle-btn ${activeVocab === 'wf' ? 'active' : ''}" data-vocab="wf">Wortfamilie</button>` : ''}
          ${wfeldList.length > 0 ? `<button class="wortschatz-toggle-btn ${activeVocab === 'wfeld' ? 'active' : ''}" data-vocab="wfeld">Wortfeld</button>` : ''}
        </div>
        <div id="wortschatz-vocab-list-el"></div>
      `;
      contentArea.innerHTML = togglesHTML;
      const toggleBtns = contentArea.querySelectorAll('.wortschatz-toggle-btn');
      toggleBtns.forEach(btn => {
        btn.onclick = (e) => {
          e.stopPropagation();
          toggleBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          const vocabId = btn.dataset.vocab;
          if (!window.activeWortschatzTab) window.activeWortschatzTab = {};
          window.activeWortschatzTab[verbName] = vocabId;
          window.renderWortschatzList(verbName, cardEl, vocabId);
        };
      });
      window.renderWortschatzList(verbName, cardEl, activeVocab);
    } else if (tabId === 'saetze') {
      let html = '<div>';
      let note = data.note_es || data.note || '';
      if (note) {
        const a1testTag = data.case_tags ? data.case_tags.find(t => t.startsWith('A1')) : null;
        if (a1testTag) {
          const badgeHTML = `<span class="a1test-badge case-tag-${a1testTag}" style="display: inline-block; padding: 1.5px 5px; font-size: 0.74rem; border-radius: 4px; font-weight: 800; margin-right: 5px;">${a1testTag}</span>`;
          if (note.includes('<br>')) {
            note = note.replace('<br>', `<br>${badgeHTML} `);
          } else {
            note = badgeHTML + ' ' + note;
          }
        }
        html += `<div style="background: rgba(255,255,255,0.05); padding: 6px; border-radius: 6px; font-size: 0.74rem; margin-bottom: 6px; font-style: italic; color: #cbd5e1;">${note}</div>`;
      }
      const saetze = data.saetze || {};
      ['A1', 'A2', 'B1'].forEach(lvl => {
        const items = saetze[lvl] || [];
        if (items.length > 0) {
          html += `<div style="margin-top: 6px; font-weight: bold; font-size: 0.76rem; color: #38bdf8;">Nivel ${lvl}:</div>`;
          items.forEach(item => {
            html += `
              <div class="card-back-info-text card-back-saetze-item">
                <strong>${item.expression}</strong>: ${item.translation}
                ${item.example ? `<br><span style="color:#cbd5e1;">Ex: "${item.example}"</span>` : ''}
              </div>
            `;
          });
        }
      });
      html += '</div>';
      contentArea.innerHTML = html || '<p style="font-size: 0.76rem; color: #94a3b8; margin-top: 4px;">Keine Sätze vorhanden.</p>';
    }
  };

  window.renderWortschatzList = function (verbName, cardEl, vocabId) {

    const cardBack = cardEl.querySelector('.card-back');

    if (!cardBack) return;

    const vocabListEl = cardBack.querySelector('#wortschatz-vocab-list-el');

    if (!vocabListEl) return;

    const data = allVerbsData[verbName];

    if (!data) return;

    if (vocabId === 'wf') {

      const list = data.wortfamilie || [];

      vocabListEl.innerHTML = list.map(item => `

        <div class="card-back-info-text card-back-wf-item">

          <strong>${item.word}</strong> (${item.type}):<br>

          <span style="color: #cbd5e1;">${item.es}</span>

        </div>

      `).join('');

    } else if (vocabId === 'wfeld') {

      const list = data.word_field || [];

      vocabListEl.innerHTML = list.map(item => `

        <div class="card-back-info-text card-back-wfeld-item">

          <strong>${item.word}</strong>:<br>

          <span style="color: #cbd5e1;">${item.meaning}</span>

        </div>

      `).join('');

    }

  };

  window.renderCardBackSubTabTable = async function (verbName, cardEl, subTabId) {

    const cardBack = cardEl.querySelector('.card-back');

    if (!cardBack) return;

    const tableWrapper = cardBack.querySelector('#card-back-subtab-table-el');

    if (!tableWrapper) return;

    const data = allVerbsData[verbName];

    if (!data) return;

    const conjugateBaseForm = (phrase, suffix) => {

      if (!phrase) return '';

      const cleanPhrase = phrase.replace(/^(ich|du|er\/sie\/es|wir|ihr|sie\/Sie)\s+/, '');

      const parts = cleanPhrase.split(/\s+/);

      let base = parts[0];

      const prefix = parts.slice(1).join(' ');

      if (suffix === 'st') {

        if (base.endsWith('e')) base = base + 'st';

        else if (base.endsWith('t') || base.endsWith('d')) base = base + 'est';

        else base = base + 'st';

      } else if (suffix === 'n') {

        if (base.endsWith('en')) {}

        else if (base.endsWith('e')) base = base + 'n';

        else base = base + 'en';

      } else if (suffix === 't') {

        if (base.endsWith('t')) {}

        else if (base.endsWith('e')) base = base + 't';

        else if (base.endsWith('d')) base = base + 'et';

        else base = base + 't';

      }

      return prefix ? `${base} ${prefix}` : base;

    };

    let conjObj = null;

    let tenseExamplesKey = subTabId;

    if (subTabId === 'praesens') {

      conjObj = data.praesens || data;

    } else if (subTabId === 'perfekt') {

      let perfForm = data.perfekt || '';

      perfForm = perfForm.replace(/^(hat|ist)\s+/, '');

      const aux = data.auxiliary || 'haben';

      const isSein = aux.includes('sein') || (data.perfekt && data.perfekt.startsWith('ist'));

      const auxIch = isSein ? 'bin' : 'habe';

      const auxDu = isSein ? 'bist' : 'hast';

      const auxEr = isSein ? 'ist' : 'hat';

      const auxWir = isSein ? 'sind' : 'haben';

      const auxIhr = isSein ? 'seid' : 'habt';

      const auxSie = isSein ? 'sind' : 'haben';

      conjObj = data.perfekt_conj || {

        "ich": `${auxIch} ${perfForm}`,

        "du": `${auxDu} ${perfForm}`,

        "er/sie/es": `${auxEr} ${perfForm}`,

        "wir": `${auxWir} ${perfForm}`,

        "ihr": `${auxIhr} ${perfForm}`,

        "sie/Sie": `${auxSie} ${perfForm}`

      };

    } else if (subTabId === 'praeteritum') {

      const praetPhrase = data.praeteritum || '';

      conjObj = data.praeteritum_conj || {

        "ich": conjugateBaseForm(praetPhrase, ''),

        "du": conjugateBaseForm(praetPhrase, 'st'),

        "er/sie/es": conjugateBaseForm(praetPhrase, ''),

        "wir": conjugateBaseForm(praetPhrase, 'n'),

        "ihr": conjugateBaseForm(praetPhrase, 't'),

        "sie/Sie": conjugateBaseForm(praetPhrase, 'n')

      };

    } else if (subTabId === 'konjunktiv') {

      conjObj = data.konjunktiv_ii;

    }

    let conjugationHTML = '';

    if (conjObj) {

      const erSieEsForm = conjObj["er/sie/es"] || conjObj.er_sie_es || conjObj.er || conjObj.sie || conjObj.es || '';

      const sieSieForm = conjObj["sie/Sie"] || conjObj.sie_Sie || conjObj["sie (plural)"] || conjObj["Sie (formal)"] || conjObj.sie || '';

      conjugationHTML = `

        <table>
          <tbody>

            <tr><td><span class="pronoun-de">ich</span></td><td><span class="conj-de-form">${conjObj.ich || ''}</span></td></tr>

            <tr><td><span class="pronoun-de">du</span></td><td><span class="conj-de-form">${conjObj.du || ''}</span></td></tr>

            <tr><td><span class="pronoun-de">er</span></td><td><span class="conj-de-form">${erSieEsForm}</span></td></tr>

            <tr><td><span class="pronoun-de">sie</span></td><td><span class="conj-de-form">${erSieEsForm}</span></td></tr>

            <tr><td><span class="pronoun-de">es</span></td><td><span class="conj-de-form">${erSieEsForm}</span></td></tr>

            <tr><td><span class="pronoun-de">wir</span></td><td><span class="conj-de-form">${conjObj.wir || ''}</span></td></tr>

            <tr><td><span class="pronoun-de">ihr</span></td><td><span class="conj-de-form">${conjObj.ihr || ''}</span></td></tr>

            <tr><td><span class="pronoun-de">sie</span></td><td><span class="conj-de-form">${sieSieForm}</span></td></tr>

            <tr><td><span class="pronoun-de">Sie</span></td><td><span class="conj-de-form">${sieSieForm}</span></td></tr>

          </tbody>

        </table>

      `;

    }

    try {

      await maybeLoadExamplesForActiveTab(verbName, tenseExamplesKey);

    } catch(e) {}

    const examples = allVerbsData[verbName]?.examples?.[tenseExamplesKey] || [];

    let exampleHTML = '';

    if (examples && examples.length > 0) {

      const firstEx = examples[0];

      const exDe = firstEx.de || firstEx.example_de || '';

      const exEs = firstEx.es || firstEx.example_es || '';

      if (exDe) {

        exampleHTML = `

          <div style="margin-top: 6px; padding: 6px; background-color: rgba(255,255,255,0.03); border: 1px solid #334155; border-radius: 6px;">

            <p class="example-de" onclick="speak('${exDe.replace(/'/g, "\\'")}')" style="font-size:0.76rem; margin:0;" title="Aussprache hören">${exDe}</p>

            ${exEs ? `<p class="example-translation" style="font-size:0.72rem; margin:0; color:#94a3b8; font-style:italic;">(${exEs})</p>` : ''}

          </div>

        `;

      }

    }

    tableWrapper.innerHTML = conjugationHTML + exampleHTML;

  };

  function setupCardDrag(cardElement) {
    if (cardElement.dataset.dragSetup === 'true') return;
    cardElement.dataset.dragSetup = 'true';
    let startX = 0;
    let currentX = 0;
    let isDragging = false;
    let hasMoved = false;
    const threshold = 80;

    // Mouse events
    cardElement.addEventListener('mousedown', startDrag);
    window.addEventListener('mousemove', drag);
    window.addEventListener('mouseup', endDrag);

    // Touch events
    cardElement.addEventListener('touchstart', startDrag, { passive: true });
    window.addEventListener('touchmove', drag, { passive: false });
    window.addEventListener('touchend', endDrag);

    function startDrag(e) {
      if (e.target.closest('button') || e.target.closest('input') || e.target.closest('a') || e.target.closest('.settings-info-btn') || e.target.closest('.kompakt-header-de') || e.target.closest('.kompakt-header-es')) {
        return;
      }
      isDragging = true;
      hasMoved = false;
      startX = e.type.startsWith('touch') ? e.touches[0].clientX : e.clientX;
      currentX = startX;
    }

    function drag(e) {
      if (!isDragging) return;
      currentX = e.type.startsWith('touch') ? e.touches[0].clientX : e.clientX;
      const deltaX = currentX - startX;
      
      if (Math.abs(deltaX) > 8) {
        if (!hasMoved) {
          cardElement.style.transition = 'none';
          hasMoved = true;
        }
        cardElement.style.transform = `translateX(${deltaX}px) rotate(${deltaX * 0.03}deg)`;
        if (e.cancelable) e.preventDefault();
      }
    }

    function endDrag() {
      if (!isDragging) return;
      isDragging = false;
      
      if (!hasMoved) {
        return;
      }
      
      const deltaX = currentX - startX;
      console.log("[endDrag] deltaX:", deltaX, "threshold:", threshold, "currentCompactCardIndex:", window.currentCompactCardIndex);
      cardElement.style.transition = 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';

      const isMobile = window.innerWidth < 768;
      const pageSize = isMobile ? 1 : 3;

      if (deltaX < -threshold) {
        // Next page
        const nextDisabled = window.currentCompactCardIndex + pageSize >= window.allCompactCards.length;
        if (!nextDisabled) {
          cardElement.style.transform = 'translateX(-150%) rotate(-15deg)';
          setTimeout(() => {
            window.currentCompactCardIndex = Math.min(
              window.allCompactCards.length - pageSize,
              window.currentCompactCardIndex + pageSize
            );
            window.updateCompactView();
          }, 150);
        } else {
          cardElement.style.transform = 'translateX(0) rotate(0)';
        }
      } else if (deltaX > threshold) {
        // Previous page
        const prevDisabled = window.currentCompactCardIndex === 0;
        if (!prevDisabled) {
          cardElement.style.transform = 'translateX(150%) rotate(15deg)';
          setTimeout(() => {
            window.currentCompactCardIndex = Math.max(0, window.currentCompactCardIndex - pageSize);
            window.updateCompactView();
          }, 150);
        } else {
          cardElement.style.transform = 'translateX(0) rotate(0)';
        }
      } else {
        cardElement.style.transform = 'translateX(0) rotate(0)';
      }
    }
  }

  window.updateCompactView = function() {
    cardsContainer.innerHTML = '';
    const grid = document.createElement('div');
    grid.className = 'kompakt-grid';
    const isMobile = window.innerWidth < 768;
    const pageSize = isMobile ? 1 : 3;

    if (window.currentCompactCardIndex < 0) window.currentCompactCardIndex = 0;
    if (window.currentCompactCardIndex >= window.allCompactCards.length) {
      window.currentCompactCardIndex = Math.max(0, window.allCompactCards.length - pageSize);
    }

    const visibleCards = window.allCompactCards.slice(
      window.currentCompactCardIndex,
      window.currentCompactCardIndex + pageSize
    );

    visibleCards.forEach(card => {
      card.style.transform = 'none';
      card.style.transition = 'none';
      grid.appendChild(card);
      setupCardDrag(card); // Enable swipe/drag navigation!
    });

    cardsContainer.appendChild(grid);

    // Create bottom navigation bar
    const navBar = document.createElement('div');
    navBar.className = 'compact-nav-bar';

    const prevBtn = document.createElement('button');
    prevBtn.className = 'compact-nav-btn back-btn';
    prevBtn.innerHTML = 'Back';
    const prevDisabled = window.currentCompactCardIndex === 0;
    if (prevDisabled) prevBtn.disabled = true;

    const nextBtn = document.createElement('button');
    nextBtn.className = 'compact-nav-btn next-btn';
    nextBtn.innerHTML = 'Next';
    const nextDisabled = window.currentCompactCardIndex + pageSize >= window.allCompactCards.length;
    if (nextDisabled) nextBtn.disabled = true;

    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'compact-nav-dots';

    const totalPages = Math.ceil(window.allCompactCards.length / pageSize);
    const currentPage = Math.floor(window.currentCompactCardIndex / pageSize);

    if (isMobile) {
      const pageIndicator = document.createElement('span');
      pageIndicator.className = 'compact-nav-pages';
      pageIndicator.textContent = `${currentPage + 1} / ${totalPages}`;
      dotsContainer.appendChild(pageIndicator);
    } else {
      for (let i = 0; i < totalPages; i++) {
        const dot = document.createElement('div');
        dot.className = `compact-dot ${i === currentPage ? 'active' : ''}`;
        dot.onclick = () => {
          window.currentCompactCardIndex = i * pageSize;
          window.updateCompactView();
        };
        dotsContainer.appendChild(dot);
      }
    }

    prevBtn.onclick = () => {
      window.currentCompactCardIndex = Math.max(0, window.currentCompactCardIndex - pageSize);
      window.updateCompactView();
    };

    nextBtn.onclick = () => {
      window.currentCompactCardIndex = Math.min(
        window.allCompactCards.length - pageSize,
        window.currentCompactCardIndex + pageSize
      );
      window.updateCompactView();
    };

    navBar.appendChild(prevBtn);
    navBar.appendChild(dotsContainer);
    navBar.appendChild(nextBtn);

    const oldNavBar = document.querySelector('.compact-nav-bar');
    if (oldNavBar) oldNavBar.remove();
    cardsContainer.parentNode.insertBefore(navBar, cardsContainer.nextSibling);
  };
});
