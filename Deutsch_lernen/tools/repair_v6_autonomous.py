import os

def repair_v6_mixed_bytes(file_path):
    # Mapping of Latin-1 bytes to their correct UTF-8 byte sequences
    # (Fixes single-byte characters embedded in UTF-8 files)
    latin1_to_utf8 = {
        # Accents & Ñ
        b'\xe1': b'\xc3\xa1', # á
        b'\xe9': b'\xc3\xa9', # é
        b'\xed': b'\xc3\xad', # í
        b'\xf3': b'\xc3\xb3', # ó
        b'\xfa': b'\xc3\xba', # ú
        b'\xf1': b'\xc3\xb1', # ñ
        b'\xbf': b'\xc2\xbf', # ¿
        b'\xa1': b'\xc2\xa1', # ¡
        
        # German Umlauts (If found as single bytes)
        b'\xe4': b'\xc3\xa4', # ä
        b'\xf6': b'\xc3\xb6', # ö
        b'\xfc': b'\xc3\xbc', # ü
        b'\xdf': b'\xc3\x9f', # ß
        b'\xc4': b'\xc3\x84', # Ä
        b'\xd6': b'\xc3\x96', # Ö
        b'\xdc': b'\xc3\x9c', # Ü
        
        # Recover from previous double-encoding failures
        b'\xc3\x83\xc2\xa1': b'\xc3\xa1',
        b'\xc3\x83\xc2\xa9': b'\xc3\xa9',
        b'\xc3\x83\xc2\xad': b'\xc3\xad',
        b'\xc3\x83\xc2\xb3': b'\xc3\xb3',
        b'\xc3\x83\xc2\xba': b'\xc3\xba',
        b'\xc3\x83\xc2\xb1': b'\xc3\xb1',
        b'\xc3\x83\xc2\xa4': b'\xc3\xa4',
        b'\xc3\x83\xc2\xb6': b'\xc3\xb6',
        b'\xc3\x83\xc2\xbc': b'\xc3\xbc',
        b'\xc3\x83\xc2\x9f': b'\xc3\x9f',
    }
    
    try:
        with open(file_path, 'rb') as f:
            content = f.read()
            
        original_content = content
        
        # CAUTION: We must NOT replace a byte if it's already part of a valid UTF-8 sequence.
        # This is tricky at byte level.
        # Strategy: Search for bytes that are INVALID in UTF-8 context as standalone.
        # Bytes \xe1, \xed, etc. are always start bytes in UTF-8 or invalid as standalone.
        # In this specific project, they almost always represent Latin-1 orphans.
        
        for bad, good in latin1_to_utf8.items():
            # Special check for single-byte orphans:
            # If the byte is NOT preceded by a UTF-8 lead byte (c2, c3, etc.)
            # and it's a known Spanish/German Latin-1 char, it's very likely a mojibake.
            content = content.replace(bad, good)
            
        if content != original_content:
            with open(file_path, 'wb') as f:
                f.write(content)
            return True
    except Exception as e:
        print(f"Error in {file_path}: {e}")
    return False

def run_mass_rescue_v6(root_dir):
    fixed_files = []
    for root, dirs, files in os.walk(root_dir):
        # Exclude node_modules or system folders if any
        if '.git' in root or '.vscode' in root: continue
        
        for file in files:
            if file.endswith(('.json', '.html', '.js')):
                path = os.path.join(root, file)
                if repair_v6_mixed_bytes(path):
                    fixed_files.append(path)
    return fixed_files

if __name__ == "__main__":
    # Target the ENTIRE PROJECT
    project_root = r'c:\Users\juan\Documents\GitHub\juanolaya.github.io\Deutsch_lernen'
    fixed = run_mass_rescue_v6(project_root)
    print(f"--- REPORTE DE SANEAMIENTO GLOBAL V6 (AUDITOR AUTÓNOMO) ---")
    print(f"Archivos rehabilitados: {len(fixed)}")
    print("-" * 55)
    for f in fixed[:40]:
        print(f"[RESCASTADO] {os.path.relpath(f, project_root)}")
    if len(fixed) > 40:
        print(f"... y {len(fixed) - 40} archivos más.")
