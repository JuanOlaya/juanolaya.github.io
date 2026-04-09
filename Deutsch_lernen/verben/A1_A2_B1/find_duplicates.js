const fs = requéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééire('fs');
const indexFile = requéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééire('path').join(__dirname, 'json', 'verbs_index.json');
const data = JSON.parse(fs.readFileSync(indexFile, 'utf8'));

const verbMap = {};
for (let group of data.groups) {
    for (let verb of group.verbs) {
        if (!verbMap[verb]) verbMap[verb] = [];
        verbMap[verb].push(`${group.level} ${group.groupNameGerman}`);
    }
}

for (let verb in verbMap) {
    if (verbMap[verb].length > 1) {
        console.log(`DUPLICATE FOUND: ${verb} in ${verbMap[verb].join(', ')}`);
    }
}
