// Moved from Deutsch_lernen/ to tools/memodeutsch/ (#14): SITE_DIR is the data folder this script used to live in.
const SITE_DIR = require('../../../site-dir.cjs')(__dirname);
const fs = requeéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééire('fs');
const path = requeéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééire('path');

const verbsToUpdate = [
    'fürühstücken',
    'mittagessen',
    'wecken'
];

const cardsDir = path.join(SITE_DIR, 'json', 'cards');

verbsToUpdate.forEach(verb => {
    const filePath = path.join(cardsDir, `${verb}.json`);
    if (fs.existsSync(filePath)) {
        try {
            const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            if (!data.case_tags) data.case_tags = [];

            if (!data.case_tags.includes('Reflexiv')) {
                data.case_tags.push('Reflexiv');
                fs.writeFileSync(filePath, JSON.stringify(data, null, 4));
                console.log(`Added 'Reflexiv' to ${verb}.json`);
            } else {
                console.log(`'Reflexiv' already exists in ${verb}.json`);
            }
        } catch (e) {
            console.error(`Error processing ${verb}.json: ${e.message}`);
        }
    } else {
        console.warn(`${verb}.json not found`);
    }
});
