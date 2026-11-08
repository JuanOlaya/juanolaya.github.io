import os
import json

files = [
    r'c:\Users\juan\Documents\GitHub\juanolaya.github.io\Deutsch_lernen\verben\A1_A2_B1\json\cards\bestellen.json',
    r'c:\Users\juan\Documents\GitHub\juanolaya.github.io\Deutsch_lernen\verben\A1_A2_B1\json\conjugations\praesens\bestellen.json',
    r'c:\Users\juan\Documents\GitHub\juanolaya.github.io\Deutsch_lernen\verben\A1_A2_B1\json\conjugations\praeteritum\bestellen.json',
    r'c:\Users\juan\Documents\GitHub\juanolaya.github.io\Deutsch_lernen\verben\A1_A2_B1\json\examples\perfekt_examples\bestellen.json',
    r'c:\Users\juan\Documents\GitHub\juanolaya.github.io\Deutsch_lernen\verben\A1_A2_B1\json\examples\praesens_examples\bestellen.json',
    r'c:\Users\juan\Documents\GitHub\juanolaya.github.io\Deutsch_lernen\verben\A1_A2_B1\json\examples\praesens_question_examples\bestellen.json',
    r'c:\Users\juan\Documents\GitHub\juanolaya.github.io\Deutsch_lernen\verben\A1_A2_B1\json\examples\praeteritum_examples\bestellen.json',
    r'c:\Users\juan\Documents\GitHub\juanolaya.github.io\Deutsch_lernen\verben\A1_A2_B1\json\perfekt_konjugation\bestellen.json',
    r'c:\Users\juan\Documents\GitHub\juanolaya.github.io\Deutsch_lernen\verben\A1_A2_B1\json\praesens\bestellen.json',
    r'c:\Users\juan\Documents\GitHub\juanolaya.github.io\Deutsch_lernen\verben\A1_A2_B1\json\praesens_fragen\bestellen.json',
    r'c:\Users\juan\Documents\GitHub\juanolaya.github.io\Deutsch_lernen\verben\A1_A2_B1\json\praeteritum_konjugation\bestellen.json',
    r'c:\Users\juan\Documents\GitHub\juanolaya.github.io\Deutsch_lernen\verben\A1_A2_B1\json\wortfamilie\bestellen.json'
]

for filepath in files:
    if os.path.exists(filepath):
        print(f"\n--- {os.path.basename(filepath)} ---")
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            # Print if there is a top-level "es" key
            if "es" in data:
                print(f"Top-level 'es': {repr(data['es'])}")
            
            # Also check if it's a list or dict and has "es" keys inside
            if isinstance(data, dict):
                for k, v in data.items():
                    if k.endswith("_es") or k == "es_perfekt" or k == "es_praeteritum":
                        print(f"Key '{k}': {repr(v)}")
            elif isinstance(data, list):
                for item in data:
                    if isinstance(item, dict) and "es" in item:
                        print(f"Item 'es': {repr(item['es'])}")
        except Exception as e:
            print(f"Error parsing: {e}")
