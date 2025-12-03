# Changelog - German Verbs Group Structure

## 2025-12-03

### A1.1 Changes
- **Added Group 7**: "Logistics" (between Commerce and Modals & Feelings)
  - Moved verb: `packen` (from A1.2 Travel group)
  - Total groups: 7 → 8
  - Group 7 (Modals & Feelings) renamed to Group 8

- **Modified existing groups**:
  - Group 2 "Daily Actions": Removed `suchen` and `finden` (moved to A1.2 City and living) - 9 verbs → 7 verbs
  - Group 6 "Commerce": Removed `mieten` (moved to A1.2 City and living) - 9 verbs → 8 verbs

### A1.2 Changes
- **Added Group 6**: "City and living" (between Travel and Speech Mechanics)
  - Total groups: 7 → 8 → 9
  - Groups 6-8 shifted to 7-9
  - **Populated with 6 verbs**:
    - `mieten` (moved from A1.1 Commerce)
    - `umziehen` (moved from A2.2 Transformation)
    - `parken` (moved from A1.2 Position & Placement)
    - `besuchen` (moved from A1.2 Travel)
    - `suchen` (moved from A1.1 Daily Actions)
    - `finden` (moved from A1.1 Daily Actions)

- **Added Group 8**: "Placement"
  - Moved verb: `leben` (from A1.1)
  - Initially created as 8th group

- **Reorganized groups**:
  - Moved "Position & Placement" from Group 3 to Group 7 (before Placement)
  - Groups 4-7 renumbered accordingly

- **Modified existing groups**:
  - Group 5 "Travel": Removed `besuchen` (moved to City and living)
  - Group 8 "Position & Placement": Removed `parken` (moved to City and living)

- **Final A1.2 structure** (9 groups):
  1. Social Connection
  2. Hygiene & Home
  3. Appearance & Response
  4. Transit
  5. Travel (7 verbs, was 8)
  6. City and living (NEW - 6 verbs)
  7. Speech Mechanics
  8. Position & Placement (7 verbs, was 8)
  9. Placement (NEW)

### A2.1 Changes
- **Added Group 4**: "Termin" (between Organization & Errands and Logic & Results)
  - Moved verb: `verschieben` (from A2.2 Admin & Appointments)
  - Total groups: 7 → 9
  - Groups 4-8 shifted to 5-9

- **Final A2.1 structure** (9 groups):
  1. Social Dynamics
  2. Leisure & Relaxation
  3. Organization & Errands
  4. Termin (NEW)
  5. Logic & Results
  6. Change & Impact
  7. Fate, Nature & Events
  8. Creativity & Emotion
  9. Identity & Meaning

### A2.2 Changes
- **Modified Group 8**: "Admin & Appointments"
  - Removed verb: `verschieben` (moved to A2.1 Termin)

- **Modified Group 1**: "Transformation"
  - Removed verb: `umziehen` (moved to A1.2 City and living) - 5 verbs → 4 verbs

### verbs_index.json Changes
- Introduced `groupNumberPerLevel` field (replaces global `groupNumber`)
- Each level now numbers groups independently (1-N per level)
- Updated `totalGroups`: 29 → 30
- Updated `totalVerbs`: 227 (net change: 0, just reorganization)

### JavaScript Configuration Changes
- Updated `levelConfig` in `script.js`:
  - A1.1: 7 → 8 groups
  - A1.2: 7 → 9 groups
  - A2.1: 7 → 9 groups
  - A2.2: 8 groups (unchanged)
  - B1.1: 1 group (unchanged)

- Updated `update_index.js`:
  - `totalGroups`: 29 → 30

---

## Change Summary by Level

| Level | Original Groups | Final Groups | Change |
|-------|----------------|--------------|--------|
| A1.1  | 7              | 8            | +1     |
| A1.2  | 7              | 9            | +2     |
| A2.1  | 7              | 9            | +2     |
| A2.2  | 8              | 8            | 0      |
| B1.1  | 1              | 1            | 0      |
| **Total** | **30**     | **35**       | **+5** |
