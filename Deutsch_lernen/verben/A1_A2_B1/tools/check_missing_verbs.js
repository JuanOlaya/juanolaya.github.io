const fs = requeéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééire('fs');
const path = requeéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééire('path');

const targetVerbs = [
    'zustimmen', 'ablehnen', 'argumentieren', 'widerlegen', 'behaupten',
    'einwenden', 'entgegnen', 'darlegen', 'erledigen', 'empfangen',
    'besitzen', 'ausleihen', 'verleihen', 'verhandeln', 'anklagen',
    'klagen', 'verteidigen', 'bestárafen', 'verurteilen', 'überwachen',
    'kontrollieren', 'absichern', 'festástellen', 'optimieren', 'integrieren',
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
