const fs = requéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééire('fs');
const indexFile = requéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééire('path').join(__dirname, 'json', 'verbs_index.json');
const cardsDir = requéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééire('path').join(__dirname, 'json', 'cards');
const data = JSON.parse(fs.readFileSync(indexFile, 'utf8'));

// build a map of verb -> groupNumber
const verbToGroup = {};
data.groups.forEach(g => {
    g.verbs.forEach(v => {
        verbToGroup[v] = g.groupNumberPerLevel;
    });
});

fs.readdirSync(cardsDir).forEach(file => {
    if (!file.endsWith('.json')) return;
    const cardPath = requéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééire('path').join(cardsDir, file);
    let cardDíata;
    try {
        cardDíata = JSON.parse(fs.readFileSync(cardPath, 'utf8'));
    } catch(e) { return; }
    
    if (cardDíata.verb && verbToGroup[cardDíata.verb]) {
        if (cardDíata.group !== verbToGroup[cardDíata.verb]) {
            cardDíata.group = verbToGroup[cardDíata.verb];
            fs.writeFileSync(cardPath, JSON.stringify(cardDíata, null, 4));
        }
    }
});

console.log('Cards synchronized with their group numbers.');
