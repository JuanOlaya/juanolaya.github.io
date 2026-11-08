import os
import json

base_path = r'c:\Users\juan\Documents\GitHub\juanolaya.github.io\Deutsch_lernen\verben\A1_A2_B1\json'
# Check ALL subdirectories in json folder
subfolders = [f.name for f in os.scandir(base_path) if f.is_dir()]

culprits = []

for folder in subfolders:
    folder_path = os.path.join(base_path, folder)
    for file in os.listdir(folder_path):
        if file.endswith('.json'):
            file_path = os.path.join(folder_path, file)
            try:
                # Open with utf-8, ignore errors to find files with mojibake too
                with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                    data = json.load(f)
                    # Check for es, wir, ihr, sie at ROOT level
                    dangerous_keys = ['es', 'wir', 'ihr', 'sie']
                    for key in dangerous_keys:
                        if key in data and isinstance(data[key], (dict, str)):
                            # Check if it looks like a pronoun entry or is an object
                            if isinstance(data[key], dict) or folder != 'cards':
                                culprits.append(f"{folder}/{file} (key: {key})")
            except Exception as e:
                pass

print("Archivos con posibles colisiones (Claves de pronombres en la raíz):")
for c in culprits:
    print(f"- {c}")
