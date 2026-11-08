import os

filepath = r"c:\Users\juan\Documents\GitHub\juanolaya.github.io\Deutsch_lernen\verben\A1_A2_B1\script\script.js"

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Target 1:
target1 = " const newVerbs = verbsToLoad.filter(v => !allVerbsData[v]);"
replacement1 = """ const newVerbs = (cacheHydrated && cacheMatchesRemoteVersion)
 ? verbsToLoad.filter(v => !allVerbsData[v])
 : verbsToLoad;"""

if target1 in content:
    content = content.replace(target1, replacement1, 1) # Only replace first occurrence (background loader)
    print("Successfully replaced Target 1!")
else:
    print("Target 1 not found!")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
