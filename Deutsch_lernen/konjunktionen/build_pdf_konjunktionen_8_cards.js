const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');
const { pathToFileURL } = require('url');

const sourceHtmlPath = path.join(__dirname, 'konjunktionen_B1_DTZ.html');

const targetProjectDir = "C:\\Users\\juan\\Documents\\_HapticIO\\8_Misc\\_Projects\\Deutsch lernen";
if (!fs.existsSync(targetProjectDir)) {
    fs.mkdirSync(targetProjectDir, { recursive: true });
}

const now = new Date();
const timestamp =
    now.getFullYear() +
    String(now.getMonth() + 1).padStart(2, '0') +
    String(now.getDate()).padStart(2, '0') +
    '_' +
    String(now.getHours()).padStart(2, '0') +
    String(now.getMinutes()).padStart(2, '0');

const pdfPath = path.join(targetProjectDir, `konjunktionen_B1_DTZ_${timestamp}.pdf`);

const tempDir = path.join(__dirname, '..', 'tmp', 'pdfs');
const tempHtmlPath = path.join(tempDir, 'konjunktionen_DTZ_8_cards_print.html');

// 30 Conectores clave para DTZ B1 y sus notas de destreza con emojis (✍️, 🗣️, 📖, 👂) y ejemplos claros
const dtzConnectorNotes = {
    // Coordinantes Pos 0 (ADUSO)
    "und": { emoji: "✍️🗣️", tip: "Unir ideas sin alterar el verbo", ex_de: "Ich lerne Deutsch und ich arbeite.", ex_es: "Estudio alemán y trabajo." },
    "aber": { emoji: "✍️🗣️", tip: "Contrastar información", ex_de: "Ich habe Zeit, aber kein Geld.", ex_es: "Tengo tiempo, pero no dinero." },
    "oder": { emoji: "🗣️", tip: "Ofrecer opciones en el diálogo", ex_de: "Trinken wir Kaffee oder Tee?", ex_es: "¿Tomamos café o té?" },
    "denn": { emoji: "🗣️", tip: "Dar razón simple sin cambiar verbo", ex_de: "Ich bleibe zu Hause, denn ich bin müde.", ex_es: "Me quedo en casa porque estoy cansado." },
    "sondern": { emoji: "✍️🗣️", tip: "Corrección (no X, sino Y)", ex_de: "Nicht mit dem Auto, sondern mit dem Bus.", ex_es: "No en coche, sino en autobús." },

    // Subordinantes Esenciales (Verbo al final)
    "weil": { emoji: "✍️🗣️", tip: "La causa rey en el DTZ (verbo al final)", ex_de: "Ich komme nicht, weil ich krank bin.", ex_es: "No voy porque estoy enfermo." },
    "dass": { emoji: "✍️🗣️", tip: "Opinar y transmitir hechos", ex_de: "Ich glaube, dass das richtig ist.", ex_es: "Creo que eso es correcto." },
    "wenn": { emoji: "✍️🗣️", tip: "Condición o rutina habitual", ex_de: "Wenn ich Zeit habe, helfe ich dir.", ex_es: "Si tengo tiempo, te ayudo." },
    "ob": { emoji: "✍️👂", tip: "Preguntas indirectas y dudas (si...)", ex_de: "Können Sie sagen, ob der Kurs stattfindet?", ex_es: "¿Puede decirme si el curso se realiza?" },
    "als": { emoji: "🗣️", tip: "Hecho único en el pasado (cuando)", ex_de: "Als ich ein Kind war, lebte ich in Peru.", ex_es: "Cuando era niño, vivía en Perú." },

    // Modo / Finalidad / Infinitivos
    "obwohl": { emoji: "✍️🗣️", tip: "Concesivo B1 imprescindible", ex_de: "Obwohl es regnet, gehe ich spazieren.", ex_es: "Aunque llueve, salgo a pasear." },
    "falls": { emoji: "✍️📖", tip: "Condicional formal en avisos y cartas", ex_de: "Falls Sie Fragen haben, rufen Sie an.", ex_es: "Si tiene preguntas, llame por favor." },
    "damit": { emoji: "✍️🗣️", tip: "Finalidad (sujetos distintos)", ex_de: "Ich helfe dir, damit du pünktlich bist.", ex_es: "Te ayudo para que estés puntual." },
    "um... zu": { emoji: "✍️🗣️", tip: "Finalidad con el mismo sujeto", ex_de: "Ich lerne viel, um die Prüfung zu bestehen.", ex_es: "Estudio mucho para aprobar el examen." },
    "ohne... zu": { emoji: "✍️🗣️", tip: "Acción no realizada (sin hacer X)", ex_de: "Er ging, ohne ein Wort zu sagen.", ex_es: "Se fue sin decir una palabra." },
    "statt... zu": { emoji: "🗣️", tip: "Sustituir una acción (en vez de)", ex_de: "Ich bleibe hier, statt wegzugehen.", ex_es: "Me quedo aquí en vez de irme." },

    // Adverbiales Pos 1 (Inversión de verbo)
    "deshalb": { emoji: "✍️🗣️", tip: "Causa principal B1 (verbo en pos. 2)", ex_de: "Ich habe Fieber, deshalb bleibe ich im Bett.", ex_es: "Tengo fiebre, por eso me quedo en la cama." },
    "deswegen": { emoji: "✍️", tip: "Justificaciones en cartas y reclamos", ex_de: "Der Zug hatte Verspätung, deswegen komme ich später.", ex_es: "El tren tenía retraso, por eso llego más tarde." },
    "darum": { emoji: "🗣️", tip: "Por eso (frecuente al hablar)", ex_de: "Es war kalt, darum trug ich eine Jacke.", ex_es: "Hacía frío, por eso llevaba chaqueta." },
    "trotzdem": { emoji: "✍️🗣️", tip: "Aun así / no obstante (inversión)", ex_de: "Es war teuer, trotzdem kaufte er es.", ex_es: "Era caro, aun así lo compró." },
    "sonst": { emoji: "📖🗣️", tip: "Condiciones en avisos (o si no...)", ex_de: "Kommen Sie pünktlich, sonst verfällt der Termin.", ex_es: "Venga puntual, o si no caduca la cita." },
    "dann": { emoji: "🗣️", tip: "Secuencia temporal al hablar", ex_de: "Erst essen wir, dann gehen wir los.", ex_es: "Primero comemos, luego salimos." },
    "außerdem": { emoji: "✍️📖", tip: "Añadir argumentos en cartas formales", ex_de: "Der Kurs ist gut und außerdem kostenlos.", ex_es: "El curso es bueno y además gratuito." },

    // Temporales complementarios
    "bevor": { emoji: "📖🗣️", tip: "Antes de (orden de pasos)", ex_de: "Unterschreiben Sie, bevor Sie gehen.", ex_es: "Firme antes de irse." },
    "nachdem": { emoji: "📖🗣️", tip: "Después de que (hecho previo)", ex_de: "Nachdem er gegessen hatte, ging er.", ex_es: "Después de haber comido, se fue." },
    "während": { emoji: "📖🗣️", tip: "Mientras tanto / simultaneidad", ex_de: "Während ich lerne, kocht sie.", ex_es: "Mientras yo estudio, ella cocina." },
    "bis": { emoji: "📖👂", tip: "Límite de tiempo en avisos", ex_de: "Warten Sie bitte, bis der Zug hält.", ex_es: "Espere por favor hasta que el tren pare." },
    "sobald": { emoji: "✍️👂", tip: "Tan pronto como (avisos de llegada)", ex_de: "Ich rufe an, sobald ich da bin.", ex_es: "Llamo tan pronto como llegue." }
};

const levelMap = {
    und: 'A1', aber: 'A1', oder: 'A1', denn: 'A1', sondern: 'A1', doch: 'B1', sowie: 'B1',
    'zwar... aber': 'B1', 'entweder... oder': 'B1', 'weder... noch': 'B1',
    weil: 'A2', dass: 'A2', wenn: 'A2', ob: 'A2', als: 'A2', obwohl: 'B1', falls: 'B1',
    bevor: 'A2', nachdem: 'B1', während: 'B1', seitdem: 'B1', bis: 'A2', sobald: 'B1', solange: 'B1', indem: 'B1',
    damit: 'A2', 'um... zu': 'A2', 'ohne... zu': 'B1', 'statt... zu': 'B1',
    deshalb: 'B1', deswegen: 'B1', darum: 'B1', trotzdem: 'B1', sonst: 'B1', dann: 'A2', außerdem: 'B1',
    daher: 'B1', dennoch: 'B1', jedoch: 'B1', zuerst: 'A2', danach: 'A2', anschließend: 'B1', da: 'B1',
    wann: 'A2', warum: 'A2', wie: 'A1', wo: 'A1', wohin: 'A2', woher: 'A2'
};

const themeColors = {
    a1: '#0284c7',
    a2: '#0ea5e9',
    b1: '#059669',
    b2: '#b45309',
    inf: '#7c3aed'
};

function hasClass(tag, className) {
    const match = tag.match(/\bclass\s*=\s*"([^"]*)"/i);
    if (!match) return false;
    return match[1].split(/\s+/).includes(className);
}

function classList(tag) {
    const match = tag.match(/\bclass\s*=\s*"([^"]*)"/i);
    return match ? match[1].split(/\s+/) : [];
}

function stripTags(value) {
    return value.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

function getAttribute(tag, name) {
    const expression = new RegExp('\\b' + name + '="([^"]*)"', 'i');
    const match = tag.match(expression);
    return match ? match[1] : '';
}

function findTagEnd(html, startIndex) {
    let quote = null;
    for (let index = startIndex; index < html.length; index += 1) {
        const character = html[index];
        if (quote) {
            if (character === quote) quote = null;
            continue;
        }
        if (character === '"' || character === "'") {
            quote = character;
        } else if (character === '>') {
            return index;
        }
    }
    return -1;
}

function extractRows(cardHtml) {
    const rows = [];
    const rowStart = /<tr\b/gi;
    let match;

    while ((match = rowStart.exec(cardHtml)) !== null) {
        const openEnd = findTagEnd(cardHtml, match.index);
        if (openEnd === -1) break;

        const closeStart = cardHtml.indexOf('</tr>', openEnd + 1);
        if (closeStart === -1) break;

        const openTag = cardHtml.slice(match.index, openEnd + 1);
        const body = cardHtml.slice(openEnd + 1, closeStart);

        if (hasClass(openTag, 'card-section-label')) {
            rows.push({ type: 'section', text: stripTags(body) });
        } else if (hasClass(openTag, 'card-section-rule')) {
            rows.push({ type: 'rule', text: stripTags(body) });
        } else {
            const word = getAttribute(openTag, 'data-word');
            if (word) {
                rows.push({
                    type: 'word',
                    word,
                    translation: getAttribute(openTag, 'data-trans'),
                    example: getAttribute(openTag, 'data-example'),
                    exampleEs: getAttribute(openTag, 'data-example-es'),
                    favorite: getAttribute(openTag, 'data-dtz-star') === 'true',
                    level: levelMap[word] || 'B1'
                });
            }
        }

        rowStart.lastIndex = closeStart + 5;
    }

    return rows;
}

function extractDivBlocksByClass(html, className) {
    const blocks = [];
    const candidate = /<div\b[^>]*>/gi;
    let match;

    while ((match = candidate.exec(html)) !== null) {
        if (!hasClass(match[0], className)) continue;

        const startIndex = match.index;
        const token = /<div\b[^>]*>|<\/div>/gi;
        token.lastIndex = startIndex;
        let depth = 0;
        let tokenMatch;

        while ((tokenMatch = token.exec(html)) !== null) {
            if (/^<div\b/i.test(tokenMatch[0])) {
                depth += 1;
            } else {
                depth -= 1;
            }

            if (depth === 0) {
                blocks.push(html.slice(startIndex, token.lastIndex));
                candidate.lastIndex = token.lastIndex;
                break;
            }
        }
    }

    return blocks;
}

function parseCard(cardHtml, index) {
    const headerMatch = cardHtml.match(
        /<div\b[^>]*class="[^"]*\blevel-header\b[^"]*"[^>]*>\s*<span>([\s\S]*?)<\/span>\s*<span\b[^>]*>([\s\S]*?)<\/span>/i
    );
    if (!headerMatch) {
        throw new Error('Could not parse header for card ' + (index + 1));
    }

    const headerTagMatch = cardHtml.match(/<div\b[^>]*class="[^"]*\blevel-header\b[^"]*"[^>]*>/i);
    const headerClasses = headerTagMatch ? classList(headerTagMatch[0]) : [];
    const themeClass = ['a1', 'a2', 'b1', 'b2', 'inf'].find((name) =>
        headerClasses.includes(name)
    ) || 'b1';

    const footerMatch = cardHtml.match(
        /<div\b[^>]*class="[^"]*\blevel-footer\b[^"]*"[^>]*>([\s\S]*?)<\/div>/i
    );
    const rows = extractRows(cardHtml);

    return {
        position: stripTags(headerMatch[1]),
        title: stripTags(headerMatch[2]),
        themeClass,
        color: themeColors[themeClass] || '#0284c7',
        footer: footerMatch ? stripTags(footerMatch[1]) : '',
        rows
    };
}

function renderRow(row) {
    if (row.type === 'section') {
        return (
            '<div class="kompakt-section kompakt-section-label">' +
            row.text +
            '</div>'
        );
    }

    if (row.type === 'rule') {
        return (
            '<div class="kompakt-section kompakt-section-rule">' +
            row.text +
            '</div>'
        );
    }

    const keyData = dtzConnectorNotes[row.word];
    const isStar = row.favorite || !!keyData;
    const tipText = keyData ? `${keyData.emoji} ${keyData.tip}` : null;

    // Ejemplos simplificados
    const exDe = (keyData && keyData.ex_de) ? keyData.ex_de : row.example;
    const exEs = (keyData && keyData.ex_es) ? keyData.ex_es : row.exampleEs;

    let exDeFormatted = exDe || '';
    if (exDeFormatted) {
        const cleanWord = row.word.split('...')[0].trim();
        const wordEscaped = cleanWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regexWord = new RegExp(`\\b(${wordEscaped})\\b`, 'i');
        if (regexWord.test(exDeFormatted)) {
            exDeFormatted = exDeFormatted.replace(regexWord, '<strong>$1</strong>');
        }
    }

    // Traducción sin paréntesis
    let spanTrans = (row.translation || '').replace(/^\(|\)$/g, '').trim();

    // Clases de tamaño para palabra en alemán
    let germanClass = 'kompakt-german';
    if (row.word.length > 12) {
        germanClass += ' long-word';
    } else if (row.word.length >= 8) {
        germanClass += ' mid-word';
    }

    return [
        '<div class="kompakt-row">',
        '  <div class="col-left">',
        '    <div class="word-title-line">',
        '      <span class="' + germanClass + '">' + row.word + '</span>',
        isStar ? '      <span class="star-badge">⭐</span>' : '',
        '    </div>',
        '    <div class="meaning-line" title="' + spanTrans + '">',
        '      <span class="kompakt-spanish">' + spanTrans + '</span>',
        '    </div>',
        '  </div>',
        '  <div class="col-right">',
        tipText ? '    <div class="right-top-line"><span class="exam-tip-badge">' + tipText + '</span></div>' : '',
        exDeFormatted ? '    <div class="example-de">' + exDeFormatted + '</div>' : '',
        exEs ? '    <div class="example-es">' + exEs + '</div>' : '',
        '  </div>',
        '</div>'
    ].join('\n');
}

function renderCard(card) {
    const rowsHtml = card.rows.map(renderRow).join('\n');

    return [
        '<article class="kompakt-card">',
        '  <header class="kompakt-header" style="background-color:' + card.color + '">',
        '    <div class="header-left">',
        '      <span class="header-pill">' + card.position + '</span>',
        '      <span class="header-de">' + card.title + '</span>',
        '    </div>',
        '  </header>',
        '  <div class="kompakt-content">',
        rowsHtml,
        '  </div>',
        '  <footer class="kompakt-footer" style="background-color:' + card.color + '">',
        card.footer,
        '  </footer>',
        '</article>'
    ].join('\n');
}

function renderPage(cards) {
    return [
        '<section class="print-page">',
        '  <div class="grid">',
        cards.map(renderCard).join('\n'),
        '  </div>',
        '</section>'
    ].join('\n');
}

const sourceHtml = fs.readFileSync(sourceHtmlPath, 'utf8');
const cardBlocks = extractDivBlocksByClass(sourceHtml, 'level-card');
const cards = cardBlocks.map(parseCard);

if (cards.length !== 8) {
    throw new Error('Expected exactly 8 cards, but found ' + cards.length + '.');
}

const printHtml = [
    '<!DOCTYPE html>',
    '<html lang="de">',
    '<head>',
    '  <meta charset="UTF-8">',
    '  <title>DTZ B1 Konjunktionen - Druckversion</title>',
    '  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@600;700;800;900&family=Inter:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&display=swap" rel="stylesheet">',
    '  <style>',
    '    @page { size: A4 portrait; margin: 0; }',
    '    * { box-sizing: border-box; }',
    '    html, body { margin: 0; padding: 0; background: #fff; color: #0f172a; }',
    '    body { font-family: "Inter", "Segoe UI", sans-serif; -webkit-print-color-adjust: exact; print-color-adjust: exact; margin: 0; padding: 5mm; }',
    '    .print-page { width: 210mm; height: 297mm; padding: 5mm; display: flex; flex-direction: column; break-after: page; page-break-after: always; overflow: hidden; }',
    '    .print-page:last-child { break-after: auto; page-break-after: auto; }',
    '    .grid { flex: 1; min-height: 0; display: grid; grid-template-columns: repeat(2, 1fr); grid-template-rows: repeat(2, 1fr); gap: 10px; height: calc(100vh - 10mm); }',
    '    .kompakt-card { min-width: 0; min-height: 0; display: flex; flex-direction: column; overflow: hidden; border: 1.2px solid #cbd5e1; border-radius: 8px; background: #fff; break-inside: avoid; page-break-inside: avoid; font-size: 0.8rem; }',
    '    .kompakt-header { min-height: 8.5mm; flex: 0 0 8.5mm; display: flex; align-items: center; justify-content: space-between; gap: 7px; padding: 4px 10px; color: #fff; }',
    '    .header-left { display: flex; align-items: center; gap: 7px; }',
    '    .header-pill { background-color: rgba(255, 255, 255, 0.22); border: 1px solid rgba(255, 255, 255, 0.45); padding: 1.5px 6px; border-radius: 12px; font-size: 0.62rem; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase; }',
    '    .header-de { font-family: "Outfit", sans-serif; font-size: 1.05rem; font-weight: 800; letter-spacing: 0.2px; }',
    '    .kompakt-content { padding: 1px 8px; flex: 1; display: flex; flex-direction: column; justify-content: space-around; }',
    '    .kompakt-row { padding: 1.5px 0; border-bottom: 1px solid #f1f5f9; display: flex; align-items: center; justify-content: space-between; gap: 6px; }',
    '    .kompakt-row:last-child { border-bottom: none; }',
    '    .col-left { width: 36%; display: flex; flex-direction: column; justify-content: center; line-height: 0.95; }',
    '    .word-title-line { display: flex; align-items: baseline; gap: 3px; }',
    '    .kompakt-german { font-family: "Outfit", sans-serif; font-size: 1.7rem; font-weight: 900; color: #0f172a; letter-spacing: -0.5px; line-height: 0.95; }',
    '    .kompakt-german.mid-word { font-size: 1.35rem; letter-spacing: -0.4px; }',
    '    .kompakt-german.long-word { font-size: 1.05rem; letter-spacing: -0.3px; }',
    '    .star-badge { color: #d97706; font-size: 0.95rem; line-height: 1; font-weight: bold; }',
    '    .meaning-line { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: 1px; }',
    '    .kompakt-spanish { font-size: 0.72rem; color: #334155; font-style: italic; font-weight: 600; line-height: 1.1; }',
    '    .col-right { width: 64%; display: flex; flex-direction: column; justify-content: center; text-align: right; border-left: 2px solid #e2e8f0; padding-left: 6px; line-height: 1.16; }',
    '    .right-top-line { display: flex; justify-content: flex-end; align-items: center; margin-bottom: 1.5px; }',
    '    .exam-tip-badge { font-size: 0.58rem; background-color: #fef3c7; color: #92400e; border: 1px solid #fde68a; padding: 0.5px 4px; border-radius: 4px; font-weight: 700; font-style: normal; display: inline-block; line-height: 1.2; }',
    '    .example-de { font-size: 0.73rem; color: #0f172a; font-weight: 600; }',
    '    .example-de strong { font-weight: 800; color: #0369a1; }',
    '    .example-es { font-size: 0.67rem; color: #475569; font-style: italic; font-weight: 400; margin-top: 1px; }',
    '    .kompakt-section { flex: 0 0 auto; padding: 0.8mm 2.4mm; font-size: 6.5pt; font-weight: 800; letter-spacing: 0.55pt; text-align: center; text-transform: uppercase; }',
    '    .kompakt-section-label { border-top: 0.25mm solid #c4b5fd; border-bottom: 0.25mm solid #c4b5fd; background: #ede9fe; color: #6d28d9; }',
    '    .kompakt-section-rule { background: #7c3aed; color: #fff; letter-spacing: 0.15pt; text-transform: none; }',
    '    .kompakt-footer { min-height: 6.5mm; flex: 0 0 6.5mm; display: flex; align-items: center; justify-content: center; padding: 1.2mm 2mm; color: #fff; font-size: 7.5pt; font-weight: 700; letter-spacing: 0.05pt; text-align: center; white-space: nowrap; }',
    '  </style>',
    '</head>',
    '<body>',
    renderPage(cards.slice(0, 4)),
    renderPage(cards.slice(4, 8)),
    '</body>',
    '</html>'
].join('\n');

fs.mkdirSync(tempDir, { recursive: true });
fs.writeFileSync(tempHtmlPath, printHtml, 'utf8');

const browserCandidates = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
];

let browserPath = null;
for (const candidate of browserCandidates) {
    if (fs.existsSync(candidate)) {
        browserPath = candidate;
        break;
    }
}

if (!browserPath) {
    throw new Error('No compatible browser found to print PDF.');
}

console.log('Generating PDF via headless browser...');
const result = spawnSync(browserPath, [
    '--headless',
    '--disable-gpu',
    '--print-to-pdf=' + pdfPath,
    pathToFileURL(tempHtmlPath).toString()
], { stdio: 'inherit' });

if (result.error) {
    throw result.error;
}

console.log('SUCCESS! PDF generated successfully at:', pdfPath);
