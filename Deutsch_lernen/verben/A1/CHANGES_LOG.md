# A1 Verbs Project - Changes Log

## Summary
This document tracks all major changes made to the A1 German verbs learning application.

## Changes Made

### 1. Pronoun Order in Modal (script.js:209-249)
- Changed pronoun display order to: ich, du, er, sie, es, wir, ihr, sie (plural), Sie (formal)
- Implemented via JavaScript array to avoid changing all JSON files
- Removed "(plural)" and "(formal)" labels from display

### 2. Added Examples Column (script.js:209-249)
- Added "Beispiel" column to Präsens Konjugation table
- Shows German example with English/Spanish translations
- Translations hidden by default, shown on hover with flag emojis (🇬🇧, 🇪🇸)

### 3. Hover Effect for Translations (styles.css:805-832)
- English and Spanish translations are italic and hidden by default
- Opacity transition effect on hover
- Flag emojis prefix each translation

### 4. Lazy Loading Implementation (script.js:62-68, 190-222)
- Initial page load now only fetches card JSON files (~100 files)
- Präsens and Perfekt data loaded on-demand when user clicks a verb card
- Reduced initial load from 300 to ~100 JSON files for better performance

### 5. Hide Auxiliary Verbs in Perfekt Forms (script.js:89-165, styles.css:834-837)
**Date**: 2025-11-07

- Auxiliary verbs (ist/hat) in German Perfekt are now hidden by default
- Auxiliary verbs (he/ha) in Spanish Perfekt are now hidden by default
- Both appear on hover with smooth text swap transition
- Example: "ist gegangen" displays as "gegangen" → hover shows "ist gegangen"
- Example: "he ido" displays as "ido" → hover shows "he ido"
- Always aligned to the left (no positioning tricks or empty space)

**Implementation**:
- JavaScript prepares short (participle only) and full (auxiliary + participle) versions
- Cards store both versions in `data-short` and `data-full` attributes
- Event listeners swap text content on mouseenter/mouseleave
- Hovering over either German or Spanish perfekt shows BOTH auxiliaries simultaneously

### 6. Added Spanish Pronoun Translations in Modal (script.js:277-333, styles.css:839-861)
**Date**: 2025-11-07

- Added Spanish translations for pronouns in the Präsens Konjugation table
- Each pronoun shows its Spanish equivalent below with 🇪🇸 flag
- Translations: ich→yo, du→tú, er→él, sie→ella, es→neutro, wir→nosotr@s, ihr→vosotr@s, sie→ell@s, Sie→usted(es)
- Spanish text is smaller, italic, and gray for visual hierarchy
- Spanish translations are hidden by default and appear on hover of the Pronomen cell
- Smooth opacity and max-height transition (0.3s)

### 7. Merged Conjugation Display in Modal (script.js:313-333, styles.css:853-874)
**Date**: 2025-11-07

- In Präsens Konjugation table, er/sie/es rows appear as one merged cell in the Konjugation column
- Conjugation text shown only in the middle (sie) row
- Similarly, sie (plural) and Sie (formal) rows appear merged in the Konjugation column
- Conjugation text shown only in the Sie (formal) row
- Borders removed between merged rows in the Konjugation column
- All rows still display their individual examples

**Visual result**:
```
Pronomen       | Konjugation | Beispiel
---------------|-------------|----------
er             |             | Er arbeitet als Arzt.
🇪🇸 él         |             |
sie            | arbeitet    | Sie arbeitet in einer Bank.
🇪🇸 ella       |             |
es             |             | Das Kind arbeitet an einem Projekt.
🇪🇸 neutro     |             |
wir            | arbeiten    | Wir arbeiten zusammen.
🇪🇸 nosotr@s   |             |
ihr            | arbeitet    | Ihr arbeitet am Wochenende.
🇪🇸 vosotr@s   |             |
sie            |             | Sie arbeiten in verschiedenen Firmen.
🇪🇸 ell@s      |             |
Sie            | arbeiten    | Sie arbeiten sehr professionell.
🇪🇸 usted(es)  |             |
```

### 8. Added Search Feature for Verb Cards (index.html:25-28,44, script.js:353-502, styles.css:577-646)
**Date**: 2025-11-08

- Added search input box next to Perfekt toggle in header
- Live filtering as you type (minimum 2 characters required)
- **Searches across ALL groups** (not just current group)
- Searches in both German verb infinitive and Spanish translation
- Partial match anywhere in the text
- Maximum 9 matching verbs displayed at once
- Clear button (×) appears when typing
- Match counter shows number of results (e.g., "5 Verben gefunden" or "9 von 15 Verben angezeigt")
- "Keine Verben gefunden" message when no matches
- Clear button restores the current group view
- Cards display dynamically based on search results

**UI Features**:
- Search box with blue border matching theme
- Clear button positioned inside input (right side)
- Counter displayed above cards container
- Smooth transitions and focus states
- Perfekt hover functionality works on search results

### 9. Updated A2.1 Verb Levels (63 verbs in groups 10-16)
**Date**: 2025-11-08

- Corrected level classification for all verbs in groups 10-16 (Zehnte to Sechzehnte Gruppe)
- Updated 17 verbs that had incorrect levels (A1.1, A1.2, or A2.2) to A2.1
- Groups 10-16 now consistently show A2.1 level

**Updated verbs**:
- Group 10: anrufen, beginnen, erzählen, glauben, reisen
- Group 11: aufstehen, einkaufen, mitbringen, anfangen
- Group 12: abholen, mitkommen, erklären, bekommen, besuchen
- Group 14: halten, scheinen
- Group 15: raten

### 9b. Added Missing Präsens Conjugation Tables for A2.1 Verbs
**Date**: 2025-11-08

- Added missing `praesens` conjugation tables for 9 A2.1 verbs
- These verbs had examples but were missing the conjugation table, preventing the Präsens Konjugation modal from displaying
- All A2.1 verbs now show properly in the modal

**Fixed verbs**:
- Group 15: unterhalten
- Group 16: putzen, singen, weinen, schenken, träumen, üben, zeichnen, schneien

### 10. Fixed A1.1 Verb Examples (43 verbs)
**Date**: 2025-11-07

Updated all A1.1 verbs with properly differentiated examples:

**Verbs Updated**:
- sein, haben, werden, machen, geben, sagen, gehen, kommen, sehen
- sprechen, kaufen, essen, trinken, lesen, schreiben, hören, fragen, bezahlen
- arbeiten, lernen, wohnen, leben, schlafen, fahren, fliegen, heißen, rauchen
- wissen, kennen, denken, glauben, finden, suchen, bringen, kosten, brauchen
- dürfen, müssen, wollen, sollen, mögen, können, möchten

**Key Changes**:
- er/sie/es pronouns now have COMPLETELY different examples (not just pronoun variations)
- sie (plural) and Sie (formal) are clearly differentiated with distinct contexts
- All examples are affirmative statements (no questions)
- All examples use A1-A2 appropriate vocabulary

**Example - "arbeiten"**:
- er: "Er arbeitet als Arzt." (He works as a doctor)
- sie: "Sie arbeitet in einer Bank." (She works in a bank)
- es: "Das Kind arbeitet an einem Projekt." (The child works on a project)
- sie (plural): "Sie arbeiten in verschiedenen Firmen." (They work in different companies)
- Sie (formal): "Sie arbeiten sehr professionell." (You work very professionally)

## Known Issues

### Verbs Missing Präsens Conjugation Tables
The following verbs are missing their `praesens` conjugation data entirely:
- öffnen
- wegwerfen
- mieten
- übernachten
- (possibly more)

These need to be added to their respective JSON files.

## File Structure

```
json/
├── cards/          # Basic verb card data (loaded initially)
├── praesens/       # Präsens conjugations and examples (lazy loaded)
└── perfekt/        # Perfekt examples (lazy loaded)
```

## Next Steps (Pending)

1. Address verbs missing `praesens` conjugation tables
2. Consider reviewing remaining A2 verbs for example quality
