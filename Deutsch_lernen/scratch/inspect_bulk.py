import json

filepath = r"c:\Users\juan\Documents\GitHub\juanolaya.github.io\Deutsch_lernen\verben\A1_A2_B1\json\conjugations_bulk\A1_1_conjugations.json"

with open(filepath, 'r', encoding='utf-8') as f:
    data = json.load(f)

# Find if "gefallen" exists in the data and print it
if "gefallen" in data:
    print(json.dumps(data["gefallen"], indent=4))
else:
    print("gefallen not found in bulk file")
