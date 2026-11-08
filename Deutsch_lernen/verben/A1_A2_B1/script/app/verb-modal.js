/** Verb modal: tabs, theme modal, speech and the verb detail modal. Moved verbatim from script.js. */
import { renderSaetzeSection } from './conjugation-modal.js';
import { loadVerbModalDeferredData, loadVerbPraesensData, maybeLoadExamplesForActiveTab } from './data-loading.js';
import { applyModalThemePalette } from './levels.js';
import { performSearch } from './search.js';
import { searchInput, themeModal, verbModal } from './shared.js';
import { state } from './state.js';
import { restoreModalActiveTab } from './views.js';


 // --- TAB FUNCTIONALITY ---

 export function setupTabs() {

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

 if (!state.isRestoringModalTab && state.currentVerbInModal && verbModal.classList.contains('visible')) {

 maybeLoadExamplesForActiveTab(state.currentVerbInModal, tabId);

  }

  if (!state.isRestoringModalTab) {

    // openConjugationSubModal(tabId);

  }

  });

  });

 // Initialize

 updateCarousel();

 window.addEventListener('resize', updateCarousel);

 }

 // --- THEME MODAL FUNCTION ---

 export async function openThemeModal(optLevelKey, optGroupIndex) {

 if ('speechSynthesis' in window) {

 window.speechSynthesis.cancel();

 }

 // Read explicitly passed variables or fallback to the global UI state

 const levelKey = (typeof optLevelKey === 'string') ? optLevelKey : state.currentLevel;

 const groupIndex = (typeof optGroupIndex === 'number') ? optGroupIndex : state.currentGroupInLevel;

 const groupNum = groupIndex + 1; // 1-indexed

 // Use pre-loaded group data from memory

 const groupData = state.verbGroupsByLevel[levelKey][groupIndex];

 if (!groupData) {

 console.error(`Group data not found for ${levelKey} group index ${groupIndex}`);

 return;

 }

 state.currentThemeData = groupData;

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

 // --- TTS FUNCTION ---

 export function speak(text, lang = 'de-DE', rate = 0.9) {

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

 // --- UPDATED MODAL FUNCTION WITH LAZY LOADING ---

 export const openModalForVerb = async function (verb, options = {}) {

 const { skipDeferredReload = false, skipExampleReload = false, preferredTab = null } = options;

 const data = state.allVerbsData[verb];

 if (!data) return;

 state.currentVerbInModal = verb;

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

 const updatedData = state.allVerbsData[verb];

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

 const token = ++state.modalDeferredLoadToken;

 loadVerbModalDeferredData(verb)

 .then(() => {

 if (state.modalDeferredLoadToken !== token || state.currentVerbInModal !== verb) return;

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
