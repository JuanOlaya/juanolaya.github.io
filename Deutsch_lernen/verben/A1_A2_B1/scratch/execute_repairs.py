import os
import json
import re

json_dir = r"c:\Users\juan\Documents\GitHub\juanolaya.github.io\Deutsch_lernen\verben\A1_A2_B1\json"

# Valid Spanish verb forms for "estar" that should NOT be modified
VALID_ESTA_FORMS = {
    "está",
    "estás",
    "están",
    "estábamos",
    "estábais",
    "estáramos",
    "estásemos"
}

def clean_esta_in_word(word):
    # If the word is a valid Spanish form of estar, leave it alone
    if word.lower() in VALID_ESTA_FORMS:
        return word
    
    # Otherwise, if "está" is inside the word, replace all occurrences with "est"
    # E.g. estáar -> estar, bestáimmt -> bestimmt, wärestá -> wärest
    if "está" in word:
        return word.replace("está", "est")
    return word

def clean_esta_text(text):
    # Regex to find all words containing letters and possibly accents/umlauts
    # We want to match whole words and clean them
    word_pattern = re.compile(r'([a-zA-ZáéíóúüñäöÖÄÜßí]+)')
    
    def replace_word(match):
        word = match.group(1)
        return clean_esta_in_word(word)
    
    return word_pattern.sub(replace_word, text)

def clean_spanish_fur(text):
    # Replace "für" with "fr" in Spanish text (e.g. füracasar -> fracasar, fürío -> frío, infüringe -> infringe)
    # Let's handle cases like "für", "infüringe", etc.
    text = text.replace("füracasar", "fracasar")
    text = text.replace("fürío", "frío")
    text = text.replace("infüringe", "infringe")
    text = text.replace("füronteras", "fronteras")
    # Generic "für" in Spanish words that might remain
    # If it is part of a word in Spanish like "es": "el füruto" -> "el fruto"
    text = re.sub(r'\bfür([a-z]+)', r'fr\1', text)
    text = re.sub(r'([a-z]+)für([a-z]*)', r'\1fr\2', text)
    return text

def clean_repeating_accents(text):
    # 1. Collapse repeating óóó... to ó in words like construyóóóó... and cayóóóó...
    text = re.sub(r'construyó+', 'construyó', text)
    text = re.sub(r'cayó+', 'cayó', text)
    
    # 2. Fix construyééééndo -> construyendo, cayééééron -> cayeron
    text = re.sub(r'construyé+ndo', 'construyendo', text)
    text = re.sub(r'cayé+ron', 'cayeron', text)
    
    # 3. Fix cayóóóo -> cayó
    text = re.sub(r'cayó+o', 'cayó', text)
    
    # 4. Collapse any other repeating accented characters (3 or more) to 1
    # E.g. óóó -> ó
    text = re.sub(r'([áéíóúüäöÖÄÜß])\1{2,}', r'\1', text)
    
    # 5. Fix construyóendo -> construyendo
    text = text.replace("construyóendo", "construyendo")
    
    return text

def process_value(key, value):
    if not isinstance(value, str):
        return value
        
    original = value
    
    # 1. Clean está corruptions
    value = clean_esta_text(value)
    
    # 2. Clean Día -> Da corruptions
    # E.g. Díasein -> Dasein, Días -> Das, (+Díat) -> (+Dat) / (+Dativ), Díativ -> Dativ
    value = value.replace("Díasein", "Dasein")
    value = value.replace("Díauer", "Dauer")
    value = value.replace("Díank", "Dank")
    value = value.replace("Días", "Das")
    value = value.replace("Díatos", "Datos")
    value = value.replace("Díat", "Dat")
    value = value.replace("Díativ", "Dativ")
    value = value.replace("Día clases", "Da clases")
    
    # 3. Clean Spanish specific corruptions for keys related to Spanish
    is_spanish_key = any(k in key.lower() for k in ["es", "spanish"])
    if is_spanish_key:
        value = clean_spanish_fur(value)
        value = value.replace("divididaño", "dividido")
        
    # 4. Clean repeating accents
    value = clean_repeating_accents(value)
    
    if value != original:
        return value
    return original

def clean_json_struct(data, parent_key=""):
    if isinstance(data, dict):
        new_dict = {}
        for k, v in data.items():
            new_dict[k] = clean_json_struct(v, k)
        return new_dict
    elif isinstance(data, list):
        return [clean_json_struct(item, parent_key) for item in data]
    elif isinstance(data, str):
        return process_value(parent_key, data)
    else:
        return data

def run_repairs():
    modified_count = 0
    
    for root, dirs, files in os.walk(json_dir):
        if "backup-dont_use_them" in root:
            continue
        for file in files:
            if file.endswith('.json'):
                file_path = os.path.join(root, file)
                rel_path = os.path.relpath(file_path, json_dir)
                
                try:
                    # Read using utf-8-sig to automatically handle BOM and strip it
                    with open(file_path, 'r', encoding='utf-8-sig') as f:
                        data = json.load(f)
                except Exception as e:
                    print(f"Error reading/parsing {rel_path}: {e}")
                    continue
                
                # Recursively process the JSON structure
                new_data = clean_json_struct(data)
                
                # Check if anything changed
                # We can serialize and compare
                orig_str = json.dumps(data, ensure_ascii=False)
                new_str = json.dumps(new_data, ensure_ascii=False)
                
                if orig_str != new_str:
                    # Save back as standard UTF-8 without BOM, formatted nicely
                    with open(file_path, 'w', encoding='utf-8') as f:
                        json.dump(new_data, f, ensure_ascii=False, indent=4)
                    print(f"Repaired and saved: {rel_path}")
                    modified_count += 1
                    
    print(f"\nRepairs completed. Total files modified: {modified_count}")

if __name__ == '__main__':
    run_repairs()
