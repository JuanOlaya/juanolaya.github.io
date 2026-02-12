const fs = require('fs');
const path = require('path');

const filePath = String.raw`c:\Users\juan\Documents\GitHub\juanolaya.github.io\Deutsch_lernen\adverbs\adverbien.html`;
let content = fs.readFileSync(filePath, 'utf8');

// 1. EXTRACT DATA
const startMarker = 'const adverbGroups = [';
const startIndex = content.indexOf(startMarker);

if (startIndex === -1) {
    console.error('Could not find adverbGroups start');
    process.exit(1);
}

// Find the end of the array.
let endIndex = -1;
let openBrackets = 0;

for (let i = startIndex; i < content.length; i++) {
    if (content[i] === '[') openBrackets++;
    if (content[i] === ']') openBrackets--;
    if (openBrackets === 0 && content[i] === ';') {
        endIndex = i + 1; // Include the semicolon
        break;
    }
}

if (endIndex === -1) {
    console.error('Could not find adverbGroups end');
    process.exit(1);
}

const dataBlock = content.substring(startIndex, endIndex);
const jsonString = dataBlock.replace('const adverbGroups =', '').replace(';', '').trim();

let groups;
try {
    groups = new Function('return ' + jsonString)();
} catch (e) {
    console.error('Error parsing data:', e);
    process.exit(1);
}

// 2. CREATE NEW GROUP
const newGroup = {
    "title": "Ordinalzahlen",
    "description": "Adverbios de Orden / Enumeración",
    "level": "A2",
    "colorMain": "#06b6d4", // Cyan
    "colorPastel": "#cffafe",
    "badge": "ORDINAL",
    "emoji": "🔢",
    "adverbs": [
        {
            "word": "erstens",
            "emoji": "🥇",
            "spanish": "(en primer lugar)",
            "english": "firstly",
            "example_de": "Erstens habe ich keine Zeit.",
            "example_es": "En primer lugar, no tengo tiempo.",
            "level": "A2"
        },
        {
            "word": "zweitens",
            "emoji": "🥈",
            "spanish": "(en segundo lugar)",
            "english": "secondly",
            "example_de": "Zweitens ist es zu teuer.",
            "example_es": "En segundo lugar, es demasiado caro.",
            "level": "A2"
        },
        {
            "word": "drittens",
            "emoji": "🥉",
            "spanish": "(en tercer lugar)",
            "english": "thirdly",
            "example_de": "Drittens will ich nicht.",
            "example_es": "En tercer lugar, no quiero.",
            "level": "A2"
        },
        {
            "word": "viertens",
            "emoji": "4️⃣",
            "spanish": "(en cuarto lugar)",
            "english": "fourthly",
            "example_de": "Viertens müssen wir sparen.",
            "example_es": "En cuarto lugar, tenemos que ahorrar.",
            "level": "A2"
        },
        {
            "word": "fünftens",
            "emoji": "5️⃣",
            "spanish": "(en quinto lugar)",
            "english": "fifthly",
            "example_de": "Fünftens ist es schon spät.",
            "example_es": "En quinto lugar, ya es tarde.",
            "level": "A2"
        }
    ]
};

// Check if group already exists
const exists = groups.some(g => g.badge === 'ORDINAL');
if (!exists) {
    groups.push(newGroup);
    console.log('Added Ordinalzahlen group.');
} else {
    console.log('Ordinalzahlen group already exists. Updating...');
    const index = groups.findIndex(g => g.badge === 'ORDINAL');
    groups[index] = newGroup;
}

// 3. SERIALIZE AND WRITE BACK
const newDataBlock = 'const adverbGroups = ' + JSON.stringify(groups, null, 4) + ';';
const newContent = content.replace(dataBlock, newDataBlock);

fs.writeFileSync(filePath, newContent, 'utf8');
console.log('Successfully updated adverbien.html');
