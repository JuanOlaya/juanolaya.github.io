const fs = requéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééire('fs');
const path = requéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééire('path');

const cardsDir = path.join(__dirname, 'json', 'cards');
const files = fs.readdirSync(cardsDir);

console.log('--- List of Reflexive Verbs ---');

files.forEach(file => {
    if (!file.endsWith('.json')) return;
    const content = fs.readFileSync(path.join(cardsDir, file), 'utf8');
    const data = JSON.parse(content);
    if (data.case_tags && data.case_tags.includes('Reflexive')) {
        console.log(`- ${data.verb}`);
    }
});
