/** Constants and DOM references shared by the verben modules. Moved verbatim from script.js. */


 export let searchScope = 'verbs'; // 'verbs' or 'wortfamilie'




 export const levelOrder = ['A1', 'A2', 'B1', 'B2'];

 export let currentIndexInModal = 0;

export const PRELOAD_CONJUGATIONS_IN_BACKGROUND = true;

export const PRELOAD_CONJUGATIONS_SCOPE = 'current-group';

export const lazyExampleLoadPromises = new Map();

 // --- DOM ELEMENTS ---

 export const mainContainer = document.getElementById('main-container');

 export const cardsContainer = document.getElementById('cards-container');

 export const levelIndicator = document.getElementById('level-indicator');

 export const controlsContainer = document.querySelector('.controls-container');

 export const headerSearchContainer = document.querySelector('.controls-container .search-container');

 export const levelToggleContainer = document.querySelector('.level-toggle-container');

 export const levelToggleFooter = document.querySelector('.level-toggle-footer');

 export const levelToggleButtons = document.querySelectorAll('.level-toggle-footer .level-option');

 export const groupThemeIndicator = document.getElementById('group-theme-indicator');

 export const groupIndicator = document.getElementById('group-indicator');

 export const progressBar = document.getElementById('progress-bar');

 export const prevGroupBtn = document.getElementById('prev-group-btn');

 export const nextGroupBtn = document.getElementById('next-group-btn');

 export const navigationWrapper = document.querySelector('.navigation-wrapper');

 export const storyButton = document.getElementById('story-button');

 export const storyContainer = document.getElementById('story-container');

 export const storyContent = document.getElementById('story-content');

 export const searchInput = document.getElementById('verb-search');

 export const settingsBtn = document.getElementById('settings-btn');

 export const verbModal = document.getElementById('verb-modal');

 export const infoModal = document.getElementById('info-modal');

 export const closeVerbModalButton = document.getElementById('close-verb-modal');

 export const closeVerbModalXButton = document.getElementById('close-verb-modal-x');

 export const infoButton = document.getElementById('info-button');

 export const closeInfoModalButton = document.getElementById('close-info-modal');

 export const gustarButtonContainer = document.getElementById('gustar-button-container');

 export const gustarButton = document.getElementById('gustar-button');

 export const gustarModal = document.getElementById('gustar-modal');

 export const gustarCloseBtn = document.getElementById('gustar-close-btn');

 export const gustarCloseFooterBtn = document.getElementById('gustar-close-footer-btn');

 export const reflexiveButtonContainer = document.getElementById('reflexive-button-container');

 export const reflexiveButton = document.getElementById('reflexive-button');

 export const reflexiveModal = document.getElementById('reflexive-modal');

 export const reflexiveCloseBtn = document.getElementById('reflexive-close-btn');

 export const reflexiveCloseFooterBtn = document.getElementById('reflexive-close-footer-btn');

 // Theme modal elements

 export const themeModal = document.getElementById('theme-modal');

 export const closeThemeModalX = document.getElementById('close-theme-modal-x');

 export const closeThemeModalBtn = document.getElementById('close-theme-modal-btn');
