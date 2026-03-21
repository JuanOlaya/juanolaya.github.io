# Codex Handover Report

## Encoding Rule

All JSON, JS, CSS, and HTML files in this module must be saved as `UTF-8`.

Do not introduce character corruption in German or Spanish text. In particular, preserve characters such as:

- `ä`, `ö`, `ü`, `Ä`, `Ö`, `Ü`
- `ß`
- accented Spanish vowels and `ñ`
- inverted punctuation such as `¿` and `¡`

After bulk edits, always verify that no corrupted sequences were introduced, especially:

- `Ã`
- `Â`
- `�`

If any of those sequences appear in user-facing German or Spanish text, treat it as a regression and fix it before closing the task.

## Cache And Versioning

Current cache structure is aligned to `v35`.

When content changes affect what the app loads:

- keep cache/version references aligned
- update `lastUpdated` in `json/verbs_index.json`
- make sure the page still resolves the current content version correctly

## Safety Note

If a script is used for encoding recovery, verify the resulting files manually in a sample of affected verbs/groups before finishing.
