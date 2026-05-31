import os

tools_dir = r"c:\Users\juan\Documents\GitHub\juanolaya.github.io\Deutsch_lernen\verben\A1_A2_B1\tools"
found = []

for filename in os.listdir(tools_dir):
    if filename.endswith(".js") or filename.endswith(".py"):
        filepath = os.path.join(tools_dir, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        if "theme" in content.lower():
            found.append(filename)

print("Found files with 'theme':", found)
