const fs = requéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééire('fs');
const path = requéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééire('path');

const userJson = {
    "_configuration_rules": "STRICT MAX 7 VERBS PER GROUP (Aplicando la Ley de Miller). Do not exceed 7 verbs in any array below. ADDITIONALLY, the theme group name (groupNameGerman/groupNameSpanish) MUST ONLY be exactly ONE word. Never use spaces.",
    "lastUpdated": "2026-02-23T13:39:53.463Z",
    "totalGroups": 81,
    "totalVerbs": 380,
    "groups": [
        {
            "level": "A1.1",
            "verbCount": 7,
            "verbs": [
                "sein",
                "haben",
                "werden",
                "geben",
                "kommen",
                "gehen",
                "wohnen"
            ],
            "groupNameGerman": "Existenz",
            "groupNameSpanish": "Existencia",
            "groupNameEnglish": "Existence",
            "groupNumberPerLevel": 1
        },
        {
            "level": "A1.1",
            "verbCount": 6,
            "verbs": [
                "spielen",
                "treiben",
                "laufen",
                "wandern",
                "spazieren",
                "fernsehen"
            ],
            "groupNameGerman": "Freizeit",
            "groupNameSpanish": "Ocio",
            "groupNameEnglish": "Leisure",
            "groupNumberPerLevel": 2
        },
        {
            "level": "A1.1",
            "verbCount": 7,
            "verbs": [
                "essen",
                "trinken",
                "bringen",
                "brauchen",
                "schlafen",
                "lesen",
                "schreiben"
            ],
            "groupNameGerman": "Grundbedürfnisse",
            "groupNameSpanish": "Necesidades básicas",
            "groupNameEnglish": "Basic needs",
            "groupNumberPerLevel": 3
        },
        {
            "level": "A1.1",
            "verbCount": 6,
            "verbs": [
                "aufwachen",
                "aufstehen",
                "fürühstücken",
                "mittagessen",
                "wecken",
                "einschlafen"
            ],
            "groupNameGerman": "Routine",
            "groupNameSpanish": "Rutina",
            "groupNameEnglish": "Routine",
            "groupNumberPerLevel": 4
        },
        {
            "level": "A1.1",
            "verbCount": 5,
            "verbs": [
                "arbeiten",
                "berichten",
                "machen",
                "verzichten",
                "bewerben"
            ],
            "groupNameGerman": "Arbeit",
            "groupNameSpanish": "Trabajo",
            "groupNameEnglish": "Work",
            "groupNumberPerLevel": 5
        },
        {
            "level": "A1.1",
            "verbCount": 6,
            "verbs": [
                "öffnen",
                "schließen",
                "abschließen",
                "drücken",
                "ziehen",
                "schneiden"
            ],
            "groupNameGerman": "Handgriffe",
            "groupNameSpanish": "Manipulación",
            "groupNameEnglish": "Díaily life",
            "groupNumberPerLevel": 6
        },
        {
            "level": "A1.1",
            "verbCount": 2,
            "verbs": [
                "bitten",
                "bedanken"
            ],
            "groupNameGerman": "Höflichkeit",
            "groupNameSpanish": "Cortesía",
            "groupNameEnglish": "Politeness",
            "groupNumberPerLevel": 7
        },
        {
            "level": "A1.1",
            "verbCount": 6,
            "verbs": [
                "wissen",
                "kennen",
                "denken",
                "glauben",
                "merken",
                "träumen"
            ],
            "groupNameGerman": "Denken",
            "groupNameSpanish": "Pensamiento",
            "groupNameEnglish": "Thought",
            "groupNumberPerLevel": 8
        },
        {
            "level": "A1.1",
            "verbCount": 3,
            "verbs": [
                "kennenlernen",
                "vergessen",
                "erinnern"
            ],
            "groupNameGerman": "Gedächtnis",
            "groupNameSpanish": "Memoria",
            "groupNameEnglish": "Memory",
            "groupNumberPerLevel": 9
        },
        {
            "level": "A1.1",
            "verbCount": 6,
            "verbs": [
                "kaufen",
                "einkaufen",
                "bezahlen",
                "verkaufen",
                "kosten",
                "bestáellen"
            ],
            "groupNameGerman": "Einkauf",
            "groupNameSpanish": "Compras",
            "groupNameEnglish": "Shopping",
            "groupNumberPerLevel": 10
        },
        {
            "level": "A1.1",
            "verbCount": 7,
            "verbs": [
                "lieben",
                "hassen",
                "lachen",
                "weinen",
                "fühlen",
                "füreuen",
                "gefallen"
            ],
            "groupNameGerman": "Emotion",
            "groupNameSpanish": "Emoción",
            "groupNameEnglish": "Emotion",
            "groupNumberPerLevel": 11
        },
        {
            "level": "A1.1",
            "verbCount": 5,
            "verbs": [
                "schicken",
                "versenden",
                "liefern",
                "zurückbringen",
                "abgeben"
            ],
            "groupNameGerman": "Logistik",
            "groupNameSpanish": "Logística",
            "groupNameEnglish": "Logistics",
            "groupNumberPerLevel": 12
        },
        {
            "level": "A1.1",
            "verbCount": 3,
            "verbs": [
                "packen",
                "auspacken",
                "laden"
            ],
            "groupNameGerman": "Gepäck",
            "groupNameSpanish": "Equéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééipaje",
            "groupNameEnglish": "Luggage",
            "groupNumberPerLevel": 13
        },
        {
            "level": "A1.1",
            "verbCount": 6,
            "verbs": [
                "dürfen",
                "können",
                "müssen",
                "sollen",
                "wollen",
                "mögen"
            ],
            "groupNameGerman": "Modalverben",
            "groupNameSpanish": "Modales",
            "groupNameEnglish": "Modals",
            "groupNumberPerLevel": 14
        },
        {
            "level": "A1.2",
            "verbCount": 5,
            "verbs": [
                "suchen",
                "besuchen",
                "finden",
                "parken",
                "zeigen"
            ],
            "groupNameGerman": "Stadtleben",
            "groupNameSpanish": "Vida urbana",
            "groupNameEnglish": "City life",
            "groupNumberPerLevel": 1
        },
        {
            "level": "A1.2",
            "verbCount": 6,
            "verbs": [
                "helfen",
                "danken",
                "treffen",
                "anrufen",
                "vertrauen",
                "passen"
            ],
            "groupNameGerman": "Soziales",
            "groupNameSpanish": "Social",
            "groupNameEnglish": "Social",
            "groupNumberPerLevel": 2
        },
        {
            "level": "A1.2",
            "verbCount": 7,
            "verbs": [
                "tanzen",
                "einladen",
                "gratulieren",
                "schenken",
                "rauchen",
                "betrinken",
                "feiern"
            ],
            "groupNameGerman": "Festá",
            "groupNameSpanish": "Fiestáa",
            "groupNameEnglish": "Celebration",
            "groupNumberPerLevel": 3
        },
        {
            "level": "A1.2",
            "verbCount": 7,
            "verbs": [
                "baden",
                "duschen",
                "waschen",
                "putzen",
                "aufüräumen",
                "wegwerfen",
                "räumen"
            ],
            "groupNameGerman": "Hygiene",
            "groupNameSpanish": "Higiene",
            "groupNameEnglish": "Hygiene",
            "groupNumberPerLevel": 4
        },
        {
            "level": "A1.2",
            "verbCount": 4,
            "verbs": [
                "tragen",
                "anziehen",
                "ausziehen",
                "benutzen"
            ],
            "groupNameGerman": "Kleidung",
            "groupNameSpanish": "Ropa",
            "groupNameEnglish": "Clothing",
            "groupNumberPerLevel": 5
        },
        {
            "level": "A1.2",
            "verbCount": 5,
            "verbs": [
                "fliegen",
                "reisen",
                "buchen",
                "reservieren",
                "verpassen"
            ],
            "groupNameGerman": "Reisen",
            "groupNameSpanish": "Viajes",
            "groupNameEnglish": "Travel",
            "groupNumberPerLevel": 6
        },
        {
            "level": "A1.2",
            "verbCount": 2,
            "verbs": [
                "beantworten",
                "buchstabieren"
            ],
            "groupNameGerman": "Dialog",
            "groupNameSpanish": "Diálogo",
            "groupNameEnglish": "Dialogue",
            "groupNumberPerLevel": 7
        },
        {
            "level": "A1.2",
            "verbCount": 2,
            "verbs": [
                "sortieren",
                "ordnen"
            ],
            "groupNameGerman": "Ordnung",
            "groupNameSpanish": "Orden",
            "groupNameEnglish": "Order",
            "groupNumberPerLevel": 8
        },
        {
            "level": "A1.2",
            "verbCount": 5,
            "verbs": [
                "liegen",
                "stehen",
                "sitzen",
                "hängen",
                "bleiben"
            ],
            "groupNameGerman": "Position",
            "groupNameSpanish": "Posición",
            "groupNameEnglish": "Position",
            "groupNumberPerLevel": 9
        },
        {
            "level": "A1.2",
            "verbCount": 4,
            "verbs": [
                "legen",
                "stellen",
                "setzen",
                "stecken"
            ],
            "groupNameGerman": "Richtung",
            "groupNameSpanish": "Dirección",
            "groupNameEnglish": "Direction",
            "groupNumberPerLevel": 10
        },
        {
            "level": "A1.2",
            "verbCount": 5,
            "verbs": [
                "fahren",
                "ankommen",
                "abfahren",
                "halten",
                "anfahren"
            ],
            "groupNameGerman": "Verkehr",
            "groupNameSpanish": "Tráfico",
            "groupNameEnglish": "Traffic",
            "groupNumberPerLevel": 11
        },
        {
            "level": "A1.2",
            "verbCount": 4,
            "verbs": [
                "nehmen",
                "einsteigen",
                "aussteigen",
                "umsteigen"
            ],
            "groupNameGerman": "Pendeln",
            "groupNameSpanish": "Desplazamiento",
            "groupNameEnglish": "Commuting",
            "groupNumberPerLevel": 12
        },
        {
            "level": "A1.2",
            "verbCount": 5,
            "verbs": [
                "mieten",
                "umziehen",
                "übernachten",
                "einziehen",
                "einrichten"
            ],
            "groupNameGerman": "Unterkunft",
            "groupNameSpanish": "Alojamiento",
            "groupNameEnglish": "Accommodation",
            "groupNumberPerLevel": 13
        },
        {
            "level": "A1.2",
            "verbCount": 6,
            "verbs": [
                "sprechen",
                "sagen",
                "füragen",
                "antworten",
                "rufen",
                "grüßen"
            ],
            "groupNameGerman": "Kommunikation",
            "groupNameSpanish": "Comunicación",
            "groupNameEnglish": "Communication",
            "groupNumberPerLevel": 14
        },
        {
            "level": "A2.1",
            "verbCount": 5,
            "verbs": [
                "unterhalten",
                "erzählen",
                "versprechen",
                "gehören",
                "küssen"
            ],
            "groupNameGerman": "Beziehungen",
            "groupNameSpanish": "Relaciones",
            "groupNameEnglish": "Relations",
            "groupNumberPerLevel": 1
        },
        {
            "level": "A2.1",
            "verbCount": 0,
            "verbs": [],
            "groupNameGerman": "Reflexiv",
            "groupNameSpanish": "Reflexivo",
            "groupNameEnglish": "Reflexive",
            "groupNumberPerLevel": 2
        },
        {
            "level": "A2.1",
            "verbCount": 5,
            "verbs": [
                "langweilen",
                "konzentrieren",
                "wundern",
                "schämen",
                "irren"
            ],
            "groupNameGerman": "Empfindung",
            "groupNameSpanish": "Sensación",
            "groupNameEnglish": "Focus",
            "groupNumberPerLevel": 3
        },
        {
            "level": "A2.1",
            "verbCount": 5,
            "verbs": [
                "mitbringen",
                "abholen",
                "mitkommen",
                "zurückgeben",
                "bekommen"
            ],
            "groupNameGerman": "Besorgung",
            "groupNameSpanish": "Encargos",
            "groupNameEnglish": "Errands",
            "groupNumberPerLevel": 4
        },
        {
            "level": "A2.1",
            "verbCount": 5,
            "verbs": [
                "vereinbaren",
                "absagen",
                "planen",
                "vorhaben",
                "verschieben"
            ],
            "groupNameGerman": "Termine",
            "groupNameSpanish": "Citas",
            "groupNameEnglish": "Appointments",
            "groupNumberPerLevel": 5
        },
        {
            "level": "A2.1",
            "verbCount": 6,
            "verbs": [
                "dauern",
                "warten",
                "anfangen",
                "aufhören",
                "beginnen",
                "beeilen"
            ],
            "groupNameGerman": "Zeit",
            "groupNameSpanish": "Tiempo",
            "groupNameEnglish": "Time",
            "groupNumberPerLevel": 6
        },
        {
            "level": "A2.1",
            "verbCount": 4,
            "verbs": [
                "vergleichen",
                "begründen",
                "wählen",
                "entscheiden"
            ],
            "groupNameGerman": "Entscheidung",
            "groupNameSpanish": "Elección",
            "groupNameEnglish": "Choice",
            "groupNumberPerLevel": 7
        },
        {
            "level": "A2.1",
            "verbCount": 5,
            "verbs": [
                "fehlen",
                "enden",
                "fallen",
                "brechen",
                "verschwinden"
            ],
            "groupNameGerman": "Zustand",
            "groupNameSpanish": "Estado",
            "groupNameEnglish": "State",
            "groupNumberPerLevel": 8
        },
        {
            "level": "A2.1",
            "verbCount": 3,
            "verbs": [
                "tun",
                "ändern",
                "wechseln"
            ],
            "groupNameGerman": "Änderung",
            "groupNameSpanish": "Cambio",
            "groupNameEnglish": "Alteration",
            "groupNumberPerLevel": 9
        },
        {
            "level": "A2.1",
            "verbCount": 2,
            "verbs": [
                "regnen",
                "schneien"
            ],
            "groupNameGerman": "Wetter",
            "groupNameSpanish": "Clima",
            "groupNameEnglish": "Weather",
            "groupNumberPerLevel": 10
        },
        {
            "level": "A2.1",
            "verbCount": 5,
            "verbs": [
                "passieren",
                "geschehen",
                "verlieren",
                "rauschen",
                "hoffen"
            ],
            "groupNameGerman": "Schicksal",
            "groupNameSpanish": "Destáino",
            "groupNameEnglish": "Fate",
            "groupNumberPerLevel": 11
        },
        {
            "level": "A2.1",
            "verbCount": 3,
            "verbs": [
                "singen",
                "zeichnen",
                "malen"
            ],
            "groupNameGerman": "Kreativität",
            "groupNameSpanish": "Creatividad",
            "groupNameEnglish": "Creativity",
            "groupNumberPerLevel": 12
        },
        {
            "level": "A2.1",
            "verbCount": 5,
            "verbs": [
                "heißen",
                "bedeuten",
                "nennen",
                "beschreiben",
                "übersetzen"
            ],
            "groupNameGerman": "Bedeutung",
            "groupNameSpanish": "Significado",
            "groupNameEnglish": "Meaning",
            "groupNumberPerLevel": 13
        },
        {
            "level": "A2.2",
            "verbCount": 7,
            "verbs": [
                "begrüßen",
                "verabschieden",
                "anbieten",
                "mitnehmen",
                "holen",
                "wiederholen",
                "organisieren"
            ],
            "groupNameGerman": "Interaktion",
            "groupNameSpanish": "Interacción",
            "groupNameEnglish": "Interaction",
            "groupNumberPerLevel": 1
        },
        {
            "level": "A2.2",
            "verbCount": 4,
            "verbs": [
                "werfen",
                "springen",
                "bewegen",
                "fangen"
            ],
            "groupNameGerman": "Motorik",
            "groupNameSpanish": "Motricidad",
            "groupNameEnglish": "Motorics",
            "groupNumberPerLevel": 2
        },
        {
            "level": "A2.2",
            "verbCount": 5,
            "verbs": [
                "zumachen",
                "zurückkommen",
                "behalten",
                "versuchen",
                "verschenken"
            ],
            "groupNameGerman": "Beruf",
            "groupNameSpanish": "Trabajo",
            "groupNameEnglish": "Job",
            "groupNumberPerLevel": 3
        },
        {
            "level": "A2.2",
            "verbCount": 1,
            "verbs": [
                "beraten"
            ],
            "groupNameGerman": "Büro",
            "groupNameSpanish": "Oficina",
            "groupNameEnglish": "Office",
            "groupNumberPerLevel": 4
        },
        {
            "level": "A2.2",
            "verbCount": 7,
            "verbs": [
                "studieren",
                "lernen",
                "teilnehmen",
                "verstehen",
                "üben",
                "lösen",
                "mitmachen"
            ],
            "groupNameGerman": "Lernen",
            "groupNameSpanish": "Aprendizaje",
            "groupNameEnglish": "Learning",
            "groupNumberPerLevel": 5
        },
        {
            "level": "A2.2",
            "verbCount": 5,
            "verbs": [
                "unterrichten",
                "erklären",
                "bestáehen",
                "prüfen",
                "lehren"
            ],
            "groupNameGerman": "Lehre",
            "groupNameSpanish": "Enseñanza",
            "groupNameEnglish": "Teaching",
            "groupNumberPerLevel": 6
        },
        {
            "level": "A2.2",
            "verbCount": 4,
            "verbs": [
                "herstellen",
                "bauen",
                "aufbauen",
                "klappen"
            ],
            "groupNameGerman": "Werk",
            "groupNameSpanish": "Taller",
            "groupNameEnglish": "Workshop",
            "groupNumberPerLevel": 7
        },
        {
            "level": "A2.2",
            "verbCount": 3,
            "verbs": [
                "vorbereiten",
                "zuhören",
                "regeln"
            ],
            "groupNameGerman": "Planung",
            "groupNameSpanish": "Planificación",
            "groupNameEnglish": "Planning",
            "groupNumberPerLevel": 8
        },
        {
            "level": "A2.2",
            "verbCount": 4,
            "verbs": [
                "braten",
                "kochen",
                "backen",
                "räuchern"
            ],
            "groupNameGerman": "Kochen",
            "groupNameSpanish": "Cocina",
            "groupNameEnglish": "Cooking",
            "groupNumberPerLevel": 9
        },
        {
            "level": "A2.2",
            "verbCount": 4,
            "verbs": [
                "mischen",
                "vermischen",
                "wiegen",
                "einmachen"
            ],
            "groupNameGerman": "Rezept",
            "groupNameSpanish": "Receta",
            "groupNameEnglish": "Recipe",
            "groupNumberPerLevel": 10
        },
        {
            "level": "A2.2",
            "verbCount": 7,
            "verbs": [
                "husten",
                "schmerzen",
                "untersuchen",
                "wehtun",
                "erkälten",
                "erholen",
                "wohlfühlen"
            ],
            "groupNameGerman": "Gesundheit",
            "groupNameSpanish": "Salud",
            "groupNameEnglish": "Health",
            "groupNumberPerLevel": 11
        },
        {
            "level": "A2.2",
            "verbCount": 7,
            "verbs": [
                "schaffen",
                "erreichen",
                "gewinnen",
                "unternehmen",
                "weiterhelfen",
                "führen",
                "vorschlagen"
            ],
            "groupNameGerman": "Firma",
            "groupNameSpanish": "Empresa",
            "groupNameEnglish": "Company",
            "groupNumberPerLevel": 12
        },
        {
            "level": "A2.2",
            "verbCount": 6,
            "verbs": [
                "sehen",
                "hören",
                "riechen",
                "schmecken",
                "aussehen",
                "scheinen"
            ],
            "groupNameGerman": "Wahrnehmung",
            "groupNameSpanish": "Percepción",
            "groupNameEnglish": "Perception",
            "groupNumberPerLevel": 13
        },
        {
            "level": "A2.2",
            "verbCount": 7,
            "verbs": [
                "verdienen",
                "sparen",
                "überweisen",
                "leihen",
                "ausgeben",
                "schulden",
                "zahlen"
            ],
            "groupNameGerman": "Finanzen",
            "groupNameSpanish": "Finanzas",
            "groupNameEnglish": "Finances",
            "groupNumberPerLevel": 14
        },
        {
            "level": "A2.2",
            "verbCount": 5,
            "verbs": [
                "steigen",
                "sinken",
                "wachsen",
                "zunehmen",
                "abnehmen"
            ],
            "groupNameGerman": "Wandel",
            "groupNameSpanish": "Cambio",
            "groupNameEnglish": "Change",
            "groupNumberPerLevel": 15
        },
        {
            "level": "A2.2",
            "verbCount": 3,
            "verbs": [
                "heiraten",
                "sterben",
                "leben"
            ],
            "groupNameGerman": "Biografie",
            "groupNameSpanish": "Biografía",
            "groupNameEnglish": "Biography",
            "groupNumberPerLevel": 16
        },
        {
            "level": "A2.2",
            "verbCount": 5,
            "verbs": [
                "raten",
                "erlauben",
                "verbieten",
                "lassen",
                "verlassen"
            ],
            "groupNameGerman": "Struktur",
            "groupNameSpanish": "Estructura",
            "groupNameEnglish": "Structure",
            "groupNumberPerLevel": 17
        },
        {
            "level": "B1.1",
            "verbCount": 4,
            "verbs": [
                "spenden",
                "aufsuchen",
                "stehlen",
                "bewerten"
            ],
            "groupNameGerman": "Ethik",
            "groupNameSpanish": "Ética",
            "groupNameEnglish": "Ethics",
            "groupNumberPerLevel": 1
        },
        {
            "level": "B1.1",
            "verbCount": 3,
            "verbs": [
                "bestáätigen",
                "gelingen",
                "misslingen"
            ],
            "groupNameGerman": "Erfolg",
            "groupNameSpanish": "Éxito",
            "groupNameEnglish": "Success",
            "groupNumberPerLevel": 2
        },
        {
            "level": "B1.1",
            "verbCount": 7,
            "verbs": [
                "schmücken",
                "verzieren",
                "erstellen",
                "vorstellen",
                "wünschen",
                "sichern",
                "versichern"
            ],
            "groupNameGerman": "Präsentation",
            "groupNameSpanish": "Presentación",
            "groupNameEnglish": "Presentation",
            "groupNumberPerLevel": 3
        },
        {
            "level": "B1.1",
            "verbCount": 6,
            "verbs": [
                "forschen",
                "erforschen",
                "analysieren",
                "dokumentieren",
                "unterscheiden",
                "ähneln"
            ],
            "groupNameGerman": "Forschung",
            "groupNameSpanish": "Investáigación",
            "groupNameEnglish": "Research",
            "groupNumberPerLevel": 4
        },
        {
            "level": "B1.1",
            "verbCount": 6,
            "verbs": [
                "entschließen",
                "entwickeln",
                "erhalten",
                "gründen",
                "erleben",
                "aufgeben"
            ],
            "groupNameGerman": "Innovation",
            "groupNameSpanish": "Innovación",
            "groupNameEnglish": "Innovation",
            "groupNumberPerLevel": 5
        },
        {
            "level": "B1.1",
            "verbCount": 5,
            "verbs": [
                "schützen",
                "verschmutzen",
                "verbrauchen",
                "trennen",
                "recyceln"
            ],
            "groupNameGerman": "Ökologie",
            "groupNameSpanish": "Ecología",
            "groupNameEnglish": "Ecology",
            "groupNumberPerLevel": 6
        },
        {
            "level": "B1.1",
            "verbCount": 5,
            "verbs": [
                "heilen",
                "behandeln",
                "verletzen",
                "pflegen",
                "retten"
            ],
            "groupNameGerman": "Pflege",
            "groupNameSpanish": "Cuidado",
            "groupNameEnglish": "Care",
            "groupNumberPerLevel": 7
        },
        {
            "level": "B1.1",
            "verbCount": 5,
            "verbs": [
                "funktionieren",
                "reparieren",
                "einstellen",
                "installieren",
                "drucken"
            ],
            "groupNameGerman": "Technik",
            "groupNameSpanish": "Tecnología",
            "groupNameEnglish": "Technology",
            "groupNumberPerLevel": 8
        },
        {
            "level": "B1.1",
            "verbCount": 3,
            "verbs": [
                "löschen",
                "einschalten",
                "ausschalten"
            ],
            "groupNameGerman": "Díaten",
            "groupNameSpanish": "Díatos",
            "groupNameEnglish": "Díata",
            "groupNumberPerLevel": 9
        },
        {
            "level": "B1.1",
            "verbCount": 4,
            "verbs": [
                "klicken",
                "posten",
                "nutzen",
                "senden"
            ],
            "groupNameGerman": "Medien",
            "groupNameSpanish": "Medios",
            "groupNameEnglish": "Media",
            "groupNumberPerLevel": 10
        },
        {
            "level": "B1.1",
            "verbCount": 4,
            "verbs": [
                "regieren",
                "fordern",
                "richten",
                "empfangen"
            ],
            "groupNameGerman": "Politik",
            "groupNameSpanish": "Política",
            "groupNameEnglish": "Politics",
            "groupNumberPerLevel": 11
        },
        {
            "level": "B1.1",
            "verbCount": 4,
            "verbs": [
                "engagieren",
                "unterstützen",
                "akzeptieren",
                "respektieren"
            ],
            "groupNameGerman": "Haltung",
            "groupNameSpanish": "Postura",
            "groupNameEnglish": "Stance",
            "groupNumberPerLevel": 12
        },
        {
            "level": "B1.1",
            "verbCount": 4,
            "verbs": [
                "kämpfen",
                "siegen",
                "wirken",
                "kündigen"
            ],
            "groupNameGerman": "Wettbewerb",
            "groupNameSpanish": "Competencia",
            "groupNameEnglish": "Competition",
            "groupNumberPerLevel": 13
        },
        {
            "level": "B1.1",
            "verbCount": 3,
            "verbs": [
                "zwingen",
                "beeinflussen",
                "gelten"
            ],
            "groupNameGerman": "Leben in Deutschland",
            "groupNameSpanish": "Vida en Alemania",
            "groupNameEnglish": "Life in Germany",
            "groupNumberPerLevel": 14
        },
        {
            "level": "B1.1",
            "verbCount": 3,
            "verbs": [
                "hineingehen",
                "mitteilen",
                "verwandeln"
            ],
            "groupNameGerman": "Transformation",
            "groupNameSpanish": "Transformación",
            "groupNameEnglish": "Transformation",
            "groupNumberPerLevel": 15
        },
        {
            "level": "B1.1",
            "verbCount": 7,
            "verbs": [
                "diskutieren",
                "kritisieren",
                "loben",
                "widersprechen",
                "überzeugen",
                "stimmen",
                "meinen"
            ],
            "groupNameGerman": "Debatte",
            "groupNameSpanish": "Debate",
            "groupNameEnglish": "Debate",
            "groupNumberPerLevel": 16
        },
        {
            "level": "B1.1",
            "verbCount": 6,
            "verbs": [
                "beantragen",
                "anmelden",
                "einreichen",
                "sammeln",
                "speichern",
                "füllen"
            ],
            "groupNameGerman": "Verwaltung",
            "groupNameSpanish": "Administración",
            "groupNameEnglish": "Administration",
            "groupNumberPerLevel": 17
        },
        {
            "level": "B1.1",
            "verbCount": 7,
            "verbs": [
                "ärgern",
                "lügen",
                "zerstören",
                "beschweren",
                "streiten",
                "schimpfen",
                "stören"
            ],
            "groupNameGerman": "Konflikt",
            "groupNameSpanish": "Conflicto",
            "groupNameEnglish": "Conflict",
            "groupNumberPerLevel": 18
        },
        {
            "level": "B1.1",
            "verbCount": 3,
            "verbs": [
                "probieren",
                "auswählen",
                "ersetzen"
            ],
            "groupNameGerman": "Versuch",
            "groupNameSpanish": "Prueba",
            "groupNameEnglish": "Trial",
            "groupNumberPerLevel": 19
        },
        {
            "level": "B1.1",
            "verbCount": 6,
            "verbs": [
                "teilen",
                "herunterladen",
                "hochladen",
                "verbinden",
                "folgen",
                "empfehlen"
            ],
            "groupNameGerman": "Internet",
            "groupNameSpanish": "Internet",
            "groupNameEnglish": "Internet",
            "groupNumberPerLevel": 20
        },
        {
            "level": "B2.1",
            "verbCount": 6,
            "verbs": [
                "befehlen",
                "betrügen",
                "beurteilen",
                "entstehen",
                "erscheinen",
                "scheitern"
            ],
            "groupNameGerman": "Konzepte",
            "groupNameSpanish": "Conceptos",
            "groupNameEnglish": "Concepts",
            "groupNumberPerLevel": 1
        },
        {
            "level": "B2.1",
            "verbCount": 2,
            "verbs": [
                "wirtschaften",
                "investáieren"
            ],
            "groupNameGerman": "Wirtschaft",
            "groupNameSpanish": "Economía",
            "groupNameEnglish": "Economy",
            "groupNumberPerLevel": 2
        }
    ]
};

fs.writeFileSync('json/verbs_index.json', JSON.stringify(userJson, null, 4));
console.log('Restáored verbs_index.json');

// Rebuild folders and card properties
const groupsDir = 'json/groups';
const cardsDir = 'json/cards';

// Cleanup the pure A1/A2 dirs created earlier
['A1', 'A2', 'B1', 'B2', 'A1_1', 'A1_2', 'A2_1', 'A2_2', 'B1_1', 'B2_1'].forEach(lvl => {
    const p = path.join(groupsDir, lvl);
    if (fs.existsSync(p)) {
        try { fs.rmSync(p, { recursive: true, force: true }); } catch (e) { }
    }
});

userJson.groups.forEach(g => {
    let dirName = g.level.replace('.', '_');
    let dirPath = path.join(groupsDir, dirName);
    if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });

    let chunkPath = path.join(dirPath, `${dirName}_group_${g.groupNumberPerLevel}.json`);
    fs.writeFileSync(chunkPath, JSON.stringify(g, null, 4));

    // Update individual cards
    g.verbs.forEach(v => {
        const cardPath = path.join(cardsDir, v + '.json');
        if (fs.existsSync(cardPath)) {
            let card = JSON.parse(fs.readFileSync(cardPath, 'utf8'));
            card.level = g.level;
            card.group = g.groupNumberPerLevel;
            fs.writeFileSync(cardPath, JSON.stringify(card, null, 4));
        }
    });
});
console.log('Rebuilt füractional directories and card properties.');
