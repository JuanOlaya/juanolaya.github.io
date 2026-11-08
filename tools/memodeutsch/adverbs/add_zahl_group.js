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
// We start counting from the '[' of 'const adverbGroups = ['
// Content at startIndex is 'c', we need to find the first '[' which is at startIndex + 21
// Let's just search from startIndex.
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
    // Using Function constructor to parse the JS object literal
    groups = new Function('return ' + jsonString)();
} catch (e) {
    console.error('Error parsing data:', e);
    process.exit(1);
}

// 2. CREATE NEW GROUP
const newGroup = {
    "title": "Zahl",
    "description": "Adverbios de Cantidad (Veces)",
    "level": "A1",
    "colorMain": "#22C55E",
    "colorPastel": "#dcfce7",
    "badge": "ZAHL",
    "emoji": "123",
    "adverbs": [
        {
            "word": "die Zahl / die Zahlen",
            "emoji": "🔢",
            "spanish": "(el número / los números)",
            "english": "the number / the numbers",
            "example_de": "Denken Sie an eine Zahl.",
            "example_es": "Piense en un número.",
            "level": "A1"
        },
        {
            "word": "einmal",
            "emoji": "1️⃣",
            "spanish": "(una vez)",
            "english": "once",
            "example_de": "Ich war einmal in Berlin.",
            "example_es": "Fui una vez a Berlín.",
            "level": "A1"
        },
        {
            "word": "zweimal",
            "emoji": "2️⃣",
            "spanish": "(dos veces)",
            "english": "twice",
            "example_de": "Ich habe den Film zweimal gesehen.",
            "example_es": "He visto la película dos veces.",
            "level": "A1"
        },
        {
            "word": "dreimal",
            "emoji": "3️⃣",
            "spanish": "(tres veces)",
            "english": "three times",
            "example_de": "Klopf bitte dreimal.",
            "example_es": "Toca tres veces, por favor.",
            "level": "A1"
        },
        {
            "word": "viermal",
            "emoji": "4️⃣",
            "spanish": "(cuatro veces)",
            "english": "four times",
            "example_de": "Wir waren schon viermal dort.",
            "example_es": "Ya hemos estado allí cuatro veces.",
            "level": "A1"
        },
        {
            "word": "fünfmal",
            "emoji": "5️⃣",
            "spanish": "(cinco veces)",
            "english": "five times",
            "example_de": "Ich habe dich fünfmal angerufen.",
            "example_es": "Te he llamado cinco veces.",
            "level": "A1"
        }
    ]
};

// Check if group already exists to prevent duplicates
const exists = groups.some(g => g.title === 'Zahl');
if (!exists) {
    groups.push(newGroup);
    console.log('Added Zahl group.');
} else {
    console.log('Zahl group already exists. Updating content...');
    // Optional: update content if it exists, but for now we just skip or replace?
    // Let's replace just in case.
    const index = groups.findIndex(g => g.title === 'Zahl');
    groups[index] = newGroup;
}

// 3. SERIALIZE AND WRITE BACK
const newDataBlock = 'const adverbGroups = ' + JSON.stringify(groups, null, 4) + ';';
const newContent = content.replace(dataBlock, newDataBlock);

fs.writeFileSync(filePath, newContent, 'utf8');
console.log('Successfully updated adverbien.html');
