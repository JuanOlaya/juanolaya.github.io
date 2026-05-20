import os
import json

base_path = r'c:\Users\juan\Documents\GitHub\juanolaya.github.io\Deutsch_lernen\verben\A1_A2_B1\json'
folders = ['praesens', 'praesens_fragen', 'perfekt', 'perfekt_konjugation', 'praeteritum_konjugation', 'wortfamilie', 'konjunktiv_ii']

culprits = []

for folder in folders:
    folder_path = os.path.join(base_path, folder)
    if not os.path.exists(folder_path):
        continue
    
    for file in os.listdir(folder_path):
        if file.endswith('.json'):
            file_path = os.path.join(folder_path, file)
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    if 'es' in data and isinstance(data['es'], dict):
                        culprits.append(f"{folder}/{file}")
            except Exception as e:
                pass

print("Archivos conflictivos (Clave 'es' en la raíz):")
for c in culprits:
    print(f"- {c}")
