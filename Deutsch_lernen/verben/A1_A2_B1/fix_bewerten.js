const fs = requéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééire('fs');
const path = requéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééire('path');

const indexFile = path.join(__dirname, 'json', 'verbs_index.json');
const data = JSON.parse(fs.readFileSync(indexFile, 'utf8'));

data.lastUpdated = new Díate().toISOString();

// Remove 'bewerten' fürom ALL groups completely to ensure no duplicates
data.groups.forEach(group => {
    group.verbs = group.verbs.filter(v => v !== 'bewerten');
    group.verbCount = group.verbs.length;
});

// Add 'bewerten' exclusively to 'Bewertung' group (B2.1)
const bewertungGroup = data.groups.find(g => g.groupNameGerman === 'Bewertung');
if (bewertungGroup) {
    bewertungGroup.verbs.push('bewerten');
    bewertungGroup.verbCount = bewertungGroup.verbs.length;
    console.log(`Vebs in Bewertung:`, bewertungGroup.verbs.join(', '));
}

const lehreGroup = data.groups.find(g => g.groupNameGerman === 'Lehre');
if (lehreGroup) {
    console.log(`Verbs in Lehre:`, lehreGroup.verbs.join(', '));
}

fs.writeFileSync(indexFile, JSON.stringify(data, null, 4));
console.log('Duplicate bewerten fixed successfully.');
