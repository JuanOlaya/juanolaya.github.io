import os
import re

def repair_mojibake_definitive(file_path):
    # Mapping of specific mojibake byte patterns found in the filtered audit
    # Uses a more aggressive byte-level matching
    replacements = {
        # House Emoji Variants: ðŸ  
        b'\xc3\xb0\xc5\xb8\xc2\x8f\xc2\xa0': b'\xf0\x9f\x8f\xa0',
        b'\xc3\xb0\xc2\x9f\xc2\x8f\xc2\xa0': b'\xf0\x9f\x8f\xa0',
        # Checkmark Emoji Variants: âœ…
        b'\xc3\xa2\xc5\x93\xe2\x80\xa6': b'\xe2\x9c\x85',
        b'\xc3\xa2\xc2\x9c\xc2\x85': b'\xe2\x9c\x85',
        # German Umlauts (Double Encoded)
        b'\xc3\x83\xc2\xa4': b'\xc3\xa4', # ä
        b'\xc3\x83\xc2\xb6': b'\xc3\xb6', # ö
        b'\xc3\x83\xc2\xbc': b'\xc3\xbc', # ü
        b'\xc3\x83\xc2\x9f': b'\xc3\x9f', # ß
        b'\xc3\x83\xc2\x84': b'\xc3\x84', # Ä
        b'\xc3\x83\xc2\x96': b'\xc3\x96', # Ö
        b'\xc3\x83\xc2\x9c': b'\xc3\x9c', # Ü
    }
    
    try:
        with open(file_path, 'rb') as f:
            content = f.read()
            
        original_content = content
        
        # 1. Targeted byte replacements
        for bad, good in replacements.items():
            content = content.replace(bad, good)
            
        # 2. Heuristic multi-pass restoration
        # (This handles triple or inconsistent encoding)
        for _ in range(2):
            try:
                text = content.decode('utf-8')
                # Look for suspicious patterns to trigger recovery
                if any(x in text for x in ['Ã', 'â', 'ð', 'Ÿ']):
                    # Try to unpeel one layer of encoding
                    # Encode as Latin-1 (CP1252) and re-decode as UTF-8
                    try:
                        restored = text.encode('latin1').decode('utf-8')
                        content = restored.encode('utf-8')
                    except:
                        pass
            except:
                pass

        if content != original_content:
            with open(file_path, 'wb') as f:
                f.write(content)
            return True
    except Exception as e:
        print(f"Error in {file_path}: {e}")
    return False

def run_repair(root_dir):
    fixed_files = []
    # Targeted files list from the refined audit (example subset + recursive call)
    for root, dirs, files in os.walk(root_dir):
        for file in files:
            if file.endswith(('.json', '.html', '.js')):
                path = os.path.join(root, file)
                if repair_mojibake_definitive(path):
                    fixed_files.append(path)
    return fixed_files

if __name__ == "__main__":
    target = r'c:\Users\juan\Documents\GitHub\juanolaya.github.io\Deutsch_lernen\verben\A1_A2_B1'
    fixed = run_repair(target)
    print(f"--- REPORTE FINAL DE SANEAMIENTO (AUDITOR V4) ---")
    print(f"Archivos rehabilitados: {len(fixed)}")
    print("-" * 45)
    for f in fixed:
        print(f"[REHABILITADO] {os.path.relpath(f, target)}")
