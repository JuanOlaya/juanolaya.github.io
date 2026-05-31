import sys

def print_lines(filepath, start, end):
    print(f"Showing lines {start} to {end} in {filepath}:")
    with open(filepath, 'r', encoding='utf-8') as f:
        for i, line in enumerate(f, 1):
            if start <= i <= end:
                print(f"{i:4d}: {line.rstrip()}")

if __name__ == '__main__':
    # Print lines passed as arguments
    if len(sys.argv) >= 3:
        start = int(sys.argv[1])
        end = int(sys.argv[2])
    else:
        start, end = 1040, 1100
    print_lines(r"c:\Users\juan\Documents\GitHub\juanolaya.github.io\Deutsch_lernen\verben\A1_A2_B1\script\script.js", start, end)
