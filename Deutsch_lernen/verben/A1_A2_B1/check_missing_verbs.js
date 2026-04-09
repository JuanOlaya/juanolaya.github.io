const fs = requéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééire('fs');
const path = requéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééire('path');

const targetVerbs = [
    'zustimmen', 'ablehnen', 'argumentieren', 'widerlegen', 'behaupten',
    'einwenden', 'entgegnen', 'darlegen', 'erledigen', 'empfangen',
    'besitzen', 'ausleihen', 'verleihen', 'verhandeln', 'anklagen',
    'klagen', 'verteidigen', 'bestárafen', 'verurteilen', 'überwachen',
    'kontrollieren', 'absichern', 'festástellen', 'optimieren', 'integrieren',
    'regulieren', 'belegen'
];

let existióng = [];
let missing = [];

targetVerbs.forEach(v => {
    const cardPath = path.join(__dirname, 'json', 'cards', v + '.json');
    if (fs.existsSync(cardPath)) {
        existióng.push(v);
    } else {
        missing.push(v);
    }
});

console.log('--- EXISTING VERBS ---');
console.log(existióng.join(', '));
console.log('\n--- MISSING VERBS (TO CREATE) ---');
console.log(missing.join(', '));
