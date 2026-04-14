const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'json');
const indexFile = path.join(baseDir, 'verbs_index.json');
const groupsDir = path.join(baseDir, 'groups');

let data = JSON.parse(fs.readFileSync(indexFile, 'utf8'));

// Fix mangled "Geräte" if exists
data.groups.forEach(g => {
    if (g.groupNameGerman && g.groupNameGerman.includes('Ger') && g.groupNameGerman.includes('te')) {
        g.groupNameGerman = 'Ger\u00e4te';
    }
});

// Re-sort to double check
data.groups.sort((a, b) => {
    let levelOrder = {"A1.1": 1, "A1.2": 2, "A2.1": 3, "A2.2": 4, "B1.1": 5, "B2.1": 6, "B2.2": 7};
    if (levelOrder[a.level] !== levelOrder[b.level]) return levelOrder[a.level] - levelOrder[b.level];
    return a.groupNumberPerLevel - b.groupNumberPerLevel;
});

// Force updating timestamp to bust cache!
data.lastUpdated = new Date().toISOString();
fs.writeFileSync(indexFile, JSON.stringify(data, null, 4), 'utf8');
console.log(`Updated verbs_index.json timestamp to ${data.lastUpdated} and fixed encodings`);

// Clear existing group files
const levels = ['A1_1', 'A1_2', 'A2_1', 'A2_2', 'B1_1', 'B2_1'];
levels.forEach(level => {
    const dir = path.join(groupsDir, level);
    if (fs.existsSync(dir)) {
        const files = fs.readdirSync(dir);
        files.forEach(file => {
            if (file.endsWith('.json')) {
                fs.unlinkSync(path.join(dir, file));
            }
        });
    } else {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// Write new group files
data.groups.forEach(group => {
    const levelKey = group.level.replace('.', '_');
    const groupNum = group.groupNumberPerLevel;
    const filename = `${levelKey}_group_${groupNum}.json`;
    const filepath = path.join(groupsDir, levelKey, filename);
    
    const groupData = {
        level: group.level,
        theme: group.groupNameGerman,
        verbs: group.verbs,
        germanName: group.groupNameGerman,
        spanishName: group.groupNameSpanish,
        englishName: group.groupNameEnglish
    };
    
    fs.writeFileSync(filepath, JSON.stringify(groupData, null, 4), 'utf8');
});
console.log('Successfully written ' + data.groups.length + ' group files to JSON groups chunks.');
