const fs = require('fs');
const path = require('path');

// Level configuration
const levelConfig = {
    'A1_1': { groupCount: 9, displayName: 'A1.1' },
    'A1_2': { groupCount: 9, displayName: 'A1.2' },
    'A2_1': { groupCount: 9, displayName: 'A2.1' },
    'A2_2': { groupCount: 12, displayName: 'A2.2' },
    'B1_1': { groupCount: 7, displayName: 'B1.1' }
};

const levelOrder = ['A1_1', 'A1_2', 'A2_1', 'A2_2', 'B1_1'];

// Step 1: Build a mapping of verb -> {level, theme, group}
const verbToThemeMap = {};

levelOrder.forEach(levelKey => {
    const config = levelConfig[levelKey];

    for (let groupNum = 1; groupNum <= config.groupCount; groupNum++) {
        const groupFilePath = path.join(__dirname, 'json', 'groups', levelKey, `${levelKey}_group_${groupNum}.json`);

        try {
            const groupData = JSON.parse(fs.readFileSync(groupFilePath, 'utf8'));
            const theme = groupData.theme;
            const level = groupData.level;
            const verbs = groupData.verbs;

            verbs.forEach(verb => {
                verbToThemeMap[verb] = {
                    level: level,
                    theme: theme,
                    group: groupNum
                };
            });
        } catch (error) {
            console.warn(`Warning: Could not read ${groupFilePath}:`, error.message);
        }
    }
});

console.log(`Mapped ${Object.keys(verbToThemeMap).length} verbs to their themes.`);

// Step 2: Update all verb card JSON files
const cardsDir = path.join(__dirname, 'json', 'cards');
const cardFiles = fs.readdirSync(cardsDir).filter(file => file.endsWith('.json'));

let updatedCount = 0;
let skippedCount = 0;

cardFiles.forEach(cardFile => {
    const verbName = cardFile.replace('.json', '');
    const cardPath = path.join(cardsDir, cardFile);

    try {
        const cardData = JSON.parse(fs.readFileSync(cardPath, 'utf8'));

        if (verbToThemeMap[verbName]) {
            const themeInfo = verbToThemeMap[verbName];

            // Add theme and group to the card data
            cardData.theme = themeInfo.theme;
            cardData.group = themeInfo.group;

            // Make sure level is set correctly (some might already have it)
            cardData.level = themeInfo.level;

            // Write back to file with nice formatting
            fs.writeFileSync(cardPath, JSON.stringify(cardData, null, 2), 'utf8');
            updatedCount++;
            console.log(`✓ Updated ${verbName}: ${themeInfo.level} - ${themeInfo.theme} (Group ${themeInfo.group})`);
        } else {
            skippedCount++;
            console.log(`⚠ Skipped ${verbName}: not found in any group`);
        }
    } catch (error) {
        console.error(`✗ Error processing ${cardFile}:`, error.message);
    }
});

console.log('\n=== Summary ===');
console.log(`Updated: ${updatedCount} verbs`);
console.log(`Skipped: ${skippedCount} verbs`);
console.log('Done!');
