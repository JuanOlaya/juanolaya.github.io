import os

def main():
    styles_path = r"c:\Users\juan\Documents\GitHub\juanolaya.github.io\Deutsch_lernen\verben\A1_A2_B1\style\styles.css"
    html_path = r"c:\Users\juan\Documents\GitHub\juanolaya.github.io\Deutsch_lernen\verben\A1_A2_B1\verben.html"

    # 1. Update style/styles.css for contrast
    with open(styles_path, "r", encoding="utf-8") as f:
        css = f.read().replace('\r\n', '\n')

    replacements_css = [
        (
            """.gustar-modal-content {
    background: white;
    border-radius: 16px;""",
            """.gustar-modal-content {
    background: white;
    color: #1e293b; /* Explicit dark text color for contrast */
    border-radius: 16px;"""
        ),
        (
            """.highlight-box {
    background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
    border: none;""",
            """.highlight-box {
    background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
    color: #78350f; /* Dark amber text color */
    border: none;"""
        ),
        (
            """.negative-row {
    background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
    border: none;""",
            """.negative-row {
    background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
    color: #7f1d1d; /* Dark red text color */
    border: none;"""
        ),
        (
            """.gustar-summary {
    background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
    border: 2px solid #0ea5e9;""",
            """.gustar-summary {
    background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
    color: #0369a1; /* Dark blue text color */
    border: 2px solid #0ea5e9;"""
        ),
        (
            """.summary-item {
    background: white;
    border-radius: 12px;""",
            """.summary-item {
    background: white;
    color: #1e293b; /* Explicit dark text color for items */
    border-radius: 12px;"""
        ),
        (
            """.example-box {
    background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
    border: none;""",
            """.example-box {
    background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
    color: #1e3a8a; /* Dark blue text color */
    border: none;"""
        ),
        (
            """.negative-example {
    background: linear-gradient(135deg, #ffe4e6 0%, #fecdd3 100%);
    border: none;""",
            """.negative-example {
    background: linear-gradient(135deg, #ffe4e6 0%, #fecdd3 100%);
    color: #9f1239; /* Dark rose text color */
    border: none;"""
        )
    ]

    css_changed = False
    for target, repl in replacements_css:
        t_norm = target.replace('\r\n', '\n')
        r_norm = repl.replace('\r\n', '\n')
        if t_norm in css:
            css = css.replace(t_norm, r_norm)
            css_changed = True
        else:
            print(f"CSS target not found: {repr(target[:50])}...")

    if css_changed:
        with open(styles_path, "w", encoding="utf-8", newline="\n") as f:
            f.write(css)
        print("styles.css contrast fixes applied.")
    else:
        print("No CSS contrast fixes applied.")

    # 2. Update verben.html for mojibakes
    with open(html_path, "r", encoding="utf-8") as f:
        html = f.read().replace('\r\n', '\n')

    replacements_html = [
        ("Eine íœbersicht", "Eine Übersicht"),
        ("title=\"Schließen (Cerrar)\">í—</button>", "title=\"Schließen (Cerrar)\">&times;</button>"),
        ("title=\"Schlieen (Cerrar)\"></button>", "title=\"Schließen (Cerrar)\">&times;</button>"),
        ("title=\"Schließen (Cerrar)\"></button>", "title=\"Schließen (Cerrar)\">&times;</button>"),
    ]

    html_changed = False
    for target, repl in replacements_html:
        t_norm = target.replace('\r\n', '\n')
        r_norm = repl.replace('\r\n', '\n')
        if t_norm in html:
            html = html.replace(t_norm, r_norm)
            html_changed = True
            print(f"Repaired HTML mojibake: {repr(target)} -> {repr(repl)}")

    # Let's check for title="Schließen (Cerrar)" button on line 610 (Reflexive close btn)
    # The view_file output showed line 610 had:
    # 610: <button id="reflexive-close-btn" class="gustar-close-btn" title="Schlieen (Cerrar)"></button>
    # We will try to replace that line directly if the above didn't catch it
    target_ref = 'title="Schlieen (Cerrar)"></button>'
    if target_ref in html:
        html = html.replace(target_ref, 'title="Schließen (Cerrar)">&times;</button>')
        html_changed = True
        print("Repaired reflexive close button mojibake.")

    if html_changed:
        with open(html_path, "w", encoding="utf-8", newline="\n") as f:
            f.write(html)
        print("verben.html mojibake fixes applied.")
    else:
        print("No HTML mojibake fixes applied.")

if __name__ == "__main__":
    main()
