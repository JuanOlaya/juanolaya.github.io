const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');

const desktopPath = path.join(os.homedir(), 'Desktop');
const tempHtmlPath = path.join(desktopPath, 'adverbien_DTZ_print.html');

// Create a timestamped PDF filename
const now = new Date();
const timestamp = now.getFullYear() +
    String(now.getMonth() + 1).padStart(2, '0') +
    String(now.getDate()).padStart(2, '0') + '_' +
    String(now.getHours()).padStart(2, '0') +
    String(now.getMinutes()).padStart(2, '0');
const pdfPath = path.join(desktopPath, `adverbien_B1_DTZ_${timestamp}.pdf`);

// 1. Read adverbien_B1_DTZ.html
const htmlContent = fs.readFileSync('adverbien_B1_DTZ.html', 'utf8');

// 2. Extract script block containing data
const scriptRegex = /<script>([\s\S]*?)<\/script>/gi;
let scriptCode = '';
let match;
while ((match = scriptRegex.exec(htmlContent)) !== null) {
    if (match[1].includes('rawAdverbGroups') && match[1].includes('themeBlueprints')) {
        scriptCode = match[1];
        break;
    }
}

if (!scriptCode) {
    console.error('Failed to locate script block with data.');
    process.exit(1);
}

// 3. Evaluate script block to get variables in a sandboxed way
const sandboxCode = `
const document = {
    addEventListener: () => {},
    getElementById: () => ({ appendChild: () => {}, style: {} }),
    querySelector: () => ({ style: {} }),
    querySelectorAll: () => []
};
const window = {
    speechSynthesis: {},
    addEventListener: () => {}
};
const navigator = {
    userAgent: ''
};
${scriptCode}
console.log(JSON.stringify({ rawAdverbGroups, themeBlueprints, modalParticlesGroup }));
`;

const tempEvalPath = path.join(__dirname, 'temp_eval.js');
fs.writeFileSync(tempEvalPath, sandboxCode, 'utf8');

let data;
try {
    const stdout = execSync(`node "${tempEvalPath}"`, { maxBuffer: 10 * 1024 * 1024 });
    data = JSON.parse(stdout.toString());
} catch (err) {
    console.error('Failed to extract data via Node evaluation.');
    console.error(err);
    if (fs.existsSync(tempEvalPath)) fs.unlinkSync(tempEvalPath);
    process.exit(1);
} finally {
    if (fs.existsSync(tempEvalPath)) fs.unlinkSync(tempEvalPath);
}

const { rawAdverbGroups, themeBlueprints, modalParticlesGroup } = data;

// 4. Create word mapping
const wordMap = new Map();
rawAdverbGroups.forEach(g => {
    g.adverbs.forEach(adv => {
        if (adv.dtz_star) {
            wordMap.set(adv.word, adv);
        }
    });
});
modalParticlesGroup.adverbs.forEach(adv => {
    if (adv.dtz_star) {
        wordMap.set(adv.word, adv);
    }
});

// Standard premium colors for card headers
const standardColors = ['#0ea5e9', '#0284c7', '#0f766e', '#9333ea', '#f43f5e', '#be123c', '#ea580c', '#059669', '#f59e0b', '#b45309', '#6366f1'];

// 5. Generate print HTML
let printHtml = `<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <title>DTZ B1 Adverbien - Druckversion</title>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@600;800&family=Inter:ital,wght@0,400;0,600;0,700;1,700&display=swap" rel="stylesheet">
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
        .grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            grid-template-rows: repeat(2, 1fr);
            gap: 12px;
            height: calc(100vh - 12mm);
            page-break-after: always;
        }
        .grid:last-child {
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
            opacity: 0.9;
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
            line-height: 1.2;
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
`;

// 5. Generate all card HTMLs
const cardsList = [];

// A. Add Title/Cover Card first
const titleCardHtml = `        <div class="kompakt-card" style="border: 2px solid #0f172a; background-color: #f8fafc; display: flex; flex-direction: column; justify-content: space-between; align-items: center; text-align: center; padding: 15px;">
            <div style="margin-top: 15px; width: 100%;">
                <span style="font-family: 'Outfit', sans-serif; font-size: 3.2rem; font-weight: 800; color: #0f172a; display: block; line-height: 1.1;">DTZ B1</span>
                <span style="font-family: 'Outfit', sans-serif; font-size: 2.2rem; font-weight: 800; color: #0284c7; display: block; margin-top: 10px; letter-spacing: 1px;">ADVERBIEN</span>
            </div>
            <div style="margin-bottom: 15px; font-size: 0.9rem; color: #475569; font-weight: 600; line-height: 1.4; padding: 0 10px; width: 100%;">
                <div style="border-top: 1px solid #cbd5e1; margin: 8px 0;"></div>
                <p style="margin: 4px 0;">⭐ 70 Adverbios Esenciales</p>
                <p style="margin: 4px 0;">📂 11 Categorías Temáticas</p>
                <div style="border-top: 1px solid #cbd5e1; margin: 8px 0;"></div>
                <div style="margin-top: 12px; display: flex; flex-direction: column; align-items: center;">
                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://juanolaya.github.io/Deutsch_lernen/index.html" alt="QR Code MemoDeutsch" style="width: 100px; height: 100px; border: 1px solid #cbd5e1; padding: 3px; border-radius: 4px; background: #ffffff;" />
                    <span style="display: block; font-size: 0.75rem; color: #0f172a; font-weight: 800; margin-top: 5px; letter-spacing: 0.5px;">MemoDeutsch App</span>
                </div>
            </div>
        </div>
`;
cardsList.push(titleCardHtml);

// B. Build the 11 category cards
themeBlueprints.forEach((theme, index) => {
    const themeColor = standardColors[index % standardColors.length];
    let rowsHtml = '';
    
    theme.words.forEach(w => {
        const adv = wordMap.get(w);
        if (adv) {
            let spanTrans = adv.spanish || '';
            const exactLevel = adv.level || 'B1';
            
            rowsHtml += `            <div class="kompakt-row">
                <div class="word-line" style="display: flex; justify-content: space-between; align-items: center;">
                    <span class="kompakt-german" style="width: 35%; text-align: left;">${adv.word}</span>
                    <span class="kompakt-spanish" style="width: 50%; text-align: center;">${spanTrans}</span>
                    <span style="width: 15%; text-align: right;">
                        <span style="font-size: 0.55rem; background-color: #f1f5f9; color: #475569; border: 1px solid #cbd5e1; padding: 0px 3px; border-radius: 4px; font-weight: 700; font-style: normal;">${exactLevel}</span>
                    </span>
                </div>
                <div class="kompakt-example">
                    ${adv.example_de} &rarr; <em>${adv.example_es}</em>
                </div>
            </div>
`;
        }
    });

    const cardHtml = `        <div class="kompakt-card">
            <div class="kompakt-header" style="background-color: ${themeColor};">
                <span class="header-de">${theme.title}</span>
                <span class="header-es">${theme.translation}</span>
            </div>
            <div class="kompakt-content">
${rowsHtml}
            </div>
        </div>
`;
    cardsList.push(cardHtml);
});

// Chunk into pages of 4 cards
const chunks = [];
for (let i = 0; i < cardsList.length; i += 4) {
    chunks.push(cardsList.slice(i, i + 4));
}

chunks.forEach((chunk, pageIndex) => {
    printHtml += `    <div class="grid">
`;

    chunk.forEach(card => {
        printHtml += card;
    });

    printHtml += `    </div>\n`;
});

printHtml += `</body>
</html>`;

fs.writeFileSync(tempHtmlPath, printHtml, 'utf8');
console.log('HTML generated at:', tempHtmlPath);

// 6. Find Edge/Chrome path
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
