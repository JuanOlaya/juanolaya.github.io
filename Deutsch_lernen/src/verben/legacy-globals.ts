import {
  globalGroupIndex,
  levelsFromGroups,
  pageSizeForWidth,
  physicalGroupData,
  themeColorForVerb,
} from './level-layout.ts';
import { normalizeMojibakeDeep, normalizeMojibakeString } from './mojibake.ts';
import { getMatchHint, highlightBaseVerb, highlightMatch, highlightVerbName } from './search-highlight.ts';
import { findMatchingTextEntry, findMatchingWordInText, normalizeSearchValue } from './search.ts';
import { hexToRgb, mixHexColors, rgbToHex } from './theme-colors.ts';
import {
  getCardTranslation,
  getCardTranslationLines,
  getPrimaryTranslation,
  removeParentheses,
} from './translations.ts';
import { compactToLevel, lightweightVerbData } from './verb-cache.ts';
import {
  getExampleLoadKey,
  mergeVerbData,
  normalizeModalTabId,
  parseJsonUtf8,
  tabNeedsLazyExamples,
} from './verb-data-merge.ts';
import { cleanVerbForm, conjugateBaseForm, getCleanPerfekt, getCleanPraeteritum } from './verb-forms.ts';
import {
  germanExampleOrdinals,
  germanOrdinals,
  konjunktivVerbs,
  savedStories,
  standardColors,
} from './verben-data.ts';
import { formatVerbPrefix, separablePrefixesMap } from './verb-prefix.ts';

/** Helpers that `script.js` calls by their bare names, keyed by those names. */
export const legacyGlobals = {
  separablePrefixesMap,
  formatVerbPrefix,
  hexToRgb,
  rgbToHex,
  mixHexColors,
  normalizeMojibakeString,
  normalizeMojibakeDeep,
  normalizeSearchValue,
  findMatchingWordInText,
  findMatchingTextEntry,
  removeParentheses,
  getPrimaryTranslation,
  getCardTranslation,
  getCardTranslationLines,
  getCleanPerfekt,
  getCleanPraeteritum,
  cleanVerbForm,
  conjugateBaseForm,
  lightweightVerbData,
  compactToLevel,
  savedStories,
  germanOrdinals,
  germanExampleOrdinals,
  standardColors,
  konjunktivVerbs,
  physicalGroupData,
  globalGroupIndex,
  themeColorForVerb,
  levelsFromGroups,
  pageSizeForWidth,
  mergeVerbData,
  parseJsonUtf8,
  getExampleLoadKey,
  normalizeModalTabId,
  tabNeedsLazyExamples,
  highlightMatch,
  highlightBaseVerb,
  highlightVerbName,
  getMatchHint,
};
