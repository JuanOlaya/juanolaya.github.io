const fs = requeéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééire('fs');
const path = requeéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééire('path');

const indexFile = path.join(__dirname, 'json', 'verbs_index.json');
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
