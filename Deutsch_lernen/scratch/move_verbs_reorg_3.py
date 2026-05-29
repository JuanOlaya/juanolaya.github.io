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

def update_card(verb, theme=None, level=None):
    path = os.path.join(base_dir, "cards", f"{verb}.json")
    if os.path.exists(path):
        data = load_json(path)
        if theme is not None:
            data["theme"] = theme
        if level is not None:
            data["level"] = level
        
        # Write back indented by 4 spaces (matching cards style)
        with open(path, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=4)
        print(f"Updated card {verb}.json")
    else:
        print(f"ERROR: Card {verb}.json not found at {path}")

# 1. fühlen: move to the top of Gefühl (A1_1_group_12.json)
g12_path = os.path.join(base_dir, "groups", "A1_1", "A1_1_group_12.json")
g12 = load_json(g12_path)
g12["verbs"] = [v for v in g12["verbs"] if v != "fühlen"]
g12["verbs"].insert(0, "fühlen")
save_json(g12_path, g12)
print("Moved fühlen to the top of Gefühl theme in A1_1_group_12.json")

# 2. verstehen and vergessen: move to the top of Verstand (A1_1_group_10.json)
g10_path = os.path.join(base_dir, "groups", "A1_1", "A1_1_group_10.json")
g10 = load_json(g10_path)
g10["verbs"] = [v for v in g10["verbs"] if v not in ["verstehen", "vergessen"]]
g10["verbs"].insert(0, "vergessen")
g10["verbs"].insert(0, "verstehen")
save_json(g10_path, g10)
print("Moved verstehen and vergessen to the top of Verstand theme in A1_1_group_10.json")

# 3. brauchen: remove from A1_1_group_4.json, move between nehmen and zeigen in Alltag (A1_1_group_6.json)
g4_path = os.path.join(base_dir, "groups", "A1_1", "A1_1_group_4.json")
g4 = load_json(g4_path)
g4["verbs"] = [v for v in g4["verbs"] if v != "brauchen"]
save_json(g4_path, g4)
print("Removed brauchen from A1_1_group_4.json")

g6_path = os.path.join(base_dir, "groups", "A1_1", "A1_1_group_6.json")
g6 = load_json(g6_path)
g6_verbs = [v for v in g6["verbs"] if v != "brauchen"]
if "nehmen" in g6_verbs:
    idx = g6_verbs.index("nehmen")
    g6_verbs.insert(idx + 1, "brauchen")
else:
    g6_verbs.append("brauchen")
g6["verbs"] = g6_verbs
save_json(g6_path, g6)
print("Moved brauchen between nehmen and zeigen in Alltag theme in A1_1_group_6.json")

# 4. wecken: remove from A1_1_group_5.json, move to end of Zeit (A1_2_group_30.json)
g5_path = os.path.join(base_dir, "groups", "A1_1", "A1_1_group_5.json")
g5 = load_json(g5_path)
g5["verbs"] = [v for v in g5["verbs"] if v != "wecken"]
save_json(g5_path, g5)
print("Removed wecken from A1_1_group_5.json")

g30_path = os.path.join(base_dir, "groups", "A1_2", "A1_2_group_30.json")
g30 = load_json(g30_path)
if "wecken" not in g30["verbs"]:
    g30["verbs"].append("wecken")
save_json(g30_path, g30)
print("Added wecken to Zeit theme in A1_2_group_30.json")

# 5. Update cards theme/level properties
update_card("brauchen", theme="Alltag")
update_card("wecken", theme="Zeit", level="A1.2")

print("All card and group operations completed.")
