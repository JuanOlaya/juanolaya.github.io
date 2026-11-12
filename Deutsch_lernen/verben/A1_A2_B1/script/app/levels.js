/** Level layout and group theme colours over the shared level state. Moved verbatim from script.js. */
import { state } from './state.js';



 export function getPhysicalGroupData(macroLevel, globalIndex) {
    return physicalGroupData(state.physicalLevelMap, macroLevel, globalIndex);
  }

  export function getGlobalGroupIndex(levelStr, localGroupNumber) {
    return globalGroupIndex(state.physicalLevelMap, levelStr, localGroupNumber);
  }

  export function getThemeColorForVerbData(verbData) {
    return themeColorForVerb(state.physicalLevelMap, verbData);
  }

export function applyModalThemePalette(verbData) {

 const modalContentEl = document.querySelector('#verb-modal .modal-content');

 const modalHeaderEl = document.querySelector('#verb-modal .modal-header');

 if (!modalContentEl) return;

 const themeColor = getThemeColorForVerbData(verbData);

 const softColor = mixHexColors(themeColor, '#33333d', 0.78);

 const paleColor = mixHexColors(themeColor, '#33333d', 0.9);

 const strongColor = mixHexColors(themeColor, '#1a1a1a', 0.22);

 const borderColor = mixHexColors(themeColor, '#41414e', 0.55);

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

 export function autoConfigureLevelsFromGroups(groupsArray) {
    const layout = levelsFromGroups(groupsArray, state.physicalLevelMap);
    if (!layout) return;
    state.physicalLevelMap = layout.physicalLevelMap;
    state.levelConfig = layout.levelConfig;
  }
