const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');

const desktopPath = path.join(os.homedir(), 'Desktop');
const htmlPath = path.join(desktopPath, 'Tarjetas_Kompakt_A1_1.html');
const pdfPath = path.join(desktopPath, 'Kompakt_Tarjetas_A1_1.pdf');

// Load verbs_index
const data = JSON.parse(fs.readFileSync('json/verbs_index.json', 'utf8'));

// Only grab A1.1 groups and sort them by group number
let a11Groups = data.groups.filter(g => g.level === 'A1.1');
a11Groups.sort((a, b) => a.groupNumberPerLevel - b.groupNumberPerLevel);

const standardColors = ['#8b5cf6', '#ec4899', '#f59e0b', '#ea580c', '#22C55E', '#3b82f6', '#14b8a6', '#6366f1', '#a855f7'];

let cardsHtml = '';

a11Groups.forEach((group, index) => {
    const themeColor = standardColors[index % standardColors.length];
    const groupNameDe = group.groupNameGerman || group.theme || ('Gruppe ' + group.groupNumberPerLevel);
    const groupNameEs = group.groupNameSpanish || group.spanishName || '';

    // Build rows for each verb
    let rowsHtml = '';
    for (const verb of group.verbs) {
        // Soft load translation from physical card
        let translation = '';
        const cardPath = 'json/cards/' + verb + '.json';
        if (fs.existsSync(cardPath)) {
            const cardData = JSON.parse(fs.readFileSync(cardPath, 'utf8'));
            translation = cardData.es || '';
            // Apply standard parsing logic if needed
            translation = translation.replace(/^\\(([^)]+)\\)\\s*/, (match, word) => word.toLowerCase() === 'sich' ? '' : word + ' ').replace(/ o /g, ' / ').trim();
        }

        rowsHtml += '<div class="kompakt-row">' +
            '<span class="kompakt-german">' + verb + '</span>' +
            '<span class="kompakt-spanish">' + translation + '</span>' +
            '</div>';
    }

    // Assemble the semantic card
    cardsHtml += '<div class="kompakt-card">' +
        '<div class="kompakt-header" style="background-color: ' + themeColor + ';">' +
        '<span class="header-de">' + groupNameDe + '</span>' +
        '<span class="header-es">' + groupNameEs + '</span>' +
        '</div>' +
        '<div class="kompakt-content">' +
        rowsHtml +
        '</div>' +
        '</div>';
});

// Calculate pages needed to correctly chunk grids
// We want exactly 6 cards per page (2 rows x 3 columns landscape)

const finalHtml = '<!DOCTYPE html>\n' +
    '<html lang="de">\n' +
    '<head>\n' +
    '<meta charset="UTF-8">\n' +
    '<title>Kompakt Tarjetas A1.1</title>\n' +
    '<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@600;800&family=Inter:ital,wght@0,400;0,600;0,700;1,700&display=swap" rel="stylesheet">\n' +
    '<style>\n' +
    '@page {\n' +
    'size: A4 landscape;\n' +
    'margin: 0;\n' +
    '}\n' +
    'body {\n' +
    'font-family: \'Inter\', sans-serif;\n' +
    'background-color: #ffffff;\n' +
    'color: #0f172a;\n' +
    'margin: 0;\n' +
    'padding: 15mm;\n' +
    '-webkit-print-color-adjust: exact;\n' +
    '}\n' +
    '.grid {\n' +
    'display: grid;\n' +
    'grid-template-columns: repeat(3, 1fr);\n' +
    'grid-template-rows: repeat(2, 1fr);\n' +
    'gap: 15px;\n' +
    'height: calc(100vh - 30mm);\n' + // Exact fit for 1 page
    'page-break-after: always;\n' +
    '}\n' +
    '.kompakt-card {\n' +
    'background-color: #ffffff;\n' +
    'border: 1px solid #e2e8f0;\n' +
    'border-radius: 12px;\n' +
    'display: flex;\n' +
    'flex-direction: column;\n' +
    'overflow: hidden;\n' +
    'box-shadow: 0 1px 3px rgba(0,0,0,0.1);\n' +
    'break-inside: avoid;\n' +
    '}\n' +
    '.kompakt-header {\n' +
    'display: flex;\n' +
    'justify-content: space-between;\n' +
    'align-items: center;\n' +
    'padding: 12px 20px;\n' +
    '}\n' +
    '.header-de {\n' +
    'font-family: \'Outfit\', sans-serif;\n' +
    'font-size: 1.25rem;\n' +
    'font-weight: 800;\n' +
    'color: #0f172a;\n' +
    '}\n' +
    '.header-es {\n' +
    'font-family: \'Inter\', sans-serif;\n' +
    'font-size: 1.2rem;\n' +
    'font-weight: 700;\n' +
    'font-style: italic;\n' +
    'color: #0f172a;\n' +
    'text-align: right;\n' +
    '}\n' +
    '.kompakt-content {\n' +
    'padding: 6px 20px;\n' +
    'flex: 1;\n' +
    '}\n' +
    '.kompakt-row {\n' +
    'display: flex;\n' +
    'justify-content: space-between;\n' +
    'align-items: center;\n' +
    'padding: 9px 0;\n' +
    'border-bottom: 1px solid #e2e8f0;\n' +
    '}\n' +
    '.kompakt-row:last-child {\n' +
    'border-bottom: none;\n' +
    '}\n' +
    '.kompakt-german {\n' +
    'font-size: 1.2rem;\n' +
    'font-weight: 700;\n' +
    'color: #0f172a;\n' +
    '}\n' +
    '.kompakt-spanish {\n' +
    'font-size: 1.1rem;\n' +
    'font-weight: 700;\n' +
    'font-style: italic;\n' +
    'color: #475569;\n' +
    'text-align: right;\n' +
    'max-width: 55%;\n' +
    'white-space: nowrap;\n' +
    'overflow: hidden;\n' +
    'text-overflow: ellipsis;\n' +
    '}\n' +
    '</style>\n' +
    '</head>\n' +
    '<body>\n';

// Chunk the cards into arrays of 6
const chunks = [];
for (let i = 0; i < a11Groups.length; i += 6) {
    chunks.push(a11Groups.slice(i, i + 6));
}

let pageHtml = finalHtml;
chunks.forEach((chunk, pageIndex) => {
    pageHtml += '<div class="grid">\n';

    chunk.forEach((group, index) => {
        const themeColor = standardColors[(pageIndex * 6 + index) % standardColors.length];
        const groupNameDe = group.groupNameGerman || group.theme || ('Gruppe ' + group.groupNumberPerLevel);
        const groupNameEs = group.groupNameSpanish || group.spanishName || '';

        let rowsHtml = '';
        for (const verb of group.verbs) {
            let translation = '';
            const cardPath = 'json/cards/' + verb + '.json';
            if (fs.existsSync(cardPath)) {
                const cardData = JSON.parse(fs.readFileSync(cardPath, 'utf8'));
                translation = cardData.es || '';
                translation = translation.replace(/^\\(([^)]+)\\)\\s*/, '').replace(/ o /g, ' / ').trim();
            }

            rowsHtml += '<div class="kompakt-row">' +
                '<span class="kompakt-german">' + verb + '</span>' +
                '<span class="kompakt-spanish">' + translation + '</span>' +
                '</div>';
        }

        pageHtml += '<div class="kompakt-card">' +
            '<div class="kompakt-header" style="background-color: ' + themeColor + ';">' +
            '<span class="header-de">' + groupNameDe + '</span>' +
            '<span class="header-es">' + groupNameEs + '</span>' +
            '</div>' +
            '<div class="kompakt-content">' +
            rowsHtml +
            '</div>' +
            '</div>\n';
    });

    pageHtml += '</div>\n'; // end grid
});

pageHtml += '</body>\n</html>';

fs.writeFileSync(htmlPath, pageHtml, 'utf8');
console.log('HTML generated at ' + htmlPath);

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

try {
    console.log('Generating PDF...');
    const command = browserPath + ' --headless --disable-gpu "--print-to-pdf=' + pdfPath + '" "' + htmlPath + '"';
    execSync(command, { stdio: 'inherit' });
    console.log('SUCCESS! PDF generated successfully at:', pdfPath);
    if (fs.existsSync(htmlPath)) fs.unlinkSync(htmlPath);
} catch (error) {
    console.error('Failed to convert PDF using Edge/Chrome.');
    console.error(error);
}
