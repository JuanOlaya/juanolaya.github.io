import os
import json

def check_file_integrity(file_path):
    patterns = [b'\xc3\x83', b'\xc3\xa2', b'\xc3\xb0', b'\xf0\x9f'] # Common mojibake byte sequences
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
    
    print(f"--- AUDITORÍA DE INTEGRIDAD UTF-8 ---")
    print(f"Archivos analizados en: {target}")
    print(f"Total de archivos con sospecha de Mojibake: {len(results)}")
    print("-" * 40)
    for r in results[:20]: # Show first 20
        print(f"[CORRUPTO] {r['file']} ({r['issues']} patrones detectados)")
    if len(results) > 20:
        print(f"... y {len(results) - 20} archivos más.")
