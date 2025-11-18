# Changelog

All notable changes to the Deutsch Lernen project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [2025-01-18] - Swipe Navigation & Verb Reorganization

### Added
- **Swipe/Drag Navigation for Groups**
  - Touch support for mobile devices (swipe left/right to navigate between groups)
  - Mouse drag support for desktop (click and drag to navigate)
  - Visual feedback with resistance effect (40% resistance)
  - Smooth transitions and spring-back animation
  - Threshold of 80px to trigger group change
  - Files modified: `verben/A1/script/script.js`, `verben/A1/style/styles.css`

- **New Verbs Added to Group 12 (Zwölfte Gruppe)**
  - `brechen` (to break) 💔
  - `spazieren` (to stroll) 🚶‍♀️
  - Created complete conjugation files for both verbs:
    - `verben/A1/json/cards/brechen.json`
    - `verben/A1/json/cards/spazieren.json`
    - `verben/A1/json/praesens/brechen.json`
    - `verben/A1/json/praesens/spazieren.json`
    - `verben/A1/json/perfekt/brechen.json`
    - `verben/A1/json/perfekt/spazieren.json`
    - `verben/A1/json/perfekt_konjugation/brechen.json`
    - `verben/A1/json/perfekt_konjugation/spazieren.json`
    - `verben/A1/json/praesens_fragen/brechen.json`
    - `verben/A1/json/praesens_fragen/spazieren.json`
    - `verben/A1/json/praeteritum_konjugation/brechen.json`
    - `verben/A1/json/praeteritum_konjugation/spazieren.json`

- **CSS Enhancements**
  - Added `cursor: grab` to cards container for better UX
  - Added `user-select: none` to prevent text selection during drag
  - Smooth transitions for transform and opacity (0.3s ease)

### Changed
- **Verb Group Reorganization**
  - `waschen`: Moved from Group 14 → Group 7 (Siebte Gruppe)
  - `packen`: Moved from Group 7 → Group 11 (Elfte Gruppe)
  - `putzen`: Moved from Group 17 → Group 7 (Siebte Gruppe)
  - Group 12 expanded from 6 to 8 verbs (now matches other groups)

### Fixed
- **Vertical Scroll Sensitivity**
  - Added detection for horizontal vs vertical movement
  - Swipe only triggers if `|deltaX| > |deltaY|`
  - Prevents accidental group navigation while scrolling vertically
  - Uses `preventDefault()` only for horizontal gestures

### Technical Details
- **Swipe Navigation Parameters:**
  - Swipe threshold: 80px
  - Resistance factor: 0.4 (40%)
  - Transition duration: 0.3s
  - Supports both touch and mouse events
  - Direction detection prevents scroll conflicts

- **Compatibility:**
  - Works on GitHub Pages (pure client-side JavaScript)
  - No backend or server required
  - Mobile and desktop compatible

---

## Future Considerations
- Consider adding keyboard navigation (arrow keys)
- Optional: Add haptic feedback for mobile devices
- Optional: Add swipe indicators/hints for first-time users
