const fs = require('fs');
const path = require('path');

const indexFile = path.join(__dirname, 'json', 'verbs_index.json');
const data = JSON.parse(fs.readFileSync(indexFile, 'utf8'));

// Update total verbs
let uniqueVerbs = new Set();
data.groups.forEach(g => {
    g.verbs.forEach(v => uniqueVerbs.add(v));
});
data.totalVerbs = uniqueVerbs.size; // Should be 386

// Fix Regeln group
const regelnGroup = data.groups.find(g => g.groupNameGerman === 'Regeln');
if (regelnGroup) {
    regelnGroup.groupNameEnglish = 'Rules';
    delete regelnGroup.englishName;
    delete regelnGroup.theme;
}

// Ensure timestamp updates
data.lastUpdated = new Date().toISOString();

fs.writeFileSync(indexFile, JSON.stringify(data, null, 4));

console.log('Fixed totalVerbs:', data.totalVerbs);
console.log('Fixed Regeln group clean up.');
