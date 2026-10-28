const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');

const targetProjectDir = "C:\\Users\\juan\\Documents\\_HapticIO\\8_Misc\\_Projects\\Deutsch lernen";
if (!fs.existsSync(targetProjectDir)) {
    fs.mkdirSync(targetProjectDir, { recursive: true });
}

const desktopPath = path.join(os.homedir(), 'Desktop');
const tempHtmlPath = path.join(desktopPath, 'adverbien_DTZ_print.html');

// Create a timestamped PDF filename in target folder
const now = new Date();
const timestamp = now.getFullYear() +
    String(now.getMonth() + 1).padStart(2, '0') +
    String(now.getDate()).padStart(2, '0') + '_' +
    String(now.getHours()).padStart(2, '0') +
    String(now.getMinutes()).padStart(2, '0');
const pdfPath = path.join(targetProjectDir, `adverbien_B1_DTZ_${timestamp}.pdf`);

// 1. Read adverbien_B1_DTZ.html
const htmlContent = fs.readFileSync('adverbien_B1_DTZ.html', 'utf8');

// 2. Extract script block containing data
const scriptRegex = /<script>([\s\S]*?)<\/script>/gi;
let scriptCode = '';
let match;
while ((match = scriptRegex.exec(htmlContent)) !== null) {
    if (match[1].includes('rawAdverbGroups') && match[1].includes('themeBlueprints')) {
        scriptCode = match[1];
        break;
    }
}

if (!scriptCode) {
    console.error('Failed to locate script block with data.');
    process.exit(1);
}

// 3. Evaluate script block to get variables in a sandboxed way
const sandboxCode = `
const document = {
    addEventListener: () => {},
    getElementById: () => ({ appendChild: () => {}, style: {} }),
    querySelector: () => ({ style: {} }),
    querySelectorAll: () => []
};
const window = {
    speechSynthesis: {},
    addEventListener: () => {}
};
const navigator = {
    userAgent: ''
};
${scriptCode}
console.log(JSON.stringify({ rawAdverbGroups, themeBlueprints, modalParticlesGroup }));
`;

const tempEvalPath = path.join(__dirname, 'temp_eval.js');
fs.writeFileSync(tempEvalPath, sandboxCode, 'utf8');

let data;
try {
    const stdout = execSync(`node "${tempEvalPath}"`, { maxBuffer: 10 * 1024 * 1024 });
    data = JSON.parse(stdout.toString());
} catch (err) {
    console.error('Failed to extract data via Node evaluation.');
    console.error(err);
    if (fs.existsSync(tempEvalPath)) fs.unlinkSync(tempEvalPath);
    process.exit(1);
} finally {
    if (fs.existsSync(tempEvalPath)) fs.unlinkSync(tempEvalPath);
}

const { rawAdverbGroups, themeBlueprints, modalParticlesGroup } = data;

// 4. Create word mapping
const wordMap = new Map();
rawAdverbGroups.forEach(g => {
    g.adverbs.forEach(adv => {
        if (adv.dtz_star) {
            wordMap.set(adv.word, adv);
        }
    });
});
modalParticlesGroup.adverbs.forEach(adv => {
    if (adv.dtz_star) {
        wordMap.set(adv.word, adv);
    }
});

// Meta-categorías (Píldoras) para cada tema
const metaCategoryMap = {
    "Gegenwart": "TEMPORAL",
    "Abfolge": "TEMPORAL",
    "Wandel": "TEMPORAL",
    "Frequenz": "FREQUENZ",
    "Raum": "LOKAL",
    "Umgebung": "LOKAL",
    "Grad & Fokus": "MODAL",
    "Haltung": "MODAL / OPINIÓN",
    "Verbindung": "KONNEKTOR",
    "Kausal": "KAUSAL",
    "Bezug": "PRONOMINAL"
};

// 35 Adverbios más cruciales para DTZ B1 y sus notas de destreza con emojis (✍️ Schreiben, 🗣️ Sprechen, 📖 Lesen, 👂 Hören)
// Con frases simples, directas y enfocadas al examen
const dtzKeyNotes = {
    // Kausal & Verbindung (Conectores imprescindibles)
    "deshalb": { emoji: "✍️🗣️", tip: "Causa en cartas y oral", ex_de: "Ich bin krank, deshalb bleibe ich zu Hause.", ex_es: "Estoy enfermo, por eso me quedo en casa." },
    "deswegen": { emoji: "✍️", tip: "Justificar ausencias en notas", ex_de: "Mein Kind ist krank, deswegen komme ich nicht.", ex_es: "Mi hijo está enfermo, por eso no voy." },
    "also": { emoji: "🗣️", tip: "Resumir acuerdos al hablar", ex_de: "Also, wir treffen uns um zehn Uhr.", ex_es: "Entonces, nos vemos a las diez." },
    "sonst": { emoji: "📖🗣️", tip: "Condiciones en avisos (o si no)", ex_de: "Zahlen Sie bitte, sonst gibt es Mahngebühren.", ex_es: "Pague por favor, o si no habrá recargo." },
    "trotzdem": { emoji: "✍️🗣️", tip: "Concesivo clave B1", ex_de: "Es regnet, trotzdem gehe ich spazieren.", ex_es: "Llueve, pero aun así salgo a caminar." },
    "außerdem": { emoji: "✍️📖", tip: "Sumar puntos en la carta / leer avisos", ex_de: "Ich bin fleißig und lerne außerdem gern.", ex_es: "Soy aplicado y además me gusta aprender." },
    "allerdings": { emoji: "📖🗣️", tip: "Matizar opiniones / contratos", ex_de: "Die Wohnung ist schön, allerdings teuer.", ex_es: "El piso es bonito, aunque ciertamente caro." },
    "schließlich": { emoji: "🗣️", tip: "Concluir relato al hablar", ex_de: "Schließlich habe ich die Prüfung geschafft.", ex_es: "Al final aprobé el examen." },
    "doch": { emoji: "🗣️", tip: "Invitar cordialmente", ex_de: "Komm doch bitte rein!", ex_es: "¡Entra por favor!" },

    // Temporales esenciales
    "jetzt": { emoji: "✍️🗣️", tip: "Situación presente en mensajes", ex_de: "Ich habe jetzt Zeit für Sie.", ex_es: "Ahora tengo tiempo para usted." },
    "heute": { emoji: "✍️🗣️", tip: "Fijar citas para el mismo día", ex_de: "Heute kann ich leider nicht kommen.", ex_es: "Hoy lamentablemente no puedo ir." },
    "gestern": { emoji: "🗣️✍️", tip: "Hechos pasados en reclamos", ex_de: "Gestern war die Heizung kaputt.", ex_es: "Ayer la calefacción estaba rota." },
    "morgen": { emoji: "✍️🗣️", tip: "Proponer y confirmar citas", ex_de: "Morgen um 9 Uhr passt es mir gut.", ex_es: "Mañana a las 9 me viene bien." },
    "bald": { emoji: "✍️", tip: "Despedida en cartas y emails", ex_de: "Schreib mir bitte bald!", ex_es: "¡Escríbeme pronto, por favor!" },
    "sofort": { emoji: "📖✍️", tip: "Urgencias en notas y avisos", ex_de: "Bitte rufen Sie mich sofort an.", ex_es: "Por favor llámeme de inmediato." },
    "dann": { emoji: "🗣️", tip: "Secuencia al relatar un día", ex_de: "Erst lerne ich, dann koche ich.", ex_es: "Primero estudio, luego cocino." },
    "danach": { emoji: "🗣️", tip: "Describir el siguiente paso", ex_de: "Wir essen, danach gehen wir spazieren.", ex_es: "Comemos, después vamos a pasear." },
    "später": { emoji: "🗣️✍️", tip: "Pedir cambio de hora", ex_de: "Können wir uns später treffen?", ex_es: "¿Podemos vernos más tarde?" },
    "zuerst": { emoji: "🗣️", tip: "Empezar una explicación oral", ex_de: "Zuerst möchte ich mich vorstellen.", ex_es: "Primero quisiera presentarme." },
    "zuletzt": { emoji: "🗣️", tip: "Terminar la presentación", ex_de: "Zuletzt danke ich für Ihre Aufmerksamkeit.", ex_es: "Por último agradezco su atención." },
    "schon": { emoji: "📖👂", tip: "Acción ya realizada / confirmada", ex_de: "Ich habe den Brief schon abgeschickt.", ex_es: "Ya he enviado la carta." },
    "noch": { emoji: "✍️🗣️", tip: "Acción pendiente o incompleta", ex_de: "Ich brauche noch etwas Zeit.", ex_es: "Todavía necesito algo de tiempo." },
    "immer": { emoji: "🗣️", tip: "Rutinas en la presentación personal", ex_de: "Ich stehe immer um 7 Uhr auf.", ex_es: "Siempre me levanto a las 7." },
    "oft": { emoji: "🗣️", tip: "Hablar de tiempo libre", ex_de: "Am Wochenende fahre ich oft Rad.", ex_es: "El fin de semana monto a menudo en bici." },
    "nie": { emoji: "🗣️", tip: "Negación rotunda", ex_de: "Ich esse nie Fleisch.", ex_es: "Nunca como carne." },

    // Modal, Opinión y Actitud
    "leider": { emoji: "✍️🗣️", tip: "Disculparse y cancelar citas", ex_de: "Leider muss ich unseren Termin absagen.", ex_es: "Lamentablemente tengo que cancelar nuestra cita." },
    "vielleicht": { emoji: "🗣️", tip: "Hacer propuestas al compañero", ex_de: "Vielleicht können wir einen Kuchen backen?", ex_es: "¿Quizás podamos hornear un pastel?" },
    "eigentlich": { emoji: "🗣️", tip: "Matizar respuestas al hablar (en realidad)", ex_de: "Eigentlich habe ich heute keine Zeit.", ex_es: "En realidad hoy no tengo tiempo." },
    "natürlich": { emoji: "🗣️", tip: "Aceptar con amabilidad", ex_de: "Natürlich helfe ich dir gern.", ex_es: "Por supuesto te ayudo con gusto." },
    "wirklich": { emoji: "🗣️", tip: "Reaccionar en el diálogo", ex_de: "Das ist wirklich eine gute Idee!", ex_es: "¡De verdad es una buena idea!" },

    // Frecuencia & Preferencia
    "gern": { emoji: "🗣️✍️", tip: "Aceptar planes con entusiasmo", ex_de: "Ich komme sehr gern zur Party.", ex_es: "Voy con mucho gusto a la fiesta." },
    "lieber": { emoji: "🗣️", tip: "Elegir otra opción al acordar", ex_de: "Ich trinke lieber Tee als Kaffee.", ex_es: "Prefiero tomar té que café." },
    "normalerweise": { emoji: "🗣️", tip: "Describir costumbres típicas", ex_de: "Normalerweise fahre ich mit dem Bus.", ex_es: "Normalmente voy en autobús." },

    // Local
    "hier": { emoji: "🗣️📖", tip: "Señalar fotos o planos", ex_de: "Hier im Bild sieht man einen Park.", ex_es: "Aquí en la imagen se ve un parque." },
    "unterwegs": { emoji: "👂✍️", tip: "Avisar retraso por mensaje de voz", ex_de: "Ich stehe im Stau, bin noch unterwegs.", ex_es: "Estoy en un atasco, sigo en camino." }
};

// Standard premium colors for card headers
const standardColors = ['#0284c7', '#0ea5e9', '#059669', '#b45309', '#0f766e', '#7c3aed', '#d97706', '#be123c', '#ea580c', '#e11d48', '#4f46e5'];

// 5. Generate print HTML
let printHtml = `<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <title>DTZ B1 Adverbien - Druckversion</title>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@600;700;800;900&family=Inter:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&display=swap" rel="stylesheet">
    <style>
        @page {
            size: A4 portrait;
            margin: 0;
        }
        * {
            box-sizing: border-box;
        }
        body {
            font-family: 'Inter', sans-serif;
            background-color: #ffffff;
            color: #0f172a;
            margin: 0;
            padding: 5mm;
            -webkit-print-color-adjust: exact;
        }
        .grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            grid-template-rows: repeat(2, 1fr);
            gap: 10px;
            height: calc(100vh - 10mm);
            page-break-after: always;
        }
        .grid:last-child {
            page-break-after: avoid;
        }
        .kompakt-card {
            background-color: #ffffff;
            border: 1.2px solid #cbd5e1;
            border-radius: 8px;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            break-inside: avoid;
            font-size: 0.8rem;
        }
        .kompakt-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 5px 10px;
            color: #ffffff;
        }
        .header-left {
            display: flex;
            align-items: center;
            gap: 7px;
        }
        .header-pill {
            background-color: rgba(255, 255, 255, 0.22);
            border: 1px solid rgba(255, 255, 255, 0.45);
            padding: 1.5px 6px;
            border-radius: 12px;
            font-size: 0.62rem;
            font-weight: 800;
            letter-spacing: 0.5px;
            text-transform: uppercase;
        }
        .header-de {
            font-family: 'Outfit', sans-serif;
            font-size: 1.05rem;
            font-weight: 800;
            letter-spacing: 0.2px;
        }
        .header-es {
            font-family: 'Inter', sans-serif;
            font-size: 0.82rem;
            font-weight: 500;
            font-style: italic;
            opacity: 0.95;
        }
        .kompakt-content {
            padding: 0px 8px;
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
        }
        .kompakt-row {
            padding: 0.5px 0;
            border-bottom: 1px solid #f1f5f9;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 6px;
        }
        .kompakt-row:last-child {
            border-bottom: none;
        }
        .col-left {
            width: 37%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            line-height: 0.95;
        }
        .word-title-line {
            display: flex;
            align-items: baseline;
            gap: 3px;
        }
        .kompakt-german {
            font-family: 'Outfit', sans-serif;
            font-size: 1.7rem;
            font-weight: 900;
            color: #0f172a;
            letter-spacing: -0.6px;
            line-height: 0.95;
        }
        .kompakt-german.long-word {
            font-size: 0.98rem;
            letter-spacing: -0.4px;
        }
        .kompakt-german.mid-word {
            font-size: 1.4rem;
            letter-spacing: -0.4px;
        }
        .star-badge {
            color: #d97706;
            font-size: 1rem;
            line-height: 1;
            font-weight: bold;
        }
        .meaning-line {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            margin-top: 1px;
        }
        .kompakt-spanish {
            font-size: 0.72rem;
            color: #334155;
            font-style: italic;
            font-weight: 600;
            line-height: 1.1;
        }
        .col-right {
            width: 63%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            text-align: right;
            border-left: 2px solid #e2e8f0;
            padding-left: 6px;
            line-height: 1.15;
        }
        .right-top-line {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            margin-bottom: 1.5px;
        }
        .exam-tip-badge {
            font-size: 0.58rem;
            background-color: #fef3c7;
            color: #92400e;
            border: 1px solid #fde68a;
            padding: 0.5px 4px;
            border-radius: 4px;
            font-weight: 700;
            font-style: normal;
            display: inline-block;
            line-height: 1.2;
        }
        .example-de {
            font-size: 0.73rem;
            color: #0f172a;
            font-weight: 600;
        }
        .example-de strong {
            font-weight: 800;
            color: #0369a1;
        }
        .example-es {
            font-size: 0.67rem;
            color: #475569;
            font-style: italic;
            font-weight: 400;
            margin-top: 1px;
        }
    </style>
</head>
<body>
`;

// Mapa de temáticas por nombre
const themeMap = new Map();
themeBlueprints.forEach(t => themeMap.set(t.title, t));

// Orden por páginas:
// Página 1: Gegenwart, Abfolge, Wandel, Kausal
// Página 2: Verbindung, Haltung, Frequenz, Umgebung
// Página 3: Raum, Grad & Fokus, Bezug, [PORTADA QR]
const orderedThemeTitles = [
    "Gegenwart",
    "Abfolge",
    "Wandel",
    "Kausal",
    "Verbindung",
    "Haltung",
    "Frequenz",
    "Umgebung",
    "Raum",
    "Grad & Fokus",
    "Bezug"
];

// Construir las 11 tarjetas temáticas en orden
const themeCardsList = [];

orderedThemeTitles.forEach((themeTitle, index) => {
    const theme = themeMap.get(themeTitle);
    if (!theme) return;

    const themeColor = standardColors[index % standardColors.length];
    const metaCategory = metaCategoryMap[theme.title] || "ADVERB";
    let cleanTranslation = (theme.translation || '').replace(/^\(|\)$/g, '').trim();

    let rowsHtml = '';
    
    theme.words.forEach(w => {
        const adv = wordMap.get(w);
        if (adv) {
            // Limpiar paréntesis español y truncar si es demasiado largo para 1 sola línea
            let spanTrans = (adv.spanish || '').replace(/^\(|\)$/g, '').trim();
            if (spanTrans.length > 25 && spanTrans.includes('/')) {
                spanTrans = spanTrans.split('/')[0].trim();
            }

            const keyData = dtzKeyNotes[adv.word];
            const isKey = !!keyData;
            const tipText = keyData ? `${keyData.emoji} ${keyData.tip}` : null;

            // Determinar clase de tamaño según longitud de la palabra
            let sizeClass = '';
            if (adv.word.length >= 12) {
                sizeClass = ' long-word'; // e.g. wahrscheinlich (14), normalerweise (13), mittlerweile (12)
            } else if (adv.word.length >= 9) {
                sizeClass = ' mid-word';  // e.g. schließlich (11), regelmäßig (10), eigentlich (10)
            }

            // Ejemplo enfocado al DTZ
            const exDe = (keyData && keyData.ex_de) ? keyData.ex_de : adv.example_de;
            const exEs = (keyData && keyData.ex_es) ? keyData.ex_es : adv.example_es;

            // Resaltar la palabra en el ejemplo alemán si coincide
            let exDeFormatted = exDe;
            const wordEscaped = adv.word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regexWord = new RegExp(`\\b(${wordEscaped})\\b`, 'i');
            if (regexWord.test(exDeFormatted)) {
                exDeFormatted = exDeFormatted.replace(regexWord, '<strong>$1</strong>');
            }

            rowsHtml += `            <div class="kompakt-row">
                <div class="col-left">
                    <div class="word-title-line">
                        <span class="kompakt-german${sizeClass}">${adv.word}</span>
                        ${isKey ? '<span class="star-badge" title="Esencial DTZ">⭐</span>' : ''}
                    </div>
                    <div class="meaning-line" title="${spanTrans}">
                        <span class="kompakt-spanish">${spanTrans}</span>
                    </div>
                </div>
                <div class="col-right">
                    ${tipText ? `<div class="right-top-line"><span class="exam-tip-badge">${tipText}</span></div>` : ''}
                    <div class="example-de">${exDeFormatted}</div>
                    <div class="example-es">${exEs}</div>
                </div>
            </div>
`;
        }
    });

    const cardHtml = `        <div class="kompakt-card">
            <div class="kompakt-header" style="background-color: ${themeColor};">
                <div class="header-left">
                    <span class="header-pill">${metaCategory}</span>
                    <span class="header-de">${theme.title}</span>
                </div>
                <span class="header-es">${cleanTranslation}</span>
            </div>
            <div class="kompakt-content">
${rowsHtml}
            </div>
        </div>
`;
    themeCardsList.push(cardHtml);
});

// Tarjeta Portada / QR Code (Va en la última página junto a las de menor estrellas)
const titleCardHtml = `        <div class="kompakt-card" style="border: 2px solid #0f172a; background-color: #f8fafc; display: flex; flex-direction: column; justify-content: space-between; align-items: center; text-align: center; padding: 12px;">
            <div style="margin-top: 10px; width: 100%;">
                <span style="font-family: 'Outfit', sans-serif; font-size: 3rem; font-weight: 800; color: #0f172a; display: block; line-height: 1;">DTZ B1</span>
                <span style="font-family: 'Outfit', sans-serif; font-size: 1.9rem; font-weight: 800; color: #0284c7; display: block; margin-top: 6px; letter-spacing: 1px;">ADVERBIEN</span>
                <span style="display: inline-block; background-color: #e0f2fe; color: #0369a1; border: 1px solid #bae6fd; font-size: 0.68rem; font-weight: 800; padding: 2px 8px; border-radius: 10px; margin-top: 6px; text-transform: uppercase;">Guía de Examen DTZ / B1</span>
            </div>
            <div style="margin-bottom: 8px; font-size: 0.82rem; color: #334155; font-weight: 600; line-height: 1.4; padding: 0 6px; width: 100%;">
                <div style="border-top: 1px solid #cbd5e1; margin: 6px 0;"></div>
                <p style="margin: 3px 0;">⭐ <strong>35 Adverbios Clave DTZ</strong> señalados con estrella</p>
                <p style="margin: 3px 0;">✍️🗣️📖👂 <strong>Destrezas de examen</strong> (Escribir, Hablar, Leer, Escuchar)</p>
                <p style="margin: 3px 0;">📂 <strong>11 Tarjetas</strong> por función comunicativa</p>
                <div style="border-top: 1px solid #cbd5e1; margin: 6px 0;"></div>
                <div style="margin-top: 8px; display: flex; flex-direction: column; align-items: center;">
                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://juanolaya.github.io/Deutsch_lernen/index.html" alt="QR Code MemoDeutsch" style="width: 85px; height: 85px; border: 1px solid #cbd5e1; padding: 2px; border-radius: 4px; background: #ffffff;" />
                    <span style="display: block; font-size: 0.72rem; color: #0f172a; font-weight: 800; margin-top: 4px; letter-spacing: 0.5px;">MemoDeutsch App</span>
                </div>
            </div>
        </div>
`;

// Distribución de las tarjetas:
// Página 1: Gegenwart, Abfolge, Wandel, Kausal
// Página 2: Verbindung, Haltung, Frequenz, Umgebung
// Página 3: Raum, Grad & Fokus, Bezug + [PORTADA QR]
const allCards = [
    ...themeCardsList.slice(0, 8),
    ...themeCardsList.slice(8, 11),
    titleCardHtml
];

// Chunk into pages of 4 cards
const chunks = [];
for (let i = 0; i < allCards.length; i += 4) {
    chunks.push(allCards.slice(i, i + 4));
}

chunks.forEach((chunk, pageIndex) => {
    printHtml += `    <div class="grid">
`;

    chunk.forEach(card => {
        printHtml += card;
    });

    printHtml += `    </div>\n`;
});

printHtml += `</body>
</html>`;

fs.writeFileSync(tempHtmlPath, printHtml, 'utf8');
console.log('HTML generated at:', tempHtmlPath);

// 7. Find Edge/Chrome path
const browsers = [
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
];

let browserPath = null;
for (const b of browsers) {
    if (fs.existsSync(b)) {
        browserPath = '"' + b + '"';
        break;
    }
}

if (!browserPath) {
    console.error('Could not find Edge or Chrome to compile the PDF.');
    process.exit(1);
}

try {
    console.log('Generating PDF via headless browser...');
    const command = `${browserPath} --headless --disable-gpu "--print-to-pdf=${pdfPath}" "${tempHtmlPath}"`;
    execSync(command, { stdio: 'inherit' });
    console.log('SUCCESS! PDF generated successfully at:', pdfPath);
    if (fs.existsSync(tempHtmlPath)) fs.unlinkSync(tempHtmlPath);
} catch (error) {
    console.error('Failed to convert HTML to PDF.');
    console.error(error);
}
