const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'json');

const newVerbs = [
    { v: 'zustimmen', t: 'Meinung', l: 'B1.1', es: 'estar de acuerdo', en: 'to agree' },
    { v: 'ablehnen', t: 'Meinung', l: 'B1.1', es: 'rechazar', en: 'to reject' },
    { v: 'argumentieren', t: 'Debatte', l: 'B2.1', es: 'argumentar', en: 'to argue' },
    { v: 'widerlegen', t: 'Debatte', l: 'B2.1', es: 'refutar', en: 'to refute' },
    { v: 'behaupten', t: 'Rhetorik', l: 'B2.1', es: 'afirmar', en: 'to claim' },
    { v: 'einwenden', t: 'Rhetorik', l: 'B2.1', es: 'objetar', en: 'to object' },
    { v: 'entgegnen', t: 'Rhetorik', l: 'B2.1', es: 'replicar', en: 'to reply / counter' },
    { v: 'darlegen', t: 'Rhetorik', l: 'B2.1', es: 'exponer', en: 'to present / set out' },
    { v: 'erledigen', t: 'Arbeit', l: 'A1.1', es: 'realizar / completar', en: 'to complete / take care of' },
    // empfangen exists
    { v: 'besitzen', t: 'Besitz', l: 'A2.2', es: 'poseer', en: 'to own / possess' },
    { v: 'ausleihen', t: 'Besitz', l: 'A2.2', es: 'pedir prestado', en: 'to borrow' },
    { v: 'verleihen', t: 'Besitz', l: 'A2.2', es: 'prestar', en: 'to lend' },
    { v: 'verhandeln', t: 'Recht', l: 'B1.1', es: 'negociar', en: 'to negotiate' },
    { v: 'anklagen', t: 'Recht', l: 'B1.1', es: 'acusar', en: 'to accuse' },
    { v: 'klagen', t: 'Recht', l: 'B1.1', es: 'demandar', en: 'to sue' },
    { v: 'verteidigen', t: 'Recht', l: 'B1.1', es: 'defender', en: 'to defend' },
    { v: 'bestrafen', t: 'Recht', l: 'B1.1', es: 'castigar', en: 'to punish' },
    { v: 'verurteilen', t: 'Recht', l: 'B1.1', es: 'condenar', en: 'to convict / sentence' },
    { v: 'überwachen', t: 'Technik', l: 'B1.1', es: 'supervisar', en: 'to monitor / supervise' },
    { v: 'kontrollieren', t: 'Technik', l: 'B1.1', es: 'controlar / verificar', en: 'to control / check' },
    { v: 'absichern', t: 'Daten', l: 'B1.1', es: 'asegurar / proteger', en: 'to secure / safeguard' },
    { v: 'feststellen', t: 'Analyse', l: 'B2.1', es: 'determinar / constatar', en: 'to determine / establish' },
    { v: 'optimieren', t: 'Entwicklung', l: 'B2.1', es: 'optimizar', en: 'to optimize' },
    { v: 'integrieren', t: 'Entwicklung', l: 'B2.1', es: 'integrar', en: 'to integrate' },
    { v: 'regulieren', t: 'Politik', l: 'B1.1', es: 'regular', en: 'to regulate' },
    { v: 'belegen', t: 'Bewertung', l: 'B2.1', es: 'demostrar / documentar', en: 'to prove / document' }
];

function writeJ(folder, name, obj) {
    fs.writeFileSync(path.join(baseDir, folder, name + '.json'), JSON.stringify(obj, null, 4));
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
    // 3. praeteritum
    writeJ('praeteritum_konjugation', v, { verb: v, ich: v, du: v, "er/sie/es": v, wir: v, ihr: v, "Sie/sie": v });
    // 4. perfekt
    writeJ('perfekt_konjugation', v, { verb: v, ich: v, du: v, "er/sie/es": v, wir: v, ihr: v, "Sie/sie": v });
    // 5. praesens_fragen
    writeJ('praesens_fragen', v, { praesens_fragen: {} });
    // 6. wortfamilie
    writeJ('wortfamilie', v, { wortfamilie: [] });
});

console.log(`Generated basic files for ${newVerbs.length} new verbs.`);
