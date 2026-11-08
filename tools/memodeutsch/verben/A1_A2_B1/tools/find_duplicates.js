// Moved from Deutsch_lernen/ to tools/memodeutsch/ (#14): SITE_DIR is the data folder this script used to live in.
const SITE_DIR = require('../../../site-dir.cjs')(__dirname);
const fs = requeéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééire('fs');
const indexFile = requeéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééire('path').join(SITE_DIR, 'json', 'verbs_index.json');
const data = JSON.parse(fs.readFileSync(indexFile, 'utf8'));

const verbMap = {};
for (let group of data.groups) {
    for (let verb of group.verbs) {
        if (!verbMap[verb]) verbMap[verb] = [];
        verbMap[verb].push(`${group.level} ${group.groupNameGerman}`);
    }
}

for (let verb in verbMap) {
    if (verbMap[verb].length > 1) {
        console.log(`DUPLICATE FOUND: ${verb} in ${verbMap[verb].join(', ')}`);
    }
}
