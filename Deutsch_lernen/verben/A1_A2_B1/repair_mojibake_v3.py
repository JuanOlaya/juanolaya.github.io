import os

def repair_mojibake_final(file_path):
    # Precise byte mappings discovered in the forensic audit
    # These represent double-encoded results of common UTF-8 characters
    replacements = {
        # House Emoji: ðŸ   (UTF-8: f0 9f 8f a0)
        b'\xc3\xb0\xc5\xb8\xc2\x8f\xc2\xa0': b'\xf0\x9f\x8f\xa0',
        # Checkmark Emoji: âœ… (UTF-8: e2 9c 85)
        b'\xc3\xa2\xc5\x93\xe2\x80\xa6': b'\xe2\x9c\x85',
        b'\xc3\xa2\xc2\x9c\xc2\x85': b'\xe2\x9c\x85',
        # German Umlauts
        b'\xc3\x83\xc2\xa4': b'\xc3\xa4', # ä
        b'\xc3\x83\xc2\xb6': b'\xc3\xb6', # ö
        b'\xc3\x83\xc2\xbc': b'\xc3\xbc', # ü
        b'\xc3\x83\xc2\x9f': b'\xc3\x9f', # ß
        b'\xc3\x83\xc2\x84': b'\xc3\x84', # Ä
        b'\xc3\x83\xc2\x96': b'\xc3\x96', # Ö
        b'\xc3\x83\xc2\x9c': b'\xc3\x9c', # Ü
        # Common variants seen in the wild
        b'\xc3\xb0\xc5\xb8\xc2\xa7\xc2\xa0': b'\xf0\x9f\xa7\xa0', # 🧠
        b'\xc3\xb0\xc5\xb8\xc5\xa1\xc2\xaa': b'\xf0\x9f\x9a\xaa', # 🚪 (example pattern)
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
        print(f"Error repairing {file_path}: {e}")
    return False

def run_mass_sanitization(root_dir):
    repaired_count = 0
    for root, dirs, files in os.walk(root_dir):
        for file in files:
            if file.endswith(('.json', '.html', '.js')):
                path = os.path.join(root, file)
                if repair_mojibake_final(path):
                    repaired_count += 1
    return repaired_count

if __name__ == "__main__":
    target_dir = r'c:\Users\juan\Documents\GitHub\juanolaya.github.io\Deutsch_lernen\verben\A1_A2_B1'
    count = run_mass_sanitization(target_dir)
    print(f"--- REPORTE FINAL DE AUDITORÍA ---")
    print(f"Saneamiento completado en: {target_dir}")
    print(f"Archivos rescatados: {count}")
    print("-" * 35)
