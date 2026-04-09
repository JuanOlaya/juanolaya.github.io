import os

target = r'c:\Users\juan\Documents\GitHub\juanolaya.github.io\Deutsch_lernen\Einbürgerungstest\lid_kompakt_modal.js'

try:
    with open(target, 'r', encoding='utf-8', errors='replace') as f:
        content = f.read()
    
    # Remove all lingering Replacement Characters (\ufffd)
    new_content = content.replace('\ufffd', '')
    
    if new_content != content:
        with open(target, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"--- SANEAMIENTO FINAL COMPLETADO ---")
        print(f"Archivo: {os.path.basename(target)}")
        print("Todos los residuos  han sido eliminados.")
    else:
        print("No se encontraron residuos  pendientes.")
        
except Exception as e:
    print(f"Error: {e}")
