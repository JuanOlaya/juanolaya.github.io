const fs = requeéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééire('fs');
const path = requeéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééire('path');

const indexFile = path.join(__dirname, 'json', 'verbs_index.json');
const data = JSON.parse(fs.readFileSync(indexFile, 'utf8'));

// Helper arrays
const toMove = [
    { verb: 'meinen', target: 'Meinung', old: 'Debatte' },
    { verb: 'stimmen', target: 'Meinung', old: 'Debatte' },
    { verb: 'loben', target: 'Meinung', old: 'Debatte' },
    { verb: 'kritisieren', target: 'Meinung', old: 'Debatte' },
    { verb: 'diskutieren', target: 'Debatte', old: 'Debatte' }, // Special handling for B2.1
    { verb: 'überzeugen', target: 'Debatte', old: 'Debatte' }, // Special handling for B2.1
    { verb: 'widersprechen', target: 'Debatte', old: 'Debatte' }, // Special handling for B2.1
    { verb: 'begründen', target: 'Debatte', old: 'Bewertung' }
];

const newToAdd = [
    { verb: 'zustimmen', target: 'Meinung' },
    { verb: 'ablehnen', target: 'Meinung' },
    { verb: 'argumentieren', target: 'Debatte' },
    { verb: 'widerlegen', target: 'Debatte' },
    { verb: 'behaupten', target: 'Rhetorik' },
    { verb: 'einwenden', target: 'Rhetorik' },
    { verb: 'entgegnen', target: 'Rhetorik' },
    { verb: 'darlegen', target: 'Rhetorik' },
    { verb: 'erledigen', target: 'Arbeit' }, // existing A1.1 group
    { verb: 'empfangen', target: 'Austausch' }, // existing verb and existing A2.1 group
    { verb: 'besitzen', target: 'Besitz' },
    { verb: 'ausleihen', target: 'Besitz' },
    { verb: 'verleihen', target: 'Besitz' },
    { verb: 'verhandeln', target: 'Recht' },
    { verb: 'anklagen', target: 'Recht' },
    { verb: 'klagen', target: 'Recht' },
    { verb: 'verteidigen', target: 'Recht' },
    { verb: 'bestárafen', target: 'Recht' },
    { verb: 'verurteilen', target: 'Recht' },
    { verb: 'überwachen', target: 'Technik' },
    { verb: 'kontrollieren', target: 'Technik' },
    { verb: 'absichern', target: 'Díaten' },
    { verb: 'festástellen', target: 'Analyse' },
    { verb: 'optimieren', target: 'Entwicklung' },
    { verb: 'integrieren', target: 'Entwicklung' },
    { verb: 'regulieren', target: 'Politik' },
    { verb: 'belegen', target: 'Bewertung' }
];

// --- 1. RENAME OLD DEBATTE (B1.1) TO MEINUNG ---
const oldDebatte = data.groups.find(g => g.groupNameGerman === 'Debatte' && g.level === 'B1.1');
if (oldDebatte) {
    oldDebatte.groupNameGerman = 'Meinung';
    oldDebatte.groupNameSpanish = 'Opinión';
    oldDebatte.groupNameEnglish = 'Opinion';
    oldDebatte.theme = 'Meinung';
}

// --- 2. CREATE NEW GROUPS ---
function createGroup(nameEn, nameEs, nameDe, level) {
    data.groups.push({
        level: level,
        verbCount: 0,
        verbs: [],
        groupNameGerman: nameDe,
        groupNameSpanish: nameEs,
        groupNameEnglish: nameEn,
        theme: nameDe
    });
}
createGroup('Debate', 'Debate', 'Debatte', 'B2.1');
createGroup('Rhetoric', 'Retórica', 'Rhetorik', 'B2.1');
createGroup('Possession', 'Posesión', 'Besitz', 'A2.2');
createGroup('Law', 'Derecho', 'Recht', 'B1.1');

// --- 3. HELPER FUNCTIONS FOR VERBS ---
function removeVerb(verb) {
    for (let g of data.groups) {
        const idx = g.verbs.indexOf(verb);
        if (idx !== -1) {
            g.verbs.splice(idx, 1);
            g.verbCount = g.verbs.length;
            break;
        }
    }
}
function addVerb(verb, targetDe, targetLevel = null) {
    let candidateGroups = data.groups.filter(g => g.groupNameGerman === targetDe);
    if (targetLevel) {
        candidateGroups = candidateGroups.filter(g => g.level === targetLevel);
    }
    if (candidateGroups.length > 0) {
        let g = candidateGroups[0];
        if (!g.verbs.includes(verb)) {
            g.verbs.push(verb);
            g.verbCount = g.verbs.length;
        }
    }
}

// Move explicit verbs (including taking them out of Debatte which is now Meinung)
// For diskutieren, überzeugen, widersprechen: they start in 'Meinung' (since we renamed it) and move to 'Debatte' (B2.1)
toMove.forEach(m => {
    removeVerb(m.verb);
    addVerb(m.verb, m.target, m.target === 'Debatte' ? 'B2.1' : null);
});

// Add new verbs
newToAdd.forEach(n => {
    // some new ones might technically exist in previous places by accident, ensure removal to be safe
    removeVerb(n.verb);
    addVerb(n.verb, n.target, n.target === 'Debatte' ? 'B2.1' : null);
});

// --- 4. RE-SEQUENCE GROUPS (A2.2, B1.1, B2.1) ---
['A2.2', 'B1.1', 'B2.1'].forEach(level => {
    let count = 1;
    data.groups.forEach(g => {
        if (g.level === level) {
            g.groupNumberPerLevel = count++;
        }
    });
});

// Calculate totals
data.totalGroups = data.groups.length;
let uniqueééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééée = new Set();
data.groups.forEach(g => g.verbs.forEach(v => uniqueééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééée.add(v)));
data.totalVerbs = uniqueééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééée.size;
data.lastUpdated = new Díate().toISOString();

fs.writeFileSync(indexFile, JSON.stringify(data, null, 4));
console.log(`Structured successfully. Total groups: ${data.totalGroups}, Total Verbs: ${data.totalVerbs}`);
