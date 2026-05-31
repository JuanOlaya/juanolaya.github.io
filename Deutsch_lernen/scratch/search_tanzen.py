import os
import json

base_dir = r"c:\Users\juan\Documents\GitHub\juanolaya.github.io\Deutsch_lernen\verben\A1_A2_B1\json\groups"
found = []

for root, dirs, files in os.walk(base_dir):
    for file in files:
        if file.endswith(".json"):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                try:
                    data = json.load(f)
                    if "verbs" in data and "tanzen" in data["verbs"]:
                        found.append(filepath)
                except:
                    pass

print("Found tanzen in groups:", found)
