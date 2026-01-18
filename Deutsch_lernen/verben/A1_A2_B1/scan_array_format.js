const fs = require('fs');
const path = require('path');

const verbs = [
    "abnehmen", "aufgeben", "beantragen", "befehlen", "begrüßen", "behandeln", "betrügen", "beurteilen",
    "einmachen", "einziehen", "empfangen", "entschließen", "entstehen", "entwickeln", "erhalten", "erleben",
    "erscheinen", "fallen", "gelingen", "gründen", "hassen", "heilen", "holen", "kritisieren", "kämpfen",
    "kündigen", "loben", "merken", "misslingen", "organisieren", "pflegen", "retten", "scheitern", "senden",
    "siegen", "sinken", "spielen", "springen", "steigen", "treiben", "unterscheiden", "verabschieden",
    "verbinden", "verletzen", "werfen", "widersprechen", "wiederholen", "wirken", "zahlen", "zunehmen",
    "zwingen", "ähneln", "ärgern"
];

const praesensDir = path.join(__dirname, 'json', 'praesens');
console.log('--- Scanning for Array Format ---');

verbs.forEach(verb => {
    const filePath = path.join(praesensDir, `${verb}.json`);
    if (fs.existsSync(filePath)) {
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            const data = JSON.parse(content);
            if (Array.isArray(data)) {
                console.log(`Array Format: ${verb}`);
            }
        } catch (e) {
            console.error(`Error ${verb}: ${e.message}`);
        }
    }
});
