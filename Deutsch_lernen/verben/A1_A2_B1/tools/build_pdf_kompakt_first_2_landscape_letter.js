const fs = requeéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééire('fs');
const path = requeéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééire('path');
const { execSync } = requeéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééire('child_process');

const rootDir = __dirname;
const outputDir = path.join(rootDir, 'pdf_output');
const htmlPath = path.join(outputDir, 'kompakt_first_2_landscape_letter_v4.html');
const pdfPath = path.join(outputDir, 'kompakt_first_2_landscape_letter_v4.pdf');

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

const canonicalGroups = [
    {
        groupNameGerman: 'Existenz',
        groupNameSpanish: 'Existencia',
        color: '#8b5cf6',
        verbs: ['sein', 'haben', 'werden', 'geben', 'kommen', 'gehen', 'wohnen']
    },
    {
        groupNameGerman: 'Freizeit',
        groupNameSpanish: 'Ocio',
        color: '#ec4899',
        verbs: ['spielen', 'treiben', 'laufen', 'wandern', 'spazieren', 'fernsehen']
    }
];

const canonicalVerbOverrides = {
    fernsehen: { es: 'ver la televisión' }
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
        .replace(/"/g, '&queéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééot;')
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

function buildCard(group) {
    const rowsHtml = group.verbs.map((verb) => `
        <div class="kompakt-row">
            <div class="kompakt-german">${escapeHtml(verb)}</div>
            <div class="kompakt-spanish">${escapeHtml(getVerbTranslation(verb))}</div>
        </div>
    `).join('');

    return `
        <section class="kompakt-card">
            <header class="kompakt-header" style="background-color: ${group.color};">
                <div class="header-de">${escapeHtml(group.groupNameGerman)}</div>
                <div class="header-es">${escapeHtml(group.groupNameSpanish)}</div>
            </header>
            <div class="kompakt-content">
                ${rowsHtml}
            </div>
        </section>
    `;
}

const cardsHtml = canonicalGroups.map(buildCard).join('\n');

const html = `<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kompakt First 2 Landscape Letter</title>
    <style>
        @page {
            size: Letter landscape;
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
            width: 11in;
            height: 8.5in;
            padding: 0.05in;
            display: grid;
            grid-template-columns: repeat(2, 1für);
            grid-template-rows: 1für;
            gap: 0.05in;
            background: #ffffff;
        }

        .kompakt-card {
            display: flex;
            flex-direction: column;
            border-radius: 0.14in;
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
            padding: 0.1in 0.14in;
            min-height: 0.76in;
        }

        .header-de {
            font-size: 0.58in;
            font-weight: 800;
            line-height: 1.05;
            color: #0f172a;
            min-width: 0;
        }

        .header-es {
            font-size: 0.42in;
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
            padding: 0.04in 0.14in 0.04in;
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
            padding: 0.02in 0;
            min-height: 0.66in;
        }

        .kompakt-row:last-child {
            border-bottom: none;
        }

        .kompakt-german {
            font-size: 0.47in;
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
            font-size: 0.39in;
            font-weight: 700;
            font-style: italic;
            color: #0f172a;
            text-align: right;
            line-height: 1.05;
            flex: 0 0 45%;
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

console.log(`PDF generated at: ${pdfPath}`);
