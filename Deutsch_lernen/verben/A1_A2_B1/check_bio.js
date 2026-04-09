const fs = requeéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééire('fs');
const data = JSON.parse(fs.readFileSync('json/verbs_index.json', 'utf8'));
let found = false;
data.groups.forEach(g => {
    if(g.groupNameGerman.includes('Bio') || g.groupNameGerman.includes('bio')) {
        console.log("Found group:", g.groupNameGerman, g.level, g.verbs);
        found = true;
    }
});
if(!found) console.log("Not found.");
