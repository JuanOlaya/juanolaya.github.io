
import json
import os

def reorder_verbs():
    json_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'json', 'group_2.json')
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    verbs = data['verbs']
    bezahlen = verbs.pop('bezahlen')

    new_verbs = {}
    for verb, verb_data in verbs.items():
        new_verbs[verb] = verb_data
    new_verbs['bezahlen'] = bezahlen

    data['verbs'] = new_verbs

    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=4)

if __name__ == '__main__':
    reorder_verbs()
