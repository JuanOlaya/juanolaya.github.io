import os

base_dir = r"c:\Users\juan\Documents\GitHub\juanolaya.github.io\Deutsch_lernen\verben\A1_A2_B1\json"
found = []

for root, dirs, files in os.walk(base_dir):
    for file in files:
        if file.lower() == "abfliegen.json":
            found.append(os.path.join(root, file))

for path in found:
    print(path)
