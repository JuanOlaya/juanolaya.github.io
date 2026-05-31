import os

base_dir = r"c:\Users\juan\Documents\GitHub\juanolaya.github.io"
found = []

for root, dirs, files in os.walk(base_dir):
    for file in files:
        if file.endswith(".js") or file.endswith(".html"):
            filepath = os.path.join(root, file)
            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                if "json/themes" in content or "json\\themes" in content:
                    found.append(filepath)
            except Exception as e:
                pass

print("Found usage of json/themes:", found)
