import os

file_path = r'c:\Users\juan\Documents\GitHub\juanolaya.github.io\Deutsch_lernen\verben\A1_A2_B1\json\cards\beeinflussen.json'

try:
    with open(file_path, 'rb') as f:
        content = f.read()
        
    # Search for "Estático" (Latin-1 encoded if corrupted)
    # The bytes for "Estático" in UTF-8 are 45 73 74 c3 a1 74 69 63 6f
    pos = content.find(b'Est\xc3\xa1tico')
    if pos != -1:
        # Get 15 bytes before to see the emoji
        context = content[pos-15:pos+15]
        print(f"Context (hex): {context.hex()}")
        print(f"Context (raw): {context}")
    else:
        print("Sequence 'Estático' not found.")
except Exception as e:
    print(f"Error: {e}")
