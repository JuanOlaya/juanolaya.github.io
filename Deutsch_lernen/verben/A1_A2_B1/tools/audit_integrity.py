import os

def check_file_integrity(file_path):
    # Precise MOJIBAKE patterns (invalid/suspicious byte sequences in valid German/Emoji UTF-8)
    # These represent double-encoded characters.
    patterns = [
        b'\xc3\x83\xc2', # Start of mojibake like Ã¤
        b'\xc3\x83\xe2', # Start of mojibake
        b'\xc3\xa2\xc5\x93', # Correct sequence for âœ… mojibake
        b'\xc3\xb0\xc5\xb8', # Correct sequence for ðŸ mojibake
        b'\xc3\xb0\xc2\x9f', # Another variant of ðŸ
    ]
    corrupted_count = 0
    try:
        with open(file_path, 'rb') as f:
            content = f.read()
            for p in patterns:
                if p in content:
                    corrupted_count += 1
        return corrupted_count
    except Exception:
        return -1

def run_audit(root_dir):
    report = []
    for root, dirs, files in os.walk(root_dir):
        for file in files:
            if file.endswith(('.json', '.html', '.js')):
                path = os.path.join(root, file)
                issues = check_file_integrity(path)
                if issues > 0:
                    report.append({"file": os.path.relpath(path, root_dir), "issues": issues})
    return report

if __name__ == "__main__":
    target = r'c:\Users\juan\Documents\GitHub\juanolaya.github.io\Deutsch_lernen\verben\A1_A2_B1'
    results = run_audit(target)
    
    print(f"--- AUDITORÍA DE INTEGRIDAD UTF-8 (FILTRADA) ---")
    print(f"Archivos analizados en: {target}")
    print(f"Total de REALES archivos corruptos: {len(results)}")
    print("-" * 48)
    for r in results[:25]:
        print(f"[CORRUPTO] {r['file']} ({r['issues']} tipos detectados)")
    if len(results) > 25:
        print(f"... y {len(results) - 25} archivos más.")
