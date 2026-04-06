# LiD Modal Example Coverage Report

Source files checked:
- `C:\Users\juan\Documents\GitHub\juanolaya.github.io\Deutsch_lernen\substantiv\lid_kompakt.html`
- `C:\Users\juan\Documents\_HapticIO\8_Misc\Deutsch lernen\Leben in Deutschland\gesamtfragenkatalog-lebenindeutschland.pdf`
- Official BAMF online catalog:
  - `https://www.bamf.de/SharedDocs/Anlagen/DE/Integration/Einbuergerung/gesamtfragenkatalog-lebenindeutschland.html`
  - `https://www.bamf.de/SharedDocs/Anlagen/DE/Integration/Einbuergerung/gesamtfragenkatalog-lebenindeutschland.pdf?__blob=publicationFile&v=23`

Method:
- Counted all `w` entries in `lid_kompakt.html`.
- Extracted text from the PDF with `pypdf`.
- Split the catalog into `Aufgabe N` question blocks.
- Counted a noun when its exact form, or a very close listed variant for slash entries, appears in a question block.

Important note:
- This report is conservative.
- A `0` does not always mean the noun is absent from the exam domain; it means I did not find a direct exact-form match in the extracted PDF text.
- Very short or highly inflected words may still need manual review before replacing modal examples.
- I also manually verified the official Berlin section online. In the BAMF PDF, `Teil II: Fragen für das Bundesland Berlin` starts on page 121 and includes Berlin-specific questions such as the one for `Regierende Bürgermeisterin/Regierender Bürgermeister`.

## Summary

- Total noun entries in `lid_kompakt.html`: `161`
- Nouns with at least 1 direct match in the PDF: `125`
- Nouns with 0 direct matches in the PDF: `36`

## Strong Coverage

These are especially promising for replacing modal examples with test-based ones because they appear many times in the catalog:

| Entry | Matches in PDF |
| --- | ---: |
| `Bundesland` | 54 |
| `Bundesrepublik` | 32 |
| `Ministerin / Minister` | 30 |
| `DDR` | 26 |
| `Staat` | 23 |
| `Bundestag` | 22 |
| `Gemeinde` | 20 |
| `Ordnungsamt` | 20 |
| `Ministerpräsidentin / Ministerpräsident` | 19 |
| `Bürgermeister / Bürgermeisterin` | 18 |
| `Wappen` | 18 |
| `Regierungschef` | 16 |
| `Regierungschefin / Regierungschef` | 16 |
| `Regierung` | 15 |
| `Bundeskanzler` | 14 |
| `Partei` | 14 |
| `Bundespräsidentin / Bundespräsident` | 13 |
| `Bundesregierung` | 12 |
| `Bürger` | 12 |
| `Wahl` | 12 |

## Already Useful For Immediate Modal Upgrades

These have direct PDF support and are especially relevant to the work we already started:

| Entry | Matches in PDF |
| --- | ---: |
| `Stimme` | 2 |
| `Stimmabgabe` | 2 |
| `Wahlrecht` | 3 |
| `Bundestag` | 22 |
| `Bundeskanzler` | 14 |
| `Bundesversammlung` | 6 |
| `Bundespräsidentin / Bundespräsident` | 13 |
| `Staatsoberhaupt` | 3 |
| `Regierungschef` | 16 |
| `Opposition` | 3 |
| `Bundesverfassungsgericht` | 5 |
| `Fraktion` | 5 |
| `Verfassung` | 6 |
| `Grundgesetz` | 7 |
| `Gesetz` | 5 |
| `Bundesrat` | 10 |
| `Bundeskabinett` | 2 |
| `Bundesregierung` | 12 |

## Berlin-Specific Manual Confirmations

These are especially relevant because they were the missing area you called out. They come from the official BAMF online PDF, including the Berlin section on pages 121-125.

| Entry in `lid_kompakt.html` | Candidate Q&A count |
| --- | ---: |
| `Regierende Bürgermeister` | 1 |
| `Berliner Mauer` | 5 |
| `Stadtstaat` | 3 |
| `Wappen` | 18 |
| `Bundesland` | 54 |
| `Bundespräsidentin / Bundespräsident` | 13 |

Notes:
- `Regierende Bürgermeister` comes from the Berlin-specific question asking how the Regierungschefin/der Regierungschef des Stadtstaates Berlin is called.
- `Berliner Mauer` is not written exactly in that form in every question, but the official catalog contains multiple direct Berlin-wall questions such as `Wer baute die Mauer in Berlin?`, `In welchem Jahr wurde die Mauer in Berlin gebaut?`, and `Wann wurde die Mauer in Berlin für alle geöffnet?`

## Full Table

The full per-noun count table is in:
- `C:\Users\juan\Documents\GitHub\juanolaya.github.io\Deutsch_lernen\substantiv\lid_einbuergerungstest_report.tsv`
