import os
import json

base_dir = r"c:\Users\juan\Documents\GitHub\juanolaya.github.io\Deutsch_lernen\verben\A1_A2_B1"

def load_json(path):
    with open(path, "r", encoding="utf-8-sig") as f:
        return json.load(f)

def save_json(path, data):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

def update_card(verb):
    path = os.path.join(base_dir, "json", "cards", f"{verb}.json")
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8-sig") as f:
            card = json.load(f)
        card["theme"] = "Grundlagen"
        with open(path, "w", encoding="utf-8") as f:
            json.dump(card, f, ensure_ascii=False, indent=4)
        print(f"Updated card {verb}.json theme to Grundlagen")

# 1. Update theme configuration A1_1_1_theme.json
theme_path = os.path.join(base_dir, "json", "themes", "A1_1_1_theme.json")
theme = load_json(theme_path)
theme["theme"] = "Grundlagen"
theme["germanName"] = "Grundlagen"
theme["spanishName"] = "Fundamentos"
theme["englishName"] = "Basics"
theme["description"] = "Group 1 · Basics"
save_json(theme_path, theme)
print("Updated A1_1_1_theme.json")

# 2. Update group configuration A1_1_group_1.json
group_path = os.path.join(base_dir, "json", "groups", "A1_1", "A1_1_group_1.json")
group = load_json(group_path)
group["theme"] = "Grundlagen"
group["germanName"] = "Grundlagen"
group["spanishName"] = "Fundamentos"
group["englishName"] = "Basics"
save_json(group_path, group)
print("Updated A1_1_group_1.json")

# 3. Update cards
for v in ["sein", "haben", "werden", "geben", "kommen", "gehen"]:
    update_card(v)

# 4. Update preferred order in build_pdf_kompakt_a1_portrait_with_tags_v2.js
pdf_v2_path = os.path.join(base_dir, "tools", "build_pdf_kompakt_a1_portrait_with_tags_v2.js")
if os.path.exists(pdf_v2_path):
    with open(pdf_v2_path, "r", encoding="utf-8") as f:
        content = f.read()
    content = content.replace("['Existenz',", "['Grundlagen',")
    with open(pdf_v2_path, "w", encoding="utf-8") as f:
        f.write(content)
    print("Updated build_pdf_kompakt_a1_portrait_with_tags_v2.js")

# 5. Update build_pdf_kompakt_first_2_landscape_letter.js
l2_path = os.path.join(base_dir, "tools", "build_pdf_kompakt_first_2_landscape_letter.js")
if os.path.exists(l2_path):
    with open(l2_path, "r", encoding="utf-8") as f:
        content = f.read()
    content = content.replace("groupNameGerman: 'Existenz'", "groupNameGerman: 'Grundlagen'")
    content = content.replace("groupNameSpanish: 'Existencia'", "groupNameSpanish: 'Fundamentos'")
    with open(l2_path, "w", encoding="utf-8") as f:
        f.write(content)
    print("Updated build_pdf_kompakt_first_2_landscape_letter.js")

# 6. Update build_pdf_kompakt_first_8_landscape_letter.js
l8_path = os.path.join(base_dir, "tools", "build_pdf_kompakt_first_8_landscape_letter.js")
if os.path.exists(l8_path):
    with open(l8_path, "r", encoding="utf-8") as f:
        content = f.read()
    content = content.replace("groupNameGerman: 'Existenz'", "groupNameGerman: 'Grundlagen'")
    content = content.replace("groupNameSpanish: 'Existencia'", "groupNameSpanish: 'Fundamentos'")
    with open(l8_path, "w", encoding="utf-8") as f:
        f.write(content)
    print("Updated build_pdf_kompakt_first_8_landscape_letter.js")

# 7. Update build_pdf_kompakt_landscape_letter.js
lland_path = os.path.join(base_dir, "tools", "build_pdf_kompakt_landscape_letter.js")
if os.path.exists(lland_path):
    with open(lland_path, "r", encoding="utf-8") as f:
        content = f.read()
    content = content.replace("groupNameGerman: 'Existenz'", "groupNameGerman: 'Grundlagen'")
    content = content.replace("groupNameSpanish: 'Existencia'", "groupNameSpanish: 'Fundamentos'")
    with open(lland_path, "w", encoding="utf-8") as f:
        f.write(content)
    print("Updated build_pdf_kompakt_landscape_letter.js")

# 8. Update restore_backend.js
restore_path = os.path.join(base_dir, "tools", "restore_backend.js")
if os.path.exists(restore_path):
    with open(restore_path, "r", encoding="utf-8") as f:
        content = f.read()
    content = content.replace('"groupNameGerman": "Existenz"', '"groupNameGerman": "Grundlagen"')
    content = content.replace('"groupNameSpanish": "Existencia"', '"groupNameSpanish": "Fundamentos"')
    content = content.replace('"groupNameEnglish": "Existence"', '"groupNameEnglish": "Basics"')
    with open(restore_path, "w", encoding="utf-8") as f:
        f.write(content)
    print("Updated restore_backend.js")

# 9. Update A1_1_verbs.csv
csv_path = os.path.join(base_dir, "json", "csv", "A1_1_verbs.csv")
if os.path.exists(csv_path):
    with open(csv_path, "r", encoding="utf-8") as f:
        content = f.read()
    content = content.replace("Existenz - Existencia", "Grundlagen - Fundamentos")
    with open(csv_path, "w", encoding="utf-8") as f:
        f.write(content)
    print("Updated A1_1_verbs.csv")

print("Migration completed.")
