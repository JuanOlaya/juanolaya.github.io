import os

base_dir = r"c:\Users\juan\Documents\GitHub\juanolaya.github.io\Deutsch_lernen\verben\A1_A2_B1\json"
found_files = []

for root, dirs, files in os.walk(base_dir):
    for file in files:
        if file.lower() == "bestellen.json":
            found_files.append(os.path.join(root, file))

print("Found files:", found_files)
