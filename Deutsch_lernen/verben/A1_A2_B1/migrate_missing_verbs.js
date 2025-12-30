const fs = require('fs');
const path = require('path');

const SOURCE_FILE = path.join(__dirname, 'json', 'wortfamilie_A1_B1_complete.json');
const TARGET_DIR = path.join(__dirname, 'json', 'wortfamilie');

if (!fs.existsSync(SOURCE_FILE)) {
    console.error(`Source file not found: ${SOURCE_FILE}`);
    process.exit(1);
}

if (!fs.existsSync(TARGET_DIR)) {
    fs.mkdirSync(TARGET_DIR, { recursive: true });
}

function inferType(wordItem) {
    const word = wordItem.word || '';
    const en = wordItem.en || '';

    // Nouns usually have articles or are capitalized (in German, but here we look for articles key indicators)
    if (word.startsWith('der ') || word.startsWith('die ') || word.startsWith('das ') ||
        word.startsWith('Der ') || word.startsWith('Die ') || word.startsWith('Das ')) {
        return 'noun';
    }

    // English 'to ...' usually implies verb
    if (en.startsWith('to ')) {
        return 'verb';
    }

    // Adjectives/Adverbs are usually lowercase
    // Heuristics: ends in -ig, -lich, -isch, -bar, -sam, -haft are often adjectives
    if (word.endsWith('ig') || word.endsWith('lich') || word.endsWith('isch') || word.endsWith('bar') || word.endsWith('sam') || word.endsWith('haft')) {
        return 'adjective';
    }

    // Default fallback if we can't be sure, though 'adjective' is a safer bet for non-nouns in this specific dataset than 'verb' (which are usually the roots)
    // But check if it looks like a verb (ends in -en)
    if (word.endsWith('en') || word.endsWith('n')) {
        // Could be verb or noun (plural) or adjective
        // If it's lowercase and ends in en, likely verb or adjective.
        // Let's rely on lower case check = adjective/verb
    }

    // Simplistic fallback based on casing
    if (word[0] === word[0].toUpperCase()) {
        return 'noun';
    }

    return 'adjective'; // Common fallback for non-nouns in word families
}

try {
    const rawData = fs.readFileSync(SOURCE_FILE, 'utf8');
    const sourceData = JSON.parse(rawData);

    let verbsData = sourceData;
    if (sourceData.verbs) {
        verbsData = sourceData.verbs;
    }

    const verbKeys = Object.keys(verbsData);
    let createdCount = 0;
    let skippedCount = 0;

    console.log(`Scanning ${verbKeys.length} verbs from complete source...`);

    verbKeys.forEach(verb => {
        // Skip metadata
        if (['info', 'last_updated', 'total_verbs', 'format_note'].includes(verb)) return;

        const targetFile = path.join(TARGET_DIR, `${verb}.json`);

        // Check if file already exists
        if (fs.existsSync(targetFile)) {
            skippedCount++;
            return;
        }

        const familyData = verbsData[verb];

        if (!Array.isArray(familyData)) {
            return;
        }

        // Transform data to include inferred type
        const transformedData = familyData.map(item => {
            const newItem = { ...item };
            if (!newItem.type) {
                newItem.type = inferType(newItem);
            }
            return newItem;
        });

        const newFileContent = {
            wortfamilie: transformedData
        };

        fs.writeFileSync(targetFile, JSON.stringify(newFileContent, null, 2), 'utf8');
        console.log(`Created ${verb}.json`);
        createdCount++;
    });

    console.log(`Migration complete.`);
    console.log(`Created: ${createdCount}`);
    console.log(`Skipped (already existed): ${skippedCount}`);

} catch (err) {
    console.error('Error during migration:', err);
}
