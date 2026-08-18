const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');
const { pathToFileURL } = require('url');

/*
 * Adapted copy of build_pdf_konjunktionen.js.
 *
 * Default:
 *   node build_pdf_konjunktionen_8_cards.js
 *
 * Options:
 *   --examples=all    Examples on all eight cards (default)
 *   --examples=front  Examples on the first four cards
 *   --examples=none   No examples
 *   --output=PATH     Stable output path instead of a timestamped Desktop PDF
 *   --keep-html       Keep the intermediate printable HTML
 */

function optionValue(name) {
    const prefix = '--' + name + '=';
    const option = process.argv.slice(2).find((arg) => arg.startsWith(prefix));
    return option ? option.slice(prefix.length) : null;
}

const examplesMode = optionValue('examples') || 'all';
if (!['front', 'all', 'none'].includes(examplesMode)) {
    throw new Error('Invalid --examples value. Use front, all, or none.');
}

const sourceHtmlPath = path.join(__dirname, 'konjunktionen_B1_DTZ.html');
const desktopPath = path.join(os.homedir(), 'Desktop');
const now = new Date();
const timestamp =
    now.getFullYear() +
    String(now.getMonth() + 1).padStart(2, '0') +
    String(now.getDate()).padStart(2, '0') +
    '_' +
    String(now.getHours()).padStart(2, '0') +
    String(now.getMinutes()).padStart(2, '0');

const requestedOutput = optionValue('output');
const pdfPath = requestedOutput
    ? path.resolve(requestedOutput)
    : path.join(desktopPath, 'konjunktionen_B1_DTZ_8_cards_' + timestamp + '.pdf');

const tempDir = path.join(__dirname, '..', 'tmp', 'pdfs');
const tempHtmlPath = path.join(tempDir, 'konjunktionen_DTZ_8_cards_print.html');
const keepHtml = process.argv.includes('--keep-html');

const levelMap = {
    und: 'A1',
    aber: 'A1',
    oder: 'A1',
    denn: 'A1',
    sondern: 'A1',
    doch: 'B1',
    sowie: 'B1',
    'zwar... aber': 'B1',
    'entweder... oder': 'B1',
    'weder... noch': 'B1',
    weil: 'A2',
    dass: 'A2',
    wenn: 'A2',
    ob: 'A2',
    als: 'A2',
    obwohl: 'B1',
    falls: 'B1',
    bevor: 'A2',
    nachdem: 'B1',
    während: 'B1',
    seitdem: 'B1',
    bis: 'A2',
    sobald: 'B1',
    solange: 'B1',
    indem: 'B1',
    damit: 'A2',
    'um... zu': 'A2',
    'ohne... zu': 'B1',
    'statt... zu': 'B1',
    deshalb: 'B1',
    deswegen: 'B1',
    darum: 'B1',
    trotzdem: 'B1',
    sonst: 'B1',
    dann: 'A2',
    außerdem: 'B1',
    daher: 'B1',
    dennoch: 'B1',
    jedoch: 'B1',
    zuerst: 'A2',
    danach: 'A2',
    anschließend: 'B1',
    da: 'B1',
    wann: 'A2',
    warum: 'A2',
    wie: 'A1',
    wo: 'A1',
    wohin: 'A2',
    woher: 'A2'
};

const themeColors = {
    a1: '#3b82f6',
    a2: '#ca8a04',
    b1: '#f97316',
    b2: '#ef4444',
    inf: '#a855f7'
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
    const connectorCount = rows.filter((row) => row.type === 'word').length;

    if (connectorCount > 7) {
        throw new Error(
            'Card "' + stripTags(headerMatch[2]) + '" has ' + connectorCount + ' connectors.'
        );
    }

    return {
        position: stripTags(headerMatch[1]),
        title: stripTags(headerMatch[2]),
        themeClass,
        color: themeColors[themeClass],
        footer: footerMatch ? stripTags(footerMatch[1]) : '',
        rows
    };
}

function shouldShowExamples(cardIndex) {
    if (examplesMode === 'all') return true;
    if (examplesMode === 'none') return false;
    return cardIndex < 4;
}

function renderRow(row, showExamples) {
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

    const exampleDe = showExamples && row.example
        ? '<div class="kompakt-example-de">' + row.example + '</div>'
        : '';
    const exampleEs = showExamples && row.exampleEs
        ? '<div class="kompakt-example-es">' + row.exampleEs + '</div>'
        : '';
    const exampleBlock = (exampleDe || exampleEs)
        ? '<div class="kompakt-example">' + exampleDe + exampleEs + '</div>'
        : '';

    const germanClass = row.word.length > 14
        ? 'kompakt-german long-word'
        : 'kompakt-german';
    const favoriteStar = row.favorite
        ? '<span class="favorite-star" aria-hidden="true">★</span>'
        : '';

    return [
        '<div class="kompakt-row">',
        '  <div class="german-col">',
        '    <span class="' + germanClass + '">' + favoriteStar + row.word + '</span>',
        '  </div>',
        '  <div class="details-col">',
        '    <div class="trans-line">',
        '      <span class="kompakt-spanish">' + row.translation + '</span>',
        '      <span class="level-badge">' + row.level + '</span>',
        '    </div>',
        '    ' + exampleBlock,
        '  </div>',
        '</div>'
    ].join('\n');
}

function renderCard(card, cardIndex) {
    const showExamples = shouldShowExamples(cardIndex);
    const rowsHtml = card.rows
        .map((row) => renderRow(row, showExamples))
        .join('\n');

    return [
        '<article class="kompakt-card' + (showExamples ? ' with-examples' : ' without-examples') + '">',
        '  <header class="kompakt-header" style="background-color:' + card.color + '">',
        '    <span class="header-de">' + card.position + '</span>',
        '    <span class="header-es">' + card.title + '</span>',
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

function renderPage(cards, pageIndex) {
    const pageInfo = pageIndex === 0
        ? {
            kicker: 'CARA A - NUCLEO DTZ B1',
            title: 'Las cuatro reglas de uso activo',
            note: examplesMode === 'all'
                ? 'Ejemplos en las 8 tarjetas'
                : 'Ejemplos en las 4 tarjetas esenciales'
        }
        : {
            kicker: 'CARA B - AMPLIACION DTZ B1',
            title: 'Alternativas y estructuras complementarias',
            note: 'Orden espejado para duplex por borde largo'
        };

    return [
        '<section class="print-page">',
        '  <div class="page-header">',
        '    <div>',
        '      <div class="page-kicker">' + pageInfo.kicker + '</div>',
        '      <h1>' + pageInfo.title + '</h1>',
        '    </div>',
        '    <div class="page-note">' + pageInfo.note + '</div>',
        '  </div>',
        '  <div class="grid">',
        cards.map((card, offset) => renderCard(card, pageIndex * 4 + offset)).join('\n'),
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

const examplesDescription =
    examplesMode === 'all'
        ? 'all 8 cards'
        : examplesMode === 'none'
            ? 'no cards'
            : 'the first 4 cards';

const printHtml = [
    '<!DOCTYPE html>',
    '<html lang="de">',
    '<head>',
    '  <meta charset="UTF-8">',
    '  <title>DTZ B1 Konjunktionen - 8 Karten</title>',
    '  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@600;800&family=Inter:ital,wght@0,400;0,600;0,700;1,400;1,700&display=swap" rel="stylesheet">',
    '  <style>',
    '    @page { size: A4 portrait; margin: 0; }',
    '    * { box-sizing: border-box; }',
    '    html, body { margin: 0; padding: 0; background: #fff; color: #0f172a; }',
    '    body { font-family: "Inter", "Segoe UI", sans-serif; -webkit-print-color-adjust: exact; print-color-adjust: exact; }',
    '    .print-page { width: 210mm; height: 297mm; padding: 5mm 6mm; display: flex; flex-direction: column; break-after: page; page-break-after: always; overflow: hidden; }',
    '    .print-page:last-child { break-after: auto; page-break-after: auto; }',
    '    .page-header { height: 15mm; flex: 0 0 15mm; display: flex; justify-content: space-between; align-items: center; gap: 5mm; border-bottom: 0.6mm solid #0f172a; margin-bottom: 3mm; padding: 0 1mm 2mm; }',
    '    .page-kicker { color: #475569; font-size: 6.5pt; font-weight: 800; letter-spacing: 0.8pt; }',
    '    .page-header h1 { margin: 0.7mm 0 0; font-family: "Outfit", "Segoe UI", sans-serif; font-size: 14pt; line-height: 1; }',
    '    .page-note { max-width: 70mm; color: #64748b; font-size: 7pt; font-weight: 600; text-align: right; }',
    '    .grid { flex: 1; min-height: 0; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); grid-template-rows: repeat(2, minmax(0, 1fr)); gap: 3mm; }',
    '    .kompakt-card { min-width: 0; min-height: 0; display: flex; flex-direction: column; overflow: hidden; border: 0.35mm solid #cbd5e1; border-radius: 2.4mm; background: #fff; break-inside: avoid; page-break-inside: avoid; }',
    '    .kompakt-header { min-height: 10mm; flex: 0 0 10mm; display: flex; align-items: center; justify-content: space-between; gap: 3mm; padding: 2mm 3mm; color: #fff; }',
    '    .header-de { flex-shrink: 0; font-family: "Outfit", "Segoe UI", sans-serif; font-size: 10pt; font-weight: 800; text-transform: uppercase; }',
    '    .header-es { min-width: 0; overflow: hidden; font-size: 8pt; font-style: italic; font-weight: 700; text-align: right; text-overflow: ellipsis; white-space: nowrap; }',
    '    .kompakt-content { flex: 1; min-height: 0; display: flex; flex-direction: column; }',
    '    .kompakt-row { flex: 1 1 0; min-height: 0; display: grid; grid-template-columns: minmax(0, 36%) minmax(0, 64%); align-items: center; column-gap: 2mm; padding: 1mm 2.4mm; border-bottom: 0.25mm solid #e2e8f0; }',
    '    .kompakt-row:last-child { border-bottom: 0; }',
    '    .german-col { display: flex; align-items: center; }',
    '    .kompakt-german { overflow: hidden; color: #0f172a; font-size: 13.5pt; font-weight: 800; letter-spacing: -0.15pt; line-height: 1.1; word-break: break-word; }',
    '    .kompakt-german.long-word { font-size: 11pt; }',
    '    .favorite-star { margin-right: 1mm; color: #f4b400; font-family: "Segoe UI Symbol", sans-serif; font-size: 10.5pt; letter-spacing: 0; vertical-align: 0.5pt; }',
    '    .details-col { display: flex; flex-direction: column; justify-content: center; min-width: 0; }',
    '    .trans-line { display: flex; justify-content: space-between; align-items: center; gap: 1mm; }',
    '    .kompakt-spanish { color: #111827; font-size: 8.5pt; font-style: italic; font-weight: 700; }',
    '    .level-badge { flex-shrink: 0; padding: 0.15mm 1mm; border: 0.25mm solid #cbd5e1; border-radius: 1.2mm; background: #f1f5f9; color: #475569; font-size: 5.8pt; font-weight: 800; }',
    '    .kompakt-example { margin-top: 0.4mm; overflow: hidden; color: #475569; font-size: 6pt; line-height: 1.12; }',
    '    .kompakt-example-de strong { color: #1e293b; font-weight: 800; }',
    '    .kompakt-example-de .german-word { color: #1e293b; font-weight: 800; text-decoration: underline; }',
    '    .kompakt-example-es { color: #64748b; font-style: italic; font-size: 5.6pt; margin-top: 0.15mm; }',
    '    .kompakt-section { flex: 0 0 auto; padding: 0.8mm 2.4mm; font-size: 6pt; font-weight: 800; letter-spacing: 0.55pt; text-align: center; text-transform: uppercase; }',
    '    .kompakt-section-label { border-top: 0.25mm solid #c4b5fd; border-bottom: 0.25mm solid #c4b5fd; background: #ede9fe; color: #6d28d9; }',
    '    .kompakt-section-rule { background: #a855f7; color: #fff; letter-spacing: 0.15pt; text-transform: none; }',
    '    .kompakt-footer { min-height: 8.5mm; flex: 0 0 8.5mm; display: flex; align-items: center; justify-content: center; padding: 1.2mm 2mm; color: #fff; font-size: 8.5pt; font-weight: 800; letter-spacing: 0.05pt; text-align: center; white-space: nowrap; }',
    '    .without-examples .kompakt-german { font-size: 14pt; }',
    '    .without-examples .kompakt-spanish { font-size: 9pt; }',
    '  </style>',
    '</head>',
    '<body>',
    renderPage(cards.slice(0, 4), 0),
    renderPage(cards.slice(4, 8), 1),
    '</body>',
    '</html>'
].join('\n');

fs.mkdirSync(tempDir, { recursive: true });
fs.mkdirSync(path.dirname(pdfPath), { recursive: true });
fs.writeFileSync(tempHtmlPath, printHtml, 'utf8');

const browserCandidates = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
];
const browserPath = browserCandidates.find((candidatePath) => fs.existsSync(candidatePath));

if (!browserPath) {
    throw new Error('Could not find Chrome or Edge to generate the PDF.');
}

if (fs.existsSync(pdfPath)) {
    fs.unlinkSync(pdfPath);
}

const result = spawnSync(
    browserPath,
    [
        '--headless=new',
        '--disable-gpu',
        '--no-pdf-header-footer',
        '--print-to-pdf=' + pdfPath,
        pathToFileURL(tempHtmlPath).href
    ],
    { stdio: 'inherit' }
);

if (result.status !== 0 || !fs.existsSync(pdfPath)) {
    throw new Error('PDF generation failed with exit code ' + result.status + '.');
}

if (!keepHtml && fs.existsSync(tempHtmlPath)) {
    fs.unlinkSync(tempHtmlPath);
}

console.log('Parsed cards:', cards.length);
console.log('Examples:', examplesDescription);
console.log('PDF generated at:', pdfPath);
