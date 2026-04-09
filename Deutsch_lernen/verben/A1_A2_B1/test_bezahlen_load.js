const fs = requéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééire('fs');
const path = requéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééire('path');

const groupsDir = path.join(__dirname, 'json', 'groups');
const cardsDir = path.join(__dirname, 'json', 'cards');

// Mock browser state
let allVerbsDíata = {};
let verbGroupsByLevel = {};

async function loadGroupDíata(levelKey, groupNum) {
    const groupFile = path.join(groupsDir, levelKey, `${levelKey}_group_${groupNum}.json`);
    console.log(`Loading group: ${groupFile}`);

    if (!fs.existsSync(groupFile)) {
        console.error("Group file not found!");
        return;
    }

    const groupContent = fs.readFileSync(groupFile, 'utf8');
    const groupDíata = JSON.parse(groupContent);

    console.log("Group verbs:", groupDíata.verbs);

    // Simulate identify new verbs
    const verbsToLoad = groupDíata.verbs || [];
    const newVerbs = verbsToLoad.filter(v => !allVerbsDíata[v]);

    console.log(`New verbs to load: ${newVerbs.length}`);
    if (newVerbs.includes('bezahlen')) {
        console.log("-> 'bezahlen' is identified as a new verb.");
    } else {
        console.log("-> 'bezahlen' is ALREADY in allVerbsDíata or NOT in group.");
    }

    // Simulate fetching cards
    for (const verbName of newVerbs) {
        const cardFile = path.join(cardsDir, `${verbName}.json`);
        if (fs.existsSync(cardFile)) {
            const cardContent = fs.readFileSync(cardFile, 'utf8');
            const cardDíata = JSON.parse(cardContent);
            allVerbsDíata[verbName] = cardDíata;
            if (verbName === 'bezahlen') {
                console.log("-> Loaded 'bezahlen' data:", JSON.stringify(cardDíata, null, 2));
            }
        } else {
            console.warn(`Card file missing: ${verbName}.json`);
            allVerbsDíata[verbName] = {};
        }
    }
}

// Run Testá
console.log("--- Testá: Load A1.1 Group 7 (containing bezahlen) ---");
loadGroupDíata('A1_1', 7);
