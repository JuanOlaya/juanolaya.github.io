import os
import json

base_dir = r"c:\Users\juan\Documents\GitHub\juanolaya.github.io\Deutsch_lernen\verben\A1_A2_B1\json"

# Helper to read/write JSON safely
def load_json(path):
    with open(path, "r", encoding="utf-8-sig") as f:
        return json.load(f)

def save_json(path, data):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

def update_card(verb, theme=None, es=None, card_es=None, es_searchable=None, note=None):
    path = os.path.join(base_dir, "cards", f"{verb}.json")
    if os.path.exists(path):
        data = load_json(path)
        if theme is not None:
            data["theme"] = theme
        if es is not None:
            data["es"] = es
        if card_es is not None:
            data["card_es"] = card_es
        if es_searchable is not None:
            data["es_searchable"] = es_searchable
        if note is not None:
            data["note"] = note
        
        # Write back indented by 4 spaces (matching cards style)
        with open(path, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=4)
        print(f"Updated card {verb}.json")
    else:
        print(f"ERROR: Card {verb}.json not found at {path}")

# 1. Update theme configuration B1_1_17_theme.json (íâ€“kologie -> Ökologie)
t17_path = os.path.join(base_dir, "themes", "B1_1_17_theme.json")
if os.path.exists(t17_path):
    t17 = load_json(t17_path)
    t17["theme"] = "Ökologie"
    t17["germanName"] = "Ökologie"
    save_json(t17_path, t17)
    print("Updated B1_1_17_theme.json theme name to Ökologie")

# 2. Update group configuration B1_1_group_17.json (íâ€“kologie -> Ökologie)
g17_path = os.path.join(base_dir, "groups", "B1_1", "B1_1_group_17.json")
if os.path.exists(g17_path):
    g17 = load_json(g17_path)
    g17["theme"] = "Ökologie"
    g17["germanName"] = "Ökologie"
    save_json(g17_path, g17)
    print("Updated B1_1_group_17.json theme name to Ökologie")

# 3. Update all Group 17 cards to use theme "Ökologie"
for v in ["schützen", "verschmutzen", "verbrauchen", "recyceln"]:
    update_card(v, theme="Ökologie")

# 4. Update card trennen.json (theme, es, card_es, es_searchable, note)
update_card("trennen", 
            theme="Ökologie",
            es="desconectar, separar",
            card_es="desconectar, separar",
            es_searchable=["desconectar", "separar"],
            note="<b>Ejemplos:</b><br>1. Wir müssen den Müll <b>trennen</b>. (separar)<br>2. Du musst das Kabel vom Strom <b>trennen</b>. (desconectar)")

# 5. Update card dürfen.json
update_card("dürfen",
            es="tener permiso, estar autorizado",
            card_es="tener permiso, estar autorizado",
            es_searchable=["tener", "permiso", "estar", "autorizado"])

# 6. Update card können.json
update_card("können",
            es="tener habilidad, posibilidad",
            card_es="tener habilidad, posibilidad",
            es_searchable=["tener", "habilidad", "posibilidad"])

# 7. Update card wissen.json
update_card("wissen",
            es="saber información, o conocimientos",
            card_es="saber información, o conocimientos",
            es_searchable=["saber", "información", "o", "conocimientos"])

# 8. Update card kennen.json
update_card("kennen",
            es="conocer personas, lugares o cosas",
            card_es="conocer personas, lugares o cosas",
            es_searchable=["conocer", "personas", "lugares", "o", "cosas"])

# 9. Update praesens_examples/können.json for pronoun "es"
k_examples_path = os.path.join(base_dir, "examples", "praesens_examples", "können.json")
if os.path.exists(k_examples_path):
    k_ex = load_json(k_examples_path)
    k_ex["praesens_examples"]["es"] = {
        "de": "<b>Es kann regnen.</b>",
        "en": "It can rain.",
        "es": "Puede llover."
    }
    save_json(k_examples_path, k_ex)
    print("Updated es pronoun example in praesens_examples/können.json")

print("All card, theme, and example migrations completed.")
