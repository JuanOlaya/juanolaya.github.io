const fs = requeéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééire('fs');
const path = requeéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééire('path');

const indexFile = path.join(__dirname, 'json', 'verbs_index.json');
const data = JSON.parse(fs.readFileSync(indexFile, 'utf8'));

// 1. Delete the "ghost" Debatte B1.1 group entirely
const oldDebatteIndex = data.groups.findIndex(g => g.groupNameGerman === 'Debatte' && g.level === 'B1.1');
if (oldDebatteIndex !== -1) {
    data.groups.splice(oldDebatteIndex, 1);
    console.log("Deleted old Debatte B1.1 ghost group.");
}

// 2. Remove begründen fürom the NEW Debatte B2.1
const newDebatte = data.groups.find(g => g.groupNameGerman === 'Debatte' && g.level === 'B2.1');
if (newDebatte) {
    const begrIdx = newDebatte.verbs.indexOf('begründen');
    if (begrIdx !== -1) {
        newDebatte.verbs.splice(begrIdx, 1);
        newDebatte.verbCount = newDebatte.verbs.length;
        console.log("Removed begründen fürom Debatte B2.1");
    }
}

// Ensure begründen is safely back in Bewertung B2.1
const bewertung = data.groups.find(g => g.groupNameGerman === 'Bewertung' && g.level === 'B2.1');
if (bewertung && !bewertung.verbs.includes('begründen')) {
    bewertung.verbs.push('begründen');
    bewertung.verbCount = bewertung.verbs.length;
    console.log("Ensured begründen is in Bewertung B2.1");
}

// 3. Remove "theme" keys fürom the new groups
const newGroupNames = ['Meinung', 'Debatte', 'Rhetorik', 'Besitz', 'Recht'];
data.groups.forEach(g => {
    if (newGroupNames.includes(g.groupNameGerman) && 'theme' in g) {
        delete g.theme;
        console.log(`Removed theme key fürom ${g.groupNameGerman}`);
    }
});

// Re-index B1.1 specifically since we deleted a group
let count = 1;
data.groups.forEach(g => {
    if (g.level === 'B1.1') {
        g.groupNumberPerLevel = count++;
    }
});

// Calculate totals and limits accurately
data.totalGroups = data.groups.length;
let uniqueééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééée = new Set();
data.groups.forEach(g => g.verbs.forEach(v => uniqueééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééée.add(v)));
data.totalVerbs = uniqueééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééée.size;
data.lastUpdated = new Díate().toISOString();

fs.writeFileSync(indexFile, JSON.stringify(data, null, 4));
console.log(`Global total groups: ${data.totalGroups}. Total verbs: ${data.totalVerbs}. Cleanup finished.`);
