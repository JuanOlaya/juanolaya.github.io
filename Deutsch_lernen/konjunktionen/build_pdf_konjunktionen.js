const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');

const desktopPath = path.join(os.homedir(), 'Desktop');
const tempHtmlPath = path.join(desktopPath, 'konjunktionen_DTZ_print.html');

// Create a timestamped PDF filename
const now = new Date();
const timestamp = now.getFullYear() +
    String(now.getMonth() + 1).padStart(2, '0') +
    String(now.getDate()).padStart(2, '0') + '_' +
    String(now.getHours()).padStart(2, '0') +
    String(now.getMinutes()).padStart(2, '0');
const pdfPath = path.join(desktopPath, `konjunktionen_B1_DTZ_${timestamp}.pdf`);

// 1. Read konjunktionen_B1_DTZ.html
const htmlContent = fs.readFileSync('konjunktionen_B1_DTZ.html', 'utf8');

// 2. Parse categories and rows using regex
const cardsList = [];
const cardRegex = /<div class="level-card">([\s\S]*?)<\/div>\s*<\/div>/gi;
let cardMatch;

const levelMap = {
    und: 'A1', aber: 'A1', oder: 'A1', denn: 'A1', sondern: 'A1', doch: 'A1', sowie: 'B1', 'zwar... aber': 'B1', 'entweder... oder': 'B1',
    weil: 'A2', dass: 'A2', wenn: 'A2', ob: 'A2', als: 'A2', da: 'B1', bis: 'A2', falls: 'B1', solange: 'B1',
    damit: 'A2', bevor: 'A2', seit: 'A2', sobald: 'A2', während: 'B2', obwohl: 'B1', 'um... zu': 'A2', 'ohne... zu': 'B1', 'statt... zu': 'B1',
    deshalb: 'B1', deswegen: 'B1', darum: 'B1', daher: 'B1', trotzdem: 'B1', dennoch: 'B1', sonst: 'B1', dann: 'B1', außerdem: 'B1'
};

const standardColors = ['#3b82f6', '#ca8a04', '#f97316', '#ef4444'];
const footerRules = [
    "Regla: No cambian posición del verbo",
    "Regla: Envían el verbo al final",
    "Regla: Envían el verbo al final",
    "Regla: Empujan el verbo a pos 2"
];

let cardIdx = 0;
while ((cardMatch = cardRegex.exec(htmlContent)) !== null) {
    const cardContent = cardMatch[1];
    
    // Extract title and translation
    const headerMatch = /<div class="level-header[^>]*?>\s*<span>(.*?)<\/span>\s*<span[^>]*?>(.*?)<\/span>/i.exec(cardContent);
    if (!headerMatch) continue;
    
    const title = headerMatch[1].trim();
    const translation = headerMatch[2].trim();
    const themeColor = standardColors[cardIdx % standardColors.length];
    const footerText = footerRules[cardIdx] || '';
    cardIdx++;
    
    // Extract rows
    let rowsHtml = '';
    const rowRegex = /<tr[^>]*?data-word="([^"]+)"[^>]*?data-trans="([^"]+)"[^>]*?data-example="([^"]+)"/gi;
    let rowMatch;
    
    while ((rowMatch = rowRegex.exec(cardContent)) !== null) {
        const word = rowMatch[1];
        const trans = rowMatch[2];
        const example = rowMatch[3];
        const level = levelMap[word] || 'B1';
        
        rowsHtml += `            <div class="kompakt-row">
                <div class="word-line" style="display: flex; justify-content: space-between; align-items: center;">
                    <span class="kompakt-german" style="width: 35%; text-align: left;">${word}</span>
                    <span class="kompakt-spanish" style="width: 50%; text-align: center;">${trans}</span>
                    <span style="width: 15%; text-align: right;">
                        <span style="font-size: 0.55rem; background-color: #f1f5f9; color: #475569; border: 1px solid #cbd5e1; padding: 0px 3px; border-radius: 4px; font-weight: 700; font-style: normal;">${level}</span>
                    </span>
                </div>
                <div class="kompakt-example">
                    ${example}
                </div>
            </div>
`;
    }
    
    const cardHtml = `        <div class="kompakt-card">
        <div class="kompakt-header" style="background-color: ${themeColor};">
            <span class="header-de">${title}</span>
            <span class="header-es">${translation}</span>
        </div>
        <div class="kompakt-content">
${rowsHtml}
        </div>
        <div class="kompakt-footer" style="background-color: ${themeColor}; padding: 4px 10px; color: #ffffff; font-size: 0.72rem; font-weight: 700; text-align: center;">
            ${footerText}
        </div>
    </div>`;
    
    cardsList.push(cardHtml);
}

// 3. Assemble Printable HTML
let printHtml = `<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <title>DTZ B1 Konjunktionen - Druckversion</title>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@600;800&family=Inter:ital,wght@0,400;0,600;0,700;1,400;1,700&display=swap" rel="stylesheet">
    <style>
        @page {
            size: A4 portrait;
            margin: 0;
        }
        body {
            font-family: 'Inter', sans-serif;
            background-color: #ffffff;
            color: #0f172a;
            margin: 0;
            padding: 6mm;
            -webkit-print-color-adjust: exact;
        }
        .page-header {
            text-align: center;
            margin-bottom: 8px;
            border-bottom: 2px solid #0f172a;
            padding-bottom: 4px;
        }
        .page-header h1 {
            font-family: 'Outfit', sans-serif;
            font-size: 1.3rem;
            margin: 0;
            color: #0f172a;
            letter-spacing: 0.5px;
            display: inline-block;
        }
        .page-header span {
            font-size: 0.75rem;
            margin-left: 10px;
            color: #475569;
            font-weight: 600;
        }
        .grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            grid-template-rows: repeat(2, 1fr);
            gap: 12px;
            height: calc(100vh - 22mm);
            page-break-after: avoid;
        }
        .kompakt-card {
            background-color: #ffffff;
            border: 1px solid #cbd5e1;
            border-radius: 8px;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            break-inside: avoid;
            font-size: 0.82rem;
        }
        .kompakt-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 6px 12px;
            color: #ffffff;
            font-weight: bold;
        }
        .header-de {
            font-family: 'Outfit', sans-serif;
            font-size: 1.05rem;
            font-weight: 800;
        }
        .header-es {
            font-family: 'Inter', sans-serif;
            font-size: 0.9rem;
            font-weight: 600;
            font-style: italic;
            opacity: 0.95;
        }
        .kompakt-content {
            padding: 4px 10px;
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }
        .kompakt-row {
            padding: 4px 0;
            border-bottom: 1px solid #e2e8f0;
            line-height: 1.25;
        }
        .kompakt-row:last-child {
            border-bottom: none;
        }
        .word-line {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-weight: 700;
            margin-bottom: 2px;
        }
        .kompakt-german {
            font-size: 0.95rem;
            color: #0f172a;
        }
        .kompakt-spanish {
            font-size: 0.85rem;
            color: #000000;
            font-weight: bold;
            font-style: italic;
        }
        .kompakt-example {
            font-size: 0.72rem;
            color: #64748b;
            line-height: 1.2;
        }
    </style>
</head>
<body>
    <div class="page-header">
        <h1>DTZ B1 KONJUNKTIONEN</h1>
        <span>(24 Conectores Esenciales)</span>
    </div>
    <div class="grid">
`;

cardsList.forEach(card => {
    printHtml += card;
});

// Pad grid to 4 if needed (should be exactly 4 in our case)
if (cardsList.length < 4) {
    for (let pad = 0; pad < (4 - cardsList.length); pad++) {
        printHtml += '        <div style="border: 1px dashed #cbd5e1; border-radius: 8px; opacity: 0.3;"></div>\n';
    }
}

printHtml += `    </div>
</body>
</html>`;

fs.writeFileSync(tempHtmlPath, printHtml, 'utf8');
console.log('HTML generated at:', tempHtmlPath);

// 4. Find Edge/Chrome path
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

if (!browserPath) {
    console.error('Could not find Edge or Chrome to compile the PDF.');
    process.exit(1);
}

try {
    console.log('Generating PDF via headless browser...');
    const command = `${browserPath} --headless --disable-gpu "--print-to-pdf=${pdfPath}" "${tempHtmlPath}"`;
    execSync(command, { stdio: 'inherit' });
    console.log('SUCCESS! PDF generated successfully at:', pdfPath);
    if (fs.existsSync(tempHtmlPath)) fs.unlinkSync(tempHtmlPath);
} catch (error) {
    console.error('Failed to convert HTML to PDF.');
    console.error(error);
}
