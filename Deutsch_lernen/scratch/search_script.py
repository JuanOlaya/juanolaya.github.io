import sys

def search_file(filepath, query):
    print(f"Searching for '{query}' in {filepath}:")
    with open(filepath, 'r', encoding='utf-8') as f:
        for i, line in enumerate(f, 1):
            if query.lower() in line.lower():
                print(f"{i:4d}: {line.strip()}")

if __name__ == '__main__':
    query = sys.argv[1] if len(sys.argv) > 1 else "hydrateFromLocalCache"
    search_file(r"c:\Users\juan\Documents\GitHub\juanolaya.github.io\Deutsch_lernen\verben\A1_A2_B1\script\script.js", query)
