import os

def final_polish(file_path):
    # Specific brain emoji mojibake patterns
    replacements = {
        b'\xc3\xb0\xc5\xb8\xc2\xa7\xc2\xa0': b'\xf0\x9f\xa7\xa0', # 🧠 (Brain)
        b'\xc3\xb0\xc5\xb8\xc2\xa7': b'\xf0\x9f\xa7\xa0', # Variant
        b'ðŸ§ ': '🧠'.encode('utf-8'), # Direct string replacement if needed
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

def run_polish(root_dirs):
    repaired_files = []
    for d in root_dirs:
        for root, dirs, files in os.walk(d):
            for file in files:
                if file.endswith(('.json', '.html', '.js')):
                    path = os.path.join(root, file)
                    if final_polish(path):
                        repaired_files.append(path)
    return repaired_files

if __name__ == "__main__":
    targets = [
        r'c:\Users\juan\Documents\GitHub\juanolaya.github.io\Deutsch_lernen\verben\A1_A2_B1',
        r'c:\Users\juan\Documents\GitHub\juanolaya.github.io\Deutsch_lernen\Einbürgerungstest'
    ]
    fixed = run_polish(targets)
    print(f"--- REPORTE DE PULIDO FINAL (AUDITOR) ---")
    print(f"Archivos saneados: {len(fixed)}")
    print("-" * 40)
    for f in fixed:
        print(f"[RESTAURADO] {f}")
