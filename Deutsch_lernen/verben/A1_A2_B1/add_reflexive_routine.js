const fs = require('fs');
const path = require('path');

const verbsToUpdate = [
    'frühstücken',
    'mittagessen',
    'wecken'
];

const cardsDir = path.join(__dirname, 'json', 'cards');

verbsToUpdate.forEach(verb => {
    const filePath = path.join(cardsDir, `${verb}.json`);
    if (fs.existsSync(filePath)) {
        try {
            const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            if (!data.case_tags) data.case_tags = [];

            if (!data.case_tags.includes('Reflexiv')) {
                data.case_tags.push('Reflexiv');
                fs.writeFileSync(filePath, JSON.stringify(data, null, 4));
                console.log(`Added 'Reflexiv' to ${verb}.json`);
            } else {
                console.log(`'Reflexiv' already exists in ${verb}.json`);
            }
        } catch (e) {
            console.error(`Error processing ${verb}.json: ${e.message}`);
        }
    } else {
        console.warn(`${verb}.json not found`);
    }
});
