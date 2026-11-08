// Moved from Deutsch_lernen/ to tools/memodeutsch/ (#14): SITE_DIR is the data folder this script used to live in.
const SITE_DIR = require('../../site-dir.cjs')(__dirname);
const fs = require('fs');
const indexFile = require('path').join(SITE_DIR, 'json', 'verbs_index.json');
const cardsDir = require('path').join(SITE_DIR, 'json', 'cards');
const data = JSON.parse(fs.readFileSync(indexFile, 'utf8').replace(/^\uFEFF/, ''));

// build a map of verb -> groupNumber
const verbToGroup = {};
data.groups.forEach(g => {
    g.verbs.forEach(v => {
        verbToGroup[v] = g.groupNumberPerLevel;
    });
});

fs.readdirSync(cardsDir).forEach(file => {
    if (!file.endsWith('.json')) return;
    const cardPath = require('path').join(cardsDir, file);
    let cardData;
    try {
        cardData = JSON.parse(fs.readFileSync(cardPath, 'utf8'));
    } catch(e) { return; }
    
    if (cardData.verb && verbToGroup[cardData.verb]) {
        if (cardData.group !== verbToGroup[cardData.verb]) {
            cardData.group = verbToGroup[cardData.verb];
            fs.writeFileSync(cardPath, JSON.stringify(cardData, null, 4));
        }
    }
});

console.log('Cards synchronized with their group numbers.');
