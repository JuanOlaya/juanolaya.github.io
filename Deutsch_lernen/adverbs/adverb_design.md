# Standard Card Design System ("The Slate-Mint Theme")

## 1. Color Palette & Theming (CSS Variables)
The design is built on a dark mode first approach (using Slate colors), with a bright green accent (`--accent-green: #22c55e`). Light mode overrides these values.

```css
:root {
    /* --- DEFAULT DARK MODE PALETTE --- */
    --bg-color: #0f172a;        /* Slate 900 */
    --card-bg: #1e293b;         /* Slate 800 */
    --header-bg: #020617;       /* Slate 950 */
    --section-bg: #0f172a;      /* Slate 900 */
    --rule-bg: linear-gradient(135deg, #0f172a 0%, #0c4a6e 100%);
    --text-main: #f1f5f9;       /* Slate 100 */
    --text-muted: #94a3b8;      /* Slate 400 */
    --border-color: #334155;    /* Slate 700 */
    --shadow-color: rgba(0, 0, 0, 0.5);
    --glow-strength: 20px;
    --accent-green: #22c55e;
    --font-main: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

/* --- LIGHT MODE OVERRIDES --- */
body.light-mode {
    --bg-color: #f1f5f9;
    --card-bg: #ffffff;
    --header-bg: #ffffff;
    --section-bg: #e2e8f0;
    --rule-bg: linear-gradient(135deg, #ffffff 0%, #e0f2fe 100%);
    --text-main: #1e293b;
    --text-muted: #64748b;
    --border-color: #cbd5e1;
    --accent-green: #059669;
    --shadow-color: rgba(0, 0, 0, 0.1);
    --glow-strength: 0px;
}
```

## 2. Main Layout Structure
- **Body Context**: The app is centralized vertically via `min-height: 100vh; display: flex; box-sizing: border-box`. Padding is applied globally (`padding: 20px; padding-bottom: 80px`).
- **Container**: Max width of `1200px` (`.container`), housing the full structure.
  - Background: `var(--card-bg)`
  - Border-Radius: `24px`
  - Deep Box Shadow: `0 20px 25px -5px var(--shadow-color), 0 10px 10px -5px var(--shadow-color)`

### Mobile Responsiveness (Grid)
- **Grid Layout**: Features `grid-template-columns: repeat(auto-fit, minmax(320px, 1fr))` wrapped via `.grid-layout` with a `gap: 30px` and `padding: 40px`.
- **Mobile (<850px)**: Falls back to 1 Column. Reduces padding to `padding: 20px`.
- **Desktop (>1100px)**: Enforces exactly 3 Columns.

## 3. Header & Controls
- **Typography Engine**:
  - Global font uses `-apple-system...` sans-serif fallbacks. 
  - The `<h1>` features neon-glowing typography (`text-shadow` using `--glow-strength`) scaled to `2.2rem` with Extra Bold 800 weight, slightly tight spacing (`letter-spacing: -0.025em`) and uppercase formatting.
- **Search Bar**: 
  - Standard state: Fully rounded `border-radius: 50px`.
  - Focus state: A glowing green border/box-shadow (`:focus { box-shadow: 0 0 0 3px rgba(0, 255, 161, 0.2); }`).
- **Floating Controls Container**: Positioned absolute (`top: 20px; right: 20px;`) aligning children to the right (`align-items: flex-end`). Includes Theme toggle and language toggle (`.lang-toggle`), fully pill-rounded (`border-radius: 50px`) using the internal background color tracking active states with high z-index.
- **Info Button**: Employs a `pulse-orange` CSS keyframe animation sequence for high visibility:
```css
@keyframes pulse-orange {
    0% { box-shadow: 0 0 0 0 rgba(249, 115, 22, 0.4); }
    70% { box-shadow: 0 0 0 10px rgba(249, 115, 22, 0); }
    100% { box-shadow: 0 0 0 0 rgba(249, 115, 22, 0); }
}
```

## 4. Layout Rules (The `.level-card`)
A semantic grouping container:
-   **Design Specs**: Uses border radius `16px`, a slight border `1px solid var(--border-color)`, and a soft drop shadow (`box-shadow: 0 10px 15px -3px var(--shadow-color)`).
-   **Hover Effect**: Lifts elements smoothly via `transform: translateY(-5px)` supported by a generic `0.2s` transition.

### Card Body Requirements
-   **Table Architecture (Rows)**: 
    - Text color variables `var(--text-main)` (`slate-100/900`) targeting `.german-word`.
    - `font-size: 1.1rem`, and `font-weight: 700`.
    - Secondary language items `.spanish-word` size down to `0.9rem` with italics mapping exactly to `--text-muted`.
    - Clickable text features a text underline hover state. 
-   **Strict 6-Word Limit & Card Pagination**: 
    - A single `.level-card` **must never contain more than 6 words**.
    - If a semantic group (e.g., "Frequency") contains 7 or more items, the JavaScript rendering logic must split the items into **multiple, separate cards**.
    - When this split occurs, the **card title must include a pagination marker** appended to the group name.
        - Example 1: `Frequency (1/2)`
        - Example 2: `Frequency (2/2)`
        - Example 3: `Local (1/3)`, `Local (2/3)`, etc.

## 5. Grouping Strategy
Words are grouped by semantic function. Each group is assigned a unique **Theme Color** (`colorMain` property) for its header background targeting the `.level-header` DOM element, which ensures high text contrast by using `white` font indiscriminately.

**Standard Palette for Categories:**
- **Frequency**: `#8b5cf6` (Purple)
- **Local (Place)**: `#ec4899` (Pink)
- **Modal/Causal**: `#f59e0b` (Amber)
- **Number/Quantity**: `#ea580c` (Orange)
- **Ordinal**: `#22C55E` (Green)
- *Note: New categories should pick a distinct vibrant hue to maintain this pattern.*

## 6. Icons & Media Details
- **Speaker Icon (🔊)**: Bound to `.audio-icon` mapped via CSS filter manipulation: `filter: grayscale(1); opacity: 0.7;`.
- **Interaction Rules**: Hover un-tints the image (`grayscale(0)`) and sets opacity back to `1`.
- **Density Restraint**: Displayed **ONLY** on the **first item** of each card.

## 7. Search Functionality
-   **Scope & Matching**: Filters by German word and English/Spanish translations.
-   **Chunk-Level Filtering (Full Card Display)**: 
    - Search does **not** filter out individual rows. Instead, it operates on a "Card/Chunk Level".
    - If a search query matches *at least one* word in a card, **the entire card (up to 6 items) is rendered**, showing the matched item alongside its original grouped neighbors.
    - If an entire card contains zero matches, that specific card is hidden entirely.
-   **Visual Feedback**:
    -   Matches within the rendered cards are **highlighted dynamically** using `.replace()` logic in JS to inject a span containing: `background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); color: #6e4e00;`.
    -   **Whole-Word Highlighting**: Instead of highlighting only the exact query substring, the system uses a Regex `([\\wäöüÄÖÜß]*${escapedQuery}[\\wäöüÄÖÜß]*)` to capture the entire word containing the match (including German umlauts) so the full word background is highlighted seamlessly.

## 8. Modal Window Design
An overlaid popover to focus detailed grammar content triggered by generic clicks across any row item (`.level-content table tr`).
-   **Backdrop (`.modal-overlay`)**: Built with strict layout specs `rgba(0, 0, 0, 0.85)` and hardware-accelerated filters: `backdrop-filter: blur(5px)`.
-   **Entry Animation (`@keyframes modalFadeIn`)**: 
```css
@keyframes modalFadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}
```
-   **Content Container Box Aesthetics (`.modal-content`)**:
    -   Max frame width `500px`.
    -   Radius: `20px`
    -   Neon Border: `1px solid var(--accent-green)` matched exactly to `box-shadow: 0 0 30px rgba(0, 255, 161, 0.2)`. 
-   **Scrollbar Design**: Contains custom web-kit rules injecting `--accent-green` on thumb scrollbars bounding overflow limits to `max-height: 85vh`.
-   **"Ganz" Unique Logic**: A programmatic Javascript block replacing standard node tree appending within `#adverbModal` mapping strictly against "ganz", loading custom 5-column HTML table rows demonstrating absolute scaling syntax.

## 9. Application
This system should be applied to:
-   `adverbs/adverbien.html` (Completed)
-   `adjektive/adjektive.html` (Next Target)
-   Any future vocabulary lists utilizing the semantic card system.
