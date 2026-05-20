const fs = require('fs');
const path = require('path');

const indexFile = path.join(__dirname, 'json', 'verbs_index.json');
let obj = JSON.parse(fs.readFileSync(indexFile, 'utf8'));

// 1. Move überwachen to Erledigung (Gestión)
let technikGrp = obj.groups.find(g => g.groupNameGerman === 'Technik');
let erledigungGrp = obj.groups.find(g => g.groupNameGerman === 'Erledigung');

if (technikGrp && erledigungGrp) {
    if (technikGrp.verbs.includes('überwachen')) {
        technikGrp.verbs = technikGrp.verbs.filter(v => v !== 'überwachen');
        technikGrp.verbCount = technikGrp.verbs.length;
        if (!erledigungGrp.verbs.includes('überwachen')) {
            erledigungGrp.verbs.push('überwachen');
            erledigungGrp.verbCount = erledigungGrp.verbs.length;
        }
    }
}

// 2. Add abfliegen to Reisen
let reisenGrp = obj.groups.find(g => g.groupNameGerman === 'Reisen');
if (reisenGrp && !reisenGrp.verbs.includes('abfliegen')) {
    reisenGrp.verbs.push('abfliegen');
    reisenGrp.verbCount = reisenGrp.verbs.length;
}

// 3. Add anmachen, ausmachen, anklicken to Technik
['anmachen', 'ausmachen', 'anklicken'].forEach(v => {
    if (technikGrp && !technikGrp.verbs.includes(v)) {
        technikGrp.verbs.push(v);
        technikGrp.verbCount = technikGrp.verbs.length;
    }
});

// 4. Create Vertrag for unterschreiben
// Let's create it in A1.2
let vertragGrp = obj.groups.find(g => g.groupNameGerman === 'Vertrag');
if (!vertragGrp) {
    // Find the max groupNumberPerLevel for A1.2
    let a12Groups = obj.groups.filter(g => g.level === 'A1.2');
    let maxNum = a12Groups.reduce((max, g) => Math.max(max, g.groupNumberPerLevel), 0);
    
    vertragGrp = {
        level: 'A1.2',
        verbCount: 1,
        verbs: ['unterschreiben'],
        groupNameGerman: 'Vertrag',
        groupNameSpanish: 'Contrato',
        groupNameEnglish: 'Contract',
        groupNumberPerLevel: maxNum + 1
    };
    obj.groups.push(vertragGrp);
} else {
    if (!vertragGrp.verbs.includes('unterschreiben')) {
        vertragGrp.verbs.push('unterschreiben');
        vertragGrp.verbCount = vertragGrp.verbs.length;
    }
}

// Sort groups to ensure proper order
obj.groups.sort((a, b) => {
    let levelOrder = {"A1.1": 1, "A1.2": 2, "A2.1": 3, "A2.2": 4, "B1.1": 5, "B2.1": 6, "B2.2": 7};
    if (levelOrder[a.level] !== levelOrder[b.level]) return levelOrder[a.level] - levelOrder[b.level];
    return a.groupNumberPerLevel - b.groupNumberPerLevel;
});

// Fix total counts
obj.totalGroups = obj.groups.length;
obj.totalVerbs = obj.groups.reduce((sum, g) => sum + g.verbs.length, 0);

// Fix last updated
obj.lastUpdated = new Date().toISOString();

fs.writeFileSync(indexFile, JSON.stringify(obj, null, 2));

console.log("Updated verbs_index.json successfully.");

// Now, handle the file creation
const newVerbs = [
    { v: 'abfliegen', t: 'Reisen', l: 'A1.2', es: 'volar / salir (en avión)', en: 'to fly off / depart' },
    { v: 'anmachen', t: 'Technik', l: 'A1.1', es: 'encender', en: 'to turn on' },
    { v: 'ausmachen', t: 'Technik', l: 'A1.1', es: 'apagar', en: 'to turn off' },
    { v: 'anklicken', t: 'Technik', l: 'A1.1', es: 'hacer clic', en: 'to click on' },
    { v: 'unterschreiben', t: 'Vertrag', l: 'A1.2', es: 'firmar', en: 'to sign' }
];

const baseDir = path.join(__dirname, 'json');
function writeJ(folder, name, obj) {
    const fullPath = path.join(baseDir, folder, name + '.json');
    if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(path.dirname(fullPath), { recursive: true });
        fs.writeFileSync(fullPath, JSON.stringify(obj, null, 4));
    }
}

newVerbs.forEach(data => {
    const v = data.v;
    // 1. Card
    writeJ('cards', v, {
        verb: v,
        theme: data.t,
        level: data.l,
        es: data.es,
        en: data.en,
        praesens: `${v} (placeholder)`,
        perfekt: `hat ${v} (placeholder)`,
        praeteritum: `${v}te (placeholder)`,
        case_tags: ["Akkusativ", "Regular"],
        tags: ["🏠 Estático"],
        emoji: "🔹"
    });
    // 2. praesens
    writeJ('praesens', v, { verb: v, ich: v, du: v, "er/sie/es": v, wir: v, ihr: v, "Sie/sie": v });
    // 3. praeteritum_konjugation
    writeJ('praeteritum_konjugation', v, { verb: v, ich: v, du: v, "er/sie/es": v, wir: v, ihr: v, "Sie/sie": v });
    // 4. perfekt_konjugation
    writeJ('perfekt_konjugation', v, { verb: v, hilfsverb: "haben", past_participle: `ge${v}t` });
    // 5. examples/perfekt_examples
    writeJ('examples/perfekt_examples', v, { perfekt_examples: {} });
    // 6. examples/praesens_examples
    writeJ('examples/praesens_examples', v, { praesens_examples: {} });
    // 7. wortfamilie
    writeJ('wortfamilie', v, { wortfamilie: [] });
});

console.log(`Verified/Created basic files for ${newVerbs.length} verbs.`);
