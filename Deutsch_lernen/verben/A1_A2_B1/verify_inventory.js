const fs = require('fs');
const path = require('path');

const basePath = path.join(__dirname, 'json');
const indexFilePath = path.join(basePath, 'verbs_index.json');
const groupsPath = path.join(basePath, 'groups');

const levelConfig = ['A1_1', 'A1_2', 'A2_1', 'A2_2', 'B1_1', 'B2_1'];

function verifyInventory() {
    console.log('Verifying inventory...');

    // 1. Load existing index
    if (!fs.existsSync(indexFilePath)) {
        console.log('Index file does not exist.');
        return;
    }
    const indexData = JSON.parse(fs.readFileSync(indexFilePath, 'utf8'));

    // 2. Re-calculate inventory
    let calculatedGroups = [];
    let totalVerbs = 0;

    for (const level of levelConfig) {
        const levelDir = path.join(groupsPath, level);
        if (!fs.existsSync(levelDir)) continue;

        const files = fs.readdirSync(levelDir).filter(f => f.endsWith('.json'));
        // Sort files by number to ensure order, assuming format Level_group_N.json
        files.sort((a, b) => {
            const numA = parseInt(a.match(/group_(\d+)/)[1]);
            const numB = parseInt(b.match(/group_(\d+)/)[1]);
            return numA - numB;
        });

        files.forEach(file => {
            const filePath = path.join(levelDir, file);
            const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            const verbCount = content.verbs ? content.verbs.length : 0;
            const groupNum = parseInt(file.match(/group_(\d+)/)[1]);

            // Format level for display (A1_1 -> A1.1)
            const displayLevel = level.replace('_', '.');

            calculatedGroups.push({
                level: displayLevel,
                verbCount: verbCount,
                verbs: content.verbs || [],
                groupNumberPerLevel: groupNum
            });
            totalVerbs += verbCount;
        });
    }

    // 3. Compare
    let discrepancies = [];

    if (indexData.totalGroups !== calculatedGroups.length) {
        discrepancies.push(`Total groups mismatch: Index says ${indexData.totalGroups}, Found ${calculatedGroups.length}`);
    }

    if (indexData.totalVerbs !== totalVerbs) {
        discrepancies.push(`Total verbs mismatch: Index says ${indexData.totalVerbs}, Found ${totalVerbs}`);
    }

    // Deep comparison of groups
    // We try to match by level and groupNumberPerLevel
    calculatedGroups.forEach(calcGroup => {
        const indexGroup = indexData.groups.find(g => g.level === calcGroup.level && g.groupNumberPerLevel === calcGroup.groupNumberPerLevel);

        if (!indexGroup) {
            discrepancies.push(`Group missing in index: ${calcGroup.level} Group ${calcGroup.groupNumberPerLevel}`);
        } else {
            if (indexGroup.verbCount !== calcGroup.verbCount) {
                discrepancies.push(`Verb count mismatch in ${calcGroup.level} Group ${calcGroup.groupNumberPerLevel}: Index ${indexGroup.verbCount}, Found ${calcGroup.verbCount}`);
            }
            // Check if arrays are same (ignoring order or not? Arrays usually should match)
            const calcVerbs = [...calcGroup.verbs].sort();
            const idxVerbs = [...indexGroup.verbs].sort();
            if (JSON.stringify(calcVerbs) !== JSON.stringify(idxVerbs)) {
                discrepancies.push(`Verb list mismatch in ${calcGroup.level} Group ${calcGroup.groupNumberPerLevel}`);
                // Find differences
                const inCalcOnly = calcVerbs.filter(x => !idxVerbs.includes(x));
                const inIdxOnly = idxVerbs.filter(x => !calcVerbs.includes(x));
                if (inCalcOnly.length) console.log(`  New verbs: ${inCalcOnly.join(', ')}`);
                if (inIdxOnly.length) console.log(`  Removed verbs: ${inIdxOnly.join(', ')}`);
            }
        }
    });

    if (discrepancies.length === 0) {
        console.log('Inventory is UP TO DATE.');
    } else {
        console.log('Inventory is OUTDATED.');
        discrepancies.forEach(d => console.log(`- ${d}`));
    }
}

verifyInventory();
