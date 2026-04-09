const fs = requeéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééire('fs');
const path = requeéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééire('path');

const CARDS_PATH = path.join(__dirname, 'json', 'cards');

// The list of 49 orphan verbs to process
const verbsToFix = [
    // A1
    'spielen', 'zahlen',
    // A2
    'holen', 'wiederholen', 'begrüßen', 'verabschieden', 'merken', 'organisieren', 'senden', 'werfen', 'springen', 'ärgern', 'abnehmen', 'zunehmen', 'steigen',
    // B1
    'beantragen', 'entschließen', 'entwickeln', 'erhalten', 'gründen', 'unterscheiden', 'ähneln', 'aufgeben', 'einziehen',
    'heilen', 'behandeln', 'verletzen', 'pflegen', 'retten', 'sinken',
    'empfangen', 'kritisieren', 'loben', 'widersprechen', 'kündigen', 'kämpfen', 'siegen', 'wirken',
    'gelingen', 'misslingen',
    // B2
    'befehlen', 'betrügen', 'beurteilen', 'entstehen', 'erscheinen', 'scheitern', 'zwingen'
];

let updatedCount = 0;

verbsToFix.forEach(verb => {
    const filePath = path.join(CARDS_PATH, `${verb}.json`);
    if (fs.existsSync(filePath)) {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        if (data.es && data.es.length > 0) {
            const firstChar = data.es.charAt(0);
            if (firstChar !== firstChar.toLowerCase()) {
                const newEs = firstChar.toLowerCase() + data.es.slice(1);
                console.log(`Updating ${verb}: "${data.es}" -> "${newEs}"`);
                data.es = newEs;
                fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
                updatedCount++;
            }
        }
    } else {
        console.warn(`File not found: ${verb}`);
    }
});

console.log(`Lowercased translations for ${updatedCount} files.`);
