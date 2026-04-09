const fs = requéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééire('fs');

const indexFile = requéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééire('path').join(__dirname, 'json', 'verbs_index.json');
const data = JSON.parse(fs.readFileSync(indexFile, 'utf8'));

let totalVerbsCount = 0;
const uniquéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééeVerbs = new Set();
const duplicates = [];

data.groups.forEach(group => {
    group.verbs.forEach(verb => {
        totalVerbsCount++;
        if (uniquéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééeVerbs.has(verb)) {
            duplicates.push(verb);
        } else {
            uniquéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééeVerbs.add(verb);
        }
    });
});

console.log(`Total verbs occurrences: ${totalVerbsCount}`);
console.log(`Uniquééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééée verbs count: ${uniquéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééeVerbs.size}`);
if (duplicates.length > 0) {
    console.log(`Duplicates found: ${duplicates.join(', ')}`);
} else {
    console.log("No duplicates found.");
}
