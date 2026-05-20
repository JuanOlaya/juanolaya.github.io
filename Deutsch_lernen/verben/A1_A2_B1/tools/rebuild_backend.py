import json
import os
import shutil

INDEX_FILE = r'json/verbs_index.json'
GROUPS_DIR = r'json/groups'
THEMES_DIR = r'json/themes'
CARDS_DIR = r'json/cards'

with open(INDEX_FILE, 'r', encoding='utf-8') as f:
    master_index = json.load(f)

# Clear existing groups and themes
for d in [GROUPS_DIR, THEMES_DIR]:
    if os.path.exists(d):
        shutil.rmtree(d)
    os.makedirs(d)

verb_map = {}

# Rebuild groups and themes
for g in master_index['groups']:
    level = g['level']
    level_prefix = level.replace('.', '_')
    group_num = g['groupNumberPerLevel']
    
    # Track verb mappings for card updates
    for v in g['verbs']:
        verb_map[v] = {
            'level': level,
            'group': group_num,
            'theme': g['groupNameGerman']
        }
    
    # Create group dir
    group_level_dir = os.path.join(GROUPS_DIR, level_prefix)
    os.makedirs(group_level_dir, exist_ok=True)
    
    # Write group file
    group_file = os.path.join(group_level_dir, f"{level_prefix}_group_{group_num}.json")
    group_data = {
        "level": level,
        "theme": g['groupNameGerman'],
        "verbs": g['verbs'],
        "germanName": g['groupNameGerman'],
        "spanishName": g['groupNameSpanish'],
        "englishName": g['groupNameEnglish']
    }
    with open(group_file, 'w', encoding='utf-8') as f:
        json.dump(group_data, f, indent=2, ensure_ascii=False)
        
    # Write theme file
    theme_file = os.path.join(THEMES_DIR, f"{level_prefix}_{group_num}_theme.json")
    theme_data = {
        "level": level,
        "theme": g['groupNameGerman'],
        "germanName": g['groupNameGerman'],
        "spanishName": g['groupNameSpanish'],
        "englishName": g['groupNameEnglish'],
        "description": f"Group {group_num} · {g['groupNameEnglish']}"
    }
    with open(theme_file, 'w', encoding='utf-8') as f:
        json.dump(theme_data, f, indent=2, ensure_ascii=False)

# Update all cards
updated_cards = 0
for filename in os.listdir(CARDS_DIR):
    if filename.endswith('.json'):
        path = os.path.join(CARDS_DIR, filename)
        try:
            with open(path, 'r', encoding='utf-8') as f:
                card_data = json.load(f)
            
            verb = card_data.get('verb')
            if verb in verb_map:
                info = verb_map[verb]
                changed = False
                if card_data.get('level') != info['level']:
                    card_data['level'] = info['level']
                    changed = True
                if card_data.get('group') != info['group']:
                    card_data['group'] = info['group']
                    changed = True
                if card_data.get('theme') != info['theme']:
                    card_data['theme'] = info['theme']
                    changed = True
                
                if changed:
                    with open(path, 'w', encoding='utf-8') as f:
                        json.dump(card_data, f, indent=2, ensure_ascii=False)
                    updated_cards += 1
        except Exception as e:
            print(f"Error processing {filename}: {e}")

print(f"Rebuilt groups and themes. Updated {updated_cards} cards.")
