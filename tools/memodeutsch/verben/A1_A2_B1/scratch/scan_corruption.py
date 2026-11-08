import os
import json

def scan_json_files(directory):
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.json'):
                path = os.path.join(root, file)
                try:
                    with open(path, 'rb') as f:
                        content = f.read()
                    
                    # Check for non-ASCII bytes
                    corrupted = False
                    for i, b in enumerate(content):
                        if b > 127:
                            corrupted = True
                            break
                    
                    if corrupted:
                        print(f"--- Possible corruption in {path} ---")
                        # Try to decode as UTF-8 and find problematic strings
                        try:
                            text = content.decode('utf-8')
                            # Check for the pattern á or ü we saw in the logs
                            # Wait, if it decodes as UTF-8, what are those chars?
                            for line_num, line in enumerate(text.splitlines(), 1):
                                if any(ord(c) > 127 for c in line):
                                    print(f"L{line_num}: {line.strip()}")
                        except Exception as e:
                            print(f"Decode error in {path}: {e}")
                            # Print hex around the first non-ASCII byte
                            for i, b in enumerate(content):
                                if b > 127:
                                    start = max(0, i - 10)
                                    end = min(len(content), i + 10)
                                    print(f"Hex at index {i}: {content[start:end].hex()}")
                                    break
                except Exception as e:
                    print(f"Error reading {path}: {e}")

if __name__ == "__main__":
    scan_json_files(r"c:\Users\juan\Documents\GitHub\juanolaya.github.io\Deutsch_lernen\verben\A1_A2_B1\json")
