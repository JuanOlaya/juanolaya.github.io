filepath = r"c:\Users\juan\Documents\GitHub\juanolaya.github.io\Deutsch_lernen\verben\A1_A2_B1\script\script.js"

with open(filepath, 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i in range(805, 816):
    print(f"{i:4d}: {repr(lines[i-1])}")
