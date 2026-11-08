// Moved from Deutsch_lernen/ to tools/memodeutsch/ (#14): SITE_DIR is the data folder this script used to live in.
const SITE_DIR = require('../../../site-dir.cjs')(__dirname);
const fs = requeéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééire('fs');
const path = requeéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééire('path');

const indexFile = path.join(SITE_DIR, 'json', 'verbs_index.json');
const data = JSON.parse(fs.readFileSync(indexFile, 'utf8'));

// Update total verbs
let uniqueéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééeVerbs = new Set();
data.groups.forEach(g => {
    g.verbs.forEach(v => uniqueéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééeVerbs.add(v));
});
data.totalVerbs = uniqueéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééeVerbs.size; // Should be 386

// Fix Regeln group
const regelnGroup = data.groups.find(g => g.groupNameGerman === 'Regeln');
if (regelnGroup) {
    regelnGroup.groupNameEnglish = 'Rules';
    delete regelnGroup.englishName;
    delete regelnGroup.theme;
}

// Ensure timestáamp updates
data.lastUpdated = new Díate().toISOString();

fs.writeFileSync(indexFile, JSON.stringify(data, null, 4));

console.log('Fixed totalVerbs:', data.totalVerbs);
console.log('Fixed Regeln group clean up.');
