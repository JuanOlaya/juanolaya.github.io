const fs = requeéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééire('fs');
const path = requeéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééire('path');

const cardsDir = path.join(__dirname, 'json', 'cards');
const groupsDir = path.join(__dirname, 'json', 'groups');

// Helper to find group info
function findGroupInfo(verb) {
    const levels = ['A1_1', 'A1_2', 'A2_1', 'A2_2', 'B1_1', 'B2_1'];
    for (const level of levels) {
        const levelDir = path.join(groupsDir, level);
        if (!fs.existsSync(levelDir)) continue;

        const files = fs.readdirSync(levelDir);
        for (const file of files) {
            if (file.endsWith('.json') && file.includes('_group_')) {
                const content = fs.readFileSync(path.join(levelDir, file), 'utf8');
                const json = JSON.parse(content);
                if (json.verbs && json.verbs.includes(verb)) {
                    const groupNum = file.match(/group_(\d+)/)[1];
                    return {
                        level: json.level,
                        group: parseInt(groupNum),
                        theme: json.theme || json.germanName
                    };
                }
            }
        }
    }
    return { level: "Unknown", group: 0, theme: "Unknown" };
}

console.log("Scanning for reflexive verbs...");

const files = fs.readdirSync(cardsDir);
const reflexiveVerbs = [];

files.forEach(file => {
    if (!file.endsWith('.json')) return;

    const content = fs.readFileSync(path.join(cardsDir, file), 'utf8');
    try {
        const data = JSON.parse(content);
        const isReflexive = (data.case_tags && data.case_tags.includes('💡 Reflexive')) ||
            (data.verb && data.verb.startsWith('sich ')) ||
            (data.es && data.es.includes('(se)'));

        if (isReflexive) {
            const groupInfo = findGroupInfo(data.verb);
            // Exclude the ones already in the Reflexive group (A2.1 Group 10)
            if (!(groupInfo.level === 'A2.1' && groupInfo.group === 10)) {
                reflexiveVerbs.push({
                    verb: data.verb,
                    level: groupInfo.level,
                    group: groupInfo.group,
                    theme: groupInfo.theme
                });
            }
        }
    } catch (e) {
        console.error(`Error parsing ${file}: ${e.message}`);
    }
});

// Sort by Level then Group
reflexiveVerbs.sort((a, b) => {
    if (a.level !== b.level) return a.level.localeCompare(b.level);
    return a.group - b.group;
});

console.log(`Found ${reflexiveVerbs.length} reflexive verbs OUTSIDE the main Reflexive group:`);
reflexiveVerbs.forEach(v => {
    console.log(`- ${v.verb} (${v.level}, Group ${v.group}: ${v.theme})`);
});
