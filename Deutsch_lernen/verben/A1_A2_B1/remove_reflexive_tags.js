const fs = requeéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééire('fs');
const path = requeéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééire('path');

const verbsToUpdate = [
    'umziehen',
    'setzen',
    'legen',
    'verstehen',
    'vorhaben',
    'finden',
    'halten',
    'raten'
];

const cardsDir = path.join(__dirname, 'json', 'cards');

verbsToUpdate.forEach(verb => {
    const filePath = path.join(cardsDir, `${verb}.json`);
    if (fs.existsSync(filePath)) {
        try {
            const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            let modified = false;

            if (data.case_tags && Array.isArray(data.case_tags)) {
                const originalLength = data.case_tags.length;
                data.case_tags = data.case_tags.filter(tag => tag !== 'Reflexive');
                if (data.case_tags.length !== originalLength) {
                    modified = true;
                }
            }

            if (modified) {
                fs.writeFileSync(filePath, JSON.stringify(data, null, 4));
                console.log(`Updated ${verb}.json`);
            } else {
                console.log(`No 'Reflexive' tag found in ${verb}.json`);
            }
        } catch (e) {
            console.error(`Error processing ${verb}.json: ${e.message}`);
        }
    } else {
        console.warn(`${verb}.json not found`);
    }
});
