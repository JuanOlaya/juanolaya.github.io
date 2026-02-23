const fs = require('fs');
const path = require('path');

const dativVerbs = [
    'helfen', 'danken', 'gefallen', 'gehören',
    'vertrauen', 'passen', 'folgen', 'ähneln', 'weiterhelfen'
];

const cardsDir = path.join(__dirname, 'json', 'cards');

dativVerbs.forEach(verb => {
    const filePath = path.join(cardsDir, `${verb}.json`);
    if (fs.existsSync(filePath)) {
        let needsUpdate = false;
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        if (!data.case_tags) {
            data.case_tags = [];
            needsUpdate = true;
        }

        if (!data.case_tags.includes('Dativ')) {
            data.case_tags.push('Dativ');
            needsUpdate = true;
        }
        if (data.case_tags.includes('Akkusativ')) {
            console.log(`WARNING: ${verb} has Akkusativ tag. Should it be pure Dativ?`);
            // data.case_tags = data.case_tags.filter(t => t !== 'Akkusativ');
            // needsUpdate = true;
        }

        if (needsUpdate) {
            fs.writeFileSync(filePath, JSON.stringify(data, null, 4));
            console.log(`Updated tags for ${verb}.json`);
        } else {
            console.log(`Verified ${verb}.json (Already Dativ only)`);
        }
    } else {
        console.log(`File NOT FOUND: ${verb}.json`);
    }
});
