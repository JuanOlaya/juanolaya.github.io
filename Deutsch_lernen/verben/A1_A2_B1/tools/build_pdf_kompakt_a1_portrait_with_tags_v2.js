const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.join(__dirname, '..');
const outputDir = path.join(rootDir, 'pdf_output');
const indexPath = path.join(rootDir, 'json', 'verbs_index.json');
const htmlPath = path.join(outputDir, 'kompakt_a1_portrait_with_all_tags_v2.html');
const pdfPath = path.join(outputDir, 'kompakt_a1_portrait_with_all_tags_v2.pdf');

const indexRaw = fs.readFileSync(indexPath, 'utf8').replace(/^\uFEFF/, '');
const indexData = JSON.parse(indexRaw);
const a1Groups = indexData.groups
    .filter((group) => group.level === 'A1.1' || group.level === 'A1.2');

const standardColors = ['#8b5cf6', '#ec4899', '#f59e0b', '#ea580c', '#22c55e', '#3b82f6', '#14b8a6', '#6366f1', '#a855f7'];
const groupsPerPage = 4;
const preferredA1Order = ['Grundlagen', 'Modalverben', 'Freizeit'];

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

function repairMojibake(text) {
    if (text == null) return '';
    let value = String(text);
    const suspicious = /[ÃÂð]|ï¿½/;
    for (let i = 0; i < 3; i += 1) {
        if (!suspicious.test(value)) break;
        const repaired = Buffer.from(value, 'latin1').toString('utf8');
        if (repaired === value) break;
        value = repaired;
    }
    return value;
}

function normalizeText(text) {
    return repairMojibake(text).trim();
}

function normalizeVerbDisplay(text) {
    const normalized = normalizeText(text)
        .replace(/�x/g, 'ß')
        .replace(/ÃŸ/g, 'ß')
        .replace(/hei(?:ÃŸ|�x)en/gi, 'heißen')
        .replace(/schlie(?:ÃŸ|�x)en/gi, 'schließen')
        .replace(/abschlie(?:ÃŸ|�x)en/gi, 'abschließen')
        .replace(/grü(?:ÃŸ|�x)en/gi, 'grüßen')
        .replace(/wei(?:ÃŸ|�x)/gi, 'weiß');
    return normalized;
}

function escapeHtml(text) {
    return String(text ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function normalizeLevelDisplay(level) {
    const text = normalizeText(level);
    const match = text.match(/^(A1|A2|B1|B2)/i);
    return match ? match[1].toUpperCase() : text.replace(/\./g, '');
}

function chunk(array, size) {
    const out = [];
    for (let i = 0; i < array.length; i += size) {
        out.push(array.slice(i, i + size));
    }
    return out;
}

function getCard(verb) {
    const cardPath = path.join(rootDir, 'json', 'cards', `${verb}.json`);
    if (!fs.existsSync(cardPath)) return {};
    return JSON.parse(fs.readFileSync(cardPath, 'utf8').replace(/^\uFEFF/, ''));
}

function getVisibleBadges(card) {
    const tags = Array.isArray(card.case_tags) ? card.case_tags : [];
    const lowerTags = tags.map((tag) => String(tag || '').toLowerCase());
    const a1SkillTag = tags.find((tag) => /^A1/.test(String(tag || '')));

    const badges = [];
    if (tags.includes('IK')) badges.push({ label: 'IK', className: 'ik' });
    if (tags.includes('LiD')) badges.push({ label: 'LiD', className: 'lid' });
    if (lowerTags.some((tag) => tag === 'refl' || tag.includes('reflexiv'))) {
        badges.push({ label: 'refl', className: 'refl' });
    }
    if (lowerTags.some((tag) => tag === 'dat' || tag === 'dativ' || tag.includes('(+dat)'))) {
        badges.push({ label: 'dativ', className: 'dativ' });
    }
    if (a1SkillTag) badges.push({ label: normalizeText(a1SkillTag), className: 'a1skill' });
    return badges;
}

function buildVerbRow(verb) {
    const card = getCard(verb);
    const badges = getVisibleBadges(card);
    const badgeHtml = badges
        .map((badge) => `<span class="mini-badge mini-badge-${badge.className}">${escapeHtml(badge.label)}</span>`)
        .join('');

    return `
        <div class="kompakt-row">
            <div class="kompakt-left">
                <div class="kompakt-word-block">
                    <div class="kompakt-german">${escapeHtml(normalizeVerbDisplay(verb))}</div>
                    ${badgeHtml ? `<div class="kompakt-badges">${badgeHtml}</div>` : ''}
                </div>
            </div>
            <div class="kompakt-practice" aria-hidden="true">
                <div class="practice-line"></div>
            </div>
        </div>
    `;
}

function buildCard(group, index) {
    const themeColor = standardColors[index % standardColors.length];
    const levelTag = normalizeLevelDisplay(group.level);
    const rowsHtml = group.verbs.map(buildVerbRow).join('');

    return `
        <section class="kompakt-card">
            <header class="kompakt-header" style="background-color: ${themeColor};">
                <div class="header-de">${escapeHtml(normalizeText(group.groupNameGerman))}</div>
                <div class="header-es">${escapeHtml(normalizeText(group.groupNameSpanish))}</div>
            </header>
            <div class="kompakt-content">
                ${rowsHtml}
            </div>
            <footer class="kompakt-footer" style="background-color: ${themeColor};">
                <span class="footer-tag footer-tag-level">${escapeHtml(levelTag)}</span>
                <span class="footer-tag">verbos</span>
            </footer>
        </section>
    `;
}

function sortA1Groups(groups) {
    return [...groups].sort((a, b) => {
        const aPreferred = preferredA1Order.indexOf(normalizeText(a.groupNameGerman));
        const bPreferred = preferredA1Order.indexOf(normalizeText(b.groupNameGerman));

        if (aPreferred !== -1 || bPreferred !== -1) {
            if (aPreferred === -1) return 1;
            if (bPreferred === -1) return -1;
            return aPreferred - bPreferred;
        }

        const aLevel = normalizeText(a.level);
        const bLevel = normalizeText(b.level);
        if (aLevel !== bLevel) return aLevel.localeCompare(bLevel, 'de');

        return Number(a.groupNumberPerLevel || 0) - Number(b.groupNumberPerLevel || 0);
    });
}

function buildHtml() {
    const orderedGroups = sortA1Groups(a1Groups);
    const pages = chunk(orderedGroups, groupsPerPage);
    const pagesHtml = pages.map((pageGroups, pageIndex) => {
        const cardsHtml = pageGroups
            .map((group, groupIndex) => buildCard(group, pageIndex * groupsPerPage + groupIndex))
            .join('');
        return `<section class="page">${cardsHtml}</section>`;
    }).join('');

    return `<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kompakt A1 Portrait With All Tags</title>
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

        .kompakt-header,
        .kompakt-footer {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 0.08in;
            padding: 0.14in 0.16in;
        }

        .kompakt-header {
            min-height: 0.5in;
            padding-top: 0.065in;
            padding-bottom: 0.065in;
        }

        .header-de,
        .header-es {
            color: #ffffff;
            min-width: 0;
        }

        .header-de {
            font-size: 0.255in;
            font-weight: 800;
            line-height: 1.02;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .header-es {
            font-size: 0.21in;
            font-weight: 700;
            font-style: italic;
            line-height: 1.02;
            text-align: right;
            max-width: 48%;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .kompakt-content {
            flex: 1;
            min-height: 0;
            padding: 0.08in 0.14in 0.02in;
            display: flex;
            flex-direction: column;
        }

        .kompakt-row {
            min-height: 0.52in;
            padding: 0.045in 0;
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
            min-width: 0;
            flex: 0 0 48%;
        }

        .kompakt-word-block {
            display: flex;
            flex-direction: column;
            gap: 0.045in;
            min-width: 0;
            width: 100%;
        }

        .kompakt-german {
            font-size: 0.245in;
            font-weight: 800;
            color: #0f172a;
            line-height: 1.02;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .kompakt-badges {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            gap: 0.03in;
        }

        .mini-badge,
        .footer-tag {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border-radius: 999px;
            font-weight: 800;
            line-height: 1;
            border: none;
            box-sizing: border-box;
            text-transform: none;
        }

        .mini-badge {
            min-width: 0.35in;
            min-height: 0.19in;
            padding: 0 0.05in;
            font-size: 0.095in;
        }

        .mini-badge-ik {
            background: #7c3aed;
            color: #ffffff;
        }

        .mini-badge-lid {
            background: #0ea5e9;
            color: #ffffff;
        }

        .mini-badge-refl {
            background: #facc15;
            color: #1f2937;
        }

        .mini-badge-dativ {
            background: #46866E;
            color: #ffffff;
        }

        .mini-badge-a1skill {
            background: #ef4444;
            color: #ffffff;
        }

        .kompakt-practice {
            flex: 0 0 46%;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            min-height: 100%;
        }

        .practice-line {
            width: 100%;
            height: 0.21in;
            border-bottom: 1.5px solid rgba(15, 23, 42, 0.35);
        }

        .kompakt-footer {
            min-height: 0.29in;
            padding-top: 0.05in;
            padding-bottom: 0.05in;
        }

        .footer-tag {
            background: rgba(255, 255, 255, 0.2);
            color: #ffffff;
            padding: 0.055in 0.13in;
            font-size: 0.13in;
            letter-spacing: 0.01em;
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

    const headlessProfileDir = path.join('C:\\tmp', `edge-headless-profile-a1-${Date.now()}`);
    if (!fs.existsSync(headlessProfileDir)) {
        fs.mkdirSync(headlessProfileDir, { recursive: true });
    }

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

    const command = `${browserPath} --headless --disable-gpu --user-data-dir="${headlessProfileDir}" --print-to-pdf="${pdfPath}" "${htmlPath}"`;
    execSync(command, { stdio: 'inherit' });
}

writePdf();
console.log(`PDF generated at ${pdfPath}`);
