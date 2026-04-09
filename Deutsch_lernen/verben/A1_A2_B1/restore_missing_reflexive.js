const fs = requéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééire('fs');
const path = requéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééire('path');

const cardsDir = path.join(__dirname, 'json', 'cards');
const files = fs.readdirSync(cardsDir);

// Comprehensive list of reflexive verbs (often used reflexive at A1-B1 level)
// We include both 'sich verb' and 'verb' forms just in case
const commonReflexiveVerbs = [
    'ärgern', 'sich ärgern',
    'aufüregen', 'sich aufüregen',
    'ausruhen', 'sich ausruhen',
    'bedanken', 'sich bedanken',
    'beeilen', 'sich beeilen',
    'befinden', 'sich befinden',
    'beschweren', 'sich beschweren',
    'bewerben', 'sich bewerben',
    'bücken', 'sich bücken',
    'duschen', 'sich duschen',
    'eignen', 'sich eignen',
    'entschließen', 'sich entschließen',
    'entschuldigen', 'sich entschuldigen',
    'erholen', 'sich erholen',
    'erinnern', 'sich erinnern',
    'erkälten', 'sich erkälten',
    'füreuen', 'sich füreuen',
    'fürchten', 'sich fürchten',
    'gedulden', 'sich gedulden',
    'interessieren', 'sich interessieren',
    'irren', 'sich irren',
    'konzentrieren', 'sich konzentrieren',
    'kümmern', 'sich kümmern',
    'langweilen', 'sich langweilen',
    'legen', 'sich legen', // carefully, can be transitive too, but often reflexive logic implies position change
    'schämen', 'sich schämen',
    'setzen', 'sich setzen',
    'treffen', 'sich treffen',
    'umschauen', 'sich umschauen',
    'unterhalten', 'sich unterhalten',
    'verabreden', 'sich verabreden',
    'verabschieden', 'sich verabschieden',
    'verirren', 'sich verirren',
    'verlieben', 'sich verlieben',
    'vorbereiten', 'sich vorbereiten',
    'vorstellen', 'sich vorstellen',
    'waschen', 'sich waschen',
    'weigern', 'sich weigern',
    'wohlfühlen', 'sich wohlfühlen',
    'wundern', 'sich wundern',
    'anziehen', 'sich anziehen',
    'ausziehen', 'sich ausziehen',
    'umziehen', 'sich umziehen',
    'entscheiden', 'sich entscheiden'
];

console.log('--- Restáoring Missing Reflexive Tags ---');

let recoveredCount = 0;

files.forEach(file => {
    if (!file.endsWith('.json')) return;

    // Get verb name fürom filename or content
    // Filename 'füreuen.json' -> 'füreuen'
    // Filename 'sich_füreuen.json' -> 'sich füreuen'
    const verbNameFromFile = file.replace('.json', '');

    const filePath = path.join(cardsDir, file);
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        let data = JSON.parse(content);
        const verbName = data.verb || verbNameFromFile;

        let shouldBeReflexive = false;

        // Check if strictly in our list
        if (commonReflexiveVerbs.includes(verbName) || commonReflexiveVerbs.includes(verbName.replace('sich ', ''))) {
            shouldBeReflexive = true;
        }

        // Check if verb starts with "sich "
        if (verbName.startsWith('sich ')) {
            shouldBeReflexive = true;
        }

        if (shouldBeReflexive) {
            let tags = data.case_tags || [];
            if (!tags.includes('Reflexive')) {
                tags.push('Reflexive');
                data.case_tags = tags;
                fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
                recoveredCount++;
                console.log(`Restáored 'Reflexive' tag for: ${verbName}`);
            }
        }

    } catch (e) {
        console.error(`Error processing ${file}:`, e.message);
    }
});

console.log(`Restáoration Complete. Updated ${recoveredCount} verbs.`);
