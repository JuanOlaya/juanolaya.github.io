const fs = require('fs');
const path = require('path');

const indexFile = path.join(__dirname, 'json', 'verbs_index.json');
const cardsDir = path.join(__dirname, 'json', 'cards');
const data = JSON.parse(fs.readFileSync(indexFile, 'utf8'));

function findGroup(nameOrLevel, maybeName) {
    let name = maybeName || nameOrLevel;
    return data.groups.find(g => g.groupNameGerman === name && (!maybeName || g.level === nameOrLevel));
}

// 1. Move beeilen
const empA2_1_multi = data.groups.find(g => g.level === "A2.1" && g.groupNameGerman === "Empfindung" && g.verbs.includes("langweilen"));
const empA2_1_single = data.groups.find(g => g.level === "A2.1" && g.groupNameGerman === "Empfindung" && g.verbs.includes("beeilen"));

if (empA2_1_single && empA2_1_multi) {
    const idx = empA2_1_single.verbs.indexOf("beeilen");
    if (idx !== -1) {
        empA2_1_single.verbs.splice(idx, 1);
        empA2_1_single.verbCount--;
    }
    if (!empA2_1_multi.verbs.includes("beeilen")) {
        empA2_1_multi.verbs.push("beeilen");
        empA2_1_multi.verbCount++;
    }
}

// 2. move unterbrechen to Debatte
const dialog = findGroup("Dialog");
const debatte = findGroup("Debatte");
if (dialog && debatte) {
    const idx = dialog.verbs.indexOf("unterbrechen");
    if (idx !== -1) {
        dialog.verbs.splice(idx, 1);
        dialog.verbCount--;
        if (!debatte.verbs.includes("unterbrechen")) {
            debatte.verbs.push("unterbrechen");
            debatte.verbCount++;
        }
    }
}

// 3. move heißen, bedeuten to Dialog
const bedeutung = findGroup("Bedeutung");
if (bedeutung && dialog) {
    ["heißen", "bedeuten"].forEach(v => {
        const idx = bedeutung.verbs.indexOf(v);
        if (idx !== -1) {
            bedeutung.verbs.splice(idx, 1);
            bedeutung.verbCount--;
            if (!dialog.verbs.includes(v)) {
                dialog.verbs.push(v);
                dialog.verbCount++;
            }
        }
    });
}

// remove empty groups
data.groups = data.groups.filter(g => g.verbs.length > 0);
data.totalGroups = data.groups.length;

// 4. move Dialog theme between Kommunikation and Formular
const dialogIdx = data.groups.findIndex(g => g.groupNameGerman === "Dialog" && g.level === "A1.2");
if (dialogIdx !== -1) {
    const dialogGroup = data.groups.splice(dialogIdx, 1)[0];
    const kommIdx = data.groups.findIndex(g => g.groupNameGerman === "Kommunikation" && g.level === "A1.2");
    // insert AFTER Kommunikation
    data.groups.splice(kommIdx + 1, 0, dialogGroup);
}

// RECALCULATE groupNumberPerLevel
let currentLevel = null;
let currentGroupPerLevel = 0;
data.groups.forEach(g => {
    if (g.level !== currentLevel) {
        currentLevel = g.level;
        currentGroupPerLevel = 1;
    } else {
        currentGroupPerLevel++;
    }
    g.groupNumberPerLevel = currentGroupPerLevel;
});

// Update lastUpdated
data.lastUpdated = new Date().toISOString();

fs.writeFileSync(indexFile, JSON.stringify(data, null, 2));

// Sync CARDS
const verbMap = {};
data.groups.forEach(g => {
    g.verbs.forEach(v => {
        verbMap[v] = { level: g.level, group: g.groupNumberPerLevel, theme: g.groupNameGerman };
    });
});

fs.readdirSync(cardsDir).forEach(file => {
    if (!file.endsWith('.json')) return;
    const cardPath = path.join(cardsDir, file);
    let cardData;
    try { cardData = JSON.parse(fs.readFileSync(cardPath, 'utf8')); } catch(e) { return; }
    
    if (cardData.verb && verbMap[cardData.verb]) {
        let changed = false;
        const info = verbMap[cardData.verb];
        if (cardData.level !== info.level) { cardData.level = info.level; changed = true; }
        if (cardData.group !== info.group) { cardData.group = info.group; changed = true; }
        if (cardData.theme !== info.theme) { cardData.theme = info.theme; changed = true; }
        
        if (changed) {
            fs.writeFileSync(cardPath, JSON.stringify(cardData, null, 2));
        }
    }
});

console.log('Update complete.');
