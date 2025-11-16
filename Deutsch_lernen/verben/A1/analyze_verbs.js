const fs = require('fs');
const path = require('path');

const groupsDir = path.join(__dirname, 'json', 'groups');
const totalGroups = 26;

// Verbs to check
const verbsToCheck = ['behalten', 'geschehen', 'versuchen', 'verschenken', 'aufhören'];

console.log('\n=== Checking if verbs already exist ===\n');

// Read all groups and check for verbs
const allGroups = [];
const verbLocations = {};

for (let i = 1; i <= totalGroups; i++) {
    const filePath = path.join(groupsDir, `group_${i}.json`);
    try {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        allGroups.push({
            groupNumber: i,
            level: data.level,
            verbs: data.verbs || []
        });

        // Check for verbs to add
        data.verbs.forEach(verb => {
            const lowerVerb = verb.toLowerCase();
            if (verbsToCheck.includes(lowerVerb)) {
                if (!verbLocations[lowerVerb]) {
                    verbLocations[lowerVerb] = [];
                }
                verbLocations[lowerVerb].push({
                    group: i,
                    level: data.level
                });
            }
        });
    } catch (error) {
        console.error(`Error reading group_${i}.json:`, error.message);
    }
}

// Display results
verbsToCheck.forEach(verb => {
    if (verbLocations[verb]) {
        console.log(`❌ "${verb}" already exists in:`);
        verbLocations[verb].forEach(loc => {
            console.log(`   - Group ${loc.group} (${loc.level})`);
        });
    } else {
        console.log(`✓ "${verb}" is NOT in any group - OK to add`);
    }
});

console.log('\n=== Creating Index File ===\n');

// Create index file
const indexData = {
    totalGroups: totalGroups,
    groups: allGroups.map(g => ({
        groupNumber: g.groupNumber,
        level: g.level,
        verbCount: g.verbs.length,
        verbs: g.verbs
    }))
};

const indexPath = path.join(__dirname, 'verbs_index.json');
fs.writeFileSync(indexPath, JSON.stringify(indexData, null, 4) + '\n', 'utf8');

console.log(`✓ Index file created: verbs_index.json`);
console.log(`  Total groups: ${totalGroups}`);
console.log(`  Total verbs: ${allGroups.reduce((sum, g) => sum + g.verbs.length, 0)}`);

// Display summary by level
console.log('\n=== Summary by Level ===\n');
const levelSummary = {};
allGroups.forEach(g => {
    if (!levelSummary[g.level]) {
        levelSummary[g.level] = { groups: 0, verbs: 0 };
    }
    levelSummary[g.level].groups++;
    levelSummary[g.level].verbs += g.verbs.length;
});

Object.entries(levelSummary).sort().forEach(([level, stats]) => {
    console.log(`${level}: ${stats.groups} groups, ${stats.verbs} verbs`);
});

console.log('\n');
