const fs = require('fs');
const path = require('path');

const filePath = String.raw`c:\Users\juan\Documents\GitHub\juanolaya.github.io\Deutsch_lernen\adjektive\adjektive.html`;
let content = fs.readFileSync(filePath, 'utf8');

// 1. DATA TRANSFORMATION
// Find adjectiveGroups
const startMarker = 'const adjectiveGroups = [';
const endMarker = '];';
const startIndex = content.indexOf(startMarker);
if (startIndex === -1) {
    console.error('Could not find adjectiveGroups start');
    process.exit(1);
}

// We need to find the matching end bracket for the array. 
// Simple search might fail if content has ]; inside strings, but unlikely here.
// Let's look for the next ]; after start.
let endIndex = -1;
let openBrackets = 0;
for (let i = startIndex; i < content.length; i++) {
    if (content[i] === '[') openBrackets++;
    if (content[i] === ']') openBrackets--;
    if (openBrackets === 0 && content[i] === ';') {
        endIndex = i + 1;
        break;
    }
}

if (endIndex === -1) {
    // Fallback or error
    console.error('Could not find adjectiveGroups end');
    process.exit(1);
}

const dataString = content.substring(startIndex, endIndex);
// Evaluate the data string to get the object (dangerous but controlled environment)
// We need to strip 'const adjectiveGroups = ' and ';'
const jsonString = dataString.replace('const adjectiveGroups =', '').replace(';', '').trim();

// To parse this as JSON, we need to quote keys and handle single quotes if any.
// Actually, it's JS object literal, not JSON. eval() is easiest but let's try to just process string with regex to avoid eval issues if possible.
// Or just use Regex to replacements on the string directly.

// Regex to remove level from title: title: '...(Level)' -> title: '...'
// Pattern: title: 'Title Text (Level)'
// We want to capture the level and put it into objects? 
// No, the level is already in `level: 'A1'` property of the group!
// So we just need to:
// 1. Remove level text from title.
// 2. Propagate group.level to each adjective in group.adjectives.

// Let's iterate using regex replacers or just string manipulation if we can parse it.
// Since it's a script, let's use a simpler approach: 
// We will replace the whole data block with a generated one.
// We can use `eval` since this is a local build script.
let adjectiveGroups;
try {
    adjectiveGroups = eval(jsonString);
} catch (e) {
    console.error('Error parsing data:', e);
    // fallback: try to use Function constructor
    adjectiveGroups = new Function('return ' + jsonString)();
}

adjectiveGroups.forEach(group => {
    // 1. Remove level from title, e.g. "G1: Allgemeine Grundlagen (A1)" -> "G1: Allgemeine Grundlagen"
    // Regex: \s*\([A-Z0-9-]+\)$
    group.title = group.title.replace(/\s*\([A-Z0-9-]+\)$/, '');

    // 2. Add level to each adjective
    group.adjectives.forEach(adj => {
        if (!adj.level) {
            adj.level = group.level;
        }
    });
});

// Re-serialize to string. 
// We need to format it nicely to match existing style (keys unquoted if possible, or just JSON is fine?)
// The original file uses unquoted keys for 'title', 'word', etc. 
// JSON.stringify will quote keys. 'title': "..."
// That's fine, valid JS.
const newDataString = 'const adjectiveGroups = ' + JSON.stringify(adjectiveGroups, null, 4) + ';';
content = content.replace(dataString, newDataString);


// 2. HTML UPDATE (Modal)
// Add CSS
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
// Insert CSS
if (!content.includes('.modal-level-badge')) {
    content = content.replace(/(\s*)<\/style>/, `\n${cssToAdd}$1</style>`);
}

// Add HTML placeholder
const htmlSearchCode = '<div id="modalWord" class="modal-main-word" title="Escuchar">Wort</div>';
const htmlInsertCode = `<div id="modalWord" class="modal-main-word" title="Escuchar">Wort</div>
                    <div id="modalLevel" class="modal-level-badge">A1</div>`;
// Check if already exists
if (!content.includes('id="modalLevel"')) {
    // Regex for robustness
    const htmlRegex = /<div id="modalWord" class="modal-main-word" title="Escuchar">Wort<\/div>/;
    content = content.replace(htmlRegex, htmlInsertCode);
}

// 3. JS UPDATE (openModal)
const jsSearchFor = "document.getElementById('modalWord').textContent = foundAdjective.word;";
const jsInsertFor = `document.getElementById('modalWord').textContent = foundAdjective.word;

            const levelBadge = document.getElementById('modalLevel');
            if (foundAdjective.level) {
                levelBadge.textContent = foundAdjective.level;
                levelBadge.style.display = 'inline-block';
            } else {
                levelBadge.style.display = 'none';
            }`;

if (!content.includes('levelBadge.textContent = foundAdjective.level')) {
    const jsRegex = /document\.getElementById\('modalWord'\)\.textContent\s*=\s*foundAdjective\.word;/;
    content = content.replace(jsRegex, jsInsertFor);
}


// Write back
fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated adjectives');
