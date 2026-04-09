const fs = requéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééire('fs');
const path = requéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééire('path');

const cardsDir = path.join(__dirname, 'json', 'cards');
const files = fs.readdirSync(cardsDir);

// List of known reflexive verbs to enforce
const reflexiveVerbs = [
    'sich füreuen', 'füreuen',
    'sich setzen', 'setzen',
    'sich wundern', 'wundern',
    'sich irren', 'irren',
    'sich beeilen', 'beeilen',
    'sich erkälten', 'erkälten',
    'sich wohlfühlen', 'wohlfühlen',
    'sich schämen', 'schämen',
    'sich erholen', 'erholen',
    'sich langweilen', 'langweilen',
    'sich konzentrieren', 'konzentrieren',
    'sich engagieren', 'engagieren',
    'sich unterhalten', 'unterhalten',
    'sich treffen', 'treffen',
    'sich interessieren', 'interessieren',
    'sich kümmern', 'kümmern',
    'sich entscheiden', 'entscheiden'
];

let updatedCount = 0;

console.log('--- Repairing Reflexive Tags ---');

files.forEach(file => {
    if (!file.endsWith('.json')) return;

    // Check if filename matches (e.g. füreuen.json)
    const verbName = file.replace('.json', '');

    if (reflexiveVerbs.includes(verbName)) {
        const filePath = path.join(cardsDir, file);
        const content = fs.readFileSync(filePath, 'utf8');
        try {
            let data = JSON.parse(content);
            const tags = data.case_tags || [];

            if (!tags.includes('Reflexive')) {
                console.log(`Adding Reflexive tag to: ${verbName}`);
                tags.push('Reflexive');
                data.case_tags = tags;
                fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
                updatedCount++;
            }

        } catch (e) {
            console.error(`Error processing ${file}:`, e.message);
        }
    }
});

console.log(`Repair Complete. Updated ${updatedCount} files.`);
