import json
import os

base_path = r'c:\Users\juan\Documents\GitHub\juanolaya.github.io\Deutsch_lernen\verben\A1_A2_B1\json'

# --- 1. Fix verbs_index.json ---
verbs_index_path = os.path.join(base_path, 'verbs_index.json')
with open(verbs_index_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

for group in data['groups']:
    if group['level'] == 'A1.2' and group['groupNameGerman'] == 'Social':
        group['verbCount'] = len(group['verbs'])
        break

with open(verbs_index_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=4, ensure_ascii=False)

# --- 2. Fix file_index.json ---
file_index_path = os.path.join(base_path, 'file_index.json')
with open(file_index_path, 'r', encoding='utf-8', errors='ignore') as f:
    # Use ignore to handle mojibake gracefully, we will fix known keys
    content = f.read()
    # Basic known mojibake fixes in file_index.json
    content = content.replace('tten', 'töten')
    content = content.replace('trumen', 'träumen')
    content = content.replace('ber', 'über')
    content = content.replace('grnden', 'gründen')
    content = content.replace('begrnden', 'begründen')
    file_data = json.loads(content)

# Add 'trauen' to correct categories if missing
for key in ['cards', 'praesens']:
    if 'trauen' not in file_data[key]:
        file_data[key].append('trauen')
        file_data[key].sort()

with open(file_index_path, 'w', encoding='utf-8') as f:
    json.dump(file_data, f, indent=4, ensure_ascii=False)

print("Actualización de índices completada.")
