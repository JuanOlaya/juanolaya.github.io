import os

def repair_mojibake(file_path):
    # Mapping of common byte sequences found in the audit
    replacements = {
        b'\xc3\x83\xc2\xa4': b'\xc3\xa4', # ä
        b'\xc3\x83\xc2\xb6': b'\xc3\xb6', # ö
        b'\xc3\x83\xc2\xbc': b'\xc3\xbc', # ü
        b'\xc3\x83\xc2\x9f': b'\xc3\x9f', # ß
        b'\xc3\x83\xc2\x9c': b'\xc3\x9c', # Ü
        b'\xc3\x83\xc2\x96': b'\xc3\x96', # Ö
        b'\xc3\x83\xc2\x84': b'\xc3\x84', # Ä
        b'\xe2\x9c\x85': b'\xe2\x9c\x85', # ✅ (already correct)
        b'\xc3\xa2\xc2\x9c\xc2\x85': b'\xe2\x9c\x85', # Corrupted ✅
        b'\xc3\xb0\xc2\x9f\xc2\x8f\xc2\xa0': b'\xf0\x9f\x8f\xa0', # Corrupted 🏠
        b'\xc3\xa2\xc2\x9c\xc2\x85': b'\xe2\x9c\x85', # Another ✅ pattern
        b'\xef\xbb\xbf': b'', # Remove BOM if present
    }
    
    try:
        with open(file_path, 'rb') as f:
            content = f.read()
        
        original_content = content
        for bad, good in replacements.items():
            content = content.replace(bad, good)
        
        # Heuristic fix for simple UTF-8 saved as Latin1 but containing multi-byte
        # This fixes Ã¤ to ä in a generic way
        try:
            # If it's double encoded: UTF8 -> Latin1 -> UTF8
            # We try to convert back
            test_decoded = content.decode('utf-8').encode('latin1').decode('utf-8')
            content = test_decoded.encode('utf-8')
        except:
            pass

        if content != original_content:
            with open(file_path, 'wb') as f:
                f.write(content)
            return True
    except Exception as e:
        print(f"Error repairing {file_path}: {e}")
    return False

def run_repair(root_dir):
    repaired_files = []
    for root, dirs, files in os.walk(root_dir):
        for file in files:
            if file.endswith(('.json', '.html', '.js')):
                path = os.path.join(root, file)
                if repair_mojibake(path):
                    repaired_files.append(path)
    return repaired_files

if __name__ == "__main__":
    target = r'c:\Users\juan\Documents\GitHub\juanolaya.github.io\Deutsch_lernen\verben\A1_A2_B1'
    fixed = run_repair(target)
    print(f"--- REPORTE DE SANEAMIENTO ---")
    print(f"Archivos reparados: {len(fixed)}")
    print("-" * 30)
    for f in fixed[:20]:
        print(f"[REPARADO] {os.path.relpath(f, target)}")
    if len(fixed) > 20:
        print(f"... y {len(fixed) - 20} archivos más.")
