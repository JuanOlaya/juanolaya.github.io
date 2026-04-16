import os

for root, _, files in os.walk('json/cards'):
    for f in files:
        if f.endswith('.json'):
            path = os.path.join(root, f)
            with open(path, 'r', encoding='utf-8') as file:
                content = file.read()
            
            # The previous corruption was universally lowercase 'est' -> 'está'
            # We perfectly reverse this by replacing 'está' back to 'est'
            if 'está' in content:
                new_content = content.replace('está', 'est')
                with open(path, 'w', encoding='utf-8') as file:
                    file.write(new_content)
                print(f"Restored {f}")

# And let's check verbs_index.json just in case.
INDEX_FILE = r'json\verbs_index.json'
if os.path.exists(INDEX_FILE):
    with open(INDEX_FILE, 'r', encoding='utf-8') as file:
        content = file.read()
    if 'está' in content:
        new_content = content.replace('está', 'est')
        with open(INDEX_FILE, 'w', encoding='utf-8') as file:
            file.write(new_content)
        print(f"Restored verbs_index.json")

print("Globally fixed 'está' corruption.")
