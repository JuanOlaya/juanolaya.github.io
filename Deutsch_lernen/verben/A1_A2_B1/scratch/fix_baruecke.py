import os

json_dir = r"c:\Users\juan\Documents\GitHub\juanolaya.github.io\Deutsch_lernen\verben\A1_A2_B1\json"

def fix():
    count = 0
    for root, _, files in os.walk(json_dir):
        if "backup-dont_use_them" in root:
            continue
        for file in files:
            if file.endswith('.json'):
                path = os.path.join(root, file)
                try:
                    with open(path, 'r', encoding='utf-8-sig') as f:
                        content = f.read()
                except Exception as e:
                    print(f"Error reading {path}: {e}")
                    continue
                
                if "Bärücke" in content:
                    new_content = content.replace("Bärücke", "Brücke")
                    try:
                        with open(path, 'w', encoding='utf-8') as f:
                            f.write(new_content)
                        print(f"Fixed Bärücke in: {os.path.relpath(path, json_dir)}")
                        count += 1
                    except Exception as e:
                        print(f"Error writing {path}: {e}")
    print(f"Done. Fixed {count} files.")

if __name__ == '__main__':
    fix()
