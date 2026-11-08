import re
import codecs

file_path = 'c:/Users/juan/Documents/GitHub/juanolaya.github.io/Deutsch_lernen/adverbs/mengenpronomen.html'
with codecs.open(file_path, 'r', 'utf-8') as f:
    content = f.read()

content = re.sub(r'\s*<span>[🟦🟨🟧🟥]</span>', '', content)

with codecs.open(file_path, 'w', 'utf-8') as f:
    f.write(content)
