/**
 * Type environment for `checkJs` on `verben/A1_A2_B1/script/script.js` (see `tsconfig.json` next to this file).
 * It is a separate project on purpose: the loose DOM shim below must not leak into the typed modules.
 */
import type { MemoStorage } from '../../storage/memo-storage.ts';
import type { legacyGlobals } from '../legacy-globals.ts';

type Helpers = typeof legacyGlobals;
/**
 * Handlers script.js defines on `window`. `any` on purpose: their parameters take their types from these
 * signatures, and the untyped legacy bodies would not check against anything narrower.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type LegacyHandler = (...args: any[]) => any;

declare global {
  // Published by `verben-helpers.js`, which `verben.html` loads before `script.js`.
  const memoStorage: MemoStorage;
  const separablePrefixesMap: Helpers['separablePrefixesMap'];
  const formatVerbPrefix: Helpers['formatVerbPrefix'];
  const hexToRgb: Helpers['hexToRgb'];
  const rgbToHex: Helpers['rgbToHex'];
  const mixHexColors: Helpers['mixHexColors'];
  const normalizeMojibakeString: Helpers['normalizeMojibakeString'];
  const normalizeMojibakeDeep: Helpers['normalizeMojibakeDeep'];
  const normalizeSearchValue: Helpers['normalizeSearchValue'];
  const findMatchingWordInText: Helpers['findMatchingWordInText'];
  const findMatchingTextEntry: Helpers['findMatchingTextEntry'];
  const removeParentheses: Helpers['removeParentheses'];
  const getPrimaryTranslation: Helpers['getPrimaryTranslation'];
  const getCardTranslation: Helpers['getCardTranslation'];
  const getCardTranslationLines: Helpers['getCardTranslationLines'];
  const getCleanPerfekt: Helpers['getCleanPerfekt'];
  const getCleanPraeteritum: Helpers['getCleanPraeteritum'];
  const cleanVerbForm: Helpers['cleanVerbForm'];
  const conjugateBaseForm: Helpers['conjugateBaseForm'];
  const lightweightVerbData: Helpers['lightweightVerbData'];
  const compactToLevel: Helpers['compactToLevel'];

  // script.js assigns this one to `window` and also calls it by its bare name.
  const openModalForVerb: Window['openModalForVerb'];

  /** State and handlers script.js shares through `window`, for inline `onclick` attributes and between views. */
  interface Window {
    /** Open Wortschatz tab per verb. */
    activeWortschatzTab: Record<string, string>;
    allCompactCards: HTMLElement[];
    currentCompactCardIndex: number;
    openModalForVerb: (verb: string, options?: Record<string, unknown>) => Promise<void>;
    openThemeModal: LegacyHandler;
    renderCardBackMenu: LegacyHandler;
    renderCardBackSubTabTable: LegacyHandler;
    renderCardBackTabContent: LegacyHandler;
    renderWortschatzList: LegacyHandler;
    showVerbDetailsInCard: LegacyHandler;
    speak: LegacyHandler;
    toggleTrick: LegacyHandler;
    updateCompactView: LegacyHandler;
    updateTabCarousel: LegacyHandler;
  }

  /*
   * Loose DOM shim: script.js treats every queried element as an HTMLElement or form control and every
   * event target as the element that fired it. Each property here should disappear as the code that relies
   * on it moves to a typed module and narrows at the query site.
   */
  interface Element {
    readonly style: CSSStyleDeclaration;
    readonly dataset: DOMStringMap;
    readonly offsetHeight: number;
    title: string;
    onclick: ((this: GlobalEventHandlers, ev: MouseEvent) => unknown) | null;
    click(): void;
    href: string;
    src: string;
    value: string;
    checked: boolean;
  }

  interface HTMLElement {
    value: string;
    checked: boolean;
    disabled: boolean;
    placeholder: string;
    open: boolean;
  }

  interface EventTarget {
    readonly id: string;
    readonly dataset: DOMStringMap;
    value: string;
    checked: boolean;
  }
}

export {};
