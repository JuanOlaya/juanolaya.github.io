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

// 35 Adverbios más cruciales para DTZ B1 y sus notas de uso
const dtzKeyNotes = {
    // Kausal & Verbindung (Conectores imprescindibles)
    "deshalb": "Imprescindible B1 (inversión de verbo)",
    "deswegen": "Conector causal clave en cartas",
    "also": "Conclusión / estructurar ideas",
    "sonst": "Consecuencia negativa (o si no...)",
    "trotzdem": "Imprescindible B1 (concesivo)",
    "außerdem": "Añadir argumentos en la carta",
    "allerdings": "Matizar opiniones en parte oral",
    "schließlich": "Conclusión / al fin y al cabo",
    "doch": "Énfasis / insistir cordialmente",

    // Temporales esenciales
    "jetzt": "Base A1-B1 para cartas y citas",
    "heute": "Indicar día actual en mensajes",
    "gestern": "Relato de hechos pasados",
    "morgen": "Proponer o confirmar citas",
    "bald": "Cierre típico de carta (Bis bald!)",
    "sofort": "Reclamaciones / urgencias en cartas",
    "dann": "Estructurar secuencia cronológica",
    "danach": "Describir rutina o proceso",
    "später": "Posponer citas / compromisos",
    "zuerst": "Inicio de secuencia en el oral",
    "zuletzt": "Cierre de secuencia de hechos",
    "schon": "Expresar cumplimiento / ya hecho",
    "noch": "Estado pendiente / todavía",
    "immer": "Frecuencia absoluta en rutinas",
    "oft": "Frecuencia alta en relatos",
    "nie": "Negación temporal absoluta",

    // Modal, Opinión y Actitud
    "leider": "Clave para disculparse y cancelar citas",
    "vielleicht": "Proponer planes / suposiciones",
    "wahrscheinlich": "Descripción de fotos en el oral",
    "natürlich": "Afirmación y cortesía formal",
    "wirklich": "Énfasis y confirmación de dudas",

    // Frecuencia & Preferencia
    "gern": "Aceptar propuestas / preferencias",
    "lieber": "Negociar alternativas en el oral",
    "normalerweise": "Describir costumbres en el oral",

    // Local
    "hier": "Ubicación básica para indicaciones",
    "unterwegs": "Avisar retrasos por mensaje o carta"
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
            padding: 2px 8px;
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
        }
        .kompakt-row {
            padding: 3px 0;
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
            width: 38%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            line-height: 1.1;
        }
        .word-title-line {
            display: flex;
            align-items: baseline;
            gap: 3px;
        }
        .kompakt-german {
            font-family: 'Outfit', sans-serif;
            font-size: 1.25rem;
            font-weight: 800;
            color: #0f172a;
            letter-spacing: -0.3px;
            line-height: 1.05;
        }
        .star-badge {
            color: #d97706;
            font-size: 0.9rem;
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
            width: 62%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            text-align: right;
            border-left: 2px solid #e2e8f0;
            padding-left: 6px;
            line-height: 1.18;
        }
        .right-top-line {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            margin-bottom: 2px;
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
            font-size: 0.72rem;
            color: #1e293b;
            font-weight: 600;
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

// 6. Ordenar temáticas por relevancia de estrellas DTZ B1 (descendente)
const sortedThemes = [...themeBlueprints].sort((a, b) => {
    const starsA = a.words.filter(w => dtzKeyNotes[w]).length;
    const starsB = b.words.filter(w => dtzKeyNotes[w]).length;
    if (starsB !== starsA) {
        return starsB - starsA; // Mayor número de estrellas primero
    }
    return (starsB / b.words.length) - (starsA / a.words.length);
});

// Construir las 11 tarjetas temáticas
const themeCardsList = [];

sortedThemes.forEach((theme, index) => {
    const themeColor = standardColors[index % standardColors.length];
    const metaCategory = metaCategoryMap[theme.title] || "ADVERB";
    let cleanTranslation = (theme.translation || '').replace(/^\(|\)$/g, '').trim();

    let rowsHtml = '';
    
    theme.words.forEach(w => {
        const adv = wordMap.get(w);
        if (adv) {
            // Limpiar paréntesis español y truncar si es demasiado largo para 1 sola línea
            let spanTrans = (adv.spanish || '').replace(/^\(|\)$/g, '').trim();
            // Si tiene varias acepciones separadas por barra, tomamos la más representativa o compacta
            if (spanTrans.length > 25 && spanTrans.includes('/')) {
                spanTrans = spanTrans.split('/')[0].trim();
            }

            const isKey = !!dtzKeyNotes[adv.word];
            const tip = dtzKeyNotes[adv.word] || null;

            rowsHtml += `            <div class="kompakt-row">
                <div class="col-left">
                    <div class="word-title-line">
                        <span class="kompakt-german">${adv.word}</span>
                        ${isKey ? '<span class="star-badge" title="Esencial DTZ">⭐</span>' : ''}
                    </div>
                    <div class="meaning-line" title="${spanTrans}">
                        <span class="kompakt-spanish">${spanTrans}</span>
                    </div>
                </div>
                <div class="col-right">
                    ${tip ? `<div class="right-top-line"><span class="exam-tip-badge">💡 ${tip}</span></div>` : ''}
                    <div class="example-de">${adv.example_de}</div>
                    <div class="example-es">${adv.example_es}</div>
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
                <p style="margin: 3px 0;">💡 <strong>Notas estratégicas</strong> para cartas y parte oral</p>
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
// Página 1 (Top Estrellas): Top 4 temáticas
// Página 2 (Estrellas Medias): Siguientes 4 temáticas
// Página 3 (Última Página - Menor Estrellas + Portada/QR): Últimas 3 temáticas + titleCardHtml
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
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
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
