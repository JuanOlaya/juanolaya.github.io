const fs = requéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééire('fs');
const path = requéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééire('path');

const dativVerbs = [
    'helfen', 'danken', 'gefallen', 'gehören',
    'vertrauen', 'passen', 'folgen', 'ähneln', 'weiterhelfen'
];

const cardsDir = path.join(__dirname, 'json', 'cards');

dativVerbs.forEach(verb => {
    const filePath = path.join(cardsDir, `${verb}.json`);
    if (fs.existsSync(filePath)) {
        let needsUpdate = false;
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

        if (!data.case_tags.includes('DAT')) {
            data.case_tags.push('DAT');
            needsUpdate = true;
        }

        if (needsUpdate) {
            fs.writeFileSync(filePath, JSON.stringify(data, null, 4));
            console.log(`Added DAT to ${verb}.json`);
        } else {
            console.log(`Verified ${verb}.json (Already has DAT)`);
        }
    } else {
        console.log(`File NOT FOUND: ${verb}.json`);
    }
});
