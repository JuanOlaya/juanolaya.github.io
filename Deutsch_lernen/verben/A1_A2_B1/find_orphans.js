const fs = require('fs');
const path = require('path');

const cardsDir = path.join(__dirname, 'json/cards');
const groupsDir = path.join(__dirname, 'json/groups');

function getAllFiles(dirPath, arrayOfFiles) {
    const files = fs.readdirSync(dirPath);

    arrayOfFiles = arrayOfFiles || [];

    files.forEach(function (file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
        } else {
            arrayOfFiles.push(path.join(dirPath, "/", file));
        }
    });

    return arrayOfFiles;
}

// 1. Get all verb names from cards directory
const cardFiles = fs.readdirSync(cardsDir).filter(file => file.endsWith('.json'));
const cardVerbs = new Set(cardFiles.map(file => file.replace('.json', '')));

console.log(`Found ${cardVerbs.size} verb cards.`);

// 2. Get all verbs listed in group files
const groupFiles = getAllFiles(groupsDir).filter(file => file.endsWith('.json'));
const groupedVerbs = new Set();
const verbToGroupMap = new Map();

groupFiles.forEach(file => {
    try {
        const content = fs.readFileSync(file, 'utf8');
        const json = JSON.parse(content);
        if (json.verbs && Array.isArray(json.verbs)) {
            json.verbs.forEach(verb => {
                groupedVerbs.add(verb);
                // Track where each verb is assigned for duplicate checking
                if (!verbToGroupMap.has(verb)) {
                    verbToGroupMap.set(verb, []);
                }
                const relativePath = path.relative(groupsDir, file);
                verbToGroupMap.get(verb).push(relativePath);
            });
        }
    } catch (err) {
        console.error(`Error reading group file ${file}:`, err);
    }
});

console.log(`Found ${groupedVerbs.size} verbs assigned to groups.`);

// 3. Find orphans (cards that are not in any group)
const orphans = [];
cardVerbs.forEach(verb => {
    if (!groupedVerbs.has(verb)) {
        orphans.push(verb);
    }
});

// 4. Find ghosts (verbs in groups that don't have cards)
const ghosts = [];
groupedVerbs.forEach(verb => {
    if (!cardVerbs.has(verb)) {
        ghosts.push(verb);
    }
});

// 5. Find duplicates (verbs assigned to multiple groups)
const duplicates = [];
verbToGroupMap.forEach((groups, verb) => {
    if (groups.length > 1) {
        duplicates.push({ verb, groups });
    }
});

console.log('\n--- ORPHAN VERBS (Card exists, but not in any group) ---');
if (orphans.length > 0) {
    orphans.forEach(verb => console.log(verb));
} else {
    console.log('No orphans found.');
}

console.log('\n--- GHOST VERBS (In group, but no card file) ---');
if (ghosts.length > 0) {
    ghosts.forEach(verb => console.log(verb));
} else {
    console.log('No ghost verbs found.');
}

console.log('\n--- DUPLICATE ASSIGNMENTS (Verb in multiple groups) ---');
if (duplicates.length > 0) {
    duplicates.forEach(dup => {
        console.log(`${dup.verb}: assigned to ${dup.groups.join(', ')}`);
    });
} else {
    console.log('No duplicates found.');
}
