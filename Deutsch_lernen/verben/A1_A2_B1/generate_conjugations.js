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
    'wundern': { type: 'regular', es: 'sorprenderse', en: 'to be surprised', refl: true }, // sich wundern
    'irren': { type: 'regular', es: 'equivocarse', en: 'to be mistaken', refl: true }, // sich irren
    'beeilen': { type: 'regular', es: 'darse prisa', en: 'to hurry', refl: true }, // sich beeilen
    'erkälten': { type: 'regular', es: 'resfriarse', en: 'to catch a cold', refl: true }, // sich erkälten
    'wohlfühlen': { type: 'separable', prefix: 'wohl', es: 'sentirse bien', en: 'to feel good', refl: true }, // sich wohlfühlen
    'schämen': { type: 'regular', es: 'avergonzarse', en: 'to be ashamed', refl: true }, // sich schämen
    'erholen': { type: 'regular', es: 'descansar / recuperarse', en: 'to recover / rest', refl: true }, // sich erholen
    'langweilen': { type: 'regular', es: 'aburrirse', en: 'to be bored', refl: true }, // sich langweilen
    'konzentrieren': { type: 'regular', es: 'concentrarse', en: 'to concentrate', refl: true }, // sich konzentrieren
    'kochen': { es: 'cocinar', en: 'to cook' },
    'backen': { type: 'strong', irregular: true, stem: 'backte', pp: 'gebacken', es: 'hornear', en: 'to bake' }, // backte/buk mixed. 'backte' often regular now. let's stick to regular default or mixed. 
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
    const subDirs = ['cards', 'praesens', 'praeteritum_konjugation', 'perfekt_konjugation', 'praesens_fragen'];
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
        const praesensPath = path.join(basePath, 'praesens', `${fileVerb}.json`);
        if (true || !fs.existsSync(praesensPath)) {
            const p = generatePraesens(genVerb, data);
            const json = {
                praesens: p,
                praesens_examples: {
                    "ich": { "de": `Ich ${p.ich}.`, "es": `Yo ${data.es.split('/')[0]}.`, "en": `I ${data.en.split('/')[0]}.` },
                    "du": { "de": `Du ${p.du}.`, "es": `Tú ${data.es.split('/')[0]}.`, "en": `You ${data.en.split('/')[0]}.` },
                    "er": { "de": `Er ${p.er}.`, "es": `Él ${data.es.split('/')[0]}.`, "en": `He ${data.en.split('/')[0]}.` },
                    "sie": { "de": `Sie ${p.sie}.`, "es": `Ella ${data.es.split('/')[0]}.`, "en": `She ${data.en.split('/')[0]}.` },
                    "es": { "de": `Es ${p.es}.`, "es": `Eso ${data.es.split('/')[0]}.`, "en": `It ${data.en.split('/')[0]}.` },
                    "wir": { "de": `Wir ${p.wir}.`, "es": `Nosotros ${data.es.split('/')[0]}.`, "en": `We ${data.en.split('/')[0]}.` },
                    "ihr": { "de": `Ihr ${p.ihr}.`, "es": `Vosotros ${data.es.split('/')[0]}.`, "en": `You ${data.en.split('/')[0]}.` },
                    "sie (plural)": { "de": `Sie ${p['sie (plural)']}.`, "es": `Ellos ${data.es.split('/')[0]}.`, "en": `They ${data.en.split('/')[0]}.` },
                    "Sie (formal)": { "de": `Sie ${p['Sie (formal)']}.`, "es": `Usted ${data.es.split('/')[0]}.`, "en": `You ${data.en.split('/')[0]}.` }
                }
            };
            fs.writeFileSync(praesensPath, JSON.stringify(json, null, 2));
            console.log(`Created praesens for ${fileVerb}`);
            createdCount++;
        }

        // 3. PRAETERITUM (KONJUGATION)
        const praetPath = path.join(basePath, 'praeteritum_konjugation', `${fileVerb}.json`);
        if (true || !fs.existsSync(praetPath)) {
            const p = generatePraeteritum(genVerb, data);
            const json = {
                praeteritum: p,
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
            };
            fs.writeFileSync(praetPath, JSON.stringify(json, null, 2));
            console.log(`Created praeteritum for ${fileVerb}`);
            createdCount++;
        }

        // 4. PERFEKT EXAMPLES
        const perfKonjPath = path.join(basePath, 'perfekt_konjugation', `${fileVerb}.json`);
        if (true || !fs.existsSync(perfKonjPath)) {
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
            fs.writeFileSync(perfKonjPath, JSON.stringify(json, null, 2));
            console.log(`Created perfekt_konjugation for ${fileVerb}`);
            createdCount++;
        }

        // 5. QUESTIONS (praesens_fragen)
        const questPath = path.join(basePath, 'praesens_fragen', `${fileVerb}.json`);
        if (true || !fs.existsSync(questPath)) {
            const json = generateQuestions(genVerb, data);
            fs.writeFileSync(questPath, JSON.stringify(json, null, 2));
            console.log(`Created praesens_fragen for ${fileVerb}`);
            createdCount++;
        }

    }
    console.log(`Generation complete. Created/Updated ${createdCount} files.`);
}

generateAll();
