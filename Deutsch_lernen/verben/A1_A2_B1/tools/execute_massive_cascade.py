import json
import os
import datetime

NEW_CARDS = {
    "zuordnen": {
        "verb": "zuordnen", "perfekt": "hat zugeordnet", "praeteritum": "er/sie/es ordnete zu", "emoji": "🧩",
        "es": "asignar / relacionar", "en_verb": "(to assign / match)",
        "es_perfekt": "ha asignado / relacionado", "en_perfekt": "has assigned / matched",
        "es_praeteritum": "él / ella asignaba / relacionaba", "en_praeteritum": "he / she assigned / matched",
        "level": "A1.2", "theme": "Prüfung", "Wortart_type": "verb", "case_tags": ["Akkusativ", "Dativ", "Separable", "Regular"], "tags": ["🏠 Estático"]
    },
    "ergänzen": {
        "verb": "ergänzen", "perfekt": "hat ergänzt", "praeteritum": "er/sie/es ergänzte", "emoji": "📝",
        "es": "completar / añadir", "en_verb": "(to complete / add)",
        "es_perfekt": "ha completado / añadido", "en_perfekt": "has completed / added",
        "es_praeteritum": "él / ella completaba / añadía", "en_praeteritum": "he / she completed / added",
        "level": "A1.2", "theme": "Prüfung", "Wortart_type": "verb", "case_tags": ["Akkusativ", "Regular"], "tags": ["🏠 Estático"]
    },
    "markieren": {
        "verb": "markieren", "perfekt": "hat markiert", "praeteritum": "er/sie/es markierte", "emoji": "🖍️",
        "es": "marcar / señalar", "en_verb": "(to mark / highlight)",
        "es_perfekt": "ha marcado / señalado", "en_perfekt": "has marked / highlighted",
        "es_praeteritum": "él / ella marcaba / señalaba", "en_praeteritum": "he / she marked / highlighted",
        "level": "A1.2", "theme": "Prüfung", "Wortart_type": "verb", "case_tags": ["Akkusativ", "Regular"], "tags": ["🏠 Estático"]
    },
    "unterstreichen": {
        "verb": "unterstreichen", "perfekt": "hat unterstrichen", "praeteritum": "er/sie/es unterstrich", "emoji": "✏️",
        "es": "subrayar", "en_verb": "(to underline)",
        "es_perfekt": "ha subrayado", "en_perfekt": "has underlined",
        "es_praeteritum": "él / ella subrayaba", "en_praeteritum": "he / she underlined",
        "level": "A1.2", "theme": "Prüfung", "Wortart_type": "verb", "case_tags": ["Akkusativ", "Inseparable", "Irregular"], "tags": ["🏠 Estático"]
    },
    "durchstreichen": {
        "verb": "durchstreichen", "perfekt": "hat durchgestrichen", "praeteritum": "er/sie/es strich durch", "emoji": "🚫",
        "es": "tachar", "en_verb": "(to cross out)",
        "es_perfekt": "ha tachado", "en_perfekt": "has crossed out",
        "es_praeteritum": "él / ella tachaba", "en_praeteritum": "he / she crossed out",
        "level": "A1.2", "theme": "Prüfung", "Wortart_type": "verb", "case_tags": ["Akkusativ", "Separable", "Irregular"], "tags": ["🏠 Estático"]
    },
    "ausfüllen": {
        "verb": "ausfüllen", "perfekt": "hat ausgefüllt", "praeteritum": "er/sie/es füllte aus", "emoji": "📋",
        "es": "rellenar / completar (un formulario)", "en_verb": "(to fill out)",
        "es_perfekt": "ha rellenado / completado", "en_perfekt": "has filled out",
        "es_praeteritum": "él / ella rellenaba / completaba", "en_praeteritum": "he / she filled out",
        "level": "A1.2", "theme": "Formular", "Wortart_type": "verb", "case_tags": ["Akkusativ", "Separable", "Regular"], "tags": ["🏠 Estático"]
    },
    "anprobieren": {
        "verb": "anprobieren", "perfekt": "hat anprobiert", "praeteritum": "er/sie/es probierte an", "emoji": "👗",
        "es": "probarse (ropa)", "en_verb": "(to try on clothes)",
        "es_perfekt": "se ha probado (ropa)", "en_perfekt": "has tried on",
        "es_praeteritum": "él / ella se probaba", "en_praeteritum": "he / she tried on",
        "level": "A1.2", "theme": "Kleidung", "Wortart_type": "verb", "case_tags": ["Akkusativ", "Separable", "Regular"], "tags": ["🏃 Movimiento"]
    },
    "klingeln": {
        "verb": "klingeln", "perfekt": "hat geklingelt", "praeteritum": "er/sie/es klingelte", "emoji": "🔔",
        "es": "sonar (el timbre/teléfono)", "en_verb": "(to ring)",
        "es_perfekt": "ha sonado", "en_perfekt": "has rung",
        "es_praeteritum": "él / ella sonaba", "en_praeteritum": "it rang",
        "level": "A2.2", "theme": "Wahrnehmung", "Wortart_type": "verb", "case_tags": ["Nominativ", "Regular"], "tags": ["🏠 Estático"]
    },
    "überqueren": {
        "verb": "überqueren", "perfekt": "hat überquert", "praeteritum": "er/sie/es überquerte", "emoji": "🚶",
        "es": "cruzar", "en_verb": "(to cross)",
        "es_perfekt": "ha cruzado", "en_perfekt": "has crossed",
        "es_praeteritum": "él / ella cruzaba", "en_praeteritum": "he / she crossed",
        "level": "A1.2", "theme": "Pendeln", "Wortart_type": "verb", "case_tags": ["Akkusativ", "Inseparable", "Regular"], "tags": ["🏃 Movimiento"]
    },
    "dabeihaben": {
        "verb": "dabeihaben", "perfekt": "hat dabeigehabt", "praeteritum": "er/sie/es hatte dabei", "emoji": "💼",
        "es": "llevar consigo", "en_verb": "(to have with someone)",
        "es_perfekt": "ha llevado consigo", "en_perfekt": "has had with",
        "es_praeteritum": "él / ella llevaba consigo", "en_praeteritum": "he / she had with",
        "level": "A2.2", "theme": "Besitz", "Wortart_type": "verb", "case_tags": ["Akkusativ", "Separable", "Irregular"], "tags": ["🏠 Estático"]
    },
    "abheben": {
        "verb": "abheben", "perfekt": "hat abgehoben", "praeteritum": "er/sie/es hob ab", "emoji": "🏧",
        "es": "sacar (dinero)", "en_verb": "(to withdraw money)",
        "es_perfekt": "ha sacado (dinero)", "en_perfekt": "has withdrawn",
        "es_praeteritum": "él / ella sacaba (dinero)", "en_praeteritum": "he / she withdrew",
        "level": "A2.2", "theme": "Finanzen", "Wortart_type": "verb", "case_tags": ["Akkusativ", "Separable", "Irregular"], "tags": ["🏠 Estático"]
    },
    "umtauschen": {
        "verb": "umtauschen", "perfekt": "hat umgetauscht", "praeteritum": "er/sie/es tauschte um", "emoji": "🔁",
        "es": "cambiar / devolver (un artículo)", "en_verb": "(to exchange)",
        "es_perfekt": "ha cambiado / devuelto", "en_perfekt": "has exchanged",
        "es_praeteritum": "él / ella cambiaba / devolvía", "en_praeteritum": "he / she exchanged",
        "level": "A1.1", "theme": "Einkauf", "Wortart_type": "verb", "case_tags": ["Akkusativ", "Separable", "Regular"], "tags": ["🏃 Movimiento"]
    }
}

DATA_DIR = r"json"
INDEX_FILE = os.path.join(DATA_DIR, "verbs_index.json")

def process():
    # 1. Create Cards
    for v_name, v_data in NEW_CARDS.items():
        card_file = os.path.join(DATA_DIR, "cards", f"{v_name}.json")
        if not os.path.exists(card_file):
            print(f"Creating missing card: {v_name}")
            with open(card_file, 'w', encoding='utf-8', newline='') as f:
                json.dump(v_data, f, indent=2, ensure_ascii=False)
                
    # Delete leihen
    leihen_file = os.path.join(DATA_DIR, "cards", "leihen.json")
    if os.path.exists(leihen_file):
        os.remove(leihen_file)
        print("Deleted leihen.json")

    # 2. Modify Index
    with open(INDEX_FILE, 'r', encoding='utf-8') as f:
        idx_data = json.load(f)
        
    for g in idx_data["groups"]:
        theme = g.get("groupNameGerman", "")
        # A. Rename Vertrag -> Formular
        if theme == "Vertrag":
            g["groupNameGerman"] = "Formular"
            g["groupNameSpanish"] = "Formulario"
            g["groupNameEnglish"] = "Form"
            g["verbs"].append("ausfüllen")
            print("Renamed Vertrag -> Formular and added ausfüllen.")
        
        # B. Kleidung
        elif theme == "Kleidung":
            g["verbs"].append("aussehen")
            g["verbs"].append("anprobieren")
            
        # C. Wahrnehmung
        elif theme == "Wahrnehmung":
            if "aussehen" in g["verbs"]:
                g["verbs"].remove("aussehen")
            g["verbs"].append("klingeln")
            
        # D. Pendeln
        elif theme == "Pendeln":
            g["verbs"].append("überqueren")
            
        # E. Finanzen
        elif theme == "Finanzen":
            if "leihen" in g["verbs"]:
                g["verbs"].remove("leihen")
            g["verbs"].append("abheben")
            
        # F. Besitz
        elif theme == "Besitz":
            g["verbs"].append("kriegen")
            g["verbs"].append("dabeihaben")
            
        # G. Logistik
        elif theme == "Logistik":
            if "kriegen" in g["verbs"]:
                g["verbs"].remove("kriegen")
            g["verbs"].append("holen")
            
        # H. Einkauf
        elif theme == "Einkauf":
            if "holen" in g["verbs"]:
                g["verbs"].remove("holen")
            g["verbs"].append("umtauschen")
            
        # I. Dialog
        elif theme == "Dialog":
            if "buchstabieren" in g["verbs"]:
                g["verbs"].remove("buchstabieren")
                
    # Create Prüfung
    p_group = {
        "level": "A1.2",
        "groupNameGerman": "Prüfung",
        "groupNameSpanish": "Examen",
        "groupNameEnglish": "Exam",
        "verbs": ["buchstabieren", "zuordnen", "ergänzen", "markieren", "unterstreichen", "durchstreichen"]
    }
    
    # Insert Prüfung immediately after Dialog (or anywhere in A1.2)
    # Finding Dialog's index:
    dialog_i = -1
    for i, g in enumerate(idx_data["groups"]):
        if g.get("groupNameGerman") == "Dialog":
            dialog_i = i
            break
            
    if dialog_i != -1:
        idx_data["groups"].insert(dialog_i + 1, p_group)
        print("Created new group Prüfung.")
    else:
        idx_data["groups"].append(p_group)
        print("Created new group Prüfung at end.")

    idx_data["lastUpdated"] = datetime.datetime.now(datetime.UTC).strftime("%Y-%m-%dT%H:%M:%S.000Z")
    
    with open(INDEX_FILE, 'w', encoding='utf-8', newline='') as f:
        json.dump(idx_data, f, indent=2, ensure_ascii=False)
        
    print("Master index restructured successfully!")

if __name__ == "__main__":
    process()
