import re
import codecs

file_path = 'c:/Users/juan/Documents/GitHub/juanolaya.github.io/Deutsch_lernen/adverbs/mengenpronomen.html'
with codecs.open(file_path, 'r', 'utf-8') as f:
    content = f.read()

# 1. Remove <thead>
content = re.sub(r'\s*<thead>\s*<tr>\s*<th>Pronombre</th>\s*</tr>\s*</thead>', '', content)

# 2. Add flexbox to .level-card to make heights match
content = content.replace(
'''        .level-card {
            background: var(--card-bg);
            border-radius: 16px;
            overflow: hidden;
            border: 1px solid var(--border-color);
            box-shadow: 0 10px 15px -3px var(--shadow-color);
            transition: transform 0.2s;
        }''',
'''        .level-card {
            background: var(--card-bg);
            border-radius: 16px;
            overflow: hidden;
            border: 1px solid var(--border-color);
            box-shadow: 0 10px 15px -3px var(--shadow-color);
            transition: transform 0.2s;
            display: flex;
            flex-direction: column;
            height: 100%;
        }''')

content = content.replace(
'''        .level-content {
            padding: 0;
        }''',
'''        .level-content {
            padding: 0;
            flex-grow: 1;
        }''')

# 3. Footer Colors
content = content.replace(
'''        .card-footer {
            display: grid;
            grid-template-columns: auto auto;
            gap: 10px;
            align-items: center;
            justify-content: space-between;
            padding: 10px 15px 12px;
            border-top: 1px solid var(--border-color);
            background: rgba(255, 255, 255, 0.05);
            font-size: 0.8rem;
        }''',
'''        .card-footer {
            display: grid;
            grid-template-columns: auto auto;
            gap: 10px;
            align-items: center;
            justify-content: space-between;
            padding: 10px 15px 12px;
            border-top: 1px solid var(--border-color);
            background: rgba(255, 255, 255, 0.05);
            font-size: 0.8rem;
            margin-top: auto;
        }
        
        .card-footer.a1 { background: var(--level-a1); }
        .card-footer.a2 { background: var(--level-a2); }
        .card-footer.b1 { background: var(--level-b1); }
        .card-footer.b2 { background: var(--level-b2); }
''')

# apply classes to footers based on the level
content = content.replace('<div class="card-footer"><span class="card-footer-tag card-footer-level">A1', '<div class="card-footer a1"><span class="card-footer-tag card-footer-level">A1')
content = content.replace('<div class="card-footer"><span class="card-footer-tag card-footer-level">A2', '<div class="card-footer a2"><span class="card-footer-tag card-footer-level">A2')
content = content.replace('<div class="card-footer"><span class="card-footer-tag card-footer-level">B1', '<div class="card-footer b1"><span class="card-footer-tag card-footer-level">B1')
content = content.replace('<div class="card-footer"><span class="card-footer-tag card-footer-level">B2', '<div class="card-footer b2"><span class="card-footer-tag card-footer-level">B2')


with codecs.open(file_path, 'w', 'utf-8') as f:
    f.write(content)
