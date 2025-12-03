# How to Add New Groups - Step-by-Step Guide

## Overview
This guide explains how to add new verb groups to any level (A1.1, A1.2, A2.1, A2.2, B1.1).

---

## Quick Reference: What Needs to be Updated

When adding a new group, you need to update **3 things**:

1. **Group JSON file** - Create the new group file
2. **JavaScript config** - Update `levelConfig` in `script.js`
3. **Changelog** - Document the change in `CHANGELOG.md`

---

## Step-by-Step Instructions

### Step 1: Decide Group Position

**Question:** Where should the new group go?

- At the end of a level (easiest)
- Between existing groups (requires renaming)

**Example:** Adding a new group to A1.2 at the end (becomes group 10)

---

### Step 2: Create the Group JSON File

**Location:** `json/groups/{LEVEL}/{LEVEL}_group_{N}.json`

**Template:**
```json
{
    "level": "A1.2",
    "theme": "Your Theme Name",
    "verbs": [
        "verb1",
        "verb2",
        "verb3"
    ]
}
```

**Example:** Creating A1_2_group_10.json
```json
{
    "level": "A1.2",
    "theme": "Technology",
    "verbs": [
        "tippen",
        "klicken",
        "laden"
    ]
}
```

**File path:**
```
C:\Users\juan\Documents\GitHub\juanolaya.github.io\Deutsch_lernen\verben\A1\json\groups\A1_2\A1_2_group_10.json
```

---

### Step 3: Update JavaScript Configuration

**File:** `script/script.js`

**Find the levelConfig section** (around line 15):
```javascript
const levelConfig = {
    'A1_1': { groupCount: 8, displayName: 'A1.1' },
    'A1_2': { groupCount: 9, displayName: 'A1.2' },  // ← Update this number
    'A2_1': { groupCount: 9, displayName: 'A2.1' },
    'A2_2': { groupCount: 8, displayName: 'A2.2' },
    'B1_1': { groupCount: 1, displayName: 'B1.1' }
};
```

**Update the groupCount** for the level you're modifying:
```javascript
'A1_2': { groupCount: 10, displayName: 'A1.2' },  // Changed from 9 to 10
```

---

### Step 4: Update the Changelog

**File:** `CHANGELOG.md`

**Add entry at the top:**
```markdown
## 2025-12-04

### A1.2 Changes
- **Added Group 10**: "Technology" (at end of level)
  - New verbs: `tippen`, `klicken`, `laden`
  - Total groups: 9 → 10
```

---

## Advanced: Inserting a Group Between Existing Groups

If you need to insert a group **between** existing groups (not at the end), you need to **rename files**.

### Example: Insert new group 5 in A1.2

**Current situation:**
- Groups 1-9 exist
- Want to insert new group between 4 and 5

**Steps:**

1. **Rename existing files** (work backwards!):
   ```bash
   mv A1_2_group_9.json A1_2_group_10.json
   mv A1_2_group_8.json A1_2_group_9.json
   mv A1_2_group_7.json A1_2_group_8.json
   mv A1_2_group_6.json A1_2_group_7.json
   mv A1_2_group_5.json A1_2_group_6.json
   ```

2. **Create new group 5**:
   ```json
   {
       "level": "A1.2",
       "theme": "New Theme",
       "verbs": ["verb1", "verb2"]
   }
   ```

3. **Update levelConfig**: Change groupCount from 9 to 10

4. **Update changelog**: Document the insertion

---

## Moving a Verb Between Groups

### Steps:

1. **Find the verb** in current group:
   ```bash
   grep -r "verbname" json/groups/
   ```

2. **Remove from old group**:
   - Edit the old group's JSON file
   - Remove the verb from the "verbs" array

3. **Add to new group**:
   - Edit the new group's JSON file
   - Add the verb to the "verbs" array

4. **Update changelog**:
   ```markdown
   - Moved verb: `verbname` (from A1.2 Group 3 to A1.2 Group 7)
   ```

---

## Verifying Your Changes

After making changes, verify everything works:

1. **Check file names** are sequential:
   ```bash
   ls json/groups/A1_2/
   # Should show: A1_2_group_1.json, A1_2_group_2.json, etc.
   ```

2. **Test in browser**:
   - Open the app
   - Navigate to the level
   - Verify all groups load
   - Check the new group appears correctly

3. **Check console** for errors:
   - Open browser DevTools (F12)
   - Look for 404 errors (missing files)

---

## Common Issues & Solutions

### Issue: "Ein Fehler ist beim Laden der Verben aufgetreten"

**Cause:** JavaScript is trying to load a group file that doesn't exist

**Solution:**
- Check `levelConfig` matches actual number of files
- Verify file naming is sequential (no gaps)

### Issue: Group doesn't appear

**Cause:** File exists but levelConfig wasn't updated

**Solution:**
- Update `groupCount` in `script.js`
- Refresh browser (hard refresh: Ctrl+F5)

### Issue: Wrong group order

**Cause:** Files renamed incorrectly

**Solution:**
- List all files: `ls json/groups/{LEVEL}/`
- Verify sequential numbering
- Rename files if needed

---

## File Structure Reference

```
verben/A1/
├── json/
│   └── groups/
│       ├── A1_1/
│       │   ├── A1_1_group_1.json
│       │   ├── A1_1_group_2.json
│       │   └── ... (up to group_8.json)
│       ├── A1_2/
│       │   ├── A1_2_group_1.json
│       │   └── ... (up to group_9.json)
│       ├── A2_1/
│       ├── A2_2/
│       └── B1_1/
├── script/
│   └── script.js          ← Update levelConfig here
├── CHANGELOG.md           ← Document changes here
└── HOW_TO_ADD_GROUPS.md   ← This file
```

---

## Quick Checklist

Before committing changes:

- [ ] Created new group JSON file with correct naming
- [ ] Updated `levelConfig` in `script.js`
- [ ] Documented change in `CHANGELOG.md`
- [ ] Tested in browser
- [ ] No console errors
- [ ] All groups load correctly

---

## Example: Complete Workflow

**Task:** Add "Technology" group to A1.2 (as group 10)

```bash
# 1. Create the file
cat > json/groups/A1_2/A1_2_group_10.json << 'EOF'
{
    "level": "A1.2",
    "theme": "Technology",
    "verbs": ["tippen", "klicken", "laden"]
}
EOF

# 2. Edit script.js
# Change: 'A1_2': { groupCount: 9, ... }
# To:     'A1_2': { groupCount: 10, ... }

# 3. Update CHANGELOG.md
# Add entry for new group

# 4. Test in browser
# Navigate to A1.2 and verify group 10 appears
```

Done! 🎉
