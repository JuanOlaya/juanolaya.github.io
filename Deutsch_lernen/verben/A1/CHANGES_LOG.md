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

### 6. Merged er/sie/es Conjugation Display in Modal (script.js:279-293, styles.css:839-851)
**Date**: 2025-11-07

- In Präsens Konjugation table, er/sie/es rows now appear as one merged cell in the Konjugation column
- Conjugation text shown only in the middle (sie) row
- Borders removed between these three rows in the Konjugation column
- All three rows still display their individual examples

**Visual result**:
```
Pronomen | Konjugation | Beispiel
---------|-------------|----------
er       |             | Er arbeitet als Arzt.
sie      | arbeitet    | Sie arbeitet in einer Bank.
es       |             | Das Kind arbeitet an einem Projekt.
```

### 7. Fixed A1.1 Verb Examples (43 verbs)
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
