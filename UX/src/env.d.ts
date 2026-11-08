interface ImportMetaEnv {
  /** Gemini proxy base URL; overrides the `gemini-proxy-url` meta tag when set at build time. */
  readonly VITE_GEMINI_PROXY_URL?: string;
}

/** The subset of the MathJax 3 global this page configures and calls. */
interface MathJaxGlobal {
  tex?: Record<string, unknown>;
  svg?: Record<string, unknown>;
  startup?: { typeset?: boolean; promise?: Promise<void> };
  typesetPromise?: (elements?: HTMLElement[]) => Promise<void>;
}

interface Window {
  MathJax?: MathJaxGlobal;
}

declare module 'mathjax/es5/tex-svg.js';
