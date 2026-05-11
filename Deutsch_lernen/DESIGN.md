---
colors:
  brand:
    sky: "#85D4FF"
    steelBlue: "#4682B4"
    mediumSeaGreen: "#3CB371"
  levels:
    a1_1: "#4682B4"
    a1_2: "#3CB371"
    a2_1: "#3a7ca5"
    a2_2: "#FF8C42"
    b1_1: "#9B59B6"
    b2_1: "#EF476F"
  modes:
    compact_dark:
      bg: "#0f172a"
      card_bg: "#1e293b"
      accent: "#22c55e"
    compact_light:
      bg: "#f8fafc"
      card_bg: "#ffffff"
      accent: "#16a34a"
typography:
  fontFamilies:
    primary: "Nunito, sans-serif"
    heading: "Poppins, sans-serif"
    handwriting: "Kalam, Patrick Hand"
spacing:
  radii:
    container: "20px"
    modal: "8px"
---

# Deutsch Lernen - Design System

This document is the "single source of truth" for the visual identity and design system of the Deutsch Lernen application. All AI coding agents and human developers must adhere to these guidelines to prevent design drift.

## Data Structure Rules
* **Max Items:** A maximum of **7 verbs per thematic group**. This is a strict cognitive load rule to prevent overwhelming the user.

## Component Anatomy: Verb Group Cards (Kompakt Mode)
The "Verb Group Card" (`.kompakt-level-card`) is the core layout element for presenting verbs grouped by theme within the Verben section.

1. **Header/Top:**
   * Contains the thematic group name (e.g., "Existenz", "Modalverben").
   * **Color Rule:** The background color of the header must be assigned dynamically based on the group's specific **Theme Color**, ensuring strong visual differentiation between groups.
2. **Body/List:**
   * A sequential list of up to 7 verbs.
   * **German Word (Deutsch):** Positioned prominently, usually on the left, using a bold weight.
   * **Tags:** Badges (e.g., `IK`, `A1`, `refl`) must be positioned immediately adjacent to the German word.
   * **Translation (Spanish/English):** Displayed prominently on the opposite side (right-aligned) to create a clean tabular look.
3. **Footer/Bottom:**
   * Contains the level badge (e.g., "A1") and the label "verbos".
   * **Color Rule:** The background color of the footer **must match exactly** the dynamic Theme Color of the Header to frame the card visually.

## Component Anatomy: Modals & Detail Views
* **Header/Top:** Global and Case Tags ("A1.1", "Regular", "Separable") are strictly positioned at the top of the modal or card header.
* **Primary Term:** The German word is centered and uses the heading typography.
* **Translation:** Displayed below the primary German word, using an italicized or slightly muted font for visual hierarchy.
* **Tabs:** Navigation tabs (Infinitiv, Perfekt, Präteritum, Konjunktiv II) are visually connected to the content area below them, forming a folder-like appearance.

## Interaction & State
* **Hover Effects:** Interactive elements (buttons, rows) should have subtle hover effects, such as a slight scale transformation (`transform: scale(1.05)`) or background opacity changes.
* **Dark/Light Mode:** The Compact View supports dedicated dark (`.compact-view`) and light (`.compact-light-mode`) palettes. Ensure adequate contrast for text against the dynamic theme colors in both modes.
