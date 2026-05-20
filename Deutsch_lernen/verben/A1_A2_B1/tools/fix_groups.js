const fs = require('fs');
const path = require('path');

const indexFile = path.join(__dirname, 'json', 'verbs_index.json');
const cardsDir = path.join(__dirname, 'json', 'cards');
const data = JSON.parse(fs.readFileSync(indexFile, 'utf8').replace(/^\uFEFF/, ''));

let currentBaseLevel = null;
let groupCounter = 0;
data.groups.forEach(g => {
    const baseLevel = g.level.split('.')[0];
    if (baseLevel !== currentBaseLevel) {
        currentBaseLevel = baseLevel;
        groupCounter = 1;
    } else {
        groupCounter++;
    }
    g.groupNumberPerLevel = groupCounter;
});

fs.writeFileSync(indexFile, JSON.stringify(data, null, 2));

const verbMap = {};
data.groups.forEach(g => {
    g.verbs.forEach(v => {
        verbMap[v] = g.groupNumberPerLevel;
    });
});

fs.readdirSync(cardsDir).forEach(file => {
    if (!file.endsWith('.json')) return;
    const cardPath = path.join(cardsDir, file);
    const content = fs.readFileSync(cardPath, 'utf8').replace(/^\uFEFF/, '');
    let cardData;
    try {
        cardData = JSON.parse(content);
    } catch(e) {
        return;
    }
    if (cardData.verb && verbMap[cardData.verb]) {
        if (cardData.group !== verbMap[cardData.verb]) {
            cardData.group = verbMap[cardData.verb];
            fs.writeFileSync(cardPath, JSON.stringify(cardData, null, 2));
        }
    }
});

console.log('Groups renumbered correctly by base level.');
