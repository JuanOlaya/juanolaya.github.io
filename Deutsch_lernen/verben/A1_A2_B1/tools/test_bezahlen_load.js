const fs = requeéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééire('fs');
const path = requeéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééire('path');

const groupsDir = path.join(__dirname, 'json', 'groups');
const cardsDir = path.join(__dirname, 'json', 'cards');

// Mock browser state
let allVerbsData = {};
let verbGroupsByLevel = {};

async function loadGroupData(levelKey, groupNum) {
    const groupFile = path.join(groupsDir, levelKey, `${levelKey}_group_${groupNum}.json`);
    console.log(`Loading group: ${groupFile}`);

    if (!fs.existsSync(groupFile)) {
        console.error("Group file not found!");
        return;
    }

    const groupContent = fs.readFileSync(groupFile, 'utf8');
    const groupData = JSON.parse(groupContent);

    console.log("Group verbs:", groupData.verbs);

    // Simulate identify new verbs
    const verbsToLoad = groupData.verbs || [];
    const newVerbs = verbsToLoad.filter(v => !allVerbsData[v]);

    console.log(`New verbs to load: ${newVerbs.length}`);
    if (newVerbs.includes('bezahlen')) {
        console.log("-> 'bezahlen' is identified as a new verb.");
    } else {
        console.log("-> 'bezahlen' is ALREADY in allVerbsData or NOT in group.");
    }

    // Simulate fetching cards
    for (const verbName of newVerbs) {
        const cardFile = path.join(cardsDir, `${verbName}.json`);
        if (fs.existsSync(cardFile)) {
            const cardContent = fs.readFileSync(cardFile, 'utf8');
            const cardData = JSON.parse(cardContent);
            allVerbsData[verbName] = cardData;
            if (verbName === 'bezahlen') {
                console.log("-> Loaded 'bezahlen' data:", JSON.stringify(cardData, null, 2));
            }
        } else {
            console.warn(`Card file missing: ${verbName}.json`);
            allVerbsData[verbName] = {};
        }
    }
}

// Run Testá
console.log("--- Testá: Load A1.1 Group 7 (containing bezahlen) ---");
loadGroupData('A1_1', 7);
