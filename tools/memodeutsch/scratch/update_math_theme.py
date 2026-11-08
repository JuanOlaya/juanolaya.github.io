import os
import json

base_dir = r"c:\Users\juan\Documents\GitHub\juanolaya.github.io\Deutsch_lernen\verben\A1_A2_B1\json"

# 1. Update B2_1_14_theme.json
theme_file = os.path.join(base_dir, "themes", "B2_1_14_theme.json")
with open(theme_file, "r", encoding="utf-8-sig") as f:
    theme_data = json.load(f)

theme_data["theme"] = "Mathematik"
theme_data["germanName"] = "Mathematik"
theme_data["englishName"] = "Mathematics"
theme_data["description"] = "Group 14 · Mathematics"

with open(theme_file, "w", encoding="utf-8") as f:
    json.dump(theme_data, f, ensure_ascii=False, indent=2)
print("Updated B2_1_14_theme.json")

# 2. Update B2_1_group_14.json
group_file = os.path.join(base_dir, "groups", "B2_1", "B2_1_group_14.json")
with open(group_file, "r", encoding="utf-8-sig") as f:
    group_data = json.load(f)

group_data["theme"] = "Mathematik"
group_data["germanName"] = "Mathematik"
group_data["englishName"] = "Mathematics"

with open(group_file, "w", encoding="utf-8") as f:
    json.dump(group_data, f, ensure_ascii=False, indent=2)
print("Updated B2_1_group_14.json")

# 3. Update Card Files
math_verbs = ["summieren", "subtrahieren", "multiplizieren", "dividieren", "rechnen"]
cards_dir = os.path.join(base_dir, "cards")

for verb in math_verbs:
    card_file = os.path.join(cards_dir, f"{verb}.json")
    if os.path.exists(card_file):
        with open(card_file, "r", encoding="utf-8-sig") as f:
            card_data = json.load(f)
        card_data["theme"] = "Mathematik"
        with open(card_file, "w", encoding="utf-8") as f:
            json.dump(card_data, f, ensure_ascii=False, indent=4)
        print(f"Updated card: {verb}.json")
