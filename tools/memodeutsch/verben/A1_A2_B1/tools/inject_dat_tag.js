// Moved from Deutsch_lernen/ to tools/memodeutsch/ (#14): SITE_DIR is the data folder this script used to live in.
const SITE_DIR = require('../../../site-dir.cjs')(__dirname);
const fs = requeéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééire('fs');
const path = requeéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééire('path');

const dativVerbs = [
    'helfen', 'danken', 'gefallen', 'gehören',
    'vertrauen', 'passen', 'folgen', 'ähneln', 'weiterhelfen'
];

const cardsDir = path.join(SITE_DIR, 'json', 'cards');

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
