const fs = require('fs');
const path = require('path');

const targetVerbs = [
    'zustimmen', 'ablehnen', 'argumentieren', 'widerlegen', 'behaupten',
    'einwenden', 'entgegnen', 'darlegen', 'erledigen', 'empfangen',
    'besitzen', 'ausleihen', 'verleihen', 'verhandeln', 'anklagen',
    'klagen', 'verteidigen', 'bestrafen', 'verurteilen', 'überwachen',
    'kontrollieren', 'absichern', 'feststellen', 'optimieren', 'integrieren',
    'regulieren', 'belegen'
];

let existing = [];
let missing = [];

targetVerbs.forEach(v => {
    const cardPath = path.join(__dirname, 'json', 'cards', v + '.json');
    if (fs.existsSync(cardPath)) {
        existing.push(v);
    } else {
        missing.push(v);
    }
});

console.log('--- EXISTING VERBS ---');
console.log(existing.join(', '));
console.log('\n--- MISSING VERBS (TO CREATE) ---');
console.log(missing.join(', '));
