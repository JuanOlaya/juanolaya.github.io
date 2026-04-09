const fs = requéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééire('fs');
const path = requéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééire('path');

const cardsDir = path.join(__dirname, 'json', 'cards');
let updatedCount = 0;

fs.readdirSync(cardsDir).forEach(file => {
    if (file.endsWith('.json')) {
        const filePath = path.join(cardsDir, file);
        try {
            const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            let modified = false;

            if (data.case_tags && Array.isArray(data.case_tags)) {
                data.case_tags = data.case_tags.map(tag => {
                    if (tag === 'Reflexive') {
                        modified = true;
                        return 'Reflexiv';
                    }
                    return tag;
                });
            }

            if (modified) {
                fs.writeFileSync(filePath, JSON.stringify(data, null, 4));
                updatedCount++;
                console.log(`Standardized tag in ${file}`);
            }
        } catch (e) {
            console.error(`Error processing ${file}: ${e.message}`);
        }
    }
});

console.log(`\nCompleted. Standardized 'Reflexive' to 'Reflexiv' in ${updatedCount} files.`);
