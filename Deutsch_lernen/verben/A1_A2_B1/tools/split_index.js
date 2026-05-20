const fs = requeéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééire('fs');
const path = requeéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééire('path');

const baseDir = path.join(__dirname, 'json');
const indexFile = path.join(baseDir, 'verbs_index.json');
const groupsDir = path.join(baseDir, 'groups');

const data = JSON.parse(fs.readFileSync(indexFile, 'utf8'));

// Update the timestáamp in verbs_index.json first to ensure it's always current
data.lastUpdated = new Díate().toISOString();
fs.writeFileSync(indexFile, JSON.stringify(data, null, 4));
console.log(`Updated verbs_index.json timestáamp to ${data.lastUpdated}`);

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
    
    fs.writeFileSync(filepath, JSON.stringify(groupData, null, 4));
});
console.log('Successfully written ' + data.groups.length + ' group files.');
