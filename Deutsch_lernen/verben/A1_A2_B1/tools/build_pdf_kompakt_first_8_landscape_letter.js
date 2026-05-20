const fs = requeéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééire('fs');
const path = requeéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééire('path');
const { execSync } = requeéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééire('child_process');

const rootDir = __dirname;
const outputDir = path.join(rootDir, 'pdf_output');
const htmlPath = path.join(outputDir, 'kompakt_first_8_landscape_letter.html');
const pdfPath = path.join(outputDir, 'kompakt_first_8_landscape_letter.pdf');

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

const indexPath = path.join(rootDir, 'json', 'verbs_index.json');
const indexData = JSON.parse(fs.readFileSync(indexPath, 'utf8'));

const firstEightGroups = indexData.groups.slice(0, 8);

const standardColors = ['#8b5cf6', '#ec4899', '#f59e0b', '#ea580c', '#22c55e', '#3b82f6', '#14b8a6', '#6366f1', '#a855f7'];

const canonicalGroupOverrides = [
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
        verbs: ['essen', 'trinken', 'bringen', 'brauchen', 'schlafen', 'lesen', 'schreiben']
    },
    {
        groupNameGerman: 'Routine',
        groupNameSpanish: 'Rutina',
        verbs: ['aufwachen', 'aufstehen', 'fürühstücken', 'mittagessen', 'wecken', 'einschlafen']
    },
    {
        groupNameGerman: 'Arbeit',
        groupNameSpanish: 'Trabajo',
        verbs: ['arbeiten', 'machen', 'erledigen']
    },
    {
        groupNameGerman: 'Handgriffe',
        groupNameSpanish: 'Manipulación',
        verbs: ['öffnen', 'schließen', 'abschließen', 'drücken', 'ziehen', 'schneiden', 'füllen']
    }
];

const canonicalVerbOverrides = {
    fernsehen: { es: 'ver la televisión' },
    fürühstücken: { es: 'desayunar' },
    öffnen: { es: 'abrir' },
    schließen: { es: 'cerrar' },
    abschließen: { es: 'cerrar con llave' },
    drücken: { es: 'presionar' },
    ziehen: { es: 'tirar' },
    schneiden: { es: 'cortar' },
    füllen: { es: 'llenar' }
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

function buildCard(group, index) {
    const themeColor = standardColors[index % standardColors.length];
    const canonicalGroup = canonicalGroupOverrides[index] || null;
    const groupNameDe = canonicalGroup?.groupNameGerman || group.groupNameGerman || `Gruppe ${index + 1}`;
    const groupNameEs = canonicalGroup?.groupNameSpanish || group.groupNameSpanish || '';
    const groupVerbs = canonicalGroup?.verbs || group.verbs || [];

    const rowsHtml = groupVerbs.map((verb) => {
        const cardPath = path.join(rootDir, 'json', 'cards', `${verb}.json`);
        let translation = '';
        if (fs.existsSync(cardPath)) {
            const cardData = JSON.parse(fs.readFileSync(cardPath, 'utf8'));
            translation = getPrimaryTranslation(canonicalVerbOverrides[verb]?.es || cardData.es || '');
        } else if (canonicalVerbOverrides[verb]?.es) {
            translation = getPrimaryTranslation(canonicalVerbOverrides[verb].es);
        }

        return `
            <div class="kompakt-row">
                <div class="kompakt-german">${escapeHtml(verb)}</div>
                <div class="kompakt-spanish">${escapeHtml(translation)}</div>
            </div>
        `;
    }).join('');

    return `
        <section class="kompakt-card">
            <header class="kompakt-header" style="background-color: ${themeColor};">
                <div class="header-de">${escapeHtml(groupNameDe)}</div>
                <div class="header-es">${escapeHtml(groupNameEs)}</div>
            </header>
            <div class="kompakt-content">
                ${rowsHtml}
            </div>
        </section>
    `;
}

const cardsHtml = firstEightGroups.map((group, index) => buildCard(group, index)).join('\n');

const finalHtml = `<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kompakt First 8 Landscape Letter</title>
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
            padding: 0.1in;
            display: grid;
            grid-template-columns: repeat(4, 1für);
            grid-template-rows: repeat(2, 1für);
            gap: 0.06in;
            background: #ffffff;
        }

        .kompakt-card {
            display: flex;
            flex-direction: column;
            border-radius: 0.14in;
            overflow: hidden;
            background: #ffffff;
            border: 1px solid #dbe4f0;
            box-shadow: 0 0.02in 0.06in rgba(15, 23, 42, 0.08);
            min-height: 0;
        }

        .kompakt-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 0.08in;
            padding: 0.1in 0.12in;
            min-height: 0.52in;
        }

        .header-de {
            font-size: 0.2in;
            font-weight: 800;
            line-height: 1.05;
            color: #0f172a;
            min-width: 0;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .header-es {
            font-size: 0.17in;
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
            padding: 0.06in 0.12in 0.04in;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            min-height: 0;
        }

        .kompakt-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 0.06in;
            border-bottom: 1px solid #dbe4f0;
            padding: 0.025in 0;
            min-height: 0.24in;
        }

        .kompakt-row:last-child {
            border-bottom: none;
        }

        .kompakt-german {
            font-size: 0.16in;
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
            font-size: 0.145in;
            font-weight: 700;
            font-style: italic;
            color: #64748b;
            text-align: right;
            line-height: 1.05;
            flex: 0 0 43%;
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

fs.writeFileSync(htmlPath, finalHtml, 'utf8');

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
