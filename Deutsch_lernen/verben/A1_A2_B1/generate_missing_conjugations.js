const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'json');

function writeJson(folder, filename, data) {
    const fullPath = path.join(baseDir, folder, filename);
    fs.writeFileSync(fullPath, JSON.stringify(data, null, 4));
}

// 1. überprüfen
writeJson('praeteritum_konjugation', 'überprüfen.json', {
    "verb": "überprüfen",
    "ich": "überprüfte",
    "du": "überprüftest",
    "er/sie/es": "überprüfte",
    "wir": "überprüften",
    "ihr": "überprüftet",
    "Sie/sie": "überprüften"
});
writeJson('perfekt_konjugation', 'überprüfen.json', {
    "verb": "überprüfen",
    "ich": "habe überprüft",
    "du": "hast überprüft",
    "er/sie/es": "hat überprüft",
    "wir": "haben überprüft",
    "ihr": "habt überprüft",
    "Sie/sie": "haben überprüft"
});

// 2. validieren
writeJson('praeteritum_konjugation', 'validieren.json', {
    "verb": "validieren",
    "ich": "validierte",
    "du": "validiertest",
    "er/sie/es": "validierte",
    "wir": "validierten",
    "ihr": "validiertet",
    "Sie/sie": "validierten"
});
writeJson('perfekt_konjugation', 'validieren.json', {
    "verb": "validieren",
    "ich": "habe validiert",
    "du": "hast validiert",
    "er/sie/es": "hat validiert",
    "wir": "haben validiert",
    "ihr": "habt validiert",
    "Sie/sie": "haben validiert"
});

// 3. klassifizieren
writeJson('praeteritum_konjugation', 'klassifizieren.json', {
    "verb": "klassifizieren",
    "ich": "klassifizierte",
    "du": "klassifiziertest",
    "er/sie/es": "klassifizierte",
    "wir": "klassifizierten",
    "ihr": "klassifiziertet",
    "Sie/sie": "klassifizierten"
});
writeJson('perfekt_konjugation', 'klassifizieren.json', {
    "verb": "klassifizieren",
    "ich": "habe klassifiziert",
    "du": "hast klassifiziert",
    "er/sie/es": "hat klassifiziert",
    "wir": "haben klassifiziert",
    "ihr": "habt klassifiziert",
    "Sie/sie": "haben klassifiziert"
});

// 4. einordnen (praeteritum already exists, creating perfekt)
writeJson('perfekt_konjugation', 'einordnen.json', {
    "verb": "einordnen",
    "ich": "habe eingeordnet",
    "du": "hast eingeordnet",
    "er/sie/es": "hat eingeordnet",
    "wir": "haben eingeordnet",
    "ihr": "habt eingeordnet",
    "Sie/sie": "haben eingeordnet"
});

console.log("Missing conjugation files created successfully.");
