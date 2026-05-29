import os
import json

base_dir = r"c:\Users\juan\Documents\GitHub\juanolaya.github.io\Deutsch_lernen\verben\A1_A2_B1\json"

# Helper to read/write JSON safely
def load_json(path):
    with open(path, "r", encoding="utf-8-sig") as f:
        return json.load(f)

def save_json(path, data):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

def update_card(verb, theme=None, level=None, es=None, card_es=None, es_searchable=None):
    path = os.path.join(base_dir, "cards", f"{verb}.json")
    if os.path.exists(path):
        data = load_json(path)
        if theme is not None:
            data["theme"] = theme
        if level is not None:
            data["level"] = level
        if es is not None:
            data["es"] = es
        if card_es is not None:
            data["card_es"] = card_es
        if es_searchable is not None:
            data["es_searchable"] = es_searchable
        
        # Write back indented by 4 spaces (matching cards style)
        with open(path, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=4)
        print(f"Updated card {verb}.json")
    else:
        print(f"ERROR: Card {verb}.json not found at {path}")

# 1. Add entfernen to A2_1_group_6.json
g6_a21_path = os.path.join(base_dir, "groups", "A2_1", "A2_1_group_6.json")
g6_a21 = load_json(g6_a21_path)
if "entfernen" not in g6_a21["verbs"]:
    g6_a21["verbs"].append("entfernen")
save_json(g6_a21_path, g6_a21)
print("Added entfernen to A2_1_group_6.json")

# 2. Move bilden from B2_1_group_6.json (Development) to top of A2_2_group_15.json (Bildung)
g6_b21_path = os.path.join(base_dir, "groups", "B2_1", "B2_1_group_6.json")
g6_b21 = load_json(g6_b21_path)
g6_b21["verbs"] = [v for v in g6_b21["verbs"] if v != "bilden"]
save_json(g6_b21_path, g6_b21)
print("Removed bilden from B2_1_group_6.json")

g15_a22_path = os.path.join(base_dir, "groups", "A2_2", "A2_2_group_15.json")
g15_a22 = load_json(g15_a22_path)
g15_a22["verbs"] = [v for v in g15_a22["verbs"] if v != "bilden"] # avoid duplicate
g15_a22["verbs"].insert(0, "bilden")
# 3. Remove zählen from A2_2_group_15.json
g15_a22["verbs"] = [v for v in g15_a22["verbs"] if v != "zählen"]
save_json(g15_a22_path, g15_a22)
print("Updated A2_2_group_15.json (inserted bilden at top, removed zählen)")

# 3b. Add zählen to end of B2_1_group_14.json (Mathematik)
g14_b21_path = os.path.join(base_dir, "groups", "B2_1", "B2_1_group_14.json")
g14_b21 = load_json(g14_b21_path)
if "zählen" not in g14_b21["verbs"]:
    g14_b21["verbs"].append("zählen")
save_json(g14_b21_path, g14_b21)
print("Added zählen to B2_1_group_14.json")

# 4. Rename theme Gedächtnis to Verstand in A1_1_8_theme.json
t8_path = os.path.join(base_dir, "themes", "A1_1_8_theme.json")
t8 = load_json(t8_path)
t8["theme"] = "Verstand"
t8["germanName"] = "Verstand"
t8["spanishName"] = "Mente / Entendimiento"
t8["englishName"] = "Mind / Understanding"
t8["description"] = "Group 8 · Mind"
save_json(t8_path, t8)
print("Renamed A1_1_8_theme.json to Verstand")

# 5. Rename theme Gedächtnis to Verstand in A1_1_group_10.json and add verstehen
g10_path = os.path.join(base_dir, "groups", "A1_1", "A1_1_group_10.json")
g10 = load_json(g10_path)
g10["theme"] = "Verstand"
g10["germanName"] = "Verstand"
g10["spanishName"] = "Mente / Entendimiento"
g10["englishName"] = "Mind / Understanding"
g10["verbs"] = [v for v in g10["verbs"] if v != "verstehen"]
g10["verbs"].append("verstehen")
save_json(g10_path, g10)
print("Updated A1_1_group_10.json (renamed theme, added verstehen)")

# 5b. Remove verstehen from A1_2_group_27.json
g27_path = os.path.join(base_dir, "groups", "A1_2", "A1_2_group_27.json")
g27 = load_json(g27_path)
g27["verbs"] = [v for v in g27["verbs"] if v != "verstehen"]
save_json(g27_path, g27)
print("Removed verstehen from A1_2_group_27.json")

# 6. Update Cards theme/level
for v in ["erinnern", "kennenlernen", "merken", "vergessen"]:
    update_card(v, theme="Verstand")

update_card("verstehen", theme="Verstand", level="A1.1")
update_card("bilden", theme="Bildung", level="A2.2")
update_card("zählen", theme="Mathematik", level="B2.1")

# 7. Update verlassen and lassen translations
update_card("verlassen", 
            es="abandonar un lugar, dejar atrás", 
            card_es="abandonar un lugar, dejar atrás",
            es_searchable=["abandonar", "un", "lugar", "dejar", "atrás"])

update_card("lassen", 
            es="permitir, dejar", 
            card_es="permitir, dejar",
            es_searchable=["permitir", "dejar"])

print("All migration script operations completed.")
