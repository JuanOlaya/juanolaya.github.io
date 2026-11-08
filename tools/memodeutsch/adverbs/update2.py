import re

file_path = 'c:/Users/juan/Documents/GitHub/juanolaya.github.io/Deutsch_lernen/adverbs/mengenpronomen.html'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Add CSS
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

content = content.replace('        .spanish-word {\n            color: var(--text-muted);\n            font-size: 0.9rem;\n        }', css_addition)

# Add Modal HTML
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

# Add JS logic
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
        
        document.addEventListener('DOMContentLoaded', () => {
            const modEx = document.getElementById('modalExDe');
            if(modEx) {
                modEx.addEventListener('click', () => {
                   speak(modEx.textContent);
                });
                modEx.style.cursor = 'pointer';
            }
        });
'''

content = content.replace('function toggleTheme() {', js_addition + '\n        function toggleTheme() {')

# Add FontAwesome if needed
if "font-awesome" not in content:
    content = content.replace('</title>', '</title>\n    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">')

# Modify Rows Regex
# <div class="german-word"(.*?)>(.*?)</div>\s*<div class="spanish-word">(.*?)</div>\s*</td>\s*<td>\s*(.*?)<br>\s*<span class="example-sent">\((.*?)\)</span>\s*</td>\s*</tr>
pattern = r'(<tr>\s*<td>\s*<div class="german-word"([^>]*)>(.*?)</div>\s*<div class="spanish-word">(.*?)</div>\s*</td>\s*<td>\s*(.*?)<br>\s*<span class="example-sent">\((.*?)\)</span>\s*</td>\s*</tr>)'

def replace_row(match):
    full_match = match.group(0)
    gw_attr = match.group(2) # e.g. data-speak="..."
    gw_text = match.group(3).strip()
    sw_text = match.group(4).strip()
    de_ex_html = match.group(5).strip()
    es_ex_text = match.group(6).strip()
    
    # Fix the de_ex_html because it might have some html like <strong>
    de_ex_text = re.sub(r'<[^>]+>', '', de_ex_html).replace("'", "\\'")
    es_ex_text = es_ex_text.replace("'", "\\'")
    
    # German text for JS might be in data-speak or just text
    if 'data-speak' in gw_attr:
        speak_val = re.search(r'data-speak="(.*?)"', gw_attr).group(1)
        de_js_text = speak_val.replace("'", "\\'")
    else:
        de_js_text = gw_text.replace("'", "\\'")
        
    js_sw_text = sw_text.replace("'", "\\'")
    
    return f"""<tr onclick="openWordModal('{de_js_text}', '{js_sw_text}', '{de_ex_text}', '{es_ex_text}')">
                                <td>
                                    <div class="german-word"{gw_attr}>{gw_text}</div>
                                </td>
                                <td class="spanish-word">
                                    {sw_text}
                                </td>
                            </tr>"""

content = re.sub(pattern, replace_row, content)

# Remove the "Ejemplo" header
# <th(.*?)>Ejemplo</th> -> keep Pronombre only?
content = re.sub(r'<th>Pronombre / Español</th>\s*<th>Ejemplo</th>', '<th>Pronombre</th>', content)

# Add footer for A1
content = re.sub(r'(<!-- A1 LEVEL -->.*?<tbody>.*?</tbody>\s*</table>\s*</div>)',
                 r'\1\n                <div class="card-footer"><span class="card-footer-tag card-footer-level">A1</span><span class="card-footer-tag">pronombre</span></div>',
                 content, flags=re.DOTALL)

# Same for A2, B1, B2, wait dotall might match too much.
# Let's replace each level card with its structural footer.
# A1
content = content.replace('</div>\n            </div>\n\n            <!-- A2 LEVEL -->', 
                          '</div>\n                <div class="card-footer"><span class="card-footer-tag card-footer-level">A1</span><span class="card-footer-tag">pronombre</span></div>\n            </div>\n\n            <!-- A2 LEVEL -->')
content = content.replace('</div>\n            </div>\n\n            <!-- B1 LEVEL -->', 
                          '</div>\n                <div class="card-footer"><span class="card-footer-tag card-footer-level">A2</span><span class="card-footer-tag">pronombre</span></div>\n            </div>\n\n            <!-- B1 LEVEL -->')
content = content.replace('</div>\n            </div>\n\n            <!-- B2 LEVEL -->', 
                          '</div>\n                <div class="card-footer"><span class="card-footer-tag card-footer-level">B1</span><span class="card-footer-tag">pronombre</span></div>\n            </div>\n\n            <!-- B2 LEVEL -->')
content = content.replace('</div>\n            </div>\n\n        </div>\n\n        <!-- RULES & GRAMMAR NOTE -->', 
                          '</div>\n                <div class="card-footer"><span class="card-footer-tag card-footer-level">B2</span><span class="card-footer-tag">pronombre</span></div>\n            </div>\n\n        </div>\n\n        <!-- RULES & GRAMMAR NOTE -->')

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
