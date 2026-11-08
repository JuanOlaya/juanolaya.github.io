import os

def definitive_binary_fix(file_path):
    # Operation S.O.S V12 - Binary Constants
    REPLACEMENTS = [
        (b'D\xc3\xadata', b'Data'),                # Data -> Data
        (b'f\xc3\xbcr\xc3\xb6m', b'from'),          # fürom -> from
        (b'f\xc3\xbcr\xc3\xb6mId', b'fromId'),
        (b't\xc3\xa1est\xc3\xa1', b'test'),         # testest
        (b'test\xc3\xa1', b'test'),                 # test -> test
        (b'nest\xc3\xa1ed', b'nested'),             # nested -> nested
        (b'existi\xc3\xb3ng', b'existing'),         # existing -> existing
        (b'Straf\xc3\xbcrecht', b'Strafrecht'),
        (b'f\xc3\xbcre\xedheiten', b'freiheiten'),
        (b'metad\xc3\xadata', b'metadata'),
        (b'Einb\xc3\xbcrgerungstest\xc3\xa1', b'Einb\xc3\xbcrgerungstest'),
        (b'Einb\xc3\xbcrgerungstest(', b'Einb\xc3\xbcrgerungstest'),
        (b'Fest\xc3\xa1e', b'Feste'),
        (b'Fest\xc3\xa1as', b'Fiestas'),
        (b'qu\xc3\xa9\xc3\xa9\xc3\xa9\xc3\xa9', b'que')
    ]

    try:
        with open(file_path, 'rb') as f:
            data = f.read()
            
        original_data = data
        for bad, good in REPLACEMENTS:
            data = data.replace(bad, good)
            
        if data != original_data:
            with open(file_path, 'wb') as f:
                f.write(data)
            return True
    except Exception:
        pass
    return False

def run_unstoppable_rescue(root_dir):
    print(f"--- INICIANDO EL MARTILLO IMPARABLE V12 (S.O.S) ---")
    count = 0
    extensions = ('.js', '.json', '.html', '.py', '.md', '.css')
    
    for root, dirs, files in os.walk(root_dir):
        # We only skip hidden version control dirs
        if '.git' in root: continue
        
        for file in files:
            if file.lower().endswith(extensions):
                full_path = os.path.join(root, file)
                if definitive_binary_fix(full_path):
                    count += 1
                    # Progress log every 10 fixes
                    if count % 10 == 0:
                        print(f"[{count}] Rehabilitado: {os.path.relpath(full_path, root_dir)}")
    
    print("-" * 50)
    print(f"REHABILITACIÓN COMPLETADA: {count} archivos saneados.")

if __name__ == "__main__":
    project_root = r'c:\Users\juan\Documents\GitHub\juanolaya.github.io\Deutsch_lernen'
    run_unstoppable_rescue(project_root)
