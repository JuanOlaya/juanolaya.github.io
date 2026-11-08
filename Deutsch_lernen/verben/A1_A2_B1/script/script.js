/**
 * Entry of verben.html. The page logic lives in the ES modules under `app/`; this file runs their start-up
 * steps in the order the former single DOMContentLoaded closure did.
 */
import { renderCardBackMenu, renderCardBackSubTabTable, renderCardBackTabContent, renderWortschatzList, showVerbDetailsInCard, updateCompactView } from './app/card-back.js';
import { wireConjugationSubModal } from './app/conjugation-modal.js';
import { initializeApp } from './app/init.js';
import { setupFooterUtilityBar, setupModalHeaderLayout, wireModalTagsToggle } from './app/layout.js';
import { wireSearchControls } from './app/search.js';
import { openModalForVerb, openThemeModal, speak } from './app/verb-modal.js';
import { wireViewSwitches } from './app/view-controls.js';

document.addEventListener('DOMContentLoaded', () => {
  setupModalHeaderLayout();
  wireModalTagsToggle();
  setupFooterUtilityBar();
  window.openThemeModal = openThemeModal;
  window.speak = speak;
  window.openModalForVerb = openModalForVerb;
  wireSearchControls();
  initializeApp();
  wireViewSwitches();
  wireConjugationSubModal();
  window.showVerbDetailsInCard = showVerbDetailsInCard;
  window.renderCardBackMenu = renderCardBackMenu;
  window.renderCardBackTabContent = renderCardBackTabContent;
  window.renderWortschatzList = renderWortschatzList;
  window.renderCardBackSubTabTable = renderCardBackSubTabTable;
  window.updateCompactView = updateCompactView;
});
