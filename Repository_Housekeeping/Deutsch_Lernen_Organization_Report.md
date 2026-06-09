# Repository Maintenance Report: Deutsch_lernen Folder Reorganization

**Date:** June 9, 2026  
**Repository:** `juanolaya.github.io`  
**Maintenance Folder:** `Repository_Housekeeping/`  

---

## 📋 Overview

The root of the `Deutsch_lernen/` project contained a large number of loose files from development, debugging, and data analysis. These files were cluttering the repository root and making it harder to navigate the core web application assets.

We reorganized these files into a clean two-folder structure (Option 2):
1. **`tools/`**: Contains offline developer scripts (Python and JavaScript) used for testing, auditing, and repairing data.
2. **`references/`**: Contains raw documentation sources, PDFs, wordlists, and text/JSON database analysis dumps.

---

## 📂 Reorganization Details

### 1. Developer Tools & Scripts (`tools/`)
The following files were moved into [tools/](file:///C:/Users/juan/Documents/GitHub/juanolaya.github.io/Deutsch_lernen/tools):
* `audit_quality_final.py`
* `audit_semantic_loss.py`
* `debug_v6_failure.py`
* `emergency_rollback_spaces.py`
* `extract_broken_data.py`
* `final_cleanup.py`
* `final_surgical_relief.py`
* `fix_repeating_chars.py`
* `fix_triple_mojibake.js`
* `repair_final_polish.py`
* `repair_mojibake.js`
* `repair_v5_final.py`
* `repair_v6_autonomous.py`
* `repair_v7_final_reconstruction.py`
* `the_final_hammer_v8.py`
* `the_unstoppable_hammer_v12.py`
* `transform_table.py`

### 2. Sources & Raw Reference Data (`references/`)
The following files were moved into [references/](file:///C:/Users/juan/Documents/GitHub/juanolaya.github.io/Deutsch_lernen/references):
* **PDF Reference Documents:**
  * `bamf_official_2025.pdf`
  * `goethe_a1_wortliste.pdf`
  * `goethe_a2_wortliste.pdf`
* **Word Lists & Texts:**
  * `goethe_a1_wortliste.txt`
  * `goethe_a2_wortliste.txt`
  * `bamf_official_2025_extracted.txt`
  * `broken_lines_lid.txt`
  * `tmp_a1_a2_verbs_local.txt`
  * `tmp_dom.html`
  * `verb_report.txt`
  * `verb_searchable_analysis_report.txt`
* **JSON Datasets & Backups:**
  * `a1_praeteritum_audit.json`
  * `bad_strings.json`
  * `abstraktes-deutsches-substantiv.html.backup`

---

## 🚦 Verification Status

* **Git Index Integrity**: Staged using `git mv` (and `git add -u`), preserving complete file history in Git.
* **Web App Integrity**: Verified that no references to these offline scripts and PDFs exist in any HTML/JS code. The website's assets (`index.html`, styles, sub-pages, service workers) remain clean and operational in the root directory.
