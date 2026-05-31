const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.join(__dirname, '..');
const outputDir = path.join(rootDir, 'pdf_output');

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

const indexPath = path.join(rootDir, 'json', 'verbs_index.json');
const indexData = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
const firstFourGroups = indexData.groups.filter(group => group.level === 'B1.1').slice(0, 4);
const standardColors = ['#8b5cf6', '#ec4899', '#f59e0b', '#ea580c'];

function removeParentheses(text) {
    if (!text) return '';
    return String(text).replace(/^\(([^)]+)\)\s*/, (match, innerWord) => {
        if (innerWord.toLowerCase() === 'sich') return '';
        return `${innerWord} `;
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

function getVerbCard(verb) {
    const cardPath = path.join(rootDir, 'json', 'cards', `${verb}.json`);
    if (!fs.existsSync(cardPath)) return {};
    return JSON.parse(fs.readFileSync(cardPath, 'utf8').replace(/^\uFEFF/, ''));
}

function getVerbTranslation(verb) {
    const cardData = getVerbCard(verb);
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

function buildHtml() {
    const cardsHtml = firstFourGroups.map((group, index) => buildCard(group, index)).join('\n');

    return `<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kompakt B1 First 4 Portrait</title>
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

        .page {
            box-sizing: border-box;
            width: 8.5in;
            height: 11in;
            padding: 0.04in;
            display: grid;
            grid-template-columns: 1fr 1fr;
            grid-template-rows: 1fr 1fr;
            gap: 0.04in;
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
            gap: 0.08in;
            min-height: 0.92in;
            padding: 0.14in 0.14in;
        }

        .header-de {
            font-size: 0.38in;
            font-weight: 800;
            line-height: 1.02;
            color: #0f172a;
            min-width: 0;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .header-es {
            font-size: 0.31in;
            font-weight: 700;
            font-style: italic;
            text-align: right;
            color: #0f172a;
            line-height: 1.02;
            max-width: 48%;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .kompakt-content {
            flex: 1;
            padding: 0.07in 0.12in 0.05in;
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
            padding: 0.038in 0;
            min-height: 0.41in;
        }

        .kompakt-row:last-child {
            border-bottom: none;
        }

        .kompakt-german {
            font-size: 0.285in;
            font-weight: 800;
            color: #0f172a;
            line-height: 1.02;
            flex: 1 1 auto;
            min-width: 0;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .kompakt-spanish {
            font-size: 0.245in;
            font-weight: 700;
            font-style: italic;
            color: #0f172a;
            text-align: right;
            line-height: 1.02;
            flex: 0 0 42%;
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

function writePdf() {
    const htmlPath = path.join(outputDir, 'kompakt_b1_first_4_portrait.html');
    const pdfPath = path.join(outputDir, 'kompakt_b1_first_4_portrait.pdf');
    fs.writeFileSync(htmlPath, buildHtml(), 'utf8');
    const headlessProfileDir = path.join(outputDir, `edge-headless-profile-b1-first4-${Date.now()}`);
    if (!fs.existsSync(headlessProfileDir)) {
        fs.mkdirSync(headlessProfileDir, { recursive: true });
    }

    const browsers = [
        'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
        'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
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

    const command = `${browserPath} --headless --disable-gpu --user-data-dir="${headlessProfileDir}" --print-to-pdf="${pdfPath}" "${htmlPath}"`;
    execSync(command, { stdio: 'inherit' });
}

writePdf();
console.log('PDF generated for first 4 B1 cards.');
