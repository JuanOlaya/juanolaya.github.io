import os

base_dir = r"c:\Users\juan\Documents\GitHub\juanolaya.github.io\Deutsch_lernen\verben"
found = []

for root, dirs, files in os.walk(base_dir):
    for file in files:
        if file.endswith(".json") or file.endswith(".js"):
            filepath = os.path.join(root, file)
            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                if "gefallte" in content.lower():
                    found.append((filepath, file))
            except Exception as e:
                pass

print("Found occurrences:", found)
