const fs = require('fs');
const path = require('path');

const indexFile = path.join(__dirname, 'json', 'verbs_index.json');
let obj = JSON.parse(fs.readFileSync(indexFile, 'utf8'));

// 1. Structural Changes in groups
let computerGrp = obj.groups.find(g => g.groupNameGerman === 'Computer');
let technikGrp = obj.groups.find(g => g.groupNameGerman === 'Technik');

if (technikGrp) {
    technikGrp.groupNameGerman = 'Geräte';
    technikGrp.groupNameSpanish = 'Dispositivos';
    technikGrp.groupNameEnglish = 'Devices';
}
let geraeteGrp = obj.groups.find(g => g.groupNameGerman === 'Geräte');

// Move reparieren from Computer to Geräte
if (computerGrp && geraeteGrp && computerGrp.verbs.includes('reparieren')) {
    computerGrp.verbs = computerGrp.verbs.filter(v => v !== 'reparieren');
    computerGrp.verbCount = computerGrp.verbs.length;
    if (!geraeteGrp.verbs.includes('reparieren')) {
        geraeteGrp.verbs.push('reparieren');
        geraeteGrp.verbCount = geraeteGrp.verbs.length;
    }
}

// 2. Create Urlaub group in A2.2
let urlaubGrp = obj.groups.find(g => g.groupNameGerman === 'Urlaub');
if (!urlaubGrp) {
    let a22Groups = obj.groups.filter(g => g.level === 'A2.2');
    let maxNum = a22Groups.reduce((max, g) => Math.max(max, g.groupNumberPerLevel), 0);
    
    urlaubGrp = {
        level: 'A2.2',
        verbCount: 0,
        verbs: [],
        groupNameGerman: 'Urlaub',
        groupNameSpanish: 'Vacaciones',
        groupNameEnglish: 'Vacation',
        groupNumberPerLevel: maxNum + 1
    };
    obj.groups.push(urlaubGrp);
}

// 3. Verbs to Groups mappings
const newVerbs = [
    { v: 'aufpassen', t: 'Handlung', l: 'A2.2', es: 'tener cuidado / prestar atención', en: 'to pay attention / watch out' },
    { v: 'aussprechen', t: 'Bedeutung', l: 'A2.1', es: 'pronunciar', en: 'to pronounce' },
    { v: 'austragen', t: 'Erledigung', l: 'A2.2', es: 'repartir / llevar (cartas, etc.)', en: 'to deliver / distribute' },
    { v: 'beenden', t: 'Erledigung', l: 'A2.2', es: 'terminar / finalizar', en: 'to finish / end' },
    { v: 'einpacken', t: 'Reisen', l: 'A1.2', es: 'empacar / meter', en: 'to pack up' },
    { v: 'eintragen', t: 'Termine', l: 'A2.1', es: 'anotar / inscribirse', en: 'to register / enter' },
    { v: 'informieren', t: 'Lehre', l: 'A2.2', es: 'informar / informarse', en: 'to inform' },
    { v: 'interessieren', t: 'Zustand', l: 'A2.1', es: 'interesar / interesarse', en: 'to interest' },
    { v: 'joggen', t: 'Motorik', l: 'A2.2', es: 'trotar / hacer footing', en: 'to jog' },
    { v: 'notieren', t: 'Termine', l: 'A2.1', es: 'anotar / tomar nota', en: 'to note down' },
    { v: 'rechnen', t: 'Lehre', l: 'A2.2', es: 'calcular / hacer cuentas', en: 'to calculate / count' },
    { v: 'reden', t: 'Interaktion', l: 'A2.2', es: 'hablar / platicar', en: 'to talk / speak' },
    { v: 'renovieren', t: 'Werk', l: 'A2.2', es: 'renovar', en: 'to renovate' },
    { v: 'stattfinden', t: 'Termine', l: 'A2.1', es: 'tener lugar / celebrarse', en: 'to take place / happen' },
    { v: 'trainieren', t: 'Körper', l: 'A2.1', es: 'entrenar / practicar', en: 'to train / practice' },
    { v: 'verlieben', t: 'Beziehungen', l: 'A2.1', es: 'enamorar / enamorarse', en: 'to fall in love' },
    { v: 'chatten', t: 'Computer', l: 'A2.1', es: 'chatear', en: 'to chat' },   // Keeping Level A2.1 on card!
    { v: 'surfen', t: 'Computer', l: 'A2.1', es: 'navegar / surfear', en: 'to surf' }, // Keeping Level A2.1 on card!
    // Urlaub verbs
    { v: 'verreisen', t: 'Urlaub', l: 'A2.2', es: 'irse de viaje', en: 'to go on a trip' },
    { v: 'fotografieren', t: 'Urlaub', l: 'A2.2', es: 'fotografiar / hacer fotos', en: 'to photograph' },
    { v: 'ansehen', t: 'Urlaub', l: 'A2.2', es: 'mirar / ver', en: 'to look at / watch' },
    { v: 'ausruhen', t: 'Urlaub', l: 'A2.2', es: 'descansar', en: 'to rest / relax' },
    { v: 'ausgehen', t: 'Urlaub', l: 'A2.2', es: 'salir', en: 'to go out' },
];

newVerbs.forEach(data => {
    let group = obj.groups.find(g => g.groupNameGerman === data.t);
    if (group && !group.verbs.includes(data.v)) {
        group.verbs.push(data.v);
        group.verbCount = group.verbs.length;
    }
});

// Update totals properly
obj.groups.sort((a, b) => {
    let levelOrder = {"A1.1": 1, "A1.2": 2, "A2.1": 3, "A2.2": 4, "B1.1": 5, "B2.1": 6, "B2.2": 7};
    if (levelOrder[a.level] !== levelOrder[b.level]) return levelOrder[a.level] - levelOrder[b.level];
    return a.groupNumberPerLevel - b.groupNumberPerLevel;
});
obj.totalGroups = obj.groups.length;
obj.totalVerbs = obj.groups.reduce((sum, g) => sum + g.verbs.length, 0);
obj.lastUpdated = new Date().toISOString();

fs.writeFileSync(indexFile, JSON.stringify(obj, null, 2));
console.log("Updated verbs_index.json successfully.");

// Create base files
const baseDir = path.join(__dirname, 'json');
function writeJ(folder, name, dataObj) {
    const fullPath = path.join(baseDir, folder, name + '.json');
    if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(path.dirname(fullPath), { recursive: true });
        fs.writeFileSync(fullPath, JSON.stringify(dataObj, null, 4));
    }
}

newVerbs.forEach(data => {
    const v = data.v;
    writeJ('cards', v, {
        verb: v,
        theme: data.t,
        level: data.l, // Card level might differ slightly from group level (e.g., chatten is A2 but in B1 Computer group)
        es: data.es,
        en: data.en,
        praesens: `${v} (placeholder)`,
        perfekt: `hat ${v} (placeholder)`,
        praeteritum: `${v}te (placeholder)`,
        case_tags: ["Akkusativ", "Regular"],
        tags: ["🏠 Estático"],
        emoji: "🔹"
    });
    writeJ('praesens', v, { verb: v, ich: v, du: v, "er/sie/es": v, wir: v, ihr: v, "Sie/sie": v });
    writeJ('praeteritum_konjugation', v, { verb: v, ich: v, du: v, "er/sie/es": v, wir: v, ihr: v, "Sie/sie": v });
    writeJ('perfekt_konjugation', v, { verb: v, hilfsverb: "haben", past_participle: `ge${v}t` });
    writeJ('examples/perfekt_examples', v, { perfekt_examples: {} });
    writeJ('examples/praesens_examples', v, { praesens_examples: {} });
    writeJ('wortfamilie', v, { wortfamilie: [] });
});

console.log(`Verified/Created basic files for ${newVerbs.length} verbs.`);
