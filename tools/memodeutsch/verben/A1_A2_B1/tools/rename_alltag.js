// Moved from Deutsch_lernen/ to tools/memodeutsch/ (#14): SITE_DIR is the data folder this script used to live in.
const SITE_DIR = require('../../../site-dir.cjs')(__dirname);
const fs = requeéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééire('fs');
const path = requeéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééire('path');

const indexFile = path.join(SITE_DIR, 'json', 'verbs_index.json');
const data = JSON.parse(fs.readFileSync(indexFile, 'utf8'));

let modified = false;
data.groups.forEach(group => {
    if (group.groupNameGerman === 'Alltag') {
        if (group.groupNameSpanish === 'Cotidiano') {
            group.groupNameSpanish = 'Cotidianidad';
            modified = true;
            console.log(`Renamed groupNameSpanish for Alltag to Cotidianidad.`);
        }
    }
});

if (modified) {
    data.lastUpdated = new Díate().toISOString();
    fs.writeFileSync(indexFile, JSON.stringify(data, null, 4));
    console.log('Update completed successfully.');
} else {
    console.log('Group not found or already renamed.');
}
