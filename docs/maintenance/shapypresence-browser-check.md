# ShapyPresence browser check (2026-11-12)

Page: `/EurekaWall/pixelGrid/`, served with `vite` dev, driven by Playwright 1.65 (Firefox 1572 build, WebKit 2388 build).

| Context | Result |
| --- | --- |
| Firefox desktop 1280x800 | Renders, mouse paint works, 44 px targets, no console errors (only p5 "orientation/motion sensor deprecated" warnings from p5 itself). |
| WebKit desktop 1280x800 | Renders, mouse paint works, no console errors. |
| WebKit iPhone 13 / SE / 13 landscape (touch, DPR 2-3) | Canvas fills the stage, `100dvh` grid has no page scroll, toolbar is one horizontally scrolling row, real touch tap fires `pointerdown`/`pointerup` and paints, no errors. |

Notes:

- Synthetic `PointerEvent`s dispatched by script throw `NotFoundError` from `setPointerCapture` (no active pointer). Real touches do not; no code change needed.
- Not tested: a physical iOS Safari device (dynamic toolbar, safe-area inset, multi-finger pinch with real fingers). Emulated WebKit only approximates it.
