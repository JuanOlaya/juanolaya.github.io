import os

def repair_v5_emergency(file_path):
    # The "Holy Grail" of Mojibake recovery: 
    # Targeted byte-pairs for Spanish and German common characters
    replacements = {
        # Double-encoded Spanish Accents & Ñ
        b'\xc3\x83\xc2\xa1': b'\xc3\xa1', # á
        b'\xc3\x83\xc2\xa9': b'\xc3\xa9', # é
        b'\xc3\x83\xc2\xad': b'\xc3\xad', # í
        b'\xc3\x83\xc2\xb3': b'\xc3\xb3', # ó
        b'\xc3\x83\xc2\xba': b'\xc3\xba', # ú
        b'\xc3\x83\xc2\xb1': b'\xc3\xb1', # ñ
        b'\xc3\x83\xc2\xbf': b'\xc3\xbf', # ¿ (actually encoded as different pattern)
        b'\xc3\x82\xc2\xbf': b'\xc2\xbf', # ¿
        
        # Double-encoded German Umlauts
        b'\xc3\x83\xc2\xa4': b'\xc3\xa4', # ä
        b'\xc3\x83\xc2\xb6': b'\xc3\xb6', # ö
        b'\xc3\x83\xc2\xbc': b'\xc3\xbc', # ü
        b'\xc3\x83\xc2\x9f': b'\xc3\x9f', # ß
        b'\xc3\x83\xc2\x84': b'\xc3\x84', # Ä
        b'\xc3\x83\xc2\x96': b'\xc3\x96', # Ö
        b'\xc3\x83\xc2\x9c': b'\xc3\x9c', # Ü
        
        # Triple-encoded variants observed in index files
        b'\xc3\x83\xc3\x82\xc2\xa4': b'\xc3\xa4',
        b'\xc3\x83\xc3\x82\xc2\xb6': b'\xc3\xb6',
        b'\xc3\x83\xc3\x82\xc2\xbc': b'\xc3\xbc',
    }
    
    try:
        with open(file_path, 'rb') as f:
            content = f.read()
            
        original_content = content
        for bad, good in replacements.items():
            content = content.replace(bad, good)
            
        if content != original_content:
            with open(file_path, 'wb') as f:
                f.write(content)
            return True
    except Exception as e:
        print(f"Error in {file_path}: {e}")
    return False

def run_rescue(root_dirs):
    repaired_files = []
    for d in root_dirs:
        for root, dirs, files in os.walk(d):
            for file in files:
                if file.endswith(('.json', '.html', '.js')):
                    path = os.path.join(root, file)
                    if repair_v5_emergency(path):
                        repaired_files.append(path)
    return repaired_files

if __name__ == "__main__":
    targets = [
        r'c:\Users\juan\Documents\GitHub\juanolaya.github.io\Deutsch_lernen\verben\A1_A2_B1',
        r'c:\Users\juan\Documents\GitHub\juanolaya.github.io\Deutsch_lernen\Einbürgerungstest'
    ]
    fixed = run_rescue(targets)
    print(f"--- REPORTE DE RESCATE EMERGENCIA V5 ---")
    print(f"Archivos rehabilitados: {len(fixed)}")
    print("-" * 40)
    for f in fixed[:30]:
        print(f"[RESCATADO] {f}")
    if len(fixed) > 30:
        print(f"... y {len(fixed) - 30} archivos más.")
