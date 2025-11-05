import json
import os

file_path = "C:\\Users\\juan\\Documents\\GitHub\\juanolaya.github.io\\Deutsch_lernen\\verben\\A1\\json\\group_2.json"

try:
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=4, ensure_ascii=False)
    print(f"Successfully fixed and re-formatted {file_path}")
except json.JSONDecodeError as e:
    print(f"JSON decoding error in {file_path}: {e}")
except FileNotFoundError:
    print(f"Error: File not found at {file_path}")
except Exception as e:
    print(f"An unexpected error occurred: {e}")
