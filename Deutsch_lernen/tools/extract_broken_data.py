import os

target = r'c:\Users\juan\Documents\GitHub\juanolaya.github.io\Deutsch_lernen\Einbürgerungstest\lid_kompakt_modal.js'
output = r'c:\Users\juan\Documents\GitHub\juanolaya.github.io\Deutsch_lernen\broken_lines_lid.txt'

try:
    # We read with 'ignore' or 'replace' to capture the  character
    with open(target, 'r', encoding='utf-8', errors='replace') as f:
        lines = f.readlines()
        
    broken = []
    for i, line in enumerate(lines):
        # We look for the replacement character \ufffd ()
        # or suspicious ? in Spanish context if any
        if '\ufffd' in line:
            broken.append(f"L{i+1}: {line}")
            
    with open(output, 'w', encoding='utf-8') as f:
        f.writelines(broken)
        
    print(f"--- REPORTE DE EXTRACCIÓN ---")
    print(f"Frases rotas encontradas: {len(broken)}")
    print(f"Archivo de revisión guardado en: {output}")
    
except Exception as e:
    print(f"Error: {e}")
