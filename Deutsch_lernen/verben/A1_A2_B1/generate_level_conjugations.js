const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'json');
const indexFile = path.join(baseDir, 'verbs_index.json');
const outputDir = path.join(baseDir, 'conjugations_bulk');

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

function safeReadJson(filePath) {
    if (!fs.existsSync(filePath)) return {};
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(content);
    } catch (e) {
        console.warn(`Warning: Could not parse ${filePath}`);
        return {};
    }
}

function main() {
    console.log("Loading verbs_index.json...");
    const indexData = safeReadJson(indexFile);
    if (!indexData.groups) {
        console.error("Invalid verbs_index.json");
        return;
    }

    // Map to hold verbs by physical sub-level
    // e.g., 'A1_1': Set of verbs
    const verbsByPhysicalLevel = {};

    indexData.groups.forEach(group => {
        if (!group.level || !group.verbs) return;
        // Physical level is e.g. A1_1 instead of A1.1
        const physicalLevel = String(group.level).replace('.', '_');
        
        if (!verbsByPhysicalLevel[physicalLevel]) {
            verbsByPhysicalLevel[physicalLevel] = new Set();
        }
        
        group.verbs.forEach(v => verbsByPhysicalLevel[physicalLevel].add(v));
    });

    const levels = Object.keys(verbsByPhysicalLevel);
    console.log(`Found ${levels.length} sub-levels: ${levels.join(', ')}`);

    let totalProcessed = 0;

    levels.forEach(level => {
        const verbs = Array.from(verbsByPhysicalLevel[level]);
        const levelData = {};

        console.log(`Processing ${level} with ${verbs.length} verbs...`);

        verbs.forEach(verbName => {
            const praesens = safeReadJson(path.join(baseDir, 'praesens', `${verbName}.json`));
            const praeteritumData = safeReadJson(path.join(baseDir, 'praeteritum_konjugation', `${verbName}.json`));
            const konjunktiv_ii = safeReadJson(path.join(baseDir, 'konjunktiv_ii', `${verbName}.json`));
            const perfekt = safeReadJson(path.join(baseDir, 'perfekt_konjugation', `${verbName}.json`));
            
            // Normalize praeteritum key (script.js renames it to praeteritum_conjugations)
            let praeteritum_conjugations = {};
            if (praeteritumData.praeteritum) {
                praeteritum_conjugations = praeteritumData.praeteritum;
            } else if (praeteritumData.praeteritum_conjugation) {
                praeteritum_conjugations = praeteritumData.praeteritum_conjugation;
            } else if (praeteritumData.praeteritum_conjugations) {
                praeteritum_conjugations = praeteritumData.praeteritum_conjugations;
            }

            const verbObj = {};

            if (praesens.praesens && Object.keys(praesens.praesens).length > 0) {
                verbObj.praesens = praesens.praesens;
            }
            if (Object.keys(praeteritum_conjugations).length > 0) {
                verbObj.praeteritum_conjugations = praeteritum_conjugations;
            }
            if (konjunktiv_ii.konjunktiv_ii && Object.keys(konjunktiv_ii.konjunktiv_ii).length > 0) {
                verbObj.konjunktiv_ii = konjunktiv_ii.konjunktiv_ii;
            }
            if (perfekt.perfekt_examples && Object.keys(perfekt.perfekt_examples).length > 0) {
                verbObj.perfekt_examples = perfekt.perfekt_examples;
            }

            if (Object.keys(verbObj).length > 0) {
                levelData[verbName] = verbObj;
            }
            totalProcessed++;
        });

        const outputPath = path.join(outputDir, `${level}_conjugations.json`);
        fs.writeFileSync(outputPath, JSON.stringify(levelData, null, 2), 'utf8');
        console.log(`Saved ${outputPath}`);
    });

    console.log(`Done! Processed ${totalProcessed} total verbs across all levels.`);
}

main();
