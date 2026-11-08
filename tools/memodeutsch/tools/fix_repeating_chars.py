import os
import re

def collapse_repeating_accents(file_path):
    print(f"--- SANEANDO CORDURA: {os.path.basename(file_path)} ---")
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            
        original_content = content
        
        # Regex to find repeating accented characters (2 or more)
        # We target á, é, í, ó, ú, ñ, ¿, ¡, and German umlauts
        patterns = [
            (r'á{2,}', 'á'),
            (r'é{2,}', 'é'),
            (r'í{2,}', 'í'),
            (r'ó{2,}', 'ó'),
            (r'ú{2,}', 'ú'),
            (r'ñ{2,}', 'ñ'),
            (r'¿{2,}', '¿'),
            (r'¡{2,}', '¡'),
            (r'ü{2,}', 'ü'),
            (r'ö{2,}', 'ö'),
            (r'ä{2,}', 'ä'),
            (r'ß{2,}', 'ß'),
            (r' {2,}', ' '), # Also collapse double spaces
        ]
        
        for p, r in patterns:
            content = re.sub(p, r, content)
            
        # Specific fix for the '?' marks seen in the view
        content = content.replace(' Berl?n', ' Berlín')
        content = content.replace(' qu? ', ' qué ')
        content = content.replace(' construy? ', ' construyó ')
        
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
    except Exception as e:
        print(f"Error in {file_path}: {e}")
    return False

targets = [
    r'c:\Users\juan\Documents\GitHub\juanolaya.github.io\Deutsch_lernen\Einbürgerungstest\lid_kompakt_modal.js',
    r'c:\Users\juan\Documents\GitHub\juanolaya.github.io\Deutsch_lernen\verben\A1_A2_B1\script\script.js'
]

for t in targets:
    if collapse_repeating_accents(t):
        print(f"[RESTAURADO] {t}")
