import os, re
import sys

with open('scratch/check_est.txt', 'w', encoding='utf-8') as out:
    for root, _, files in os.walk('json/cards'):
        for f in files:
            if f.endswith('.json'):
                path = os.path.join(root, f)
                with open(path, 'r', encoding='utf-8') as file:
                    content = file.read()
                
                # Check what comes after "está"
                matches = re.finditer(r'está(.)', content)
                for m in matches:
                    next_char = m.group(1)
                    if next_char not in [' ', '"', ',', '.', 'b']: # "estábamos", "está" etc are fine
                        out.write(f'{f} has está{next_char}\n')
