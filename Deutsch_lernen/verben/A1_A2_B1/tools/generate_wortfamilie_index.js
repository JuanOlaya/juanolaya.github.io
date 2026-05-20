const fs = require('fs');
const path = require('path');

const WORTFAMILIE_DIR = path.join(__dirname, '..', 'json', 'wortfamilie');
const OUTPUT_FILE = path.join(__dirname, '..', 'json', 'wortfamilie_index.json');

if (!fs.existsSync(WORTFAMILIE_DIR)) {
    console.error(`Directory not found: ${WORTFAMILIE_DIR}`);
    process.exit(1);
}

const files = fs.readdirSync(WORTFAMILIE_DIR).filter(file => file.endsWith('.json'));
const combinedIndex = {}; // structure: { "Word": { verbs: ["verb1", "verb2"], type: "Noun" } }

console.log(`Processing ${files.length} files...`);

let processedCount = 0;
let wordCount = 0;

files.forEach(file => {
    try {
        const filePath = path.join(WORTFAMILIE_DIR, file);
        const content = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(content);
        const verbName = file.replace('.json', '');

        if (data.wortfamilie && Array.isArray(data.wortfamilie)) {
            data.wortfamilie.forEach(item => {
                const word = item.word;
                const type = item.type;
                const es = item.es;

                if (!word) return;

                if (!combinedIndex[word]) {
                    combinedIndex[word] = {
                        verbs: [],
                        type: type,
                        es: es
                    };
                    wordCount++;
                }

                if (!combinedIndex[word].verbs.includes(verbName)) {
                    combinedIndex[word].verbs.push(verbName);
                }
            });
        }
        processedCount++;
    } catch (err) {
        console.error(`Error processing ${file}:`, err);
    }
});

// Save the index
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(combinedIndex, null, 2), 'utf8');

console.log('Index generation complete.');
console.log(`Files processed: ${processedCount}`);
console.log(`Total unique words indexed: ${wordCount}`);
console.log(`Saved to: ${OUTPUT_FILE}`);
