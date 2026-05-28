import os
import json

base_dir = r"c:\Users\juan\Documents\GitHub\juanolaya.github.io\Deutsch_lernen\verben\A1_A2_B1\json"

# 1. Update Group Files

# A1_2_group_15.json (Wohnen) - Remove parken, zeigen, besichtigen
g15_path = os.path.join(base_dir, "groups", "A1_2", "A1_2_group_15.json")
with open(g15_path, "r", encoding="utf-8-sig") as f:
    g15 = json.load(f)
g15["verbs"] = [v for v in g15["verbs"] if v not in ["parken", "zeigen", "besichtigen"]]
with open(g15_path, "w", encoding="utf-8") as f:
    json.dump(g15, f, ensure_ascii=False, indent=2)
print("Updated A1_2_group_15.json")

# A1_2_group_24.json (Pendeln) - Add parken
g24_path = os.path.join(base_dir, "groups", "A1_2", "A1_2_group_24.json")
with open(g24_path, "r", encoding="utf-8-sig") as f:
    g24 = json.load(f)
if "parken" not in g24["verbs"]:
    g24["verbs"].append("parken")
with open(g24_path, "w", encoding="utf-8") as f:
    json.dump(g24, f, ensure_ascii=False, indent=2)
print("Updated A1_2_group_24.json")

# A1_1_group_6.json (Alltag) - Add zeigen
g6_path = os.path.join(base_dir, "groups", "A1_1", "A1_1_group_6.json")
with open(g6_path, "r", encoding="utf-8-sig") as f:
    g6 = json.load(f)
if "zeigen" not in g6["verbs"]:
    g6["verbs"].append("zeigen")
with open(g6_path, "w", encoding="utf-8") as f:
    json.dump(g6, f, ensure_ascii=False, indent=2)
print("Updated A1_1_group_6.json")

# A2_2_group_29.json (Urlaub) - Add besichtigen
g29_path = os.path.join(base_dir, "groups", "A2_2", "A2_2_group_29.json")
with open(g29_path, "r", encoding="utf-8-sig") as f:
    g29 = json.load(f)
if "besichtigen" not in g29["verbs"]:
    g29["verbs"].append("besichtigen")
with open(g29_path, "w", encoding="utf-8") as f:
    json.dump(g29, f, ensure_ascii=False, indent=2)
print("Updated A2_2_group_29.json")


# 2. Update Card Files

# json/cards/parken.json
parken_card = os.path.join(base_dir, "cards", "parken.json")
with open(parken_card, "r", encoding="utf-8-sig") as f:
    card = json.load(f)
card["theme"] = "Pendeln"
card["group"] = 10
with open(parken_card, "w", encoding="utf-8") as f:
    json.dump(card, f, ensure_ascii=False, indent=4)
print("Updated parken.json card")

# json/cards/zeigen.json
zeigen_card = os.path.join(base_dir, "cards", "zeigen.json")
with open(zeigen_card, "r", encoding="utf-8-sig") as f:
    card = json.load(f)
card["level"] = "A1.1"
card["theme"] = "Alltag"
card["group"] = 6
with open(zeigen_card, "w", encoding="utf-8") as f:
    json.dump(card, f, ensure_ascii=False, indent=4)
print("Updated zeigen.json card")

# json/cards/besichtigen.json
besichtigen_card = os.path.join(base_dir, "cards", "besichtigen.json")
with open(besichtigen_card, "r", encoding="utf-8-sig") as f:
    card = json.load(f)
card["level"] = "A2.2"
card["theme"] = "Urlaub"
card["group"] = 17
with open(besichtigen_card, "w", encoding="utf-8") as f:
    json.dump(card, f, ensure_ascii=False, indent=4)
print("Updated besichtigen.json card")
