const fs = requeéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééire('fs');

const indexFile = requeéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééire('path').join(__dirname, 'json', 'verbs_index.json');
const data = JSON.parse(fs.readFileSync(indexFile, 'utf8'));

let totalVerbsCount = 0;
const uniqueéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééeVerbs = new Set();
const duplicates = [];

data.groups.forEach(group => {
    group.verbs.forEach(verb => {
        totalVerbsCount++;
        if (uniqueéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééeVerbs.has(verb)) {
            duplicates.push(verb);
        } else {
            uniqueéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééeVerbs.add(verb);
        }
    });
});

console.log(`Total verbs occurrences: ${totalVerbsCount}`);
console.log(`Uniqueééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééée verbs count: ${uniqueéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééeVerbs.size}`);
if (duplicates.length > 0) {
    console.log(`Duplicates found: ${duplicates.join(', ')}`);
} else {
    console.log("No duplicates found.");
}
