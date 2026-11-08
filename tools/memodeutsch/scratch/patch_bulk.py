import json

filepath = r"c:\Users\juan\Documents\GitHub\juanolaya.github.io\Deutsch_lernen\verben\A1_A2_B1\json\conjugations_bulk\A1_1_conjugations.json"

with open(filepath, 'r', encoding='utf-8') as f:
    data = json.load(f)

if "gefallen" in data:
    data["gefallen"]["praeteritum_conjugations"] = {
        "ich": "gefiel",
        "du": "gefielst",
        "er": "gefiel",
        "sie": "gefiel",
        "es": "gefiel",
        "wir": "gefielen",
        "ihr": "gefielt",
        "sie (plural)": "gefielen",
        "Sie (formal)": "gefielen"
    }
    
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=4, ensure_ascii=False)
    print("Successfully patched bulk conjugations file!")
else:
    print("gefallen not found in bulk file")
