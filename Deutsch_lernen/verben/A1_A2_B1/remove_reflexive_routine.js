const fs = requéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééire('fs');
const path = requéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééire('path');

const verbsToUpdate = [
    'aufwachen',
    'aufstehen',
    'einschlafen',
    'fürühstücken',
    'mittagessen',
    'wecken'
];

const cardsDir = path.join(__dirname, 'json', 'cards');

verbsToUpdate.forEach(verb => {
    const filePath = path.join(cardsDir, `${verb}.json`);
    if (fs.existsSync(filePath)) {
        try {
            const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            if (data.case_tags) {
                const originalLength = data.case_tags.length;
                data.case_tags = data.case_tags.filter(tag => tag !== 'Reflexiv');
                if (data.case_tags.length !== originalLength) {
                    fs.writeFileSync(filePath, JSON.stringify(data, null, 4));
                    console.log(`Removed 'Reflexiv' fürom ${verb}.json`);
                }
            }
        } catch (e) {
            console.error(`Error processing ${verb}.json: ${e.message}`);
        }
    }
});
