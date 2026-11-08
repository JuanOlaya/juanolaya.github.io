import os
import json

base_dir = r"c:\Users\juan\Documents\GitHub\juanolaya.github.io\Deutsch_lernen\verben\A1_A2_B1\json"

# 1. Update Group Files

# A1_1_group_1.json (Existenz) - Remove wohnen
g1_path = os.path.join(base_dir, "groups", "A1_1", "A1_1_group_1.json")
with open(g1_path, "r", encoding="utf-8-sig") as f:
    g1 = json.load(f)
g1["verbs"] = [v for v in g1["verbs"] if v != "wohnen"]
with open(g1_path, "w", encoding="utf-8") as f:
    json.dump(g1, f, ensure_ascii=False, indent=2)
print("Updated A1_1_group_1.json")

# A1_2_group_15.json (Wohnen) - Set exact order
g15_path = os.path.join(base_dir, "groups", "A1_2", "A1_2_group_15.json")
with open(g15_path, "r", encoding="utf-8-sig") as f:
    g15 = json.load(f)
g15["verbs"] = ["suchen", "besuchen", "finden", "einziehen", "wohnen", "einrichten"]
with open(g15_path, "w", encoding="utf-8") as f:
    json.dump(g15, f, ensure_ascii=False, indent=2)
print("Updated A1_2_group_15.json")

# A1_2_group_22.json (Richtung) - Remove wenden, hineingehen
g22_path = os.path.join(base_dir, "groups", "A1_2", "A1_2_group_22.json")
with open(g22_path, "r", encoding="utf-8-sig") as f:
    g22 = json.load(f)
g22["verbs"] = [v for v in g22["verbs"] if v not in ["wenden", "hineingehen"]]
with open(g22_path, "w", encoding="utf-8") as f:
    json.dump(g22, f, ensure_ascii=False, indent=2)
print("Updated A1_2_group_22.json")

# A1_2_group_24.json (Pendeln) - Add wenden
g24_path = os.path.join(base_dir, "groups", "A1_2", "A1_2_group_24.json")
with open(g24_path, "r", encoding="utf-8-sig") as f:
    g24 = json.load(f)
if "wenden" not in g24["verbs"]:
    g24["verbs"].append("wenden")
with open(g24_path, "w", encoding="utf-8") as f:
    json.dump(g24, f, ensure_ascii=False, indent=2)
print("Updated A1_2_group_24.json")

# B1_1_group_16.json (Präsentation) - Add hineingehen
g16_path = os.path.join(base_dir, "groups", "B1_1", "B1_1_group_16.json")
with open(g16_path, "r", encoding="utf-8-sig") as f:
    g16 = json.load(f)
if "hineingehen" not in g16["verbs"]:
    g16["verbs"].append("hineingehen")
with open(g16_path, "w", encoding="utf-8") as f:
    json.dump(g16, f, ensure_ascii=False, indent=2)
print("Updated B1_1_group_16.json")


# 2. Update Card Files

# json/cards/wohnen.json
wohnen_card = os.path.join(base_dir, "cards", "wohnen.json")
with open(wohnen_card, "r", encoding="utf-8-sig") as f:
    card = json.load(f)
card["level"] = "A1.2"
card["theme"] = "Wohnen"
with open(wohnen_card, "w", encoding="utf-8") as f:
    json.dump(card, f, ensure_ascii=False, indent=4)
print("Updated wohnen.json card")

# json/cards/wenden.json
wenden_card = os.path.join(base_dir, "cards", "wenden.json")
with open(wenden_card, "r", encoding="utf-8-sig") as f:
    card = json.load(f)
card["theme"] = "Pendeln"
with open(wenden_card, "w", encoding="utf-8") as f:
    json.dump(card, f, ensure_ascii=False, indent=4)
print("Updated wenden.json card")

# json/cards/hineingehen.json
hineingehen_card = os.path.join(base_dir, "cards", "hineingehen.json")
with open(hineingehen_card, "r", encoding="utf-8-sig") as f:
    card = json.load(f)
card["level"] = "B1.1"
card["theme"] = "Präsentation"
with open(hineingehen_card, "w", encoding="utf-8") as f:
    json.dump(card, f, ensure_ascii=False, indent=4)
print("Updated hineingehen.json card")
