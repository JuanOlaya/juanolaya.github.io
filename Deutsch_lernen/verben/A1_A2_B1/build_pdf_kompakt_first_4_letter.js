const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = __dirname;
const outputDir = path.join(rootDir, 'pdf_output');

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

const indexPath = path.join(rootDir, 'json', 'verbs_index.json');
const indexData = JSON.parse(fs.readFileSync(indexPath, 'utf8'));

const firstFourGroups = indexData.groups.slice(0, 4);
const standardColors = ['#8b5cf6', '#ec4899', '#f59e0b', '#ea580c'];

const canonicalGroups = [
    {
        groupNameGerman: 'Existenz',
        groupNameSpanish: 'Existencia',
        verbs: ['sein', 'haben', 'werden', 'geben', 'kommen', 'gehen', 'wohnen']
    },
    {
        groupNameGerman: 'Freizeit',
        groupNameSpanish: 'Ocio',
        verbs: ['spielen', 'treiben', 'laufen', 'wandern', 'spazieren', 'fernsehen']
    },
    {
        groupNameGerman: 'Alltag',
        groupNameSpanish: 'Cotidianidad',
        verbs: ['essen', 'trinken', 'bringen', 'brauchen', 'einschlafen', 'lesen', 'schreiben']
    },
    {
        groupNameGerman: 'Routine',
        groupNameSpanish: 'Rutina',
        verbs: ['aufwachen', 'aufstehen', 'frühstücken', 'mittagessen', 'wecken', 'schlafen']
    }
];

const canonicalVerbOverrides = {
    fernsehen: { es: 'ver la televisión' },
    frühstücken: { es: 'desayunar' }
};

function removeParentheses(text) {
    if (!text) return '';
    return String(text).replace(/^\(([^)]+)\)\s*/, (match, innerWord) => {
        if (innerWord.toLowerCase() === 'sich') return '';
        return innerWord + ' ';
    }).trim();
}

function getPrimaryTranslation(text) {
    const cleaned = removeParentheses(text || '');
    if (!cleaned) return '';
    return cleaned.split('/')[0].trim();
}

function escapeHtml(text) {
    return String(text || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function getVerbTranslation(verb) {
    const cardPath = path.join(rootDir, 'json', 'cards', `${verb}.json`);
    if (canonicalVerbOverrides[verb]?.es) {
        return getPrimaryTranslation(canonicalVerbOverrides[verb].es);
    }
    if (!fs.existsSync(cardPath)) return '';
    const cardData = JSON.parse(fs.readFileSync(cardPath, 'utf8'));
    return getPrimaryTranslation(cardData.es || '');
}

function buildCard(group, index) {
    const themeColor = standardColors[index % standardColors.length];
    const rowsHtml = group.verbs.map((verb) => `
        <div class="kompakt-row">
            <div class="kompakt-german">${escapeHtml(verb)}</div>
            <div class="kompakt-spanish">${escapeHtml(getVerbTranslation(verb))}</div>
        </div>
    `).join('');

    return `
        <section class="kompakt-card">
            <header class="kompakt-header" style="background-color: ${themeColor};">
                <div class="header-de">${escapeHtml(group.groupNameGerman)}</div>
                <div class="header-es">${escapeHtml(group.groupNameSpanish)}</div>
            </header>
            <div class="kompakt-content">
                ${rowsHtml}
            </div>
        </section>
    `;
}

function buildHtml({ title, orientation, pageWidth, pageHeight, columns, rows, gap, padding, headerMinHeight, headerPadding, deSize, esSize, contentPadding, rowMinHeight, rowPadding, germanSize, spanishSize }) {
    const cardsHtml = canonicalGroups.map((group, index) => buildCard(group, index)).join('\n');

    return `<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(title)}</title>
    <style>
        @page {
            size: Letter ${orientation};
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

        .page {
            box-sizing: border-box;
            width: ${pageWidth};
            height: ${pageHeight};
            padding: ${padding};
            display: grid;
            grid-template-columns: repeat(${columns}, 1fr);
            grid-template-rows: repeat(${rows}, 1fr);
            gap: ${gap};
            background: #ffffff;
        }

        .kompakt-card {
            display: flex;
            flex-direction: column;
            border-radius: 0.18in;
            overflow: hidden;
            background: #ffffff;
            border: 1px solid #dbe4f0;
            box-shadow: 0 0.02in 0.08in rgba(15, 23, 42, 0.08);
            min-height: 0;
        }

        .kompakt-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 0.1in;
            padding: ${headerPadding};
            min-height: ${headerMinHeight};
        }

        .header-de {
            font-size: ${deSize};
            font-weight: 800;
            line-height: 1.05;
            color: #0f172a;
            min-width: 0;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .header-es {
            font-size: ${esSize};
            font-weight: 700;
            font-style: italic;
            text-align: right;
            color: #0f172a;
            line-height: 1.05;
            max-width: 48%;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .kompakt-content {
            flex: 1;
            padding: ${contentPadding};
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            min-height: 0;
        }

        .kompakt-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 0.08in;
            border-bottom: 1px solid #dbe4f0;
            padding: ${rowPadding};
            min-height: ${rowMinHeight};
        }

        .kompakt-row:last-child {
            border-bottom: none;
        }

        .kompakt-german {
            font-size: ${germanSize};
            font-weight: 800;
            color: #0f172a;
            line-height: 1.05;
            flex: 1 1 auto;
            min-width: 0;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .kompakt-spanish {
            font-size: ${spanishSize};
            font-weight: 700;
            font-style: italic;
            color: #0f172a;
            text-align: right;
            line-height: 1.05;
            flex: 0 0 52%;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
    </style>
</head>
<body>
    <main class="page">
        ${cardsHtml}
    </main>
</body>
</html>`;
}

function writePdf({ htmlName, pdfName, html }) {
    const htmlPath = path.join(outputDir, htmlName);
    const pdfPath = path.join(outputDir, pdfName);
    fs.writeFileSync(htmlPath, html, 'utf8');

    const browsers = [
        'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
        'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
    ];

    let browserPath = null;
    for (const candidate of browsers) {
        if (fs.existsSync(candidate)) {
            browserPath = `"${candidate}"`;
            break;
        }
    }

    if (!browserPath) {
        throw new Error('No compatible browser found for headless PDF generation.');
    }

    const command = `${browserPath} --headless --disable-gpu --print-to-pdf="${pdfPath}" "${htmlPath}"`;
    execSync(command, { stdio: 'inherit' });
}

writePdf({
    htmlName: 'kompakt_first_4_landscape_letter.html',
    pdfName: 'kompakt_first_4_landscape_letter.pdf',
    html: buildHtml({
        title: 'Kompakt First 4 Landscape Letter',
        orientation: 'landscape',
        pageWidth: '11in',
        pageHeight: '8.5in',
        columns: 2,
        rows: 2,
        gap: '0.1in',
        padding: '0.12in',
        headerMinHeight: '0.72in',
        headerPadding: '0.14in 0.18in',
        deSize: '0.3in',
        esSize: '0.24in',
        contentPadding: '0.1in 0.18in 0.08in',
        rowMinHeight: '0.36in',
        rowPadding: '0.04in 0',
        germanSize: '0.24in',
        spanishSize: '0.2in'
    })
});

writePdf({
    htmlName: 'kompakt_first_4_portrait_letter_v9.html',
    pdfName: 'kompakt_first_4_portrait_letter_v9.pdf',
    html: buildHtml({
        title: 'Kompakt First 4 Portrait Letter',
        orientation: 'portrait',
        pageWidth: '8.5in',
        pageHeight: '11in',
        columns: 2,
        rows: 2,
        gap: '0.04in',
        padding: '0.04in',
        headerMinHeight: '0.92in',
        headerPadding: '0.14in 0.13in',
        deSize: '0.4in',
        esSize: '0.33in',
        contentPadding: '0.065in 0.11in 0.05in',
        rowMinHeight: '0.425in',
        rowPadding: '0.038in 0',
        germanSize: '0.305in',
        spanishSize: '0.265in'
    })
});

console.log('PDFs generated for first 4 cards.');
