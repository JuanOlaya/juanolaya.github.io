const fs = require('fs');
const path = require('path');

const CARDS_PATH = path.join(__dirname, 'json', 'cards');

const verbTranslations = {
    // A1
    'spielen': 'to play',
    'zahlen': 'to pay',
    // A2
    'holen': 'to fetch/get',
    'wiederholen': 'to repeat',
    'begrüßen': 'to greet',
    'verabschieden': 'to say goodbye/dismiss',
    'merken': 'to notice/remember',
    'organisieren': 'to organize',
    'senden': 'to send/broadcast',
    'werfen': 'to throw',
    'springen': 'to jump',
    'ärgern': 'to annoy/anger',
    'abnehmen': 'to decrease/lose weight',
    'zunehmen': 'to increase/gain weight',
    'steigen': 'to climb/rise',
    // B1
    'beantragen': 'to apply for',
    'entschließen': 'to decide',
    'wickeln': 'to wrap', // wait, entwickeln was the word
    'entwickeln': 'to develop',
    'erhalten': 'to receive/preserve',
    'gründen': 'to found/establish',
    'unterscheiden': 'to distinguish',
    'ähneln': 'to resemble',
    'aufgeben': 'to give up/check in',
    'einziehen': 'to move in',
    'heilen': 'to heal',
    'behandeln': 'to treat/deal with',
    'verletzen': 'to injure',
    'pflegen': 'to care for/nurse',
    'retten': 'to save/rescue',
    'sinken': 'to sink/decrease',
    'empfangen': 'to receive/welcome',
    'kritisieren': 'to criticize',
    'loben': 'to praise',
    'widersprechen': 'to contradict',
    'kündigen': 'to resign/terminate',
    'kämpfen': 'to fight',
    'siegen': 'to win/conquer',
    'wirken': 'to work/have an effect',
    'gelingen': 'to succeed',
    'misslingen': 'to fail',
    // B2
    'befehlen': 'to order/command',
    'betrügen': 'to chat/deceive',
    'beurteilen': 'to judge/assess',
    'entstehen': 'to arise/originate',
    'erscheinen': 'to appear/publish',
    'scheitern': 'to fail',
    'zwingen': 'to force'
};

let updatedCount = 0;

Object.keys(verbTranslations).forEach(verb => {
    const filePath = path.join(CARDS_PATH, `${verb}.json`);
    if (fs.existsSync(filePath)) {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        const newEn = verbTranslations[verb];

        if (data.en_verb !== newEn) {
            console.log(`Updating ${verb}: ${data.en_verb} -> ${newEn}`);
            data.en_verb = newEn;
            fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
            updatedCount++;
        }
    } else {
        console.warn(`File not found: ${verb}`);
    }
});

console.log(`Updated English translations for ${updatedCount} files.`);
