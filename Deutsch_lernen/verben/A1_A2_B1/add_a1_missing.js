const fs = require('fs');
const path = require('path');

const indexFile = path.join(__dirname, 'json', 'verbs_index.json');
let obj = JSON.parse(fs.readFileSync(indexFile, 'utf8'));

const mappings = [
    { v: 'besichtigen', t: 'Stadtleben', l: 'A1.2', es: 'visitar / recorrer', en: 'to visit / tour' },
    { v: 'entschuldigen', t: 'Höflichkeit', l: 'A1.1', es: 'disculpar', en: 'to apologize / excuse' },
    { v: 'vermieten', t: 'Unterkunft', l: 'A1.2', es: 'alquilar', en: 'to rent out' },
    { v: 'ankreuzen', t: 'Vertrag', l: 'A1.2', es: 'marcar con una cruz', en: 'to check / tick' },
    { v: 'kriegen', t: 'Logistik', l: 'A1.1', es: 'recibir / conseguir', en: 'to get / receive' },
    { v: 'telefonieren', t: 'Social', l: 'A1.2', es: 'hablar por teléfono', en: 'to phone / call' }
];

// Add to groups in verbs_index.json
mappings.forEach(data => {
    let group = obj.groups.find(g => g.groupNameGerman === data.t);
    if (group && !group.verbs.includes(data.v)) {
        group.verbs.push(data.v);
        group.verbCount = group.verbs.length;
    }
});

// Update totals
obj.totalGroups = obj.groups.length;
obj.totalVerbs = obj.groups.reduce((sum, g) => sum + g.verbs.length, 0);
obj.lastUpdated = new Date().toISOString();

fs.writeFileSync(indexFile, JSON.stringify(obj, null, 2));
console.log("Updated verbs_index.json successfully.");

// Generate files
const baseDir = path.join(__dirname, 'json');
function writeJ(folder, name, obj) {
    const fullPath = path.join(baseDir, folder, name + '.json');
    if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(path.dirname(fullPath), { recursive: true });
        fs.writeFileSync(fullPath, JSON.stringify(obj, null, 4));
    }
}

mappings.forEach(data => {
    const v = data.v;
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
    writeJ('praesens', v, { verb: v, ich: v, du: v, "er/sie/es": v, wir: v, ihr: v, "Sie/sie": v });
    writeJ('praeteritum_konjugation', v, { verb: v, ich: v, du: v, "er/sie/es": v, wir: v, ihr: v, "Sie/sie": v });
    writeJ('perfekt_konjugation', v, { verb: v, hilfsverb: "haben", past_participle: `ge${v}t` });
    writeJ('examples/perfekt_examples', v, { perfekt_examples: {} });
    writeJ('examples/praesens_examples', v, { praesens_examples: {} });
    writeJ('wortfamilie', v, { wortfamilie: [] });
});

console.log(`Verified/Created basic files for ${mappings.length} new verbs.`);
