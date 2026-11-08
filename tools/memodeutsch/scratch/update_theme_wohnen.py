import os
import json

base_dir = r"c:\Users\juan\Documents\GitHub\juanolaya.github.io\Deutsch_lernen\verben\A1_A2_B1\json"

# 1. Update A1_2_15_theme.json
theme_file = os.path.join(base_dir, "themes", "A1_2_15_theme.json")
with open(theme_file, "r", encoding="utf-8-sig") as f:
    theme_data = json.load(f)

theme_data["theme"] = "Wohnen"
theme_data["germanName"] = "Wohnen"
theme_data["spanishName"] = "Vivienda / Alojamiento"
theme_data["englishName"] = "Housing / Living"
theme_data["description"] = "Group 15 · Housing / Living"

with open(theme_file, "w", encoding="utf-8") as f:
    json.dump(theme_data, f, ensure_ascii=False, indent=2)
print("Updated A1_2_15_theme.json")

# 2. Update card files
cards_dir = os.path.join(base_dir, "cards")
for filename in os.listdir(cards_dir):
    if filename.endswith(".json"):
        filepath = os.path.join(cards_dir, filename)
        try:
            with open(filepath, "r", encoding="utf-8-sig") as f:
                card = json.load(f)
        except Exception as e:
            print(f"Error reading {filename}: {e}")
            continue
            
        modified = False
        
        # Move Stadtleben to Wohnen
        if card.get("theme") == "Stadtleben":
            card["theme"] = "Wohnen"
            modified = True
            
        # Move einziehen and einrichten to Wohnen (Group 1)
        if card.get("verb") in ["einziehen", "einrichten"]:
            card["theme"] = "Wohnen"
            card["group"] = 1
            modified = True
            
        if modified:
            with open(filepath, "w", encoding="utf-8") as f:
                json.dump(card, f, ensure_ascii=False, indent=4)
            print(f"Updated card: {filename}")
