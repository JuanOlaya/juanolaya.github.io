import os

def rollback_spaces(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            
        original_content = content
        
        # Reverse the disastrous ' ' -> 'á ' replacement
        # We target the exact pattern 'á ' (á followed by space)
        # and replace it with just a space ' '
        content = content.replace('á ', ' ')
        
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
    except Exception as e:
        print(f"Error in {file_path}: {e}")
    return False

def run_emergency_rollback(root_dirs):
    fixed_files = []
    for d in root_dirs:
        for root, dirs, files in os.walk(d):
            for file in files:
                if file.endswith(('.json', '.html', '.js')):
                    path = os.path.join(root, file)
                    if rollback_spaces(path):
                        fixed_files.append(path)
    return fixed_files

if __name__ == "__main__":
    targets = [
        r'c:\Users\juan\Documents\GitHub\juanolaya.github.io\Deutsch_lernen\Einbürgerungstest',
        r'c:\Users\juan\Documents\GitHub\juanolaya.github.io\Deutsch_lernen\verben\A1_A2_B1'
    ]
    fixed = run_emergency_rollback(targets)
    print(f"--- REPORTE DE REVERSIÓN DE EMERGENCIA ---")
    print(f"Archivos saneados: {len(fixed)}")
    print("-" * 40)
    for f in fixed:
        print(f"[REVERTIDO] {f}")
