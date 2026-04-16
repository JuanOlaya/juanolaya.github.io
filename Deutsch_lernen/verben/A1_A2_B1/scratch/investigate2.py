import json

with open('json/verbs_index.json', 'r', encoding='utf-8') as f:
    d = json.load(f)

a12_groups = [g for g in d['groups'] if g['level'] == 'A1.2']
print(f"Total A1.2 groups: {len(a12_groups)}")
for idx, g in enumerate(a12_groups):
    print(f"Index {idx}, Theme {g.get('groupNameGerman', '')}")
