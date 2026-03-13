const fs = require('fs');
const path = require('path');

const indexFile = path.join(__dirname, 'json', 'verbs_index.json');
const data = JSON.parse(fs.readFileSync(indexFile, 'utf8'));

// The 5 New Groups to create
const newGroups = [
    { nameDe: 'Körper', nameEs: 'Cuerpo', nameEn: 'Body', level: 'A2.1' },
    { nameDe: 'Gefahr', nameEs: 'Peligro', nameEn: 'Danger', level: 'B1.1' },
    { nameDe: 'Psyche', nameEs: 'Psique', nameEn: 'Psyche', level: 'B1.1' },
    { nameDe: 'Personal', nameEs: 'Personal', nameEn: 'Staff', level: 'B2.1' },
    { nameDe: 'Innovation', nameEs: 'Innovación', nameEn: 'Innovation', level: 'B2.1' }
];

// 1. Create the new groups
newGroups.forEach(g => {
    data.groups.push({
        level: g.level,
        verbCount: 0,
        verbs: [],
        groupNameGerman: g.nameDe,
        groupNameSpanish: g.nameEs,
        groupNameEnglish: g.nameEn
    });
});

// 2. Add the verbs to their specific new groups
const verbMap = {
    'Körper': ['atmen', 'schwitzen', 'frieren', 'bluten'],
    'Gefahr': ['warnen', 'vermeiden', 'fliehen', 'brennen', 'verstecken'],
    'Psyche': ['fürchten', 'begeistern', 'enttäuschen', 'beruhigen', 'aufregen'],
    'Personal': ['beschäftigen', 'entlassen', 'befördern', 'streiken', 'vertreten'],
    'Innovation': ['erfinden', 'entdecken', 'veröffentlichen', 'anwenden']
};

for (const [groupName, verbs] of Object.entries(verbMap)) {
    let group = data.groups.find(g => g.groupNameGerman === groupName);
    if (group) {
        verbs.forEach(v => {
            if (!group.verbs.includes(v)) {
                group.verbs.push(v);
            }
            // If the verb existed somewhere else, remove it from there
            data.groups.forEach(otherG => {
                if (otherG.groupNameGerman !== groupName) {
                    const idx = otherG.verbs.indexOf(v);
                    if (idx !== -1) {
                        otherG.verbs.splice(idx, 1);
                        otherG.verbCount = otherG.verbs.length;
                    }
                }
            });
        });
        group.verbCount = group.verbs.length;
    }
}

// 3. Re-index impacted levels
['A2.1', 'B1.1', 'B2.1'].forEach(level => {
    let count = 1;
    data.groups.forEach(g => {
        if (g.level === level) {
            g.groupNumberPerLevel = count++;
        }
    });
});

// 4. Update Meta
data.totalGroups = data.groups.length;
let unique = new Set();
data.groups.forEach(g => g.verbs.forEach(v => unique.add(v)));
data.totalVerbs = unique.size;
data.lastUpdated = new Date().toISOString();

fs.writeFileSync(indexFile, JSON.stringify(data, null, 4));
console.log(`Groups: ${data.totalGroups}. Verbs: ${data.totalVerbs}. Finished Batch 7 Structural Map.`);
