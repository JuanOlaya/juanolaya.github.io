import os

file_path = r'c:\Users\juan\Documents\GitHub\juanolaya.github.io\Deutsch_lernen\Einbürgerungstest\lid_kompakt_modal.js'

try:
    with open(file_path, 'rb') as f:
        lines = f.readlines()
        
    line_800 = lines[799] # 0-indexed
    print(f"--- LINEA 800: {os.path.basename(file_path)} ---")
    print(f"Hex: {line_800.hex()}")
    print(f"Raw: {line_800}")
    
    # Check another line with Spanish accents
    line_805 = lines[804]
    print(f"\n--- LINEA 805 ---")
    print(f"Hex: {line_805.hex()}")
    print(f"Raw: {line_805}")
    
except Exception as e:
    print(f"Error: {e}")
