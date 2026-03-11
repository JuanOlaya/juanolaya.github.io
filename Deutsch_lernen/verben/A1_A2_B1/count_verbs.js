const fs = require('fs');

const indexFile = require('path').join(__dirname, 'json', 'verbs_index.json');
const data = JSON.parse(fs.readFileSync(indexFile, 'utf8'));

let totalVerbsCount = 0;
const uniqueVerbs = new Set();
const duplicates = [];

data.groups.forEach(group => {
    group.verbs.forEach(verb => {
        totalVerbsCount++;
        if (uniqueVerbs.has(verb)) {
            duplicates.push(verb);
        } else {
            uniqueVerbs.add(verb);
        }
    });
});

console.log(`Total verbs occurrences: ${totalVerbsCount}`);
console.log(`Unique verbs count: ${uniqueVerbs.size}`);
if (duplicates.length > 0) {
    console.log(`Duplicates found: ${duplicates.join(', ')}`);
} else {
    console.log("No duplicates found.");
}
