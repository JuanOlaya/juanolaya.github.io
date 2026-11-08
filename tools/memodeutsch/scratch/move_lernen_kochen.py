import os
import json

base_dir = r"c:\Users\juan\Documents\GitHub\juanolaya.github.io\Deutsch_lernen\verben\A1_A2_B1\json"

# 1. Update theme files
theme_lernen = os.path.join(base_dir, "themes", "A2_2_15_theme.json")
with open(theme_lernen, "r", encoding="utf-8-sig") as f:
    t_lernen = json.load(f)
t_lernen["theme"] = "Bildung"
t_lernen["germanName"] = "Bildung"
t_lernen["spanishName"] = "Educación"
t_lernen["englishName"] = "Education"
t_lernen["description"] = "Group 15 · Education"
with open(theme_lernen, "w", encoding="utf-8") as f:
    json.dump(t_lernen, f, ensure_ascii=False, indent=2)
print("Updated A2_2_15_theme.json")

theme_kochen = os.path.join(base_dir, "themes", "A2_2_20_theme.json")
with open(theme_kochen, "r", encoding="utf-8-sig") as f:
    t_kochen = json.load(f)
t_kochen["theme"] = "Küche"
t_kochen["germanName"] = "Küche"
t_kochen["spanishName"] = "Cocina"
t_kochen["englishName"] = "Kitchen"
t_kochen["description"] = "Group 20 · Kitchen"
with open(theme_kochen, "w", encoding="utf-8") as f:
    json.dump(t_kochen, f, ensure_ascii=False, indent=2)
print("Updated A2_2_20_theme.json")

# 2. Update group files
g15_path = os.path.join(base_dir, "groups", "A2_2", "A2_2_group_15.json")
with open(g15_path, "r", encoding="utf-8-sig") as f:
    g15 = json.load(f)
g15["theme"] = "Bildung"
g15["germanName"] = "Bildung"
g15["spanishName"] = "Educación"
g15["englishName"] = "Education"
g15["verbs"] = [v for v in g15["verbs"] if v != "lernen"]
with open(g15_path, "w", encoding="utf-8") as f:
    json.dump(g15, f, ensure_ascii=False, indent=2)
print("Updated A2_2_group_15.json")

g21_path = os.path.join(base_dir, "groups", "A2_2", "A2_2_group_21.json")
with open(g21_path, "r", encoding="utf-8-sig") as f:
    g21 = json.load(f)
g21["theme"] = "Küche"
g21["germanName"] = "Küche"
g21["spanishName"] = "Cocina"
g21["englishName"] = "Kitchen"
g21["verbs"] = [v for v in g21["verbs"] if v != "kochen"]
with open(g21_path, "w", encoding="utf-8") as f:
    json.dump(g21, f, ensure_ascii=False, indent=2)
print("Updated A2_2_group_21.json")

g6_path = os.path.join(base_dir, "groups", "A1_1", "A1_1_group_6.json")
with open(g6_path, "r", encoding="utf-8-sig") as f:
    g6 = json.load(f)
for v in ["lernen", "kochen"]:
    if v not in g6["verbs"]:
        g6["verbs"].append(v)
with open(g6_path, "w", encoding="utf-8") as f:
    json.dump(g6, f, ensure_ascii=False, indent=2)
print("Updated A1_1_group_6.json")

# 3. Update card files
cards_dir = os.path.join(base_dir, "cards")

# Update lernen.json
lernen_card = os.path.join(cards_dir, "lernen.json")
if os.path.exists(lernen_card):
    with open(lernen_card, "r", encoding="utf-8-sig") as f:
        card = json.load(f)
    card["level"] = "A1.1"
    card["theme"] = "Alltag"
    with open(lernen_card, "w", encoding="utf-8") as f:
        json.dump(card, f, ensure_ascii=False, indent=4)
    print("Updated lernen.json card")

# Update kochen.json
kochen_card = os.path.join(cards_dir, "kochen.json")
if os.path.exists(kochen_card):
    with open(kochen_card, "r", encoding="utf-8-sig") as f:
        card = json.load(f)
    card["level"] = "A1.1"
    card["theme"] = "Alltag"
    with open(kochen_card, "w", encoding="utf-8") as f:
        json.dump(card, f, ensure_ascii=False, indent=4)
    print("Updated kochen.json card")

# Update Bildung cards
bildung_verbs = ["studieren", "üben", "lösen", "mitmachen", "zählen"]
for verb in bildung_verbs:
    card_path = os.path.join(cards_dir, f"{verb}.json")
    if os.path.exists(card_path):
        with open(card_path, "r", encoding="utf-8-sig") as f:
            card = json.load(f)
        card["theme"] = "Bildung"
        with open(card_path, "w", encoding="utf-8") as f:
            json.dump(card, f, ensure_ascii=False, indent=4)
        print(f"Updated card to Bildung: {verb}.json")

# Update Küche cards
kueche_verbs = ["braten", "backen", "räuchern", "garen", "grillen"]
for verb in kueche_verbs:
    card_path = os.path.join(cards_dir, f"{verb}.json")
    if os.path.exists(card_path):
        with open(card_path, "r", encoding="utf-8-sig") as f:
            card = json.load(f)
        card["theme"] = "Küche"
        with open(card_path, "w", encoding="utf-8") as f:
            json.dump(card, f, ensure_ascii=False, indent=4)
        print(f"Updated card to Küche: {verb}.json")
