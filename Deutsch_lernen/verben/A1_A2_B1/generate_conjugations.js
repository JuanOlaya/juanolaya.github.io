const fs = require('fs');
const path = require('path');

const basePath = path.join(__dirname, 'json');

// --- VERB DATABASE ---
// Format: verb: { type: 'regular'|'strong', aux: 'haben'|'sein', es: '...', en: '...' }
// Default type is 'regular' (weak).
// Default aux is 'haben'.
const verbsDB = {
    // B1.1 Group 1
    'betrinken': { type: 'strong', irregular: true, stem: 'betrank', pp: 'betrunken', aux: 'haben', es: 'emborracharse', en: 'to get drunk', refl: true },

    // B1.1 Group 2
    'schmücken': { es: 'decorar', en: 'to decorate' },
    'verzieren': { es: 'adornar', en: 'to adorn' },
    'erstellen': { es: 'crear/elaborar', en: 'to create/compile' },
    'wünschen': { es: 'desear', en: 'to wish', refl: true }, // sich wünschen (often)
    'sichern': { es: 'asegurar', en: 'to secure/save' },
    'versichern': { es: 'asegurar', en: 'to insure/assure' },

    // B1.1 Group 3
    'forschen': { es: 'investigar', en: 'to research' },
    'erforschen': { es: 'explorar/investigar', en: 'to explore/research' },
    'analysieren': { es: 'analizar', en: 'to analyze' },
    'dokumentieren': { es: 'documentar', en: 'to document' },

    // B1.1 Group 4
    'schützen': { es: 'proteger', en: 'to protect' },
    'verschmutzen': { es: 'contaminar', en: 'to pollute' },
    'verbrauchen': { es: 'consumir', en: 'to consume' },
    'trennen': { es: 'separar', en: 'to separate' },
    'recyceln': { es: 'reciclar', en: 'to recycle' },
    'zerstören': { es: 'destruir', en: 'to destroy' },
    'verzichten': { es: 'renunciar/prescindir', en: 'to renounce/do without' },

    // B1.1 Group 5
    'herunterladen': { type: 'separable', prefix: 'herunter', es: 'descargar', en: 'to download' },
    'hochladen': { type: 'separable', prefix: 'hoch', es: 'subir', en: 'to upload' },
    'löschen': { es: 'borrar', en: 'to delete' },
    'einschalten': { type: 'separable', prefix: 'ein', es: 'encender', en: 'to switch on' },
    'ausschalten': { type: 'separable', prefix: 'aus', es: 'apagar', en: 'to switch off' },
    'klicken': { es: 'hacer clic', en: 'to click' },
    'teilen': { es: 'compartir', en: 'to share' },
    'posten': { es: 'publicar', en: 'to post' },
    'nutzen': { es: 'utilizar', en: 'to use' },

    // B1.1 Group 6
    'auswählen': { type: 'separable', prefix: 'aus', es: 'seleccionar', en: 'to select' },
    'ersetzen': { es: 'reemplazar', en: 'to replace' },
    'einrichten': { type: 'separable', prefix: 'ein', es: 'configurar/amueblar', en: 'to set up/furnish' },

    // B1.1 Group 7
    'wählen': { es: 'elegir/votar', en: 'to choose/vote' },
    'diskutieren': { es: 'discutir', en: 'to discuss' },
    'sich engagieren': { base: 'engagieren', refl: true, es: 'comprometerse', en: 'to get involved' }, // Special handling needed
    'fordern': { es: 'exigir', en: 'to demand' },
    'unterstützen': { es: 'apoyar', en: 'to support', type: 'inseparable' }, // unter-stützen is inseparable often? actually support is inseparable prefix 'unter' usually. 
    'akzeptieren': { es: 'aceptar', en: 'to accept' },
    'überzeugen': { es: 'convencer', en: 'to convince', type: 'inseparable' },
    'respektieren': { es: 'respetar', en: 'to respect' },
    'regieren': { es: 'gobernar', en: 'to govern' },
    'richten': { es: 'dirigir/arreglar', en: 'to direct/fix' },

    // A2.2
    'ausgeben': { type: 'strong', irregular: true, stem: 'gab', pp: 'gegeben', prefix: 'aus', es: 'gastar', en: 'to spend' },
    'schulden': { es: 'deber', en: 'to owe' },
    'erreichen': { es: 'alcanzar', en: 'to reach' },
    'führen': { es: 'liderar/guiar', en: 'to lead' }, // "fuehren" in report
    'wechseln': { es: 'cambiar', en: 'to change' },
    // Reflexive Verben (A2.1 Group 10)
    'wundern': { type: 'regular', es: 'sorprenderse', en: 'to be surprised', refl: true },
    'irren': { type: 'regular', es: 'equivocarse', en: 'to be mistaken', refl: true },
    'beeilen': { type: 'regular', es: 'darse prisa', en: 'to hurry', refl: true },
    'erkälten': { type: 'regular', es: 'resfriarse', en: 'to catch a cold', refl: true },
    'wohlfühlen': { type: 'separable', prefix: 'wohl', es: 'sentirse bien', en: 'to feel good', refl: true },
    'schämen': { type: 'regular', es: 'avergonzarse', en: 'to be ashamed', refl: true },
    'erholen': { type: 'regular', es: 'descansar / recuperarse', en: 'to recover / rest', refl: true },
    'langweilen': { type: 'regular', es: 'aburrirse', en: 'to be bored', refl: true },
    'konzentrieren': { type: 'regular', es: 'concentrarse', en: 'to concentrate', refl: true },
    'kochen': { es: 'cocinar', en: 'to cook' },
    'backen': { type: 'strong', irregular: true, stem: 'backte', pp: 'gebacken', es: 'hornear', en: 'to bake' },
    'wiegen': { type: 'strong', irregular: true, stem: 'wog', pp: 'gewogen', es: 'pesar', en: 'to weigh' },
    'räuchern': { es: 'ahumar', en: 'to smoke (food)' },
    'bauen': { es: 'construir', en: 'to build' },
    'aufbauen': { type: 'separable', prefix: 'auf', es: 'construir/montar', en: 'to build up' },
    'unterrichten': { es: 'enseñar', en: 'to teach', type: 'inseparable' },
    'lösen': { es: 'resolver', en: 'to solve' },
    'einreichen': { type: 'separable', prefix: 'ein', es: 'presentar / entregar', en: 'to submit / to hand in' },

    // A2.1
    'freuen': { es: 'alegrarse', en: 'to be happy', refl: true },
    'füllen': { es: 'llenar', en: 'to fill' },
    'verbieten': { type: 'strong', irregular: true, stem: 'verbot', pp: 'verboten', es: 'prohibir', en: 'to forbid' },
    'verlassen': { type: 'strong', irregular: true, stem: 'verließ', pp: 'verlassen', es: 'abandonar', en: 'to leave' },
    'rauschen': { es: 'susurrar/hacer ruido', en: 'to rustle/rush' },
    'malen': { es: 'pintar', en: 'to paint' },

    // A1.2
    'vertrauen': { es: 'confiar', en: 'to trust' }, // + Dat
    'benutzen': { es: 'usar', en: 'to use' },
    'einsteigen': { type: 'separable', prefix: 'ein', aux: 'sein', es: 'subir (transporte)', en: 'to get on' },
    'aussteigen': { type: 'separable', prefix: 'aus', aux: 'sein', es: 'bajar (transporte)', en: 'to get off' },
    'umsteigen': { type: 'separable', prefix: 'um', aux: 'sein', es: 'hacer transbordo', en: 'to transfer' },
    'abfahren': { type: 'separable', prefix: 'ab', aux: 'sein', type: 'strong', irregular: true, stem: 'fuhr', pp: 'gefahren', es: 'partir/salir', en: 'to depart' },
    'ankommen': { type: 'separable', prefix: 'an', aux: 'sein', type: 'strong', irregular: true, stem: 'kam', pp: 'gekommen', es: 'llegar', en: 'to arrive' },
    'anfahren': { type: 'separable', prefix: 'an', aux: 'sein', type: 'strong', irregular: true, stem: 'fuhr', pp: 'gefahren', es: 'arrancar/atropellar', en: 'to start driving/hit' },
    'buchstabieren': { es: 'deletrear', en: 'to spell' },
    // 'wählen': duplicate
    'sortieren': { es: 'ordenar/clasificar', en: 'to sort' },
    'setzen': { es: 'sentar / colocar / poner', en: 'to sit / to place / to set', refl: true },

    // A1.1
    'aufwachen': { type: 'separable', prefix: 'auf', aux: 'sein', es: 'despertarse', en: 'to wake up' },
    'mittagessen': { type: 'separable', prefix: 'mittag', type: 'strong', irregular: true, stem: 'aß', pp: 'gegessen', es: 'almorzar', en: 'to have lunch' }, // 'essen' inside
    'rufen': { type: 'strong', irregular: true, stem: 'rief', pp: 'gerufen', es: 'llamar', en: 'to call' },
    'grüßen': { es: 'saludar', en: 'to greet' },
    'prüfen': { es: 'examinar/probar', en: 'to test/check' },
    'ziehen': { type: 'strong', irregular: true, stem: 'zog', pp: 'gezogen', es: 'tirar/mudar', en: 'to pull/move' },
    'bewegen': { es: 'mover', en: 'to move' }, // regular usually (emotion is strong, movement regular)
    'empfehlen': { type: 'strong', irregular: true, stem: 'empfahl', pp: 'empfohlen', es: 'recomendar', en: 'to recommend' },
    'fangen': { type: 'strong', irregular: true, stem: 'fing', pp: 'gefangen', es: 'atrapar', en: 'to catch' },
    "räumen": { "es": "Desalojar / Despejar / Vaciar", "en": "To clear / To evacuate", "type": "regular", "aux": "haben" },
};

// Utils
function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

function getStem(infinitive) {
    if (infinitive.endsWith('en')) return infinitive.slice(0, -2);
    if (infinitive.endsWith('n')) return infinitive.slice(0, -1);
    return infinitive;
}

function generatePraesens(verb, data) {
    let stem = getStem(verb.replace(data.prefix || '', ''));
    if (data.prefix) {
        // Handle separable prefix for 'ich mache auf' -> 'mache' is stem
    }

    // Basic endings
    let e = 'e', st = 'st', t = 't', en = 'en';

    // Adjustments for stems ending in el, er (wir/sie/Sie -> n)
    if (stem.endsWith('el') || stem.endsWith('er')) {
        en = 'n';
    }

    // Adjustments for stems ending in t, d, m, n
    if (stem.endsWith('t') || stem.endsWith('d') || stem.endsWith('ffn') || stem.endsWith('chn')) {
        st = 'est'; t = 'et';
    }
    // Adjustments for s, ss, ß, z (du form)
    if (stem.endsWith('s') || stem.endsWith('ss') || stem.endsWith('ß') || stem.endsWith('z')) {
        st = 't';
    }

    // Handle strong verbs vowel change (a -> ä, e -> i/ie) - SIMPLIFIED for automation
    // We might miss some. Ideally we need a full conjugator or more manual data.
    // For now, we will assume regular unless marked 'strong' but even then we need specific forms.
    // I will hardcode common strong changes if possible or accept regular as placeholder for now if data missing.

    // Manual overrides for known strong verbs in list
    let du_stem = stem;
    let er_stem = stem;

    // TODO: Add vowel changes logic if needed. 
    // e.g. fahren -> fährst
    if (verb === 'abfahren' || verb === 'anfahren') { du_stem = 'fähr'; er_stem = 'fähr'; }
    if (verb === 'lassen' || verb === 'verlassen') { du_stem = 'lässt'; er_stem = 'lässt'; st = 'est'; } // irregular
    if (verb === 'lesen') { du_stem = 'lies'; er_stem = 'lies'; }
    if (verb === 'empfehlen') { du_stem = 'empfiehl'; er_stem = 'empfiehl'; }
    if (verb === 'fangen') { du_stem = 'fäng'; er_stem = 'fäng'; }

    let prefix_suffix = data.prefix ? ` ${data.prefix}` : '';

    let suffix = (key) => (data.refl ? ref[key] : '');
    // Need ref defined? No, pass it or refactor. 
    // Easier: refactor generatePraesens to accept data AND ref map? Or just handle inside.
    const refl = data.refl ? { "ich": " mich", "du": " dich", "er": " sich", "sie": " sich", "es": " sich", "wir": " uns", "ihr": " euch", "sie (plural)": " sich", "Sie (formal)": " sich" } :
        { "ich": "", "du": "", "er": "", "sie": "", "es": "", "wir": "", "ihr": "", "sie (plural)": "", "Sie (formal)": "" };

    return {
        "ich": `${stem}${e}${prefix_suffix}${refl['ich']}`,
        "du": `${du_stem}${st}${prefix_suffix}${refl['du']}`,
        "er": `${er_stem}${t}${prefix_suffix}${refl['er']}`,
        "sie": `${er_stem}${t}${prefix_suffix}${refl['sie']}`,
        "es": `${er_stem}${t}${prefix_suffix}${refl['es']}`,
        "wir": `${stem}${en}${prefix_suffix}${refl['wir']}`,
        "ihr": `${stem}${t}${prefix_suffix}${refl['ihr']}`,
        "sie (plural)": `${stem}${en}${prefix_suffix}${refl['sie (plural)']}`,
        "Sie (formal)": `${stem}${en}${prefix_suffix}${refl['Sie (formal)']}`
    };
}

function generatePraeteritum(verb, data) {
    let stem = getStem(verb.replace(data.prefix || '', ''));
    let part1 = stem;
    let ending_ich = 'te';

    if (data.type === 'strong' && data.stem) {
        part1 = data.stem;
        ending_ich = ''; // strong verbs irregular past stem often no ending for ich/er/es
    } else {
        // Regular
        if (stem.endsWith('t') || stem.endsWith('d') || stem.endsWith('ffn') || stem.endsWith('chn')) {
            ending_ich = 'ete';
        }
    }

    let ich_form = `${part1}${ending_ich}`;
    let du_form = `${part1}${ending_ich}st`;
    let er_form = ich_form;
    let wir_form = `${part1}${ending_ich}n`;
    let ihr_form = `${part1}${ending_ich}t`;
    let sie_form = `${part1}${ending_ich}n`;

    if (data.type === 'strong' && data.stem) {
        // Strong endings: -, st, -, en, t, en attached to irregular stem
        du_form = `${part1}st`;
        wir_form = `${part1}en`;
        ihr_form = `${part1}t`;
        sie_form = `${part1}en`;
        // adjustments
        if (part1.endsWith('e')) { wir_form = `${part1}n`; sie_form = `${part1}n`; }
        if (part1.endsWith('s') || part1.endsWith('ß')) { du_form = `${part1}est`; } // sometimes
    }

    let prefix_suffix = data.prefix ? ` ${data.prefix}` : '';

    const refl = data.refl ? { "ich": " mich", "du": " dich", "er": " sich", "sie": " sich", "es": " sich", "wir": " uns", "ihr": " euch", "sie (plural)": " sich", "Sie (formal)": " sich" } :
        { "ich": "", "du": "", "er": "", "sie": "", "es": "", "wir": "", "ihr": "", "sie (plural)": "", "Sie (formal)": "" };

    return {
        "ich": `${ich_form}${prefix_suffix}${refl['ich']}`,
        "du": `${du_form}${prefix_suffix}${refl['du']}`,
        "er": `${er_form}${prefix_suffix}${refl['er']}`,
        "sie": `${er_form}${prefix_suffix}${refl['sie']}`,
        "es": `${er_form}${prefix_suffix}${refl['es']}`,
        "wir": `${wir_form}${prefix_suffix}${refl['wir']}`,
        "ihr": `${ihr_form}${prefix_suffix}${refl['ihr']}`,
        "sie (plural)": `${sie_form}${prefix_suffix}${refl['sie (plural)']}`,
        "Sie (formal)": `${sie_form}${prefix_suffix}${refl['Sie (formal)']}`
    };
}

// --- GENERATION FUNCTIONS ---

function generatePerfekt(verb, data) {
    const perfect_aux = data.aux || 'haben';
    const perfect_pp = data.pp || ('ge' + getStem(verb.replace(data.prefix || '', '')) + 't');

    // We only need a few examples for the valid format
    // But importantly, the file should be a JSON array of objects

    const examples = [
        {
            "de": `Ich ${perfect_aux} ... ${perfect_pp}.`,
            "es": `(Ejemplo perfecto 1)`,
            "phonetics": "",
            "explanation": "<li><b>Automatisch generiert:</b> Ejemplo 1."
        },
        {
            "de": `Du ${perfect_aux === 'sein' ? 'bist' : 'hast'} ... ${perfect_pp}.`,
            "es": `(Ejemplo perfecto 2)`,
            "phonetics": "",
            "explanation": "<li><b>Automatisch generiert:</b> Ejemplo 2."
        }
    ];
    return examples;
}

function generateQuestions(verb, data) {
    const p = generatePraesens(verb, data);
    return {
        "praesens_fragen": {
            "ich": { "de": `Was ${p.ich}?`, "en": `What do I ${data.en.split('/')[0]}?`, "es": `¿Qué ${data.es.split('/')[0]} (yo)?` },
            "du": { "de": `Wann ${p.du}?`, "en": `When do you ${data.en.split('/')[0]}?`, "es": `¿Cuándo ${data.es.split('/')[0]} (tú)?` },
            "er": { "de": `Warum ${p.er}?`, "en": `Why does he ${data.en.split('/')[0]}?`, "es": `¿Por qué ${data.es.split('/')[0]} (él)?` },
            "sie": { "de": `Wie ${p.sie}?`, "en": `How does she ${data.en.split('/')[0]}?`, "es": `¿Cómo ${data.es.split('/')[0]} (ella)?` },
            "es": { "de": `Wo ${p.es}?`, "en": `Where does it ${data.en.split('/')[0]}?`, "es": `¿Dónde ${data.es.split('/')[0]} (eso)?` },
            "wir": { "de": `Wen ${p.wir}?`, "en": `Whom do we ${data.en.split('/')[0]}?`, "es": `¿A quién ${data.es.split('/')[0]} (nosotros)?` },
            "ihr": { "de": `Was ${p.ihr}?`, "en": `What do you ${data.en.split('/')[0]}?`, "es": `¿Qué ${data.es.split('/')[0]} (vosotros)?` },
            "sie (plural)": { "de": `Wie oft ${p['sie (plural)']}?`, "en": `How often do they ${data.en.split('/')[0]}?`, "es": `¿Con qué frecuencia ${data.es.split('/')[0]} (ellos)?` },
            "Sie (formal)": { "de": `Wann ${p['Sie (formal)']}?`, "en": `When do you ${data.en.split('/')[0]}?`, "es": `¿Cuándo ${data.es.split('/')[0]} (usted)?` }
        }
    };
}

async function generateAll() {
    console.log("Starting generation...");
    let createdCount = 0;

    // Ensure base directories exist
    const subDirs = [
        'cards',
        'conjugations/praesens',
        'conjugations/praeteritum',
        'examples/praesens_examples',
        'examples/praesens_question_examples',
        'examples/perfekt_examples',
        'examples/praeteritum_examples'
    ];
    subDirs.forEach(dir => {
        const fullPath = path.join(basePath, dir);
        if (!fs.existsSync(fullPath)) {
            fs.mkdirSync(fullPath, { recursive: true });
            console.log(`Created directory: ${fullPath}`);
        }
    });

    for (const [verb, data] of Object.entries(verbsDB)) {
        let fileVerb = verb.replace('sich ', '');
        let genVerb = fileVerb;

        // Special handling for 'sich engagieren' to preserve filename but generate correctly
        if (verb === 'sich engagieren') {
            fileVerb = 'sich engagieren';
            genVerb = 'engagieren';
        }

        // Ref pronouns mapping
        const ref = {
            "ich": " mich", "du": " dich", "er": " sich", "sie": " sich", "es": " sich",
            "wir": " uns", "ihr": " euch", "sie (plural)": " sich", "Sie (formal)": " sich"
        };


        // 1. CARDS
        const cardPath = path.join(basePath, 'cards', `${fileVerb}.json`);
        if (!fs.existsSync(cardPath)) {
            const perfect_aux = data.aux || 'haben';
            const perfect_pp = data.pp || ('ge' + getStem(genVerb) + 't');
            const praeteritum_full = data.stem ? `er/sie/es ${data.stem}` : `er/sie/es ${getStem(genVerb)}te`;

            const cardJson = {
                verb: fileVerb,
                perfekt: `${perfect_aux} ${perfect_pp}`,
                praeteritum: praeteritum_full,
                emoji: '📝',
                es: data.es,
                en_verb: data.en,
                level: 'B1.1', // Placeholder
                theme: 'Automated',
                group: 1,
                irregularPraesens: data.type === 'strong'
            };
            // Ensure optional fields are handled or minimal dummy data
            fs.writeFileSync(cardPath, JSON.stringify(cardJson, null, 2));
            console.log(`Created card for ${fileVerb}`);
            createdCount++;
        }

        // 2. PRAESENS
        const praesensConjugationPath = path.join(basePath, 'conjugations/praesens', `${fileVerb}.json`);
        const praesensExamplesPath = path.join(basePath, 'examples/praesens_examples', `${fileVerb}.json`);
        if (true || !fs.existsSync(praesensConjugationPath) || !fs.existsSync(praesensExamplesPath)) {
            const p = generatePraesens(genVerb, data);
            const customReflexiveExamples = {
                "freuen": {
                    "ich": { es: "Me alegro.", en: "I am happy." },
                    "du": { es: "Te alegras.", en: "You are happy." },
                    "er": { es: "Se alegra.", en: "He is happy." },
                    "sie": { es: "Se alegra.", en: "She is happy." },
                    "es": { es: "Se alegra.", en: "It is happy." },
                    "wir": { es: "Nos alegramos.", en: "We are happy." },
                    "ihr": { es: "Os alegráis.", en: "You are happy." },
                    "sie (plural)": { es: "Se alegran.", en: "They are happy." },
                    "Sie (formal)": { es: "Se alegra.", en: "You are happy." }
                },
                "setzen": {
                    "ich": { es: "Me siento (colocarse).", en: "I sit down." },
                    "du": { es: "Te sientas.", en: "You sit down." },
                    "er": { es: "Se sienta.", en: "He sits down." },
                    "sie": { es: "Se sienta.", en: "She sits down." },
                    "es": { es: "Se sienta.", en: "It sits down." },
                    "wir": { es: "Nos sentamos.", en: "We sit down." },
                    "ihr": { es: "Os sentáis.", en: "You sit down." },
                    "sie (plural)": { es: "Se sientan.", en: "They sit down." },
                    "Sie (formal)": { es: "Se sienta.", en: "You sit down." }
                },
                "wundern": {
                    "ich": { es: "Me sorprendo.", en: "I am surprised." },
                    "du": { es: "Te sorprendes.", en: "You are surprised." },
                    "er": { es: "Se sorprende.", en: "He is surprised." },
                    "sie": { es: "Se sorprende.", en: "She is surprised." },
                    "es": { es: "Se sorprende.", en: "It is surprised." },
                    "wir": { es: "Nos sorprendemos.", en: "We are surprised." },
                    "ihr": { es: "Os sorprendéis.", en: "You are surprised." },
                    "sie (plural)": { es: "Se sorprenden.", en: "They are surprised." },
                    "Sie (formal)": { es: "Se sorprende.", en: "You are surprised." }
                },
                "irren": {
                    "ich": { es: "Me equivoco.", en: "I am mistaken." },
                    "du": { es: "Te equivocas.", en: "You are mistaken." },
                    "er": { es: "Se equivoca.", en: "He is mistaken." },
                    "sie": { es: "Se equivoca.", en: "She is mistaken." },
                    "es": { es: "Se equivoca.", en: "It is mistaken." },
                    "wir": { es: "Nos equivocamos.", en: "We are mistaken." },
                    "ihr": { es: "Os equivocáis.", en: "You are mistaken." },
                    "sie (plural)": { es: "Se equivocan.", en: "They are mistaken." },
                    "Sie (formal)": { es: "Se equivoca.", en: "You are mistaken." }
                },
                "beeilen": {
                    "ich": { es: "Me doy prisa.", en: "I hurry." },
                    "du": { es: "Te das prisa.", en: "You hurry." },
                    "er": { es: "Se da prisa.", en: "He hurries." },
                    "sie": { es: "Se da prisa.", en: "She hurries." },
                    "es": { es: "Se da prisa.", en: "It hurries." },
                    "wir": { es: "Nos damos prisa.", en: "We hurry." },
                    "ihr": { es: "Os dais prisa.", en: "You hurry." },
                    "sie (plural)": { es: "Se dan prisa.", en: "They hurry." },
                    "Sie (formal)": { es: "Se da prisa.", en: "You hurry." }
                },
                "erkälten": {
                    "ich": { es: "Me resfrío.", en: "I catch a cold." },
                    "du": { es: "Te resfrías.", en: "You catch a cold." },
                    "er": { es: "Se resfría.", en: "He catches a cold." },
                    "sie": { es: "Se resfría.", en: "She catches a cold." },
                    "es": { es: "Se resfría.", en: "It catches a cold." },
                    "wir": { es: "Nos resfriamos.", en: "We catch a cold." },
                    "ihr": { es: "Os resfriáis.", en: "You catch a cold." },
                    "sie (plural)": { es: "Se resfrían.", en: "They catch a cold." },
                    "Sie (formal)": { es: "Se resfría.", en: "You catch a cold." }
                },
                "wohlfühlen": {
                    "ich": { es: "Me siento bien.", en: "I feel good." },
                    "du": { es: "Te sientes bien.", en: "You feel good." },
                    "er": { es: "Se siente bien.", en: "He feels good." },
                    "sie": { es: "Se siente bien.", en: "She feels good." },
                    "es": { es: "Se siente bien.", en: "It feels good." },
                    "wir": { es: "Nos sentimos bien.", en: "We feel good." },
                    "ihr": { es: "Os sentís bien.", en: "You feel good." },
                    "sie (plural)": { es: "Se sienten bien.", en: "They feel good." },
                    "Sie (formal)": { es: "Se siente bien.", en: "You feel good." }
                },
                "schämen": {
                    "ich": { es: "Me avergüenzo.", en: "I am ashamed." },
                    "du": { es: "Te avergüenzas.", en: "You are ashamed." },
                    "er": { es: "Se avergüenza.", en: "He is ashamed." },
                    "sie": { es: "Se avergüenza.", en: "She is ashamed." },
                    "es": { es: "Se avergüenza.", en: "It is ashamed." },
                    "wir": { es: "Nos avergonzamos.", en: "We are ashamed." },
                    "ihr": { es: "Os avergonzáis.", en: "You are ashamed." },
                    "sie (plural)": { es: "Se avergüenzan.", en: "They are ashamed." },
                    "Sie (formal)": { es: "Se avergüenza.", en: "You are ashamed." }
                },
                "erholen": {
                    "ich": { es: "Me recupero.", en: "I recover." },
                    "du": { es: "Te recuperas.", en: "You recover." },
                    "er": { es: "Se recupera.", en: "He recovers." },
                    "sie": { es: "Se recupera.", en: "She recovers." },
                    "es": { es: "Se recupera.", en: "It recovers." },
                    "wir": { es: "Nos recuperamos.", en: "We recover." },
                    "ihr": { es: "Os recuperáis.", en: "You recover." },
                    "sie (plural)": { es: "Se recuperan.", en: "They recover." },
                    "Sie (formal)": { es: "Se recupera.", en: "You recover." }
                },
                "langweilen": {
                    "ich": { es: "Me aburro.", en: "I am bored." },
                    "du": { es: "Te aburres.", en: "You are bored." },
                    "er": { es: "Se aburre.", en: "He is bored." },
                    "sie": { es: "Se aburre.", en: "She is bored." },
                    "es": { es: "Se aburre.", en: "It is bored." },
                    "wir": { es: "Nos aburrimos.", en: "We are bored." },
                    "ihr": { es: "Os aburrís.", en: "You are bored." },
                    "sie (plural)": { es: "Se aburren.", en: "They are bored." },
                    "Sie (formal)": { es: "Se aburre.", en: "You are bored." }
                },
                "konzentrieren": {
                    "ich": { es: "Me concentro.", en: "I concentrate." },
                    "du": { es: "Te concentras.", en: "You concentrate." },
                    "er": { es: "Se concentra.", en: "He concentrates." },
                    "sie": { es: "Se concentra.", en: "She concentrates." },
                    "es": { es: "Se concentra.", en: "It concentrates." },
                    "wir": { es: "Nos concentramos.", en: "We concentrate." },
                    "ihr": { es: "Os concentráis.", en: "You concentrate." },
                    "sie (plural)": { es: "Se concentran.", en: "They concentrate." },
                    "Sie (formal)": { es: "Se concentra.", en: "You concentrate." }
                }
            };

            let examples = {
                "ich": { "de": `Ich ${p.ich}.`, "es": `Yo ${data.es.split('/')[0]}.`, "en": `I ${data.en.split('/')[0]}.` },
                "du": { "de": `Du ${p.du}.`, "es": `Tú ${data.es.split('/')[0]}.`, "en": `You ${data.en.split('/')[0]}.` },
                "er": { "de": `Er ${p.er}.`, "es": `Él ${data.es.split('/')[0]}.`, "en": `He ${data.en.split('/')[0]}.` },
                "sie": { "de": `Sie ${p.sie}.`, "es": `Ella ${data.es.split('/')[0]}.`, "en": `She ${data.en.split('/')[0]}.` },
                "es": { "de": `Es ${p.es}.`, "es": `Eso ${data.es.split('/')[0]}.`, "en": `It ${data.en.split('/')[0]}.` },
                "wir": { "de": `Wir ${p.wir}.`, "es": `Nosotros ${data.es.split('/')[0]}.`, "en": `We ${data.en.split('/')[0]}.` },
                "ihr": { "de": `Ihr ${p.ihr}.`, "es": `Vosotros ${data.es.split('/')[0]}.`, "en": `You ${data.en.split('/')[0]}.` },
                "sie (plural)": { "de": `Sie ${p['sie (plural)']}.`, "es": `Ellos ${data.es.split('/')[0]}.`, "en": `They ${data.en.split('/')[0]}.` },
                "Sie (formal)": { "de": `Sie ${p['Sie (formal)']}.`, "es": `Usted ${data.es.split('/')[0]}.`, "en": `You ${data.en.split('/')[0]}.` }
            };

            if (customReflexiveExamples[fileVerb]) {
                const custom = customReflexiveExamples[fileVerb];
                Object.keys(examples).forEach(key => {
                    examples[key].es = custom[key].es;
                    examples[key].en = custom[key].en;
                });
            }

            fs.writeFileSync(praesensConjugationPath, JSON.stringify({ praesens: p }, null, 2));
            fs.writeFileSync(praesensExamplesPath, JSON.stringify({ praesens_examples: examples }, null, 2));
            console.log(`Created praesens for ${fileVerb}`);
            createdCount++;
        }

        // 3. PRAETERITUM (KONJUGATION)
        const praetConjugationPath = path.join(basePath, 'conjugations/praeteritum', `${fileVerb}.json`);
        const praetExamplesPath = path.join(basePath, 'examples/praeteritum_examples', `${fileVerb}.json`);
        if (true || !fs.existsSync(praetConjugationPath) || !fs.existsSync(praetExamplesPath)) {
            const p = generatePraeteritum(genVerb, data);
            fs.writeFileSync(praetConjugationPath, JSON.stringify({ praeteritum: p }, null, 2));
            fs.writeFileSync(praetExamplesPath, JSON.stringify({
                praeteritum_examples: {
                    "ich": { "de": `Ich ${p.ich} gestern.`, "es": `Yo ${data.es.split('/')[0]} ayer.`, "en": `I ${data.en.split('/')[0]} yesterday.` },
                    "du": { "de": `Du ${p.du}.`, "es": `...`, "en": `...` },
                    "er": { "de": `Er ${p.er}.`, "es": `...`, "en": `...` },
                    "sie": { "de": `Sie ${p.sie}.`, "es": `...`, "en": `...` },
                    "es": { "de": `Es ${p.es}.`, "es": `...`, "en": `...` },
                    "wir": { "de": `Wir ${p.wir}.`, "es": `...`, "en": `...` },
                    "ihr": { "de": `Ihr ${p.ihr}.`, "es": `...`, "en": `...` },
                    "sie (plural)": { "de": `Sie ${p['sie (plural)']}.`, "es": `...`, "en": `...` },
                    "Sie (formal)": { "de": `Sie ${p['Sie (formal)']}.`, "es": `...`, "en": `...` }
                }
            }, null, 2));
            console.log(`Created praeteritum for ${fileVerb}`);
            createdCount++;
        }

        // 4. PERFEKT EXAMPLES
        const perfExamplesPath = path.join(basePath, 'examples/perfekt_examples', `${fileVerb}.json`);
        if (true || !fs.existsSync(perfExamplesPath)) {
            const perfect_aux = data.aux || 'haben';
            const perfect_pp = data.pp || ('ge' + getStem(genVerb) + 't');

            const json = {
                perfekt_examples: {
                    "ich": { "de": `Ich ${perfect_aux} ... ${perfect_pp}.`, "es": `(Perfekt Ich)`, "en": `(Perfect I)` },
                    "du": { "de": `Du ${perfect_aux === 'sein' ? 'bist' : 'hast'} ... ${perfect_pp}.`, "es": `(Perfekt Du)`, "en": `(Perfect You)` },
                    "er": { "de": `Er ${perfect_aux === 'sein' ? 'ist' : 'hat'} ... ${perfect_pp}.`, "es": `(Perfekt Er)`, "en": `(Perfect He)` },
                    "sie": { "de": `Sie ${perfect_aux === 'sein' ? 'ist' : 'hat'} ... ${perfect_pp}.`, "es": `(Perfekt Sie)`, "en": `(Perfect She)` },
                    "es": { "de": `Es ${perfect_aux === 'sein' ? 'ist' : 'hat'} ... ${perfect_pp}.`, "es": `(Perfekt Es)`, "en": `(Perfect It)` },
                    "wir": { "de": `Wir ${perfect_aux === 'sein' ? 'sind' : 'haben'} ... ${perfect_pp}.`, "es": `(Perfekt Wir)`, "en": `(Perfect We)` },
                    "ihr": { "de": `Ihr ${perfect_aux === 'sein' ? 'seid' : 'habt'} ... ${perfect_pp}.`, "es": `(Perfekt Ihr)`, "en": `(Perfect You Pl)` },
                    "sie (plural)": { "de": `Sie ${perfect_aux === 'sein' ? 'sind' : 'haben'} ... ${perfect_pp}.`, "es": `(Perfekt Sie Pl)`, "en": `(Perfect They)` },
                    "Sie (formal)": { "de": `Sie ${perfect_aux === 'sein' ? 'sind' : 'haben'} ... ${perfect_pp}.`, "es": `(Perfekt Sie Formal)`, "en": `(Perfect You Formal)` }
                }
            };
            fs.writeFileSync(perfExamplesPath, JSON.stringify(json, null, 2));
            console.log(`Created perfekt_examples for ${fileVerb}`);
            createdCount++;
        }

        // 5. QUESTIONS (praesens_fragen)
        const questPath = path.join(basePath, 'examples/praesens_question_examples', `${fileVerb}.json`);
        if (true || !fs.existsSync(questPath)) {
            const json = generateQuestions(genVerb, data);
            fs.writeFileSync(questPath, JSON.stringify(json, null, 2));
            console.log(`Created praesens_question_examples for ${fileVerb}`);
            createdCount++;
        }

    }
    console.log(`Generation complete. Created/Updated ${createdCount} files.`);
}

generateAll();
