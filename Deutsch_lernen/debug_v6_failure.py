import os

file_path = r'c:\Users\juan\Documents\GitHub\juanolaya.github.io\Deutsch_lernen\Einbürgerungstest\lid_kompakt_modal.js'

def check_and_fix_single_file(path):
    print(f"--- DEBUG: {path} ---")
    try:
        with open(path, 'rb') as f:
            content = f.read()
            
        print(f"File size: {len(content)} bytes")
        
        # Search for "Berl" followed by Latin-1 'í' (0xed)
        # or "?" rombo mark seen in view tool
        
        # Let's search for the pattern of "Muro de Berl"
        search_pattern = b"Muro de Berl"
        pos = content.find(search_pattern)
        if pos != -1:
            print(f"Found 'Muro de Berl' at {pos}")
            context = content[pos:pos+20]
            print(f"Context hex: {context.hex()}")
            
            # Check for the \xed byte (í)
            if b'\xed' in context:
                print("Confirmed: Byte 0xed (í) found!")
                new_content = content.replace(b'\xed', b'\xc3\xad')
                print(f"Replacement attempted. New context hex: {new_content[pos:pos+20].hex()}")
            else:
                print("Byte 0xed NOT found in context.")
        else:
            print("'Muro de Berl' NOT found in binary.")
            
    except Exception as e:
        print(f"Error: {e}")

check_and_fix_single_file(file_path)
