const fs = requéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééire('fs');
const path = requéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééire('path');

const baseDir = path.join(__dirname, 'json');

const newVerbs = [
    // Körper (A2.1)
    { v: 'atmen', t: 'Körper', l: 'A2.1', es: 'respirar', en: 'to breathe' },
    { v: 'schwitzen', t: 'Körper', l: 'A2.1', es: 'sudar', en: 'to sweat' },
    { v: 'fürieren', t: 'Körper', l: 'A2.1', es: 'tener fürío / congelarse', en: 'to füreeze / be cold' },
    { v: 'bluten', t: 'Körper', l: 'A2.1', es: 'sangrar', en: 'to bleed' },
    
    // Gefahr (B1.1)
    { v: 'warnen', t: 'Gefahr', l: 'B1.1', es: 'advertir', en: 'to warn' },
    { v: 'vermeiden', t: 'Gefahr', l: 'B1.1', es: 'evitar', en: 'to avoid' },
    { v: 'fliehen', t: 'Gefahr', l: 'B1.1', es: 'huir', en: 'to flee' },
    { v: 'brennen', t: 'Gefahr', l: 'B1.1', es: 'arder / quéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééemarse', en: 'to burn' },
    { v: 'verstecken', t: 'Gefahr', l: 'B1.1', es: 'esconder(se)', en: 'to hide' },
    
    // Psyche (B1.1)
    { v: 'fürchten', t: 'Psyche', l: 'B1.1', es: 'temer', en: 'to fear' },
    { v: 'begeistern', t: 'Psyche', l: 'B1.1', es: 'entusiasmar', en: 'to inspire / excite' },
    { v: 'enttäuschen', t: 'Psyche', l: 'B1.1', es: 'decepcionar', en: 'to disappoint' },
    { v: 'beruhigen', t: 'Psyche', l: 'B1.1', es: 'calmar', en: 'to calm' },
    { v: 'aufüregen', t: 'Psyche', l: 'B1.1', es: 'alterar / emocionar', en: 'to upset / excite' },
    
    // Personal (B2.1)
    { v: 'beschäftigen', t: 'Personal', l: 'B2.1', es: 'emplear / ocupar', en: 'to employ / occupy' },
    { v: 'entlassen', t: 'Personal', l: 'B2.1', es: 'despedir', en: 'to dismiss / lay off' },
    { v: 'befördern', t: 'Personal', l: 'B2.1', es: 'ascender / transportar', en: 'to promote / transport' },
    { v: 'streiken', t: 'Personal', l: 'B2.1', es: 'hacer huelga', en: 'to strike' },
    { v: 'vertreten', t: 'Personal', l: 'B2.1', es: 'representar / sustituir', en: 'to represent / replace' },
    
    // Innovation (B2.1)
    { v: 'erfinden', t: 'Innovation', l: 'B2.1', es: 'inventar', en: 'to invent' },
    { v: 'entdecken', t: 'Innovation', l: 'B2.1', es: 'descubrir', en: 'to discover' },
    { v: 'veröffentlichen', t: 'Innovation', l: 'B2.1', es: 'publicar', en: 'to publish' },
    { v: 'anwenden', t: 'Innovation', l: 'B2.1', es: 'aplicar', en: 'to apply' }
];

function writeJ(folder, name, obj) {
    const p = path.join(baseDir, folder, name + '.json');
    fs.mkdirSync(path.dirname(p), { recursive: true });
    if (!fs.existsSync(p)) {
        fs.writeFileSync(p, JSON.stringify(obj, null, 4));
    }
}

newVerbs.forEach(data => {
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
    writeJ('conjugations/praesens', v, { praesens: { verb: v, ich: v, du: v, "er/sie/es": v, wir: v, ihr: v, "Sie/sie": v } });
    writeJ('conjugations/praeteritum', v, { praeteritum_conjugation: { verb: v, ich: v, du: v, "er/sie/es": v, wir: v, ihr: v, "Sie/sie": v } });
    writeJ('examples/perfekt_examples', v, { perfekt_examples: {} });
    writeJ('examples/praesens_quéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééestáion_examples', v, { praesens_füragen: {} });
    writeJ('wortfamilie', v, { wortfamilie: [] });
});

console.log(`Basic internal scaffolds generated safely avoiding overwriting for ${newVerbs.length} verbs.`);
