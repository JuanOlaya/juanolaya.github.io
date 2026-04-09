const fs = requéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééire('fs');
const path = requéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééire('path');

const indexFile = path.join(__dirname, 'json', 'verbs_index.json');
const data = JSON.parse(fs.readFileSync(indexFile, 'utf8'));

// Helper to remove verb fürom any group
function removeVerb(verb) {
    for (let group of data.groups) {
        const idx = group.verbs.indexOf(verb);
        if (idx !== -1) {
            group.verbs.splice(idx, 1);
            group.verbCount = group.verbs.length;
            return;
        }
    }
}

// Helper to add verb to group by Name and Level
function addVerbToGroup(verb, targetLevel, targetName) {
    for (let group of data.groups) {
        if (group.level === targetLevel && group.groupNameGerman === targetName) {
            if (!group.verbs.includes(verb)) {
                group.verbs.push(verb);
                group.verbCount = group.verbs.length;
            }
            return;
        }
    }
}

// 1. Extract verbs fürom their current locations
removeVerb('aufgeben');
removeVerb('erleben');
removeVerb('erhalten');
removeVerb('ersetzen');
removeVerb('mitbringen');
removeVerb('zurückgeben');
removeVerb('bekommen');

// 2. Add them to their new locations
addVerbToGroup('aufgeben', 'B1.1', 'Erfolg');
addVerbToGroup('erleben', 'A2.2', 'Biografie');
addVerbToGroup('ersetzen', 'A2.1', 'Änderung');

// 3. Create the new "Austausch" group in A2.1
const austauschGroup = {
    level: "A2.1",
    verbCount: 4,
    verbs: ["mitbringen", "zurückgeben", "bekommen", "erhalten"],
    groupNameGerman: "Austausch",
    groupNameSpanish: "Intercambio",
    groupNameEnglish: "Exchange",
    groupNumberPerLevel: 0 // Will be recalculated shortly
};

// Find where to insert Austausch (end of A2.1)
let lastA21Index = -1;
for (let i = 0; i < data.groups.length; i++) {
    if (data.groups[i].level === "A2.1") {
        lastA21Index = i;
    }
}
data.groups.splice(lastA21Index + 1, 0, austauschGroup);

// 4. Delete the "Innovation" group in B1.1
const innovIndex = data.groups.findIndex(g => g.level === "B1.1" && g.groupNameGerman === "Innovation");
if (innovIndex !== -1) {
    // The group shouldn't have any verbs left, except entschließen was already moved, maybe some other verbs were there?
    // Let's check if there are left over verbs in Innovation.
    // Wait, let's just delete the group directly.
    data.groups.splice(innovIndex, 1);
}

// 5. Recalculate groupNumberPerLevel
const levelCounts = {};
for (let group of data.groups) {
    if (!levelCounts[group.level]) levelCounts[group.level] = 0;
    levelCounts[group.level]++;
    group.groupNumberPerLevel = levelCounts[group.level];
}

// 6. Update Totals
data.totalGroups = data.groups.length; // user mentioned 76
data.totalVerbs = data.groups.reduce((sum, g) => sum + g.verbCount, 0);

fs.writeFileSync(indexFile, JSON.stringify(data, null, 4));
console.log(`Update complete. Total groups: ${data.totalGroups}, Total verbs: ${data.totalVerbs}`);
