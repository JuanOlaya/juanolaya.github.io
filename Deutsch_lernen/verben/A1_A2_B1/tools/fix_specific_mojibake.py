import os

replacements = {
    "estáud.": "estud.",
    "estáudiado": "estudiado",
    "estáudiar": "estudiar",
    "infüringir": "infringir",
    "infüringido": "infringido",
    "infüringió": "infringió",
    "einschr?nken": "einschränken"
}

def fix_mojibake(root_dir):
    modified = 0
    for root, dirs, files in os.walk(root_dir):
        for f in files:
            if f.endswith('.json'):
                path = os.path.join(root, f)
                try:
                    with open(path, 'r', encoding='utf-8') as file:
                        content = file.read()
                except Exception as e:
                    print(f"Error reading {f}: {e}")
                    continue
                
                original = content
                for bad, good in replacements.items():
                    content = content.replace(bad, good)
                
                if content != original:
                    with open(path, 'w', encoding='utf-8', newline='') as file:
                        file.write(content)
                    print(f"Fixed {f}")
                    modified += 1
    print(f"Total fixed: {modified}")

if __name__ == "__main__":
    target = r'c:\Users\juan\Documents\GitHub\juanolaya.github.io\Deutsch_lernen\verben\A1_A2_B1\json'
    fix_mojibake(target)
