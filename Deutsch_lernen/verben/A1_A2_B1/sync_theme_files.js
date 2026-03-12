const fs = require('fs');
const path = require('path');

// Level configuration
const levelConfig = {
    'A1_1': { groupCount: 14, displayName: 'A1.1' },
    'A1_2': { groupCount: 14, displayName: 'A1.2' },
    'A2_1': { groupCount: 12, displayName: 'A2.1' },
    'A2_2': { groupCount: 12, displayName: 'A2.2' },
    'B1_1': { groupCount: 17, displayName: 'B1.1' },
    'B2_1': { groupCount: 8, displayName: 'B2.1' }
};

const levelOrder = ['A1_1', 'A1_2', 'A2_1', 'A2_2', 'B1_1', 'B2_1'];

console.log('Synchronizing theme files with group files...\n');

let updatedCount = 0;
let createdCount = 0;

levelOrder.forEach(levelKey => {
    const config = levelConfig[levelKey];
    const displayName = config.displayName;

    for (let groupNum = 1; groupNum <= config.groupCount; groupNum++) {
        const groupFilePath = path.join(__dirname, 'json', 'groups', levelKey, `${levelKey}_group_${groupNum}.json`);
        const themeFilePath = path.join(__dirname, 'json', 'themes', `${levelKey}_${groupNum}_theme.json`);

        try {
            // Read the group file
            const groupData = JSON.parse(fs.readFileSync(groupFilePath, 'utf8'));
            const theme = groupData.theme;

            // Check if theme file exists
            let themeData = {};
            let existed = false;

            if (fs.existsSync(themeFilePath)) {
                themeData = JSON.parse(fs.readFileSync(themeFilePath, 'utf8'));
                existed = true;
            }

            // Update theme data with correct information from group file
            themeData.level = displayName;
            themeData.group = groupNum;
            themeData.germanName = theme;

            // Keep existing fields if they exist, otherwise set defaults
            if (!themeData.shortName) themeData.shortName = theme;
            if (!themeData.spanishName) themeData.spanishName = theme; // Will need manual translation
            if (!themeData.germanDescription) themeData.germanDescription = '';
            if (!themeData.spanishDescription) themeData.spanishDescription = '';
            if (!themeData.b1Rating) themeData.b1Rating = '';
            if (!themeData.examContext) themeData.examContext = '';
            if (!themeData.examContextEs) themeData.examContextEs = '';

            // Write the theme file
            fs.writeFileSync(themeFilePath, JSON.stringify(themeData, null, 2), 'utf8');

            if (existed) {
                console.log(`✓ Updated ${levelKey}_${groupNum}_theme.json: ${theme}`);
                updatedCount++;
            } else {
                console.log(`✨ Created ${levelKey}_${groupNum}_theme.json: ${theme}`);
                createdCount++;
            }

        } catch (error) {
            console.error(`✗ Error processing ${levelKey} group ${groupNum}:`, error.message);
        }
    }
});

console.log('\n=== Summary ===');
console.log(`Updated: ${updatedCount} theme files`);
console.log(`Created: ${createdCount} theme files`);
console.log('Done!');
console.log('\nNote: Some theme files may need manual translation for spanishName and descriptions.');
