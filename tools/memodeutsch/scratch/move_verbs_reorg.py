import os
import json

base_dir = r"c:\Users\juan\Documents\GitHub\juanolaya.github.io\Deutsch_lernen\verben\A1_A2_B1\json"

# 1. Update theme file A2_1_6_theme.json
theme_file = os.path.join(base_dir, "themes", "A2_1_6_theme.json")
with open(theme_file, "r", encoding="utf-8-sig") as f:
    t_data = json.load(f)
t_data["theme"] = "Bearbeitung"
t_data["germanName"] = "Bearbeitung"
t_data["spanishName"] = "Edición"
t_data["englishName"] = "Editing / Processing"
t_data["description"] = "Group 6 · Editing"
with open(theme_file, "w", encoding="utf-8") as f:
    json.dump(t_data, f, ensure_ascii=False, indent=2)
print("Updated A2_1_6_theme.json")

# 2. Update group files
# A2_1_group_6.json: Change to Bearbeitung, remove tun, add hinzufügen
g6_a21_path = os.path.join(base_dir, "groups", "A2_1", "A2_1_group_6.json")
with open(g6_a21_path, "r", encoding="utf-8-sig") as f:
    g6_a21 = json.load(f)
g6_a21["theme"] = "Bearbeitung"
g6_a21["germanName"] = "Bearbeitung"
g6_a21["spanishName"] = "Edición"
g6_a21["englishName"] = "Editing / Processing"
g6_a21["verbs"] = [v for v in g6_a21["verbs"] if v != "tun"]
if "hinzufügen" not in g6_a21["verbs"]:
    g6_a21["verbs"].append("hinzufügen")
with open(g6_a21_path, "w", encoding="utf-8") as f:
    json.dump(g6_a21, f, ensure_ascii=False, indent=2)
print("Updated A2_1_group_6.json")

# A1_1_group_6.json (Alltag): Remove aufmachen, zumachen, lernen, kochen. Add tun below machen, add füllen.
g6_a11_path = os.path.join(base_dir, "groups", "A1_1", "A1_1_group_6.json")
with open(g6_a11_path, "r", encoding="utf-8-sig") as f:
    g6_a11 = json.load(f)

# Rebuild list: machen, tun, nehmen, zeigen, füllen
g6_a11["verbs"] = ["machen", "tun", "nehmen", "zeigen", "füllen"]
with open(g6_a11_path, "w", encoding="utf-8") as f:
    json.dump(g6_a11, f, ensure_ascii=False, indent=2)
print("Updated A1_1_group_6.json")

# A1_1_group_5.json (Routine): Remove einschlafen, add kochen.
g5_path = os.path.join(base_dir, "groups", "A1_1", "A1_1_group_5.json")
with open(g5_path, "r", encoding="utf-8-sig") as f:
    g5 = json.load(f)
g5["verbs"] = [v for v in g5["verbs"] if v != "einschlafen"]
if "kochen" not in g5["verbs"]:
    g5["verbs"].append("kochen")
with open(g5_path, "w", encoding="utf-8") as f:
    json.dump(g5, f, ensure_ascii=False, indent=2)
print("Updated A1_1_group_5.json")

# A1_1_group_4.json (Tagesablauf): Add lernen.
g4_path = os.path.join(base_dir, "groups", "A1_1", "A1_1_group_4.json")
with open(g4_path, "r", encoding="utf-8-sig") as f:
    g4 = json.load(f)
if "lernen" not in g4["verbs"]:
    g4["verbs"].append("lernen")
with open(g4_path, "w", encoding="utf-8") as f:
    json.dump(g4, f, ensure_ascii=False, indent=2)
print("Updated A1_1_group_4.json")

# A1_1_group_3.json (Freizeit): Add einschlafen.
g3_path = os.path.join(base_dir, "groups", "A1_1", "A1_1_group_3.json")
with open(g3_path, "r", encoding="utf-8-sig") as f:
    g3 = json.load(f)
if "einschlafen" not in g3["verbs"]:
    g3["verbs"].append("einschlafen")
with open(g3_path, "w", encoding="utf-8") as f:
    json.dump(g3, f, ensure_ascii=False, indent=2)
print("Updated A1_1_group_3.json")

# A1_1_group_14.json (Paket): Add schneiden.
g14_path = os.path.join(base_dir, "groups", "A1_1", "A1_1_group_14.json")
with open(g14_path, "r", encoding="utf-8-sig") as f:
    g14 = json.load(f)
if "schneiden" not in g14["verbs"]:
    # Insert before or append. Let's insert after einpacken: packen, auspacken, einpacken, schneiden, ...
    verbs = g14["verbs"]
    if "einpacken" in verbs:
        idx = verbs.index("einpacken")
        verbs.insert(idx + 1, "schneiden")
    else:
        verbs.append("schneiden")
    g14["verbs"] = verbs
with open(g14_path, "w", encoding="utf-8") as f:
    json.dump(g14, f, ensure_ascii=False, indent=2)
print("Updated A1_1_group_14.json")

# A1_1_group_7.json (Handgriffe): Remove schneiden, füllen. Add aufmachen, zumachen.
g7_path = os.path.join(base_dir, "groups", "A1_1", "A1_1_group_7.json")
with open(g7_path, "r", encoding="utf-8-sig") as f:
    g7 = json.load(f)
g7["verbs"] = [v for v in g7["verbs"] if v not in ["schneiden", "füllen"]]
for v in ["aufmachen", "zumachen"]:
    if v not in g7["verbs"]:
        g7["verbs"].append(v)
with open(g7_path, "w", encoding="utf-8") as f:
    json.dump(g7, f, ensure_ascii=False, indent=2)
print("Updated A1_1_group_7.json")


# 3. Update Card Files
cards_dir = os.path.join(base_dir, "cards")

def update_card(verb_name, new_theme, new_level=None):
    card_file = os.path.join(cards_dir, f"{verb_name}.json")
    if os.path.exists(card_file):
        with open(card_file, "r", encoding="utf-8-sig") as f:
            card = json.load(f)
        card["theme"] = new_theme
        if new_level:
            card["level"] = new_level
        with open(card_file, "w", encoding="utf-8") as f:
            json.dump(card, f, ensure_ascii=False, indent=4)
        print(f"Updated card {verb_name}.json: theme={new_theme}, level={new_level}")

# Move kochen to Routine
update_card("kochen", "Routine")

# Move lernen to Tagesablauf
update_card("lernen", "Tagesablauf")

# Move einschlafen to Freizeit
update_card("einschlafen", "Freizeit")

# Move tun to Alltag (level A1.1)
update_card("tun", "Alltag", "A1.1")

# Move schneiden to Paket
update_card("schneiden", "Paket")

# Move füllen to Alltag
update_card("füllen", "Alltag")

# Move aufmachen, zumachen to Handgriffe
update_card("aufmachen", "Handgriffe")
update_card("zumachen", "Handgriffe")

# Update other cards in Bearbeitung (ändern, wechseln, ersetzen)
for v in ["ändern", "wechseln", "ersetzen"]:
    update_card(v, "Bearbeitung")
