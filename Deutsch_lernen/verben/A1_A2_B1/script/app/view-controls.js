/** Tag filters and the view / language switches. Moved verbatim from script.js. */
import { performSearch } from './search.js';
import { searchInput } from './shared.js';
import { state } from './state.js';
import { renderVerbGroup } from './views.js';


 // --- TAG FILTER IMPLEMENTATION ---

 export function generateTagFilters() {

 const container = document.getElementById('tag-filters-container');

 if (!container) return;

 container.innerHTML = ''; // Clear existing

 const allTags = new Set();

 const tagCounts = {};

 // Collect tags

 Object.values(state.allVerbsData).forEach(verb => {

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

 export const viewSwitchers = document.querySelectorAll('input[name="card-version"]');

 // --- LISTENER FOR ENGLISH TOGGLE ---

 export const enSwitch = document.getElementById('en-switch');

/** Start-up listeners of this part of the page, attached in the original order by script.js. */
export function wireViewSwitches() {

 viewSwitchers.forEach(radio => {

 radio.addEventListener('change', () => {

 renderVerbGroup();

 });

 });

 if (enSwitch) {

 enSwitch.addEventListener('change', () => {

 // Re-render if in Niedlich mode (or generally to update views)

 renderVerbGroup();

 });

 }
}
