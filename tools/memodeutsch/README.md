# MemoDeutsch offline tools

Maintenance scripts for `Deutsch_lernen/` (Node, Python, PowerShell). They are **not** part of the published
site: the Vite build only copies `Deutsch_lernen/`, so nothing here reaches `dist/`.

The folder mirrors `Deutsch_lernen/`: a script at `tools/memodeutsch/X/Y.js` works on the data in
`Deutsch_lernen/X/`. Scripts that used their own folder (`__dirname`, `__file__`, `$PSScriptRoot`) now resolve it
through `site-dir.cjs` (Node) or an equivalent relative path (Python/PowerShell), so they run from any directory.

`package.json` declares `"type": "commonjs"` because the repository root is an ES module package.

## Verb database workflow (see `Deutsch_lernen/verben/A1_A2_B1/HOW_TO_ADD_GROUPS.md`)

```bash
node tools/memodeutsch/verben/A1_A2_B1/update_index.js      # rebuild json/verbs_index.json
node tools/memodeutsch/verben/A1_A2_B1/sync_card_groups.js  # align json/cards/*.json group numbers
node tools/memodeutsch/verben/A1_A2_B1/verify_inventory.js  # check index vs groups
```

## Known limitations

- Many one-off scripts contain absolute paths of the author's machine (`c:\Users\juan\Documents\GitHub\...`).
  They were left unchanged: they already pointed at `Deutsch_lernen/` and keep doing so.
- A few scripts use paths relative to the current directory; run them from the matching `Deutsch_lernen/X/` folder.
