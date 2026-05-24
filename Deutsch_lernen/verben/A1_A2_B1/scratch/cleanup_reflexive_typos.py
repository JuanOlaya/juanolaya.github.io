import os
import re

def main():
    html_path = r"c:\Users\juan\Documents\GitHub\juanolaya.github.io\Deutsch_lernen\verben\A1_A2_B1\verben.html"

    with open(html_path, "r", encoding="utf-8") as f:
        content = f.read().replace('\r\n', '\n')

    # The characters are Ã (\u00c3) and © (\u00a9) repeating
    # We will replace 'aque[Ã©]+ellos' with 'aquellos'
    # and 'que[Ã©]+e' with 'que'
    new_content, count1 = re.subn(r"aque[\u00c3\u00a9]+ellos", "aquellos", content)
    new_content, count2 = re.subn(r"que[\u00c3\u00a9]+e", "que", new_content)

    print(f"Replaced: {count1} aquellos, {count2} que")

    # Let's verify line 616 by printing it
    lines = new_content.split('\n')
    print("New line 616:", repr(lines[615]))

    with open(html_path, "w", encoding="utf-8", newline="\n") as f:
        f.write(new_content)
    print("Saved verben.html.")

if __name__ == "__main__":
    main()
