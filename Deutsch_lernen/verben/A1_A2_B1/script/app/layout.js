/** Header, footer utility bar, level menu and search shell layout. Moved verbatim from script.js. */
import { controlsContainer, headerSearchContainer, levelToggleContainer, levelToggleFooter, searchInput, settingsBtn } from './shared.js';
import { state } from './state.js';


 export function setupModalHeaderLayout() {

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

 // Header Tags Toggle Listener

 export const modalTagsToggle = document.getElementById('modal-tags-toggle');

 export const mobileLevelMediaQuery = window.matchMedia('(max-width: 600px)');


 export function setupFooterUtilityBar() {

 if (!levelToggleContainer || !headerSearchContainer || !controlsContainer) return;

 const settingsButton = settingsBtn;

 if (settingsButton && settingsButton.parentElement === headerSearchContainer) {

 controlsContainer.appendChild(settingsButton);

 }

 state.footerUtilityBar = document.createElement('div');

 state.footerUtilityBar.className = 'footer-utility-bar';

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

 state.footerSearchPanel = footerSearch.querySelector('.footer-search-panel');

 state.footerSearchToggle = footerSearch.querySelector('#footer-search-toggle');

 headerSearchContainer.classList.add('footer-search-container');

 state.footerSearchPanel.prepend(headerSearchContainer);

 const settingsModal = document.getElementById('settings-modal');

 const footerParent = settingsModal?.parentElement || document.body;

 footerParent.insertBefore(state.footerUtilityBar, settingsModal || null);

 state.footerUtilityBar.appendChild(levelToggleContainer);

 state.footerUtilityBar.appendChild(footerSearch);

 state.footerSearchShell = footerSearch;

 }

 export function scheduleLevelMenuIdleCollapse() {

 clearTimeout(state.levelMenuIdleTimeout);

 if (!state.isLevelMenuExpanded || state.isFooterSearchExpanded) return;

 state.levelMenuIdleTimeout = setTimeout(() => {

 state.isLevelMenuExpanded = false;

 syncMobileLevelToggleState();

 }, 1800);

 }

 export function scheduleSearchIdleCollapse() {

 clearTimeout(state.searchIdleTimeout);

 if (!state.isFooterSearchExpanded || state.isFooterSearchForcedOpen) return;

 if (searchInput && searchInput.value.trim()) return;

 state.searchIdleTimeout = setTimeout(() => {

 if (searchInput && document.activeElement === searchInput) return;

 if (searchInput && searchInput.value.trim()) return;

 setFooterSearchExpanded(false);

 }, 1800);

 }

 export function setFooterSearchExpanded(expanded, { forced = false } = {}) {

 if (!state.footerSearchShell || !state.footerSearchToggle) return;

 state.isFooterSearchExpanded = expanded;

 state.isFooterSearchForcedOpen = forced ? expanded : (expanded && state.isFooterSearchForcedOpen);

 if (!expanded) {

 state.isFooterSearchForcedOpen = false;

 } else {

 state.isLevelMenuExpanded = false;

 }

 state.footerSearchShell.classList.toggle('footer-search-expanded', expanded);

 state.footerSearchShell.classList.toggle('footer-search-collapsed', !expanded);

 state.footerSearchToggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');

 if (expanded) {

 scheduleSearchIdleCollapse();

 } else {

 clearTimeout(state.searchIdleTimeout);

 }

 syncMobileLevelToggleState();

 }

 export function syncMobileLevelToggleState() {

    return; // disabled collapse

 if (!levelToggleFooter) return;

 const isMobile = mobileLevelMediaQuery.matches;

 const isCollapsed = !state.isLevelMenuExpanded || state.isFooterSearchExpanded;

 levelToggleFooter.classList.toggle('mobile-collapsed', isCollapsed);

 levelToggleFooter.classList.toggle('mobile-expanded', !isCollapsed);

 levelToggleFooter.classList.toggle('selector-collapsed', isCollapsed);

 levelToggleFooter.classList.toggle('selector-expanded', !isCollapsed);

 levelToggleFooter.classList.toggle('search-collapsed', state.isFooterSearchExpanded);

 levelToggleContainer?.classList.toggle('mobile-right-docked', isMobile);

 if (isCollapsed) {

 clearTimeout(state.levelMenuIdleTimeout);

 } else {

 scheduleLevelMenuIdleCollapse();

 }

 }

/** Start-up listeners of this part of the page, attached in the original order by script.js. */
export function wireModalTagsToggle() {

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
}
