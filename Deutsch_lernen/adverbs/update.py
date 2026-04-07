import re
import os
from bs4 import BeautifulSoup

file_path = 'c:/Users/juan/Documents/GitHub/juanolaya.github.io/Deutsch_lernen/adverbs/mengenpronomen.html'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

css_addition = '''
        /* --- MODAL STYLES --- */
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.85);
            display: none;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            backdrop-filter: blur(8px);
        }

        .modal-content {
            background: var(--card-bg);
            border: 1px solid var(--accent-green);
            width: 95%;
            max-width: 550px;
            border-radius: 28px;
            overflow: hidden;
            box-shadow: 0 0 40px rgba(0, 255, 161, 0.15);
            animation: modalFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            max-height: 90vh;
            display: flex;
            flex-direction: column;
        }

        @keyframes modalFadeIn {
            from {
                opacity: 0;
                transform: scale(0.9) translateY(20px);
            }
            to {
                opacity: 1;
                transform: scale(1) translateY(0);
            }
        }

        .modal-header {
            padding: 20px 25px;
            background: var(--header-bg);
            border-bottom: 1px solid var(--border-color);
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-shrink: 0;
        }

        .modal-body {
            padding: 30px;
            text-align: left;
            overflow-y: auto;
        }

        .modal-de {
            font-size: 2.5rem;
            font-weight: 900;
            color: var(--accent-green);
            text-align: center;
        }

        .modal-es {
            font-size: 1.2rem;
            color: var(--text-main);
            margin-bottom: 20px;
            opacity: 0.9;
            text-align: center;
            font-weight: 600;
        }

        .modal-example-box {
            background: rgba(0, 0, 0, 0.2);
            padding: 20px;
            border-radius: 16px;
            border: 1px solid var(--border-color);
            margin-bottom: 25px;
        }

        .example-de {
            font-weight: 700;
            color: var(--text-main);
            font-size: 1.1rem;
            margin-bottom: 4px;
        }

        .example-es {
            font-style: italic;
            color: var(--text-muted);
            font-size: 0.95rem;
        }

        .btn-container {
            text-align: center;
            margin-top: 10px;
        }

        .play-btn-large {
            background: var(--accent-green);
            color: #020617;
            border: none;
            padding: 12px 25px;
            border-radius: 50px;
            font-weight: 800;
            display: inline-flex;
            align-items: center;
            gap: 10px;
            cursor: pointer;
            transition: all 0.2s;
        }

        /* Update spanish-word */
        .spanish-word {
            color: var(--text-muted);
            font-size: 0.85rem;
            cursor: pointer;
            transition: color 0.2s;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            gap: 6px;
            text-align: right;
        }

        .spanish-word:hover {
            color: var(--text-main);
        }

        tr {
            cursor: pointer;
        }
        
        tr:hover td {
            background: rgba(255, 255, 255, 0.03);
        }

        .card-footer {
            display: grid;
            grid-template-columns: auto auto;
            gap: 10px;
            align-items: center;
            justify-content: space-between;
            padding: 10px 15px 12px;
            border-top: 1px solid var(--border-color);
            background: rgba(255, 255, 255, 0.05);
            font-size: 0.8rem;
        }

        .card-footer-tag {
            background: rgba(255, 255, 255, 0.18);
            border: 1px solid rgba(255, 255, 255, 0.28);
            border-radius: 999px;
            padding: 5px 12px;
            font-size: 0.7rem;
            font-weight: 800;
            letter-spacing: 0.05em;
            line-height: 1;
            white-space: nowrap;
        }

        .card-footer-level {
            background: rgba(255, 255, 255, 0.28);
            border: 1px solid rgba(255, 255, 255, 0.42);
            color: #ffffff;
            font-weight: 900;
        }
'''

content = content.replace('''        .spanish-word {
            color: var(--text-muted);
            font-size: 0.9rem;
        }''', css_addition)

modal_html = '''
    <!-- Word Modal -->
    <div id="wordModal" class="modal-overlay" onclick="closeModal('wordModal', event)">
        <div class="modal-content" onclick="event.stopPropagation()">
            <header id="wordModalHeader" class="modal-header">
                <div></div>
                <button style="font-size: 1.5rem; color: var(--text-muted); background: none; border: none; cursor: pointer; line-height: 1; padding: 0 10px;" onclick="closeModal('wordModal')">&times;</button>
            </header>
            <div class="modal-body">
                <div id="modalDe" class="modal-de"></div>
                <div id="modalEs" class="modal-es"></div>

                <div class="modal-example-box" id="exampleContainer">
                    <div class="example-de" id="modalExDe"></div>
                    <div class="example-es" id="modalExEs"></div>
                </div>

                <div class="btn-container">
                    <button class="play-btn-large" onclick="triggerSpeech()">
                        🔊 ESCUCHAR
                    </button>
                </div>
            </div>
        </div>
    </div>
'''

content = content.replace('<body class="mode-es">', '<body class="mode-es">\n' + modal_html)

js_addition = '''
        function openWordModal(de, es, exDe, exEs) {
            document.getElementById('wordModal').style.display = 'flex';
            document.getElementById('modalDe').textContent = de;
            document.getElementById('modalEs').textContent = es;
            document.getElementById('modalExDe').innerHTML = exDe + ' <i class="fas fa-volume-up text-xs opacity-50 ml-2"></i>';
            document.getElementById('modalExEs').textContent = exEs;
        }

        function closeModal(modalId, event) {
            if (event && event.target !== event.currentTarget) return;
            document.getElementById(modalId).style.display = 'none';
        }

        function triggerSpeech() {
            const text = document.getElementById('modalDe').textContent;
            speak(text);
        }
        
        document.getElementById('modalExDe').addEventListener('click', () => {
            speak(document.getElementById('modalExDe').textContent);
        });
        document.getElementById('modalExDe').style.cursor = 'pointer';
'''

content = content.replace('function toggleTheme() {', js_addition + '\n        function toggleTheme() {')

soup = BeautifulSoup(content, 'html.parser')

# Also add font-awesome if not present
head = soup.find('head')
if not head.find('link', href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"):
    link = soup.new_tag('link')
    link['href'] = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
    link['rel'] = "stylesheet"
    head.append(link)

for level_card in soup.find_all('div', class_='level-card'):
    tbody = level_card.find('tbody')
    
    # Process Header (level text)
    level_header = level_card.find('div', class_='level-header')
    level_class = level_header.get('class', [])
    if len(level_class) > 1:
        level_id = level_class[1].upper() # A1
    else:
        level_id = "A1"
        
    span_tags = level_header.find_all('span')
    if span_tags:
        level_name = span_tags[0].text.split(' – ')[0] # "A1"
    else:
        level_name = level_id

    if tbody:
        for tr in tbody.find_all('tr'):
            tds = tr.find_all('td')
            if len(tds) == 2:
                german_div = tds[0].find('div', class_='german-word')
                spanish_div = tds[0].find('div', class_='spanish-word')
                
                de_text = german_div.text.strip().replace("'", "\\'")
                if 'data-speak' in german_div.attrs:
                    speak_text = german_div['data-speak'].strip().replace("'", "\\'")
                    de_text = speak_text
                
                # if there is audio icon, we only want the text
                clone_german = german_div
                
                es_text = spanish_div.text.strip().replace("'", "\\'")
                
                # Extract Example DE
                ex_de = ''
                ex_es = ''
                
                es_span = tds[1].find('span', class_='example-sent')
                if es_span:
                    ex_es = es_span.text.strip().replace("'", "\\'").replace('(', '').replace(')', '')
                    
                # Everything before <br> is DE example
                for node in tds[1].contents:
                    if getattr(node, 'name', None) == 'br':
                        break
                    if isinstance(node, str):
                        ex_de += node
                    elif getattr(node, 'name', None) == 'span' and 'example-sent' not in node.get('class', []):
                        ex_de += node.text
                
                ex_de = ex_de.strip().replace("'", "\\'")

                # Add onclick to open modal
                tr['onclick'] = f"openWordModal('{de_text}', '{es_text}', '{ex_de}', '{ex_es}')"
                
                # Now restructure the columns
                # We want 2 columns: German word, Spanish word on right.
                tds[1].decompose() # Remove standard example column
                
                # we keep german word in first column
                # but we remove spanish word from first column
                spanish_div.extract()
                
                # add spanish word as second column
                new_td = soup.new_tag('td')
                new_td['class'] = 'spanish-word'
                new_td.string = es_text.replace("\\'", "'")
                tr.append(new_td)

                # also we should ensure the audio icon remains or gets re-added nicely.
                # Actually, the original script dynamically adds the audio icon.
                
        # Also remove Example header in the table
        thead = level_card.find('thead')
        if thead:
            headers = thead.find_all('th')
            if len(headers) == 2:
                headers[1].decompose()
                headers[0].string = 'Pronombre'

    # Add Footer
    footer = soup.new_tag('div')
    footer['class'] = 'card-footer'
    
    span1 = soup.new_tag('span')
    span1['class'] = 'card-footer-tag card-footer-level'
    span1.string = level_name
    
    span2 = soup.new_tag('span')
    span2['class'] = 'card-footer-tag'
    span2.string = 'pronombre'
    
    footer.append(span1)
    footer.append(span2)
    level_card.append(footer)
    
# Remove example styling from original css if it's there
# Not strictly necessary but keeps it clean
with open(file_path, 'w', encoding='utf-8') as f:
    f.write(str(soup))
