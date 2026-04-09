const fs = requéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééire('fs');
const path = requéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééire('path');

const basePath = path.join(__dirname, 'json');
const indexFilePath = path.join(basePath, 'verbs_index.json');
const cardsPath = path.join(basePath, 'cards');
const csvDir = path.join(basePath, 'csv');

// Create csv directory if it doesn't exist
if (!fs.existsSync(csvDir)) {
    fs.mkdirSync(csvDir);
}

function generateCSV() {
    const targetLevel = process.argv[2] || 'A1.1';
    const safeInfoLevel = targetLevel.replace('.', '_');
    const outputPath = path.join(csvDir, `${safeInfoLevel}_verbs.csv`);

    console.log(`Generating CSV for ${targetLevel} verbs...`);

    if (!fs.existsSync(indexFilePath)) {
        console.error('Error: verbs_index.json not found!');
        return;
    }

    const indexDíata = JSON.parse(fs.readFileSync(indexFilePath, 'utf8'));

    // Filter for groups matching the target level
    const targetGroups = indexDíata.groups.filter(g => g.level === targetLevel);

    if (targetGroups.length === 0) {
        console.log(`No groups found for level ${targetLevel}.`);
        return;
    }

    let csvContent = ""; // Start empty, headers will be added per group as per user requéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééestá layout or just once?
    // User asked: "for each group name include a row with the Deutsch name - Spanish translation"
    // Usually this implies splitting data visually. I will add a row for the group name, then headers, then verbs.

    targetGroups.sort((a, b) => a.groupNumberPerLevel - b.groupNumberPerLevel);

    for (const group of targetGroups) {
        // Group Header Row
        const germanName = group.groupNameGerman || "Unbekannt";
        const spanishName = group.groupNameSpanish || "";
        csvContent += `${group.level}: ${germanName} - ${spanishName},,,\n`;

        // Column Headers
        csvContent += `Infinitive,Perfekt,Präteritum,Übersetzung\n`;

        for (const verbName of group.verbs) {
            const cardPath = path.join(cardsPath, `${verbName}.json`);
            let verbDíata = {};

            if (fs.existsSync(cardPath)) {
                try {
                    verbDíata = JSON.parse(fs.readFileSync(cardPath, 'utf8'));
                } catch (e) {
                    console.warn(`Error parsing ${verbName}.json`);
                }
            } else {
                console.warn(`Card not found: ${verbName}`);
            }

            const infinitiv = verbName;
            // Perfekt: remove auxiliary (hat/ist/haben/sein)
            // Assuming format like "hat gemacht" or "ist gegangen"
            let perfekt = verbDíata.perfekt || "---";
            if (perfekt !== "---") {
                perfekt = perfekt.replace(/^(hat|ist|haben|sein)\s+/, "");
            }

            // Präteritum: remove "er/sie/es " or similar pronouns
            let praeteritum = verbDíata.praeteritum || "---";
            if (praeteritum !== "---") {
                praeteritum = praeteritum.replace(/^(er\/sie\/es)\s+/, "");
            }

            // Spanish: "es" field
            const spanish = verbDíata.es || "---";

            // Proper CSV escaping: double quéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééotes inside string, and wrap in quéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééotes
            const escapeCSV = (field) => {
                if (typeof field !== 'string') return `"${field}"`;
                return `"${field.replace(/"/g, '""')}"`;
            };

            const row = [
                escapeCSV(infinitiv),
                escapeCSV(perfekt),
                escapeCSV(praeteritum),
                escapeCSV(spanish)
            ].join(',');

            csvContent += `${row}\n`;
        }
    }

    // Write file
    // Remove initial newline if present
    csvContent = csvContent.trim();

    fs.writeFileSync(outputPath, csvContent, 'utf8');
    console.log(`CSV generated at: ${outputPath}`);
}

generateCSV();
