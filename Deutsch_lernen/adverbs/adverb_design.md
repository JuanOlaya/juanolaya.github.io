# Standard Card Design System ("The Slate-Mint Theme")

## Colors
- **Main Word**: `#CBF6DB` (Pale Mint Green) - Used for `.german-word` class.
- **Translation**: `#F3F4F7` (Off-White / Slate 50) - Used for `.spanish-word` class.
- **Hover Intent**: Text underline on main word.

## Layout Rules
1.  **Card Header**:
    -   Title text only.
    -   **NO** emojis in the header.
    -   Level indicators removed from title (moved to modal).
2.  **Card Body**:
    -   **Items per Card**: 6 items maximum.
    -   **Overflow Protocol (>6 items)**:
        -   If a category has > 6 words, it spawns **multiple cards**.
        -   Title tracks this: "Frequency (1/2)", "Frequency (2/2)".
        -   This ensures no card becomes too long or overwhelming.
    -   **Table Structure**:
        -   **NO** `<thead>` (No "German" / "Translation" column titles).
        -   Clean 2-column layout.

## Grouping Strategy
Words are grouped by semantic function (e.g., *Tempo*, *Lokale*, *Mood*). Each group is assigned a unique **Theme Color** for its header background to distinguish it visually.

**Standard Palette for Categories:**
- **Frequency**: `#8b5cf6` (Purple)
- **Local (Place)**: `#ec4899` (Pink)
- **Modal/Causal**: `#f59e0b` (Amber)
- **Number/Quantity**: `#ea580c` (Orange)
- **Ordinal**: `#22C55E` (Green)
- *Note: New categories should pick a distinct vibrant hue to maintain this pattern.*

The text colors inside the card body (Slate-Mint) remain consistent regardless of the header color.

3.  **Icons**:
    -   **Speaker Icon (🔊)**: Displayed **ONLY** on the **first item** of each card. Hidden for items 2-6.

## Search Functionality
-   **Scope**: Filters by **German Word** (Main) and **Translation** (Spanish/English).
-   **Behavior**: Real-time filtering as the user types.
-   **Matching**: Case-insensitive substring match.
-   **Visual Feedback**:
    -   Matches are **highlighted** with a gradient background (`linear-gradient(135deg, #fa709a 0%, #fee140 100%)`).
    -   Cards with no matches are hidden.
    -   Groups with no matching cards are hidden entirely.

## Typography & Hierarchy
-   **Font Stack**: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto...` (System UI).
-   **Weights**:
    -   **German Words**: 700 (Bold)
    -   **Translations**: 400 (Normal) + *Italic*
    -   **Titles**: 800 (Extra Bold)

## Mobile Responsiveness
-   **Grid**:
    -   **Mobile (<850px)**: 1 Column
    -   **Desktop (>1100px)**: 3 Columns
-   **Touch Targets**: Minimum 44px height for interactive elements.

## Animation & Interactions
-   **Card Hover**: `translateY(-5px)` with `0.2s ease` transition.
-   **Click Feedback**: Immediate Modal fade-in (`0.3s ease-out`).
-   **Glow Effects**: Used sparingly on active elements (Search, Headers).

## Modal Window Design
-   **Overlay**: `rgba(0, 0, 0, 0.85)` with `backdrop-filter: blur(5px)`.
-   **Content Box**:
    -   Background: `var(--card-bg)`
    -   Radius: `20px`
    -   Border: `1px solid var(--accent-green)`
    -   Shadow: `0 0 30px rgba(0, 255, 161, 0.2)` (Neon Glow)
-   **Level Indicator**: Placed prominently (implementation pending).

## Application
This system should be applied to:
-   `adverbs/adverbien.html` (Completed)
-   `adjektive/adjektive.html` (Next Target)
-   Any future vocabulary lists using the card system.
