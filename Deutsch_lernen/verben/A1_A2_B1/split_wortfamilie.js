const fs = require('fs');
const path = require('path');

const inputFile = path.join(__dirname, 'json/wortfamilie_kompakt.json');
const outputDir = path.join(__dirname, 'json/wortfamilie');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

try {
    const rawData = fs.readFileSync(inputFile, 'utf8');
    const data = JSON.parse(rawData);

    // Handle both potential structures (raw object or wrapped in "verbs")
    const verbsData = data.verbs || data;

    let count = 0;
    for (const [verb, family] of Object.entries(verbsData)) {
        if (verb === 'info') continue; // Skip metadata

        const filePath = path.join(outputDir, `${verb}.json`);
        // Wrap in an object keyed by "wortfamilie" to match what script.js might expect 
        // OR simply array. Let's stick to the array as the content, 
        // but it's safer to have an object structure for extensibility.
        // However, looking at current usage: `wortfamilieData[verb]` returns the array.
        // So fetching `json/wortfamilie/{verb}.json` should probably return just the array
        // or an object `{ "wortfamilie": [...] }`.
        // Let's use `{ "wortfamilie": [...] }` for better JSON practice, 
        // and we'll adapt script.js to read `data.wortfamilie`.

        const fileContent = {
            wortfamilie: family
        };

        fs.writeFileSync(filePath, JSON.stringify(fileContent, null, 2));
        count++;
    }

    console.log(`Successfully split ${count} word families into ${outputDir}`);

} catch (error) {
    console.error('Error splitting file:', error);
}
