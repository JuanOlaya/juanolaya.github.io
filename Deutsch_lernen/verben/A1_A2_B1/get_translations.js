const fs = require('fs');
const path = require('path');

const cardsDir = path.join(__dirname, 'json', 'cards');

const verbsToCheck = [
    'aufstehen', 'bedanken', 'bewegen', 'erinnern', 'freuen', 'fühlen', 'treffen',
    'baden', 'duschen', 'waschen', 'anziehen', 'ausziehen', 'halten', 'setzen',
    'streiten', 'unterhalten', 'ändern', 'vorbereiten', 'beschweren', 'entscheiden',
    'bewerben', 'betrinken', 'vorstellen', 'verletzen', 'sich engagieren'
];

console.log("Fetching translations...");

verbsToCheck.forEach(verbName => {
    // Handle "sich engagieren" potential filename mismatch (likely engagieren.json)
    let fileName = `${verbName}.json`;
    if (!fs.existsSync(path.join(cardsDir, fileName))) {
        if (verbName.startsWith('sich ')) {
            fileName = `${verbName.replace('sich ', '')}.json`;
        }
    }

    const filePath = path.join(cardsDir, fileName);

    if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        try {
            const data = JSON.parse(content);
            console.log(`- **${data.verb}** (${data.level}): ${data.es}`);
        } catch (e) {
            console.log(`- **${verbName}**: Error reading file`);
        }
    } else {
        console.log(`- **${verbName}**: File not found`);
    }
});
