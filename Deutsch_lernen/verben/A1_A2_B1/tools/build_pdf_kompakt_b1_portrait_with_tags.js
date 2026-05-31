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
const b1Groups = indexData.groups.filter(group => group.level === 'B1.1');

const htmlPath = path.join(outputDir, 'kompakt_b1_portrait_with_ik_lid_refl.html');
const pdfPath = path.join(outputDir, 'kompakt_b1_portrait_with_ik_lid_refl.pdf');

const standardColors = ['#8b5cf6', '#ec4899', '#f59e0b', '#ea580c', '#22c55e', '#3b82f6', '#14b8a6', '#6366f1', '#a855f7'];
const lightHeaderColors = ['#c4b5fd', '#f9a8d4', '#fcd34d', '#fdba74', '#86efac', '#93c5fd', '#67e8f9', '#a5b4fc', '#d8b4fe'];
const groupsPerPage = 4;

function repairMojibake(text) {
    if (text == null) return '';
    let value = String(text);
    const suspicious = /[ÃƒÃ‚âð]|�|\?/;
    for (let i = 0; i < 3; i += 1) {
        if (!suspicious.test(value)) break;
        const repaired = Buffer.from(value, 'latin1').toString('utf8');
        if (repaired === value) break;
        value = repaired;
    }
    return value;
}

function escapeHtml(text) {
    return String(text || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function normalizeText(text) {
    return repairMojibake(text).trim();
}

function removeParentheses(text) {
    if (!text) return '';
    return normalizeText(text).replace(/^\(([^)]+)\)\s*/, (match, innerWord) => {
        if (innerWord.toLowerCase() === 'sich') return '';
        return `${innerWord} `;
    }).trim();
}

function getPrimaryTranslation(text) {
    const cleaned = removeParentheses(text || '');
    if (!cleaned) return '';
    return cleaned.split('/')[0].trim();
}

function getCard(verb) {
    const cardPath = path.join(rootDir, 'json', 'cards', `${verb}.json`);
    if (!fs.existsSync(cardPath)) return {};
    return JSON.parse(fs.readFileSync(cardPath, 'utf8').replace(/^\uFEFF/, ''));
}

function getVisibleBadges(verb) {
    const card = getCard(verb);
    const tags = Array.isArray(card.case_tags) ? card.case_tags : [];
    const hasIK = tags.includes('IK');
    const hasLiD = tags.includes('LiD');
    const hasRefl = tags.some(tag => {
        const text = String(tag || '').toLowerCase();
        return text === 'refl' || text.includes('reflexiv');
    });
    return [
        hasIK ? 'IK' : null,
        hasLiD ? 'LiD' : null,
        hasRefl ? 'refl' : null
    ].filter(Boolean);
}

function buildVerbRow(verb) {
    const card = getCard(verb);
    const translation = getPrimaryTranslation(card.es || '');
    const badges = getVisibleBadges(verb);

    return `
        <div class="kompakt-row">
            <div class="kompakt-left">
                <div class="kompakt-german">${escapeHtml(normalizeText(verb))}</div>
                <div class="kompakt-badges">
                    ${badges.map(tag => `<span class="mini-badge mini-badge-${tag}">${escapeHtml(tag)}</span>`).join('')}
                </div>
            </div>
            <div class="kompakt-spanish">${escapeHtml(normalizeText(translation))}</div>
        </div>
    `;
}

function buildCard(group, index) {
    const themeColor = standardColors[index % standardColors.length];
    const lightThemeColor = lightHeaderColors[index % lightHeaderColors.length];
    const rowsHtml = group.verbs.map(buildVerbRow).join('');

    return `
        <section class="kompakt-card">
            <header class="kompakt-header" style="background-color: ${lightThemeColor}; border-top: 0.05in solid ${themeColor};">
                <div class="header-de">${escapeHtml(normalizeText(group.groupNameGerman))}</div>
                <div class="header-es">${escapeHtml(normalizeText(group.groupNameSpanish))}</div>
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
    const pages = chunk(b1Groups, groupsPerPage);
    const pagesHtml = pages.map((pageGroups, pageIndex) => {
        const cardsHtml = pageGroups.map((group, groupIndex) => buildCard(group, pageIndex * groupsPerPage + groupIndex)).join('');
        return `<section class="page">${cardsHtml}</section>`;
    }).join('');

    return `<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kompakt B1 Portrait With IK LiD Refl</title>
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
            padding: 0.06in;
            display: grid;
            grid-template-columns: 1fr 1fr;
            grid-template-rows: 1fr 1fr;
            gap: 0.05in;
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
            background: #ffffff;
            border: 1px solid #dbe4f0;
            box-shadow: 0 0.02in 0.08in rgba(15, 23, 42, 0.08);
        }

        .kompakt-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 0.08in;
            min-height: 0.92in;
            padding: 0.14in 0.16in;
        }

        .header-de {
            font-size: 0.33in;
            font-weight: 800;
            line-height: 1.02;
            color: #0f172a;
            min-width: 0;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .header-es {
            font-size: 0.27in;
            font-weight: 700;
            font-style: italic;
            line-height: 1.02;
            color: #0f172a;
            text-align: right;
            max-width: 48%;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .kompakt-content {
            flex: 1;
            min-height: 0;
            padding: 0.08in 0.14in 0.06in;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
        }

        .kompakt-row {
            min-height: 0.37in;
            padding: 0.025in 0;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 0.08in;
            border-bottom: 1px solid #dbe4f0;
        }

        .kompakt-row:last-child {
            border-bottom: none;
        }

        .kompakt-left {
            display: flex;
            align-items: center;
            gap: 0.04in;
            min-width: 0;
            flex: 1 1 auto;
        }

        .kompakt-german {
            font-size: 0.245in;
            font-weight: 800;
            color: #0f172a;
            line-height: 1.02;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            min-width: 0;
        }

        .kompakt-badges {
            display: flex;
            align-items: center;
            gap: 0.025in;
            flex: 0 0 auto;
        }

        .mini-badge {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-width: 0.29in;
            height: 0.17in;
            padding: 0 0.035in;
            border-radius: 999px;
            font-size: 0.095in;
            font-weight: 800;
            line-height: 1;
            border: 1px solid transparent;
            box-sizing: border-box;
            text-transform: none;
        }

        .mini-badge-IK {
            color: #1d4ed8;
            background: #dbeafe;
            border-color: #93c5fd;
            min-width: 0.377in;
            height: 0.221in;
            padding: 0 0.045in;
            font-size: 0.124in;
        }

        .mini-badge-LiD {
            color: #166534;
            background: #dcfce7;
            border-color: #86efac;
        }

        .mini-badge-refl {
            color: #92400e;
            background: #fef3c7;
            border-color: #fcd34d;
        }

        .kompakt-spanish {
            flex: 0 0 42%;
            font-size: 0.205in;
            font-weight: 700;
            font-style: italic;
            line-height: 1.02;
            color: #0f172a;
            text-align: right;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
    </style>
</head>
<body>
${pagesHtml}
</body>
</html>`;
}

function writePdf() {
    fs.writeFileSync(htmlPath, buildHtml(), 'utf8');
    const headlessProfileDir = path.join(outputDir, `chrome-headless-profile-b1-${Date.now()}`);
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
console.log(`PDF generated at ${pdfPath}`);
