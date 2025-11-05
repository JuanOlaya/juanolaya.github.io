import json

file_path = "C:\\Users\\juan\\Documents\\GitHub\\juanolaya.github.io\\Deutsch_lernen\\verben\\A1\\json\\group_2.json"

try:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # First, try to load the entire content to get the exact error position
    json.loads(content)
    print("JSON is valid.")

except json.JSONDecodeError as e:
    print(f"JSON decoding error in {file_path}: {e}")
    print(f"Error at line {e.lineno}, column {e.colno}: {e.msg}")
    
    lines = content.splitlines()
    if 0 < e.lineno <= len(lines):
        problematic_line = lines[e.lineno - 1]
        print(f"Problematic line content: {problematic_line}")
        
        # Highlight the character position
        if 0 < e.colno <= len(problematic_line):
            print(" " * (e.colno - 1) + "^")
        
    # Print content around the error for more context
    start_char = max(0, e.pos - 50)
    end_char = min(len(content), e.pos + 50)
    print(f"Content around error (chars {start_char}-{end_char}):")
    print(content[start_char:end_char])

except FileNotFoundError:
    print(f"Error: File not found at {file_path}")
except Exception as e:
    print(f"An unexpected error occurred: {e}")
