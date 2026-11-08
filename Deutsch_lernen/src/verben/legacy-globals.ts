import { normalizeMojibakeDeep, normalizeMojibakeString } from './mojibake.ts';
import { findMatchingTextEntry, findMatchingWordInText, normalizeSearchValue } from './search.ts';
import { hexToRgb, mixHexColors, rgbToHex } from './theme-colors.ts';
import {
  getCardTranslation,
  getCardTranslationLines,
  getPrimaryTranslation,
  removeParentheses,
} from './translations.ts';
import { cleanVerbForm, conjugateBaseForm, getCleanPerfekt, getCleanPraeteritum } from './verb-forms.ts';
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
};
