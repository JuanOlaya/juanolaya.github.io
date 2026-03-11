const fs = require('fs');
const path = require('path');

const indexFile = path.join(__dirname, 'json', 'verbs_index.json');
const data = JSON.parse(fs.readFileSync(indexFile, 'utf8'));

data.lastUpdated = new Date().toISOString();

function moveVerb(verb, targetGroupGerman) {
    let fromGroup = "";
    // Remove
    for (let group of data.groups) {
        const idx = group.verbs.indexOf(verb);
        if (idx !== -1) {
            fromGroup = group.groupNameGerman + " (" + group.level + ")";
            group.verbs.splice(idx, 1);
            group.verbCount = group.verbs.length;
            break;
        }
    }
    // Add
    for (let group of data.groups) {
        if (group.groupNameGerman === targetGroupGerman) {
            if (!group.verbs.includes(verb)) {
                group.verbs.push(verb);
                group.verbCount = group.verbs.length;
                console.log(`Moved ${verb} from ${fromGroup} to ${targetGroupGerman} (${group.level}). Verbs now in group: ${group.verbs.join(', ')}`);
            }
            break;
        }
    }
}

moveVerb('bewerten', 'Bewertung');

fs.writeFileSync(indexFile, JSON.stringify(data, null, 4));
console.log('Verb relocation completed successfully.');
