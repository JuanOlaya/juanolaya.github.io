import json
import os

INDEX_FILE = r'json\verbs_index.json'
GROUPS_DIR = r'json\groups'

with open(INDEX_FILE, 'r', encoding='utf-8') as f:
    master_index = json.load(f)

for root, dirs, files in os.walk(GROUPS_DIR):
    for filename in files:
        if filename.endswith('.json'):
            path = os.path.join(root, filename)
            with open(path, 'r', encoding='utf-8') as f:
                try:
                    group_data = json.load(f)
                except Exception as e:
                    print(f"Error reading {path}")
                    continue
            
            theme = group_data.get('germanName') or group_data.get('theme')
            
            # Find in master index
            for mg in master_index['groups']:
                if mg.get('groupNameGerman') == theme or mg.get('theme') == theme:
                    updated = False
                    if group_data.get('verbs') != mg.get('verbs'):
                        group_data['verbs'] = mg['verbs']
                        updated = True
                    if group_data.get('germanName') != mg.get('groupNameGerman'):
                        group_data['germanName'] = mg['groupNameGerman']
                        updated = True
                    if group_data.get('spanishName') != mg.get('groupNameSpanish'):
                        group_data['spanishName'] = mg['groupNameSpanish']
                        updated = True
                    if group_data.get('englishName') != mg.get('groupNameEnglish'):
                        group_data['englishName'] = mg['groupNameEnglish']
                        updated = True
                    
                    if updated:
                        with open(path, 'w', encoding='utf-8') as f:
                            json.dump(group_data, f, indent=2, ensure_ascii=False)
                        print(f"Synched {filename} ({theme}) -> {len(mg['verbs'])} verbs")
                    break

print("Groups directory synchronization complete.")
