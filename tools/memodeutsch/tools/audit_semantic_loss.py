import os
import re

def audit_semantic_loss(file_path):
    print(f"--- AUDITORÍA DE PÉRDIDA SEMÁNTICA: {os.path.basename(file_path)} ---")
    try:
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
        
        # Look for literal  or the replacement hex sequence
        # Many editors/viewers show the replacement char differently
        
        # We'll use a regex to find words containing corrupted chars
        # \ufffd is the unicode replacement character
        corrupted_words = re.findall(r'\w*\ufffd\w*', content)
        
        if corrupted_words:
            print(f"Encontradas {len(corrupted_words)} palabras rotas:")
            for word in set(corrupted_words[:20]): # Show unique first 20
                print(f"  - {word}")
        else:
            print("No se encontraron palabras con \u00fffd en modo texto.")
            
        # BINARY CHECK for ef bf bd
        with open(file_path, 'rb') as f:
            bin_content = f.read()
            if b'\xef\xbf\xbd' in bin_content:
                print(f"CONFIRMADO: El archivo tiene {bin_content.count(b'\xef\xbf\xbd')} marcas de reemplazo (ef bf bd).")
    except Exception as e:
        print(f"Error: {e}")

targets = [
    r'c:\Users\juan\Documents\GitHub\juanolaya.github.io\Deutsch_lernen\Einbürgerungstest\lid_kompakt_modal.js',
    r'c:\Users\juan\Documents\GitHub\juanolaya.github.io\Deutsch_lernen\verben\A1_A2_B1\json\verbs_index.json'
]

for t in targets:
    audit_semantic_loss(t)
