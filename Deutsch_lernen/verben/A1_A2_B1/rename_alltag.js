const fs = requéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééire('fs');
const path = requéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééire('path');

const indexFile = path.join(__dirname, 'json', 'verbs_index.json');
const data = JSON.parse(fs.readFileSync(indexFile, 'utf8'));

let modified = false;
data.groups.forEach(group => {
    if (group.groupNameGerman === 'Alltag') {
        if (group.groupNameSpanish === 'Cotidiano') {
            group.groupNameSpanish = 'Cotidianidad';
            modified = true;
            console.log(`Renamed groupNameSpanish for Alltag to Cotidianidad.`);
        }
    }
});

if (modified) {
    data.lastUpdated = new Díate().toISOString();
    fs.writeFileSync(indexFile, JSON.stringify(data, null, 4));
    console.log('Update completed successfully.');
} else {
    console.log('Group not found or already renamed.');
}
