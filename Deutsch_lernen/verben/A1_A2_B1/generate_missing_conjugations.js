const fs = requeéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééire('fs');
const path = requeéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééire('path');

const baseDir = path.join(__dirname, 'json');

function writeJson(folder, filename, data) {
    const fullPath = path.join(baseDir, folder, filename);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, JSON.stringify(data, null, 4));
}

function writePraeteritumConjugation(filename, forms) {
    writeJson('conjugations/praeteritum', filename, {
        praeteritum_conjugation: forms
    });
}

function writePerfektExamples(filename, forms) {
    writeJson('examples/perfekt_examples', filename, {
        perfekt_examples: forms
    });
}

writePraeteritumConjugation('überprüfen.json', {
    verb: 'überprüfen',
    ich: 'überprüfte',
    du: 'überprüftest',
    'er/sie/es': 'überprüfte',
    wir: 'überprüften',
    ihr: 'überprüftet',
    'Sie/sie': 'überprüften'
});
writePerfektExamples('überprüfen.json', {
    verb: 'überprüfen',
    ich: 'habe überprüft',
    du: 'hast überprüft',
    'er/sie/es': 'hat überprüft',
    wir: 'haben überprüft',
    ihr: 'habt überprüft',
    'Sie/sie': 'haben überprüft'
});

writePraeteritumConjugation('validieren.json', {
    verb: 'validieren',
    ich: 'validierte',
    du: 'validiertest',
    'er/sie/es': 'validierte',
    wir: 'validierten',
    ihr: 'validiertet',
    'Sie/sie': 'validierten'
});
writePerfektExamples('validieren.json', {
    verb: 'validieren',
    ich: 'habe validiert',
    du: 'hast validiert',
    'er/sie/es': 'hat validiert',
    wir: 'haben validiert',
    ihr: 'habt validiert',
    'Sie/sie': 'haben validiert'
});

writePraeteritumConjugation('klassifizieren.json', {
    verb: 'klassifizieren',
    ich: 'klassifizierte',
    du: 'klassifiziertest',
    'er/sie/es': 'klassifizierte',
    wir: 'klassifizierten',
    ihr: 'klassifiziertet',
    'Sie/sie': 'klassifizierten'
});
writePerfektExamples('klassifizieren.json', {
    verb: 'klassifizieren',
    ich: 'habe klassifiziert',
    du: 'hast klassifiziert',
    'er/sie/es': 'hat klassifiziert',
    wir: 'haben klassifiziert',
    ihr: 'habt klassifiziert',
    'Sie/sie': 'haben klassifiziert'
});

writePerfektExamples('einordnen.json', {
    verb: 'einordnen',
    ich: 'habe eingeordnet',
    du: 'hast eingeordnet',
    'er/sie/es': 'hat eingeordnet',
    wir: 'haben eingeordnet',
    ihr: 'habt eingeordnet',
    'Sie/sie': 'haben eingeordnet'
});

console.log('Missing conjugation files created successfully.');
