import os
import json

base_dir = r"c:\Users\juan\Documents\GitHub\juanolaya.github.io\Deutsch_lernen\verben\A1_A2_B1\json\groups\A1_2"

groups = []
for filename in os.listdir(base_dir):
    if filename.endswith(".json") and "group" in filename:
        filepath = os.path.join(base_dir, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # Get the group number from filename
        num = int(filename.split("_group_")[1].split(".json")[0])
        groups.append((num, filename, data.get("theme"), data.get("germanName")))

for g in sorted(groups):
    print(f"Num: {g[0]:<2d} File: {g[1]:<20} Theme: {g[2]:<20} GermanName: {g[3]}")
