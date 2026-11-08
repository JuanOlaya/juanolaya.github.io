import os
import json

base_dir = r"c:\Users\juan\Documents\GitHub\juanolaya.github.io\Deutsch_lernen\verben\A1_A2_B1\json\themes"

themes = []
for filename in os.listdir(base_dir):
    if filename.endswith(".json"):
        filepath = os.path.join(base_dir, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)
        themes.append((filename, data.get("level"), data.get("theme")))

for t in sorted(themes):
    print(f"File: {t[0]:<25} Level: {t[1]:<10} Theme: {t[2]}")
