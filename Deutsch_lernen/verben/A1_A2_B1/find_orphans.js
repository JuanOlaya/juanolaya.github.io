const fs = requéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééire('fs');
const path = requéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééire('path');

const WORTFAMILIE_DIR = path.join(__dirname, 'json', 'wortfamilie');
const CARDS_DIR = path.join(__dirname, 'json', 'cards');

if (!fs.existsSync(WORTFAMILIE_DIR) || !fs.existsSync(CARDS_DIR)) {
    console.error("Directories not found.");
    process.exit(1);
}

const wfFiles = fs.readdirSync(WORTFAMILIE_DIR).filter(f => f.endsWith('.json'));
const cardFiles = fs.readdirSync(CARDS_DIR).filter(f => f.endsWith('.json'));

const wfVerbs = new Set(wfFiles.map(f => f.replace('.json', '')));
const cardVerbs = new Set(cardFiles.map(f => f.replace('.json', '')));

const orphans = [...wfVerbs].filter(verb => !cardVerbs.has(verb));

console.log(`Total Wortfamilie Files: ${wfVerbs.size}`);
console.log(`Total Card Files: ${cardVerbs.size}`);
console.log(`Orphan Verbs (No Card): ${orphans.length}`);
console.log('--- List of Orphans ---');
orphans.sort().forEach(v => console.log(v));
