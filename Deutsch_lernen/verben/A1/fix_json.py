import json
import os

def fix_json():
    json_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'json', 'group_2.json')
    with open(json_path, 'r', encoding='utf-8') as f:
        content = f.read()

    print("Original content:")
    print(content)

    try:
        json.loads(content)
    except json.JSONDecodeError as e:
        print(f"Error in {json_path}: {e}")
        # Fix the error by adding a comma
        error_pos = e.pos
        fixed_content = content[:error_pos] + ',' + content[error_pos:]
        
        print("Fixed content:")
        print(fixed_content)

        # Verify the fix
        try:
            json.loads(fixed_content)
            with open(json_path, 'w', encoding='utf-8') as f:
                f.write(fixed_content)
            print(f"Successfully fixed {json_path}")
        except json.JSONDecodeError as e2:
            print(f"Failed to fix {json_path}: {e2}")

if __name__ == '__main__':
    fix_json()