import json

file_path = r'c:\Users\juan\Documents\GitHub\juanolaya.github.io\Deutsch_lernen\verben\A1_A2_B1\json\file_index.json'

with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

verb_to_add = "kennzeichnen"
# Only add to categories where we created files
target_categories = ["cards", "praesens", "perfekt", "wortfamilie"]

for category in target_categories:
    if category in data and isinstance(data[category], list):
        if verb_to_add not in data[category]:
            data[category].append(verb_to_add)
            data[category].sort()
            print(f"Added {verb_to_add} to {category}")

with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=4, ensure_ascii=False)

print("Done!")
