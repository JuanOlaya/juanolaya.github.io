import os

groups_dir = r"c:\Users\juan\Documents\GitHub\juanolaya.github.io\Deutsch_lernen\verben\A1_A2_B1\json\groups"
found = []

for root, dirs, files in os.walk(groups_dir):
    for file in files:
        if file.endswith(".json"):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            if "examContext" in content or "germanDescription" in content:
                found.append(filepath)

print("Found group files with metadata fields:", found)
