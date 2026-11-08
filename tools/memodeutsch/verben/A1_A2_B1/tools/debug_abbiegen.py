import os

def debug_file(file_path):
    print(f"--- DEBUG: {os.path.basename(file_path)} ---")
    try:
        with open(file_path, 'rb') as f:
            content = f.read()
            
        pos = content.find(b'Est\xc3\xa1tico')
        if pos != -1:
            context = content[pos-20:pos+20]
            print(f"Index: {pos}")
            print(f"Hex: {context.hex()}")
            print(f"Raw: {context}")
        else:
            # If not Estático, just look for common mojibake markers
            markers = [b'\xc3\xb0', b'\xc3\xa2', b'\xc3\x83']
            for m in markers:
                p = content.find(m)
                if p != -1:
                    print(f"Found marker {m.hex()} at {p}")
                    print(f"Context: {content[p:p+10].hex()}")
                    break
    except Exception as e:
        print(f"Error: {e}")

debug_file(r'c:\Users\juan\Documents\GitHub\juanolaya.github.io\Deutsch_lernen\verben\A1_A2_B1\json\cards\abbiegen.json')
debug_file(r'c:\Users\juan\Documents\GitHub\juanolaya.github.io\Deutsch_lernen\verben\A1_A2_B1\json\verbs_index.json')
