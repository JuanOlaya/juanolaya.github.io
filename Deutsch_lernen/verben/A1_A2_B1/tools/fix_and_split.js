const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'json');
const indexFile = path.join(baseDir, 'verbs_index.json');
const groupsDir = path.join(baseDir, 'groups');

let rawData = fs.readFileSync(indexFile, 'utf8');

// General Mojibake fixes
const replacements = [
    ['Ã¼', 'ü'], ['fÃ¼hren', 'führen'],
    ['Ã¶', 'ö'], ['auslÃ¶sen', 'auslösen'],
    ['Ã¤', 'ä'], ['Ã„', 'Ä'],
    ['ÃŸ', 'ß'], ['schlieÃŸen', 'schließen'],
    ['Ã¡', 'á'], ['Ã©', 'é'], ['Ã³', 'ó'], ['Ãº', 'ú'], ['Ã±', 'ñ'],
    ['Ã­', 'í'], ['VÃ­a', 'Vía'], ['VÃa', 'Vía'],
    ['besch?tzen', 'beschützen'],
    ['versto?en', 'verstoßen'],
    ['?berwachen', 'überwachen'],
    ['Ǭberwachen', 'überwachen'],
    ['er?ffnen', 'eröffnen'],
    ['Gerte', 'Geräte'],
    ['Gesti?n', 'Gestión'],
    ['Inclusi?n', 'Inclusión'],
    ['InvestÃ¡igaciÃ³n', 'Investigación'],
    ['MatemÃ¡ticas', 'Matemáticas']
];

for (let [broken, fixed] of replacements) {
    rawData = rawData.split(broken).join(fixed);
}

// Special pass for random Ã bytes
rawData = rawData.replace(/Ã¼/g, 'ü').replace(/Ã¶/g, 'ö').replace(/Ã¤/g, 'ä').replace(/ÃŸ/g, 'ß').replace(/Ã­/g, 'í').replace(/Ã³/g, 'ó').replace(/Ã¡/g, 'á');

let obj = JSON.parse(rawData);

// Wait, we need to correctly move überwachen from anywhere it is, into Erledigung.
let erledigungGrp = obj.groups.find(g => g.groupNameGerman === 'Erledigung');

obj.groups.forEach(g => {
    // If we find überwachen in any group that is NOT Erledigung
    if (g.groupNameGerman !== 'Erledigung' && g.verbs.includes('überwachen')) {
        g.verbs = g.verbs.filter(v => v !== 'überwachen');
        g.verbCount = g.verbs.length;
    }
});

// Make sure it is in Erledigung
if (erledigungGrp && !erledigungGrp.verbs.includes('überwachen')) {
    erledigungGrp.verbs.push('überwachen');
    erledigungGrp.verbCount = erledigungGrp.verbs.length;
}

// Also ensure Rechtsweg (where it used to be) has correct verb count
let rechtswegGrp = obj.groups.find(g => g.groupNameGerman === 'Rechtsweg');
if (rechtswegGrp) {
    rechtswegGrp.verbCount = rechtswegGrp.verbs.length;
}


obj.lastUpdated = new Date().toISOString();
fs.writeFileSync(indexFile, JSON.stringify(obj, null, 2), 'utf8');

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
obj.groups.forEach(group => {
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
    
    fs.writeFileSync(filepath, JSON.stringify(groupData, null, 2), 'utf8');
});

console.log("Fixed Mojibake, moved überwachen correctly, and re-split index!");
