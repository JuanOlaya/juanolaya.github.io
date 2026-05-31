import os

base_path = r"c:\Users\juan\Documents\GitHub\juanolaya.github.io\Deutsch_lernen\verben\A1_A2_B1"

# 1. Update Group file A1_1_group_9.json
group_file = os.path.join(base_path, "json", "groups", "A1_1", "A1_1_group_9.json")
if os.path.exists(group_file):
    with open(group_file, 'r', encoding='utf-8') as f:
        content = f.read()
    content = content.replace('"theme": "Denken"', '"theme": "Gedanke"')
    content = content.replace('"germanName": "Denken"', '"germanName": "Gedanke"')
    with open(group_file, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Updated group file successfully.")
else:
    print("Group file not found!")

# 2. Update Theme file A1_1_7_theme.json
theme_file = os.path.join(base_path, "json", "themes", "A1_1_7_theme.json")
if os.path.exists(theme_file):
    with open(theme_file, 'r', encoding='utf-8') as f:
        content = f.read()
    content = content.replace('"theme": "Denken"', '"theme": "Gedanke"')
    content = content.replace('"germanName": "Denken"', '"germanName": "Gedanke"')
    content = content.replace('"description": "Group 7 · Thought"', '"description": "Group 7 · Gedanke"')
    with open(theme_file, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Updated theme metadata file successfully.")
else:
    print("Theme metadata file not found!")

# 3. Update Card files
cards_dir = os.path.join(base_path, "json", "cards")
target_verbs = ['denken', 'glauben', 'kennen', 'träumen', 'wissen', 'überlegen']
for verb in target_verbs:
    card_file = os.path.join(cards_dir, f"{verb}.json")
    if os.path.exists(card_file):
        with open(card_file, 'r', encoding='utf-8') as f:
            content = f.read()
        content = content.replace('"theme": "Denken"', '"theme": "Gedanke"')
        with open(card_file, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated card file: {verb}.json")
    else:
        print(f"Card file not found: {verb}.json")
