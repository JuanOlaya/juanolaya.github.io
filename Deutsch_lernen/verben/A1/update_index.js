const fs = require('fs');
const path = require('path');

/**
 * Updates the verbs_index.json file with current group data
 */
function updateVerbsIndex() {
    const groupsDir = path.join(__dirname, 'json', 'groups');
    const totalGroups = 26;
    const allGroups = [];

    console.log('Updating verbs index...');

    // Read all group files
    for (let i = 1; i <= totalGroups; i++) {
        const filePath = path.join(groupsDir, `group_${i}.json`);
        try {
            const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            allGroups.push({
                groupNumber: i,
                level: data.level,
                verbCount: data.verbs ? data.verbs.length : 0,
                verbs: data.verbs || []
            });
        } catch (error) {
            console.error(`⚠ Error reading group_${i}.json:`, error.message);
        }
    }

    // Create index data
    const indexData = {
        lastUpdated: new Date().toISOString(),
        totalGroups: totalGroups,
        totalVerbs: allGroups.reduce((sum, g) => sum + g.verbCount, 0),
        groups: allGroups
    };

    // Write index file
    const indexPath = path.join(__dirname, 'verbs_index.json');
    fs.writeFileSync(indexPath, JSON.stringify(indexData, null, 4) + '\n', 'utf8');

    console.log(`✓ Index updated: ${indexData.totalVerbs} verbs across ${totalGroups} groups`);

    // Display level summary
    const levelSummary = {};
    allGroups.forEach(g => {
        if (!levelSummary[g.level]) {
            levelSummary[g.level] = { groups: 0, verbs: 0 };
        }
        levelSummary[g.level].groups++;
        levelSummary[g.level].verbs += g.verbCount;
    });

    console.log('\nSummary by level:');
    Object.entries(levelSummary).sort().forEach(([level, stats]) => {
        console.log(`  ${level}: ${stats.groups} groups, ${stats.verbs} verbs`);
    });
}

// Run if called directly
if (require.main === module) {
    updateVerbsIndex();
}

module.exports = { updateVerbsIndex };
