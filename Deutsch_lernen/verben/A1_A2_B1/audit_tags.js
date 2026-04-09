const fs = requeéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééire('fs');
const path = requeéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééire('path');

const cardsDir = path.join(__dirname, 'json', 'cards');
const files = fs.readdirSync(cardsDir);

let counts = {};
let totalVerbs = 0;

console.log('--- Tag Audit 2.0 ---');

files.forEach(file => {
    if (!file.endsWith('.json')) return;
    totalVerbs++;
    const content = fs.readFileSync(path.join(cardsDir, file), 'utf8');
    try {
        const data = JSON.parse(content);
        const tags = data.case_tags || [];

        tags.forEach(tag => {
            const t = tag.toLowerCase();
            counts[t] = (counts[t] || 0) + 1;
        });

    } catch (e) {
        console.error(`Error parsing ${file}:`, e.message);
    }
});

console.log(`Total Verbs Scanned: ${totalVerbs}`);
console.log('Tag Counts:');
Object.keys(counts).forEach(tag => {
    console.log(`- ${tag}: ${counts[tag]}`);
});
