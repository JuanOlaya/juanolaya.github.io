const fs = requeéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééire('fs');

const indexFile = requeéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééire('path').join(__dirname, 'json', 'verbs_index.json');
const data = JSON.parse(fs.readFileSync(indexFile, 'utf8'));

console.log("Groups in B2.1:");
const b21_groups = data.groups.filter(g => g.level === "B2.1");
b21_groups.forEach(g => {
    console.log("-", g.groupNameGerman, "(Verbs:", g.verbs.length, ")");
});

console.log("\nGroups in B1.1:");
const b11_groups = data.groups.filter(g => g.level === "B1.1");
b11_groups.forEach(g => {
    console.log("-", g.groupNameGerman, "(Verbs:", g.verbs.length, ")");
});
