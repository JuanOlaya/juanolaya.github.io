import os

def final_binary_fix(file_path):
    # DEFINITIVE BYTE-LEVEL MAPPINGS (Operation S.O.S V8)
    replacements = [
        (b'D\xc3\xadata', b'Data'),                # Data -> Data
        (b'f\xc3\xbcr\xc3\xb6m', b'from'),          # fürom -> from
        (b't\xc3\xa1est\xc3\xa1', b'test'),         # testest
        (b'test\xc3\xa1', b'test'),                 # test -> test
        (b'nest\xc3\xa1ed', b'nested'),             # nested -> nested
        (b'existi\xc3\xb3ng', b'existing'),           # existing -> existing
        (b'Straf\xc3\xbcrecht', b'Strafrecht'),
        (b'f\xc3\xbcre\xedheiten', b'freiheiten'),
        (b'metad\xc3\xadata', b'metadata'),
        (b'Einb\xc3\xbcrgerungstest\xc3\xa1', b'Einb\xc3\xbcrgerungstest'),
        (b'Einb\xc3\xbcrgerungstest(', b'Einb\xc3\xbcrgerungstest'),
        (b'Fest\xc3\xa1e', b'Feste'),
        (b'Fest\xc3\xa1as', b'Fiestas')
    ]

    try:
        with open(file_path, 'rb') as f:
            data = f.read()
            
        original_data = data
        for bad, good in replacements:
            data = data.replace(bad, good)
            
        if data != original_data:
            with open(file_path, 'wb') as f:
                f.write(data)
            return True
    except Exception as e:
        print(f"Error procesando {file_path}: {e}")
    return False

def run_operation_sos_v8(root_dir):
    print(f"--- INICIANDO EL MARTILLO FINAL V8 (S.O.S) ---")
    fixed_count = 0
    target_exts = ('.js', '.json', '.html', '.py', '.md', '.css')
    
    for root, dirs, files in os.walk(root_dir):
        if '.git' in root or '.gemini' in root: continue
        for file in files:
            if file.endswith(target_exts):
                path = os.path.join(root, file)
                if final_binary_fix(path):
                    fixed_count += 1
                    print(f"[{fixed_count}] REHABILITADO: {os.path.relpath(path, root_dir)}")
                    
    print("-" * 50)
    print(f"RESULTADO FINAL: {fixed_count} archivos rehabilitados con éxito.")

if __name__ == "__main__":
    project_root = r'C:\Users\juan\Documents\GitHub\juanolaya.github.io\Deutsch_lernen'
    run_operation_sos_v8(project_root)
