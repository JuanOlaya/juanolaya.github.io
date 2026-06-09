import os

def final_audit(root_dir):
    print(f"--- AUDITORÍA DE CALIDAD FINAL (PROTOCOLO AUDITOR) ---")
    print(f"Directorio: {root_dir}")
    print("-" * 55)
    
    issues = []
    # Strict patterns for mojibake and dead chars
    patterns = [
        b'\xc3\x83', # Lead for double-encoded UTF-8
        b'\xef\xbf\xbd', # Replacement character 
        b'\xed', b'\xf1', b'\xbf', b'\xa1', # Common Latin-1 orphans
        b'\xe1', b'\xe9', b'\xf3', b'\xfa'
    ]
    
    for root, dirs, files in os.walk(root_dir):
        if '.git' in root or '.vscode' in root: continue
        for file in files:
            if file.endswith(('.json', '.html', '.js')):
                path = os.path.join(root, file)
                try:
                    with open(path, 'rb') as f:
                        content = f.read()
                    
                    for p in patterns:
                        if p in content:
                            context_start = content.find(p)
                            context = content[max(0, context_start-10):min(len(content), context_start+10)]
                            issues.append(f"[ERROR] {os.path.relpath(path, root_dir)} - Patrón {p.hex()} en: {context}")
                            break
                except Exception as e:
                    print(f"Error leyendo {file}: {e}")
                    
    if not issues:
        print(">>> RESULTADO: ¡PROYECTO 100% LIMPIO! INTEGRIDAD RESTAURADA. <<<")
    else:
        print(f">>> RESULTADO: Se encontraron {len(issues)} incidencias residuales. <<<")
        for issue in issues[:20]:
            print(issue)
            
if __name__ == "__main__":
    project_root = r'c:\Users\juan\Documents\GitHub\juanolaya.github.io\Deutsch_lernen'
    final_audit(project_root)
