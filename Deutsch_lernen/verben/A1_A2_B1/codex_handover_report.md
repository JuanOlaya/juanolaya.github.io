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

## Required Safe Workflow

Do not rely on PowerShell console rendering to judge whether a file is healthy. The terminal may display correct UTF-8 text as mojibake or `?`, and inline PowerShell snippets with non-ASCII text can also reintroduce corruption.

Use this workflow instead:

1. Make edits with normal file writes in `utf8`.
2. If corruption appears, run:
   - `node "C:\Users\juan\Documents\GitHub\juanolaya.github.io\Deutsch_lernen\verben\A1_A2_B1\repair_utf8_and_sync.js"`
3. Before closing the task, run both checks:
   - `node "C:\Users\juan\Documents\GitHub\juanolaya.github.io\Deutsch_lernen\verben\A1_A2_B1\check_mojibake.js"`
   - `node "C:\Users\juan\Documents\GitHub\juanolaya.github.io\Deutsch_lernen\verben\A1_A2_B1\check_card_group_alignment.js"`
4. Only close the task if both checks return:
   - `count: 0`

This is the definitive guardrail for this module.

## Cache And Versioning

Current cache structure is aligned to `v35`.

When content changes affect what the app loads:

- keep cache/version references aligned
- update `lastUpdated` in `json/verbs_index.json`
- make sure the page still resolves the current content version correctly

## Safety Note

If a script is used for encoding recovery, verify the resulting files manually in a sample of affected verbs/groups before finishing.
