const fs = require('fs');
const path = require('path');

const filePath = String.raw`c:\Users\juan\Documents\GitHub\juanolaya.github.io\Deutsch_lernen\adverbs\adverbien.html`;
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add CSS
const cssToAdd = `
        .modal-level-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            background-color: rgba(255, 255, 255, 0.1);
            color: var(--text-muted);
            font-size: 0.9rem;
            font-weight: 700;
            margin-bottom: 5px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
`;
// Insert before closing style tag
// Regex to handle potential whitespace around </style>
content = content.replace(/(\s*)<\/style>/, `\n${cssToAdd}$1</style>`);


// 2. Add HTML
// Find the modalWord div and insert modalLevel after it
// Regex allows for flexible whitespace/attributes order if needed, but precise string is safer if known.
// Let's use string match but be careful about whitespace.
// I'll search for the ID part which is unique enough.
const htmlSearchSegment = 'id="modalWord" class="modal-main-word" title="Escuchar">Wort</div>';
// Actually, let's use regex to find the whole div tag.
const htmlRegex = /<div id="modalWord" class="modal-main-word" title="Escuchar">Wort<\/div>/;
const htmlInsert = `<div id="modalWord" class="modal-main-word" title="Escuchar">Wort</div>
                    <div id="modalLevel" class="modal-level-badge">A1</div>`;

if (!htmlRegex.test(content)) {
    console.error('HTML target not found');
}
content = content.replace(htmlRegex, htmlInsert);


// 3. Add JS
// Find the line where modalWord text content is set
const jsSearchFor = "document.getElementById('modalWord').textContent = foundAdverb.word;";
// Regex to handle varying spaces
const jsRegex = /document\.getElementById\('modalWord'\)\.textContent\s*=\s*foundAdverb\.word;/;

const jsInsert = `document.getElementById('modalWord').textContent = foundAdverb.word;
            
            const levelBadge = document.getElementById('modalLevel');
            if (foundAdverb.level) {
                levelBadge.textContent = foundAdverb.level;
                levelBadge.style.display = 'inline-block';
            } else {
                levelBadge.style.display = 'none';
            }`;

if (!jsRegex.test(content)) {
    console.error('JS target not found');
}
content = content.replace(jsRegex, jsInsert);

// Write back
fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated modal logic');
