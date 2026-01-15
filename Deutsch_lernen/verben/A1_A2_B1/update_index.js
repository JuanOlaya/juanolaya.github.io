const fs = require('fs');
const path = require('path');

/**
 * Updates the verbs_index.json file with current group data
 */
function updateVerbsIndex() {
    const groupsDir = path.join(__dirname, 'json', 'groups');
    const allGroups = [];

    console.log('Updating verbs index...');

    // Level directories to scan
    const levels = ['A1_1', 'A1_2', 'A2_1', 'A2_2', 'B1_1', 'B2_1'];

    levels.forEach(level => {
        const levelDir = path.join(groupsDir, level);
        if (!fs.existsSync(levelDir)) {
            console.warn(`Warning: Level directory not found: ${levelDir}`);
            return;
        }

        const files = fs.readdirSync(levelDir);
        files.forEach(file => {
            if (file.endsWith('.json') && file.includes('_group_')) {
                const filePath = path.join(levelDir, file);
                try {
                    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                    allGroups.push({
                        level: data.level,
                        verbCount: data.verbs ? data.verbs.length : 0,
                        verbs: data.verbs || []
                    });
                } catch (error) {
                    console.error(`⚠ Error reading ${file}:`, error.message);
                }
            }
        });
    });

    // Calculate groupNumberPerLevel for each group
    const levelCounts = {};
    allGroups.forEach(group => {
        if (!levelCounts[group.level]) {
            levelCounts[group.level] = 0;
        }
        levelCounts[group.level]++;
        group.groupNumberPerLevel = levelCounts[group.level];
    });

    // Create index data
    const indexData = {
        lastUpdated: new Date().toISOString(),
        totalGroups: allGroups.length,
        totalVerbs: allGroups.reduce((sum, g) => sum + g.verbCount, 0),
        groups: allGroups
    };

    // Write index file
    const indexPath = path.join(__dirname, 'json', 'verbs_index.json');
    fs.writeFileSync(indexPath, JSON.stringify(indexData, null, 4) + '\n', 'utf8');

    console.log(`✓ Index updated: ${indexData.totalVerbs} verbs across ${allGroups.length} groups`);

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
