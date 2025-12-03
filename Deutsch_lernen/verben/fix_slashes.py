import json
import os
import re
from pathlib import Path

def add_spaces_around_slashes(text):
    """Add spaces around slashes if they don't have them"""
    if not text or '/' not in text:
        return text
    # Replace slash without spaces with slash with spaces
    # But don't modify if spaces already exist
    return re.sub(r'(?<!\s)/(?!\s)', ' / ', text)

def fix_json_file(file_path):
    """Fix slashes in a single JSON file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)

        modified = False

        # Fields that might contain slashes
        fields_to_check = [
            'es', 'es_perfekt', 'es_praeteritum',
            'en_verb', 'en_perfekt', 'en_praeteritum'
        ]

        for field in fields_to_check:
            if field in data and isinstance(data[field], str):
                original = data[field]
                fixed = add_spaces_around_slashes(original)
                if original != fixed:
                    data[field] = fixed
                    modified = True
                    print(f"  {field}: UPDATED")

        if modified:
            with open(file_path, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=4, ensure_ascii=False)
            return True
        return False

    except Exception as e:
        print(f"Error processing {file_path}: {e}")
        return False

def main():
    cards_dir = Path('A1/json/cards')

    if not cards_dir.exists():
        print(f"Directory {cards_dir} not found!")
        return

    json_files = list(cards_dir.glob('*.json'))
    print(f"Found {len(json_files)} JSON files\n")

    fixed_count = 0

    for json_file in sorted(json_files):
        print(f"Checking {json_file.name}...")
        if fix_json_file(json_file):
            fixed_count += 1

    print(f"\nFixed {fixed_count} files")

if __name__ == '__main__':
    main()
