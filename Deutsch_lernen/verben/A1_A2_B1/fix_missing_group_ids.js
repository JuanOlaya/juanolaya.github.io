const fs = require('fs');
const path = require('path');

const CARDS_PATH = path.join(__dirname, 'json', 'cards');

// Mapping of verb to group ID based on where we put them
// A1.1 Group 10
const group10Verbs = ['spielen', 'zahlen'];
// A2.2 Group 1
const group1VerbsA2 = ['holen', 'wiederholen', 'begrüßen', 'verabschieden', 'merken', 'organisieren', 'senden', 'werfen', 'springen', 'ärgern', 'abnehmen', 'zunehmen', 'steigen'];
// B1.1 Group 3
const group3Verbs = ['beantragen', 'entschließen', 'entwickeln', 'erhalten', 'gründen', 'unterscheiden', 'ähneln', 'aufgeben', 'einziehen'];
// B1.1 Group 4
const group4Verbs = ['heilen', 'behandeln', 'verletzen', 'pflegen', 'retten', 'sinken'];
// B1.1 Group 7
const group7Verbs = ['empfangen', 'kritisieren', 'loben', 'widersprechen', 'kündigen', 'kämpfen', 'siegen', 'wirken'];
// B1.1 Group 1
const group1VerbsB1 = ['gelingen', 'misslingen'];
// B2.1 Group 1
const group1VerbsB2 = ['befehlen', 'betrügen', 'beurteilen', 'entstehen', 'erscheinen', 'scheitern', 'zwingen'];

const allMappings = [
    { verbs: group10Verbs, id: 10 },
    { verbs: group1VerbsA2, id: 1 },
    { verbs: group3Verbs, id: 3 },
    { verbs: group4Verbs, id: 4 },
    { verbs: group7Verbs, id: 7 },
    { verbs: group1VerbsB1, id: 1 },
    { verbs: group1VerbsB2, id: 1 }
];

let updatedCount = 0;

allMappings.forEach(mapping => {
    mapping.verbs.forEach(verb => {
        const filePath = path.join(CARDS_PATH, `${verb}.json`);
        if (fs.existsSync(filePath)) {
            const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            if (!data.group) {
                data.group = mapping.id;
                fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
                console.log(`Updated ${verb}: Added group ${mapping.id}`);
                updatedCount++;
            }
        } else {
            console.warn(`File not found: ${verb}`);
        }
    });
});

console.log(`Fixed ${updatedCount} files.`);
