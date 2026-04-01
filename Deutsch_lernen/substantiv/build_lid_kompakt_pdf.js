const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { execSync } = require('child_process');

const rootDir = __dirname;
const sourcePath = path.join(rootDir, 'lid_kompakt.html');
const outputDir = path.join(rootDir, 'pdf_output');
const variant = process.argv.includes('--light') ? 'light' : 'dark';
const suffixArg = process.argv.find(arg => arg.startsWith('--suffix='));
const suffix = suffixArg ? suffixArg.slice('--suffix='.length).trim() : '';
const outputBaseName = `lid_kompakt_4up_portrait_${variant}${suffix ? `_${suffix}` : ''}`;
const htmlPath = path.join(outputDir, `${outputBaseName}.html`);
const pdfPath = path.join(outputDir, `${outputBaseName}.pdf`);

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

function extractLiteral(source, startMarker) {
    const start = source.indexOf(startMarker);
    if (start === -1) {
        throw new Error(`Marker not found: ${startMarker}`);
    }

    const literalStart = source.indexOf(startMarker.endsWith('[') ? '[' : '{', start);
    if (literalStart === -1) {
        throw new Error(`Literal start not found for: ${startMarker}`);
    }

    const openChar = source[literalStart];
    const closeChar = openChar === '[' ? ']' : '}';
    let depth = 0;
    let inSingle = false;
    let inDouble = false;
    let inTemplate = false;
    let escaped = false;

    for (let i = literalStart; i < source.length; i += 1) {
        const ch = source[i];

        if (escaped) {
            escaped = false;
            continue;
        }

        if (ch === '\\') {
            escaped = true;
            continue;
        }

        if (inSingle) {
            if (ch === "'") inSingle = false;
            continue;
        }

        if (inDouble) {
            if (ch === '"') inDouble = false;
            continue;
        }

        if (inTemplate) {
            if (ch === '`') inTemplate = false;
            continue;
        }

        if (ch === "'") {
            inSingle = true;
            continue;
        }

        if (ch === '"') {
            inDouble = true;
            continue;
        }

        if (ch === '`') {
            inTemplate = true;
            continue;
        }

        if (ch === openChar) depth += 1;
        if (ch === closeChar) {
            depth -= 1;
            if (depth === 0) {
                return source.slice(literalStart, i + 1);
            }
        }
    }

    throw new Error(`Could not extract literal for: ${startMarker}`);
}

function loadSourceData() {
    const source = fs.readFileSync(sourcePath, 'utf8');
    const dataLiteral = extractLiteral(source, 'const data = [');
    const labelsLiteral = extractLiteral(source, 'const headerThemeLabels = {');

    const data = vm.runInNewContext(`(${dataLiteral})`);
    const headerThemeLabels = vm.runInNewContext(`(${labelsLiteral})`);

    return { data, headerThemeLabels };
}

function escapeHtml(text) {
    return String(text || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function normalizeWhitespace(text) {
    return String(text || '').replace(/\s+/g, ' ').trim();
}

function getCardWord(item) {
    const word = normalizeWhitespace(item.w);
    if (!word.includes('/')) return word;

    const parts = word.split('/').map(part => normalizeWhitespace(part)).filter(Boolean);
    if (parts.length < 2) return word;

    const normalizedArt = normalizeWhitespace(item.art).toLowerCase().replace(/\s+/g, '');
    const maleIndex = normalizedArt.startsWith('der') ? 0 : 1;
    return parts[maleIndex] || parts[0];
}

function getCardTranslation(item) {
    const translation = normalizeWhitespace(item.tr);
    if (!translation.includes('/')) return translation;

    const parts = translation.split('/').map(part => normalizeWhitespace(part)).filter(Boolean);
    if (parts.length < 2) return translation;

    const normalizedArt = normalizeWhitespace(item.art).toLowerCase().replace(/\s+/g, '');
    const maleIndex = normalizedArt.startsWith('der') ? 0 : 1;
    return parts[maleIndex] || parts[0];
}

function abbreviateSpanishTranslation(text) {
    let value = normalizeWhitespace(text);
    const replacements = [
        ['Ministerio de Asuntos Exteriores', 'Min. As. Exteriores'],
        ['oficina de orden público', 'of. orden publ.'],
        ['oficina de impuestos', 'of. impuestos'],
        ['administración municipal', 'adm. municipal'],
        ['comunidad religiosa', 'com. religiosa'],
        ['comunidad judía', 'com. judía'],
        ['seguridad social', 'seg. social'],
        ['cotizaciones sociales', 'cotiz. sociales'],
        ['participación electoral', 'part. electoral'],
        ['poder legislativo', 'poder leg.'],
        ['poder ejecutivo', 'poder ejec.'],
        ['poder judicial', 'poder jud.'],
        ['estado federal', 'est. federal'],
        ['estado federado', 'est. federado'],
        ['estados federados', 'est. federados'],
        ['derecho fundamental', 'der. fundamental'],
        ['derechos fundamentales', 'der. fundamentales'],
        ['soberanía popular', 'sob. popular'],
        ['autoridad pública', 'autoridad publ.'],
        ['jefe de gobierno', 'jefe gob.'],
        ['presidente federal', 'pres. federal'],
        ['presidente del Bundesrat', 'pres. Bundesrat'],
        ['presidente del Bundestag', 'pres. Bundestag'],
        ['presidente del estado federado', 'pres. est. federado'],
        ['persona que trabaja', 'persona empleada'],
        ['persona empleada', 'pers. empleada'],
        ['igualdad de derechos', 'igualdad der.'],
        ['libertad de residencia', 'lib. residencia'],
        ['libre circulación', 'libre circ.'],
        ['separación de poderes', 'sep. de poderes']
    ];

    for (const [from, to] of replacements) {
        value = value.replace(from, to);
    }

    return value;
}

function getArticleClass(art) {
    const value = normalizeWhitespace(art).toLowerCase();
    if (!value) return 'none';
    if (value.includes('/')) return 'mixed';
    if (value.includes('der')) return 'der';
    if (value.includes('die') && !value.includes('pl')) return 'die';
    if (value.includes('das')) return 'das';
    return 'pl';
}

function getHeaderLabels(group, labels) {
    return labels[group.id] || {
        de: group.title,
        es: group.title_es
    };
}

function buildRow(item) {
    const artClass = getArticleClass(item.art);
    const cardWord = getCardWord(item);
    const cardTranslation = abbreviateSpanishTranslation(getCardTranslation(item));
    const importantStar = item.important ? '<span class="importance-star">★</span>' : '';

    return `
        <div class="kompakt-row ${artClass}">
            <div class="kompakt-left">
                <span class="article-dot"></span>
                <div class="kompakt-german">${escapeHtml(cardWord)}${importantStar}</div>
            </div>
            <div class="kompakt-spanish">${escapeHtml(cardTranslation)}</div>
        </div>
    `;
}

function buildCard(group, labels, index) {
    const themeColors = variant === 'light'
        ? ['#c4b5fd', '#f9a8d4', '#fcd34d', '#fdba74', '#86efac', '#93c5fd', '#67e8f9', '#a5b4fc', '#d8b4fe']
        : ['#8b5cf6', '#ec4899', '#f59e0b', '#ea580c', '#22c55e', '#3b82f6', '#14b8a6', '#6366f1', '#a855f7'];
    const headerLabels = getHeaderLabels(group, labels);
    const rowsHtml = group.items.map(buildRow).join('');
    const color = themeColors[index % themeColors.length];

    return `
        <section class="kompakt-card">
            <header class="kompakt-header" style="background-color: ${color};">
                <div class="header-de">${escapeHtml(normalizeWhitespace(headerLabels.de))}</div>
                <div class="header-es">${escapeHtml(normalizeWhitespace(headerLabels.es))}</div>
            </header>
            <div class="kompakt-content">
                ${rowsHtml}
            </div>
        </section>
    `;
}

function chunk(array, size) {
    const out = [];
    for (let i = 0; i < array.length; i += size) {
        out.push(array.slice(i, i + size));
    }
    return out;
}

function buildHtml() {
    const { data, headerThemeLabels } = loadSourceData();
    const pages = chunk(data, 4);
    const pagesHtml = pages.map((pageGroups, pageIndex) => {
        const cardsHtml = pageGroups.map((group, groupIndex) => buildCard(group, headerThemeLabels, pageIndex * 4 + groupIndex)).join('');
        return `<section class="page">${cardsHtml}</section>`;
    }).join('');

    const cardBackground = variant === 'light' ? '#ffffff' : '#1e293b';
    const cardBorder = variant === 'light' ? '#cbd5e1' : '#334155';
    const cardShadow = variant === 'light' ? '0 0.02in 0.08in rgba(15, 23, 42, 0.08)' : '0 0.02in 0.08in rgba(15, 23, 42, 0.14)';
    const headerBorder = variant === 'light' ? '#cbd5e1' : '#334155';
    const rowBorder = variant === 'light' ? 'rgba(15, 23, 42, 0.10)' : 'rgba(255, 255, 255, 0.08)';
    const headerDeColor = variant === 'light' ? '#111827' : '#ffffff';
    const headerEsColor = variant === 'light' ? 'rgba(17, 24, 39, 0.72)' : 'rgba(255, 255, 255, 0.78)';
    const germanColor = variant === 'light' ? '#111827' : '#ffffff';
    const spanishColor = variant === 'light' ? '#374151' : '#cbd5e1';
    return `<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LiD Kompakt 4-up Portrait</title>
    <style>
        @page {
            size: Letter portrait;
            margin: 0;
        }

        html, body {
            margin: 0;
            padding: 0;
            background: #ffffff;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
            font-family: "Segoe UI", Arial, sans-serif;
            color: #0f172a;
        }

        body {
            width: 8.5in;
        }

        .page {
            box-sizing: border-box;
            width: 8.5in;
            height: 11in;
            padding: 0.08in;
            display: grid;
            grid-template-columns: 1fr 1fr;
            grid-template-rows: 1fr 1fr;
            gap: 0.08in;
            page-break-after: always;
            break-after: page;
            background: #ffffff;
        }

        .page:last-child {
            page-break-after: auto;
            break-after: auto;
        }

        .kompakt-card {
            display: flex;
            flex-direction: column;
            min-height: 0;
            overflow: hidden;
            border-radius: 0.18in;
            background: ${cardBackground};
            border: 1px solid ${cardBorder};
            box-shadow: ${cardShadow};
        }

        .kompakt-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 0.08in;
            min-height: 0.7in;
            padding: 0.14in 0.16in;
            border-bottom: 1px solid ${headerBorder};
        }

        .header-de {
            font-size: 0.3in;
            font-weight: 800;
            line-height: 1.05;
            color: ${headerDeColor};
            min-width: 0;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .header-es {
            font-size: 0.22in;
            font-style: italic;
            color: ${headerEsColor};
            text-align: right;
            max-width: 44%;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .kompakt-content {
            display: flex;
            flex-direction: column;
            flex: 1 1 auto;
            min-height: 0;
        }

        .kompakt-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 0.1in;
            padding: 0.11in 0.16in;
            border-bottom: 1px solid ${rowBorder};
            min-height: 0;
            box-sizing: border-box;
        }

        .kompakt-row:last-child {
            border-bottom: none;
        }

        .kompakt-left {
            display: flex;
            align-items: center;
            gap: 0.08in;
            min-width: 0;
            flex: 1 1 auto;
        }

        .article-dot {
            width: 0.12in;
            height: 0.12in;
            border-radius: 999px;
            background: currentColor;
            box-shadow: 0 0 8px currentColor;
            flex: 0 0 auto;
        }

        .kompakt-german {
            font-size: 0.24in;
            font-weight: 600;
            color: ${germanColor};
            line-height: 1.06;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            min-width: 0;
        }

        .importance-star {
            color: #f59e0b;
            font-size: 0.18in;
            margin-left: 0.03in;
            vertical-align: baseline;
        }

        .kompakt-spanish {
            flex: 0 0 39%;
            font-size: 0.18in;
            font-weight: 600;
            font-style: italic;
            line-height: 1.06;
            color: ${spanishColor};
            text-align: right;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .der { color: #60a5fa; }
        .die { color: #fb7185; }
        .das { color: #34d399; }
        .mixed { color: #fbbf24; }
        .pl { color: #a78bfa; }
        .none { color: #94a3b8; }
    </style>
</head>
<body>
${pagesHtml}
</body>
</html>`;
}

function findBrowserPath() {
    const candidates = [
        'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
        'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
        'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
    ];

    for (const candidate of candidates) {
        if (fs.existsSync(candidate)) return candidate;
    }

    throw new Error('No compatible browser found for headless PDF generation.');
}

function writePdf() {
    fs.writeFileSync(htmlPath, buildHtml(), 'utf8');
    const browserPath = findBrowserPath();
    const headlessProfileDir = path.join(outputDir, '.chrome-headless-profile-lid');

    if (!fs.existsSync(headlessProfileDir)) {
        fs.mkdirSync(headlessProfileDir, { recursive: true });
    }

    const command = `"${browserPath}" --headless=new --disable-gpu --no-sandbox --disable-crash-reporter --disable-breakpad --user-data-dir="${headlessProfileDir}" --print-to-pdf="${pdfPath}" "${htmlPath}"`;
    execSync(command, { stdio: 'inherit' });
}

writePdf();
console.log(`PDF generated at ${pdfPath}`);
