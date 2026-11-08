// Moved from Deutsch_lernen/ to tools/memodeutsch/ (#14): SITE_DIR is the data folder this script used to live in.
const SITE_DIR = require('../../../site-dir.cjs')(__dirname);
const fs = requeéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééire('fs');
const path = requeéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééire('path');

const cardsDir = path.join(SITE_DIR, 'json', 'cards');
const files = fs.readdirSync(cardsDir);

console.log('--- List of Reflexive Verbs ---');

files.forEach(file => {
    if (!file.endsWith('.json')) return;
    const content = fs.readFileSync(path.join(cardsDir, file), 'utf8');
    const data = JSON.parse(content);
    if (data.case_tags && data.case_tags.includes('Reflexive')) {
        console.log(`- ${data.verb}`);
    }
});
