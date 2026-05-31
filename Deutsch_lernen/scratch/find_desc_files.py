import os

base_dir = r"c:\Users\juan\Documents\GitHub\juanolaya.github.io\Deutsch_lernen\verben\A1_A2_B1"
found = []

for root, dirs, files in os.walk(base_dir):
    for file in files:
        if file.endswith(".js") or file.endswith(".py"):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            if "germanDescription" in content:
                found.append(filepath)

print("Found files:", found)
