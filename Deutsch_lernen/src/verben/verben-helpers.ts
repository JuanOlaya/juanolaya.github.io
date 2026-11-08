/**
 * Entry of `verben/A1_A2_B1/script/verben-helpers.js`, the classic script that `verben.html` loads before
 * `script.js`. The legacy script calls these helpers by their bare names, so they are published as globals
 * under exactly those names until the page itself becomes a module.
 */
import { legacyGlobals } from './legacy-globals.ts';

Object.assign(globalThis, legacyGlobals);
