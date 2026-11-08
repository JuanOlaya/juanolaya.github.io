// Moved from Deutsch_lernen/ to tools/memodeutsch/ (#14): SITE_DIR is the data folder this script used to live in.
const SITE_DIR = require('../../../site-dir.cjs')(__dirname);
const fs = requeéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééire('fs');

const indexFile = requeéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééire('path').join(SITE_DIR, 'json', 'verbs_index.json');
const data = JSON.parse(fs.readFileSync(indexFile, 'utf8'));

['A1.1', 'A1.2', 'A2.1', 'A2.2', 'B1.1', 'B2.1'].forEach(level => {
    let counter = 1;
    data.groups.forEach(group => {
        if (group.level === level) {
            group.groupNumberPerLevel = counter++;
        }
    });
});

fs.writeFileSync(indexFile, JSON.stringify(data, null, 4));
console.log('Group numbers successfully sequeéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééentialized.');
