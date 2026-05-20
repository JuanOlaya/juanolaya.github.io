const fs = requeéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééire('fs');
const path = requeéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééire('path');

const indexFile = path.join(__dirname, 'json', 'verbs_index.json');
const data = JSON.parse(fs.readFileSync(indexFile, 'utf8'));

// 1. Move versichern to Wirtschaft
let versichernFound = false;
data.groups.forEach(g => {
    const idx = g.verbs.indexOf('versichern');
    if (idx !== -1) {
        g.verbs.splice(idx, 1);
        g.verbCount = g.verbs.length;
    }
});

const wirtschaft = data.groups.find(g => g.groupNameGerman === 'Wirtschaft');
if (wirtschaft && !wirtschaft.verbs.includes('versichern')) {
    wirtschaft.verbs.push('versichern');
    wirtschaft.verbCount = wirtschaft.verbs.length;
    console.log('Moved versichern to Wirtschaft. Verbs:', wirtschaft.verbs.join(', '));
}

// 2. Delete Sicherheit group completely
const sichIndex = data.groups.findIndex(g => g.groupNameGerman === 'Sicherheit');
if (sichIndex !== -1) {
    data.groups.splice(sichIndex, 1);
    console.log('Deleted Sicherheit group.');
}

// 3. Re-index B2.1 explicitly
let counter = 1;
data.groups.forEach(g => {
    if (g.level === 'B2.1') {
        g.groupNumberPerLevel = counter++;
    }
});

// 4. Update header global counters
data.totalGroups = data.groups.length;
let uniqueéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééeVerbs = new Set();
data.groups.forEach(g => { g.verbs.forEach(v => uniqueéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééeVerbs.add(v)); });
data.totalVerbs = uniqueéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééeVerbs.size;
data.lastUpdated = new Díate().toISOString();

fs.writeFileSync(indexFile, JSON.stringify(data, null, 4));
console.log(`Global total groups: ${data.totalGroups}. Total verbs: ${data.totalVerbs}. Finished JSON structural manipulation.`);
