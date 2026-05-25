# MemoDeutsch - Developer Guide & Code Conventions

## Build & Sincronization Commands
Run the following scripts in the `verben/A1_A2_B1` directory to synchronize and validate the database:
- **Compile Index**: `node update_index.js`
- **Synchronize Groups**: `node sync_card_groups.js`
- **Verify Inventory**: `node verify_inventory.js`
- **Wortfamilie Index**: `node generate_wortfamilie_index.js` (runs from the parent `verben/A1_A2_B1` or `verben` directory depending on target)

## Coding & Formatting Conventions

### 1. Bold Highlights in Examples (`<b>`)
- **Separable Prefixes**: In German question files (`json/examples/praesens_question_examples/*.json`), separable prefixes must always be wrapped in `<b>` tags (e.g. `Was fange ich <b>an</b>?`).
- **Idioms**: Highly common phrases or idioms should keep their bold highlight (e.g. `<b>Wie geht es dir?</b>`).
- **Do not delete or strip these tags** when writing or modifying example json files.

### 2. Search Highlighting Safety in `script.js`
- Never apply regex-based query highlighting (`highlightMatch`) directly to strings containing HTML formatting tags (like the result of `formatVerbPrefix`). Doing so corrupts the HTML tags (such as matching inside attributes and producing broken tags like `separable-prefix">`).
- Use the `highlightVerbName(verbName, query)` helper in `script.js` instead. It processes prefixes and suffixes independently and joins them safely inside the HTML span wrapper.
