/**
 * Loads MathJax from npm instead of the CDN. SVG output is used because it embeds the glyphs as
 * paths, so no font files have to be resolved from the bundle's URL.
 */
export async function typesetMath(element: HTMLElement): Promise<void> {
  // MathJax reads its configuration from the global before the script runs.
  window.MathJax = {
    tex: { inlineMath: [['\\(', '\\)']] },
    svg: { fontCache: 'global' },
    startup: { typeset: false },
  };
  await import('mathjax/es5/tex-svg.js');
  await window.MathJax.startup?.promise;
  await window.MathJax.typesetPromise?.([element]);
}
