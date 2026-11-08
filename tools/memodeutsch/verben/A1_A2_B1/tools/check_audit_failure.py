import os

def check_why_corrupted(file_path):
    patterns = {
        "Ã variants": b'\xc3\x83\xc2',
        "Ã/â error": b'\xc3\x83\xe2',
        "âœ… mojibake": b'\xc3\xa2\xc5\x93',
        "ðŸ mojibake 1": b'\xc3\xb0\xc5\xb8',
        "ðŸ mojibake 2": b'\xc3\xb0\xc2\x9f',
    }
    found = []
    try:
        with open(file_path, 'rb') as f:
            content = f.read()
            for name, p in patterns.items():
                if p in content:
                    found.append(name)
        return found
    except:
        return ["Error reading"]

file_to_check = r'c:\Users\juan\Documents\GitHub\juanolaya.github.io\Deutsch_lernen\verben\A1_A2_B1\json\cards\beeinflussen.json'
print(f"Audit Results for {os.path.basename(file_to_check)}: {check_why_corrupted(file_to_check)}")
