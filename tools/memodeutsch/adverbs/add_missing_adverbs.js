const fs = require('fs');
const path = require('path');

const filePath = String.raw`c:\Users\juan\Documents\GitHub\juanolaya.github.io\Deutsch_lernen\adverbs\adverbien.html`;
let content = fs.readFileSync(filePath, 'utf8');

// 1. EXTRACT DATA
const startMarker = 'const adverbGroups = [';
const startIndex = content.indexOf(startMarker);
if (startIndex === -1) { process.exit(1); }

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
if (endIndex === -1) { process.exit(1); }

const dataBlock = content.substring(startIndex, endIndex);
const jsonString = dataBlock.replace('const adverbGroups =', '').replace(';', '').trim();

let groups;
try {
    groups = new Function('return ' + jsonString)();
} catch (e) {
    console.error(e);
    process.exit(1);
}

// 2. DEFINE NEW ADVERBS
const newAdverbs = {
    'TEMPORAL': [
        { word: "gleich", emoji: "🔜", spanish: "(enseguida)", english: "immediately / right away", example_de: "Ich komme gleich.", example_es: "Voy enseguida.", level: "A1-A2" },
        { word: "vorhin", emoji: "🔙", spanish: "(hace poco)", english: "a while ago", example_de: "Wir haben vorhin gesprochen.", example_es: "Hablamos hace poco.", level: "A1-A2" }
    ],
    'MODAL': [
        { word: "ziemlich", emoji: "⚖️", spanish: "(bastante)", english: "quite / fairly", example_de: "Es ist ziemlich kalt.", example_es: "Hace bastante frío.", level: "A1-B1" },
        { word: "bestimmt", emoji: "💯", spanish: "(seguramente)", english: "definitely / certainly", example_de: "Er kommt bestimmt.", example_es: "Seguro que viene.", level: "A1-B1" },
        { word: "glücklicherweise", emoji: "🍀", spanish: "(afortunadamente)", english: "fortunately", example_de: "Glücklicherweise ist nichts passiert.", example_es: "Afortunadamente no pasó nada.", level: "A1-B1" },
        { word: "überhaupt", emoji: "🚫", spanish: "(en absoluto)", english: "at all", example_de: "Das schmeckt mir überhaupt nicht.", example_es: "No me gusta en absoluto.", level: "A1-B1" },
        { word: "anders", emoji: "🔄", spanish: "(diferente)", english: "differently / else", example_de: "Wir machen das anders.", example_es: "Lo hacemos de otra manera.", level: "A1-B1" }
    ],
    'LOKAL': [
        { word: "weg", emoji: "💨", spanish: "(ido / fuera)", english: "away / gone", example_de: "Meine Tasche ist weg.", example_es: "Mi bolso no está / se ha ido.", level: "A1" },
        { word: "da", emoji: "📍", spanish: "(ahí / allí)", english: "there", example_de: "Ist Herr Müller da?", example_es: "¿Está el Sr. Müller ahí?", level: "A1" }
    ]
};

// 3. INSERT ADVERBS
for (const [badge, adverbs] of Object.entries(newAdverbs)) {
    const group = groups.find(g => g.badge === badge);
    if (group) {
        adverbs.forEach(newAdv => {
            if (!group.adverbs.some(a => a.word === newAdv.word)) {
                group.adverbs.push(newAdv);
                console.log(`Added ${newAdv.word} to ${badge}`);
            }
        });
    }
}

// 4. WRITE BACK
const newDataBlock = 'const adverbGroups = ' + JSON.stringify(groups, null, 4) + ';';
const newContent = content.replace(dataBlock, newDataBlock);
fs.writeFileSync(filePath, newContent, 'utf8');
console.log('Adverbs added successfully.');
