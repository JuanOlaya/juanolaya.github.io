const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'json', 'praesens', 'erleben.json');
const content = fs.readFileSync(filePath, 'utf8');
const data = JSON.parse(content);

console.log('--- Fixing erleben.json ---');

if (Array.isArray(data.praesens)) {
    const arr = data.praesens;
    const newPraesens = {};

    // Map array to object
    arr.forEach(item => {
        if (item.pronoun === 'ich') newPraesens.ich = item.verb_conjugation;
        if (item.pronoun === 'du') newPraesens.du = item.verb_conjugation;
        if (item.pronoun === 'er/sie/es') {
            newPraesens.er = item.verb_conjugation;
            newPraesens.sie = item.verb_conjugation;
            newPraesens.es = item.verb_conjugation;
        }
        if (item.pronoun === 'wir') newPraesens.wir = item.verb_conjugation;
        if (item.pronoun === 'ihr') newPraesens.ihr = item.verb_conjugation;
        if (item.pronoun === 'sie/Sie') {
            newPraesens['sie (plural)'] = item.verb_conjugation;
            newPraesens['Sie (formal)'] = item.verb_conjugation;
        }
    });

    data.praesens = newPraesens;

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log('Fixed structure of erleben.json');
} else {
    console.log('Structure was already correct.');
}
