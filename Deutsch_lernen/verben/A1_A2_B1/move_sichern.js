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
                // Ensure specific requested composition:
                // löschen, speichern, sichern, erstellen, einschalten, ausschalten
                // 'sichern' generally should be right after 'speichern' if possible.
                // Rather than generic push, let's inject it explicitly or rewrite the array exactly as asked
                
                const exactOrder = ["löschen", "speichern", "sichern", "erstellen", "einschalten", "ausschalten"];
                group.verbs.push(verb); // push first to satisfy basic criteria
                
                // Re-sort verbs in Daten to match user's explicit request exactly
                group.verbs = exactOrder.filter(v => group.verbs.includes(v));
                
                group.verbCount = group.verbs.length;
                console.log(`Moved ${verb} from ${fromGroup} to ${targetGroupGerman} (${group.level}). Verbs now in group: ${group.verbs.join(', ')}`);
            }
            break;
        }
    }
}

moveVerb('sichern', 'Daten');

fs.writeFileSync(indexFile, JSON.stringify(data, null, 4));
console.log('Batch verb relocation completed successfully.');
