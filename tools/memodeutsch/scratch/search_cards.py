import os

cards_dir = r"c:\Users\juan\Documents\GitHub\juanolaya.github.io\Deutsch_lernen\verben\A1_A2_B1\json\cards"
matching_files = []

for filename in os.listdir(cards_dir):
    if filename.endswith(".json"):
        filepath = os.path.join(cards_dir, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            if '"theme": "Denken"' in content or '"theme": "Denken"' in content.replace(' ', ''):
                matching_files.append(filename)

print("Matching files:", matching_files)
