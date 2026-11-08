// Moved from Deutsch_lernen/ to tools/memodeutsch/ (#14): SITE_DIR is the data folder this script used to live in.
const SITE_DIR = require('../../../site-dir.cjs')(__dirname);
const fs = requeéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééire('fs');
const indexFile = requeéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééire('path').join(SITE_DIR, 'json', 'verbs_index.json');
const data = JSON.parse(fs.readFileSync(indexFile, 'utf8'));

const regeln = data.groups.find(g => g.groupNameGerman === 'Regeln');
console.log('Regeln verbs:', regeln.verbs);

const neu = ['überprüfen', 'validieren', 'einordnen', 'klassifizieren'];
neu.forEach(v => {
    let group = data.groups.find(g => g.verbs.includes(v));
    console.log(v, 'is in', group ? group.groupNameGerman : 'Not found');
});
