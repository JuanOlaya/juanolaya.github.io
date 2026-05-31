import os
import json

base_path = r"c:\Users\juan\Documents\GitHub\juanolaya.github.io\Deutsch_lernen\verben\A1_A2_B1"

def update_card(verb, updates):
    filepath = os.path.join(base_path, "json", "cards", f"{verb}.json")
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)
        data.update(updates)
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=4, ensure_ascii=False)
        print(f"Updated card: {verb}.json")
    else:
        print(f"Card not found: {verb}.json")

# 1. Update wohnen.json
update_card("wohnen", {
    "es": "residir en un lugar",
    "card_es": "residir en un lugar"
})

# 2. Update leben.json
update_card("leben", {
    "es": "vivir (existir, llevar una vida)",
    "card_es": "vivir"
})

# 3. Update einziehen.json
update_card("einziehen", {
    "es": "mudarse (hacia dentro)",
    "card_es": "mudarse (hacia dentro)"
})

# 4. Update umziehen.json
update_card("umziehen", {
    "es": "mudarse de casa, cambiarse de ropa",
    "card_es": "mudarse de casa, cambiarse de ropa"
})

# 5. Update anprobieren.json
update_card("anprobieren", {
    "es": "probarse ropa",
    "card_es": "probarse ropa"
})

# 6. Update probieren.json
update_card("probieren", {
    "es": "probar algo, intentar",
    "card_es": "probar algo, intentar"
})

# 7. Update tragen.json
update_card("tragen", {
    "es": "llevar puesto ropa, llevar, cargar",
    "card_es": "llevar puesto ropa, llevar, cargar"
})

# 8. Update fliegen.json
update_card("fliegen", {
    "es": "volar, viajar por aire",
    "card_es": "volar, viajar por aire"
})

# 9. Update abfliegen.json (requires removing some keys)
abfliegen_card_path = os.path.join(base_path, "json", "cards", "abfliegen.json")
if os.path.exists(abfliegen_card_path):
    with open(abfliegen_card_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Remove praesens if it exists
    if "praesens" in data:
        del data["praesens"]
    
    # Change english key "en" to "en_verb" and add "en_perfekt"
    if "en" in data:
        data["en_verb"] = data["en"]
        del data["en"]
    else:
        data["en_verb"] = "to fly off / depart"
        
    data["en_perfekt"] = "has departed / flown off"
    data["es"] = "despegar, salir en avión"
    data["card_es"] = "despegar, salir en avión"
    data["perfekt"] = "ist abgeflogen"
    data["praeteritum"] = "er/sie/es flog ab"
    data["es_perfekt"] = "ha despegado / ha salido en avión"
    data["case_tags"] = ["Irregular", "INTR", "Separable", "A1👂"]
    data["tags"] = ["🚀 Movimiento"] # Since it's a departure, it is movement, not static!
    
    with open(abfliegen_card_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=4, ensure_ascii=False)
    print("Updated card: abfliegen.json")

# 10. Update praesens/abfliegen.json
praesens_file = os.path.join(base_path, "json", "praesens", "abfliegen.json")
if os.path.exists(praesens_file):
    with open(praesens_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    data.update({
        "ich": "fliege ab",
        "du": "fliegst ab",
        "er/sie/es": "fliegt ab",
        "wir": "fliegen ab",
        "ihr": "fliegt ab",
        "Sie/sie": "fliegen ab"
    })
    with open(praesens_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=4, ensure_ascii=False)
    print("Updated: praesens/abfliegen.json")

# 11. Update perfekt_konjugation/abfliegen.json
perfekt_konj_file = os.path.join(base_path, "json", "perfekt_konjugation", "abfliegen.json")
if os.path.exists(perfekt_konj_file):
    with open(perfekt_konj_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    data["hilfsverb"] = "sein"
    data["past_participle"] = "abgeflogen"
    with open(perfekt_konj_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=4, ensure_ascii=False)
    print("Updated: perfekt_konjugation/abfliegen.json")

# 12. Update praeteritum_konjugation/abfliegen.json
praeteritum_konj_file = os.path.join(base_path, "json", "praeteritum_konjugation", "abfliegen.json")
if os.path.exists(praeteritum_konj_file):
    with open(praeteritum_konj_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    data.update({
        "ich": "flog ab",
        "du": "flogst ab",
        "er/sie/es": "flog ab",
        "wir": "flogen ab",
        "ihr": "flogt ab",
        "Sie/sie": "flogen ab"
    })
    with open(praeteritum_konj_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=4, ensure_ascii=False)
    print("Updated: praeteritum_konjugation/abfliegen.json")

# 13. Remove tanzen from A1_1_group_3.json
group_3_file = os.path.join(base_path, "json", "groups", "A1_1", "A1_1_group_3.json")
if os.path.exists(group_3_file):
    with open(group_3_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    if "verbs" in data and "tanzen" in data["verbs"]:
        data["verbs"].remove("tanzen")
    with open(group_3_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print("Removed tanzen from A1_1_group_3.json")

# 14. Update tanzen card group settings
update_card("tanzen", {
    "level": "A1.2",
    "theme": "Feier",
    "group": 16
})

# 15. Change Pendeln theme name to Transport in group file A1_2_group_23.json
group_23_file = os.path.join(base_path, "json", "groups", "A1_2", "A1_2_group_23.json")
if os.path.exists(group_23_file):
    with open(group_23_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    data["theme"] = "Transport"
    data["germanName"] = "Transport"
    data["spanishName"] = "Transporte"
    data["englishName"] = "Transport"
    with open(group_23_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print("Updated theme name to Transport in A1_2_group_23.json")

# 16. Update theme name for Pendeln verbs cards
pendeln_verbs = ["aussteigen", "einsteigen", "parken", "umsteigen", "wenden", "überqueren"]
for verb in pendeln_verbs:
    update_card(verb, {
        "theme": "Transport"
    })

print("\nAll programmatic updates applied.")
