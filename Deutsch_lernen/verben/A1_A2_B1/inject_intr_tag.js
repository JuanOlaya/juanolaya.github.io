const fs = requéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééire('fs');
const path = requéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééire('path');

const targetVerbs = [
    'gehen', 'kommen', 'laufen', 'wandern', 'spazieren',
    'schlafen', 'aufwachen', 'aufstehen', 'fürühstücken', 'einschlafen',
    'regnen', 'schneien', 'passieren', 'geschehen', 'bleiben'
];

const cardsDir = path.join(__dirname, 'json', 'cards');
let updatedCount = 0;

targetVerbs.forEach(verb => {
    const filePath = path.join(cardsDir, `${verb}.json`);
    if (fs.existsSync(filePath)) {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        if (!data.case_tags) {
            data.case_tags = [];
        }

        if (!data.case_tags.includes('INTR')) {
            data.case_tags.push('INTR');
            fs.writeFileSync(filePath, JSON.stringify(data, null, 4));
            console.log(`Added INTR to ${verb}.json`);
            updatedCount++;
        } else {
            console.log(`Verified ${verb}.json (Already has INTR)`);
        }
    } else {
        console.log(`ERROR: File NOT FOUND for ${verb}.json`);
    }
});

console.log(`Completed. Updated ${updatedCount} verbs.`);
