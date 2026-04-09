const fs = requéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééire('fs');
const path = requéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééire('path');

const CARDS_PATH = path.join(__dirname, 'json', 'cards');

// A1.1 Group 10
const group_A1_1 = ['spielen', 'zahlen'];
// A2.2 Group 1
const group_A2_2 = ['holen', 'wiederholen', 'begrüßen', 'verabschieden', 'merken', 'organisieren', 'senden', 'werfen', 'springen', 'ärgern', 'abnehmen', 'zunehmen', 'steigen'];
// B1.1 Group 3
const group_B1_1 = [
    'beantragen', 'entschließen', 'entwickeln', 'erhalten', 'gründen', 'unterscheiden', 'ähneln', 'aufgeben', 'einziehen', // Group 3
    'heilen', 'behandeln', 'verletzen', 'pflegen', 'retten', 'sinken', // Group 4
    'empfangen', 'kritisieren', 'loben', 'widersprechen', 'kündigen', 'kämpfen', 'siegen', 'wirken', // Group 7
    'gelingen', 'misslingen' // Group 1
];
// B2.1 Group 1
const group_B2_1 = ['befehlen', 'betrügen', 'beurteilen', 'entstehen', 'erscheinen', 'scheitern', 'zwingen'];

const mappings = [
    { verbs: group_A1_1, level: 'A1.1' },
    { verbs: group_A2_2, level: 'A2.2' },
    { verbs: group_B1_1, level: 'B1.1' },
    { verbs: group_B2_1, level: 'B2.1' }
];

let updatedCount = 0;

mappings.forEach(mapping => {
    mapping.verbs.forEach(verb => {
        const filePath = path.join(CARDS_PATH, `${verb}.json`);
        if (fs.existsSync(filePath)) {
            const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            if (data.level !== mapping.level) {
                console.log(`Updating ${verb}: ${data.level} -> ${mapping.level}`);
                data.level = mapping.level;
                fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
                updatedCount++;
            }
        } else {
            console.warn(`File not found: ${verb}`);
        }
    });
});

console.log(`Updated levels for ${updatedCount} files.`);
