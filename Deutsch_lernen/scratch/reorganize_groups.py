import os
import json
import shutil

base_path = r"c:\Users\juan\Documents\GitHub\juanolaya.github.io\Deutsch_lernen\verben\A1_A2_B1"

# 1. Load A1_2_group_15.json (Wohnen)
wohnen_group_file = os.path.join(base_path, "json", "groups", "A1_2", "A1_2_group_15.json")
with open(wohnen_group_file, 'r', encoding='utf-8') as f:
    wohnen_data = json.load(f)

# Change level to A1.1
wohnen_data["level"] = "A1.1"

# 2. Shift A1_1 groups (12-15 become 13-16)
a1_1_dir = os.path.join(base_path, "json", "groups", "A1_1")
for i in range(15, 11, -1):
    src = os.path.join(a1_1_dir, f"A1_1_group_{i}.json")
    dst = os.path.join(a1_1_dir, f"A1_1_group_{i+1}.json")
    if os.path.exists(src):
        if os.path.exists(dst):
            os.remove(dst)
        os.rename(src, dst)
        print(f"Renamed {os.path.basename(src)} -> {os.path.basename(dst)}")

# Write the new A1_1_group_12.json
new_wohnen_file = os.path.join(a1_1_dir, "A1_1_group_12.json")
with open(new_wohnen_file, 'w', encoding='utf-8') as f:
    json.dump(wohnen_data, f, indent=2, ensure_ascii=False)
print("Created new A1_1_group_12.json (Wohnen)")

# 3. Shift A1_2 groups (16-31 become 15-30)
a1_2_dir = os.path.join(base_path, "json", "groups", "A1_2")
# First delete A1_2_group_15.json
if os.path.exists(wohnen_group_file):
    os.remove(wohnen_group_file)
    print("Deleted A1_2_group_15.json")

for i in range(16, 32):
    src = os.path.join(a1_2_dir, f"A1_2_group_{i}.json")
    dst = os.path.join(a1_2_dir, f"A1_2_group_{i-1}.json")
    if os.path.exists(src):
        if os.path.exists(dst):
            os.remove(dst)
        os.rename(src, dst)
        print(f"Renamed {os.path.basename(src)} -> {os.path.basename(dst)}")

# 4. Clean up theme files in json/themes
themes_dir = os.path.join(base_path, "json", "themes")
for filename in os.listdir(themes_dir):
    if filename.startswith("A1_1_") or filename.startswith("A1_2_"):
        filepath = os.path.join(themes_dir, filename)
        os.remove(filepath)
print("Cleaned A1_1 and A1_2 theme files in json/themes")

# 5. Update card level for Wohnen verbs
wohnen_verbs = ["suchen", "besuchen", "finden", "einziehen", "wohnen", "einrichten"]
cards_dir = os.path.join(base_path, "json", "cards")
for verb in wohnen_verbs:
    card_file = os.path.join(cards_dir, f"{verb}.json")
    if os.path.exists(card_file):
        with open(card_file, 'r', encoding='utf-8') as f:
            card_data = json.load(f)
        card_data["level"] = "A1.1"
        with open(card_file, 'w', encoding='utf-8') as f:
            json.dump(card_data, f, indent=4, ensure_ascii=False)
        print(f"Updated level to A1.1 in {verb}.json")

print("\nReorganization script complete.")
