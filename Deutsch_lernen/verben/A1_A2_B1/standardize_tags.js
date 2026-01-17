const fs = require('fs');
const path = require('path');

const cardsDir = path.join(__dirname, 'json', 'cards');
const files = fs.readdirSync(cardsDir);

console.log('--- Starting Tag Standardization ---');

let updatedCount = 0;

files.forEach(file => {
    if (!file.endsWith('.json')) return;

    const filePath = path.join(cardsDir, file);
    const content = fs.readFileSync(filePath, 'utf8');

    try {
        let data = JSON.parse(content);
        const oldTags = data.case_tags || [];
        let newTags = [];

        // 1. CASE MAPPING
        if (oldTags.includes('akk')) newTags.push('Akkusativ');
        if (oldTags.includes('dat')) newTags.push('Dativ');
        if (oldTags.includes('dat_akk')) {
            newTags.push('Dativ');
            newTags.push('Akkusativ');
        }
        if (oldTags.includes('nom')) newTags.push('Nominativ');

        // 2. REFLEXIVITY MAPPING
        if (oldTags.includes('reflexive') || oldTags.includes('reflexiv') || oldTags.includes('💡 reflexive') || (data.emoji === '💡')) {
            if (!newTags.includes('Reflexive')) newTags.push('Reflexive');
        }

        // 3. STRUCTURE MAPPING
        // Detect Separable
        if (oldTags.includes('sep') || (data.prefix && data.prefix !== '')) {
            if (!newTags.includes('Separable')) newTags.push('Separable');
        }
        // Detect Irregular (Regular is default, so maybe only tag Irregular?)
        if (data.irregularPraesens === true || (data.type === 'strong' || data.type === 'mixed')) {
            if (!newTags.includes('Irregular')) newTags.push('Irregular');
        } else {
            if (!newTags.includes('Regular')) newTags.push('Regular');
        }

        // 4. PREPOSITION MAPPING
        oldTags.forEach(tag => {
            const lower = tag.toLowerCase();
            if (lower.startsWith('prep:')) {
                // e.g. prep:mit+dat -> Präposition: mit (+Dat)
                const parts = tag.replace('prep:', '').split('+');
                const prep = parts[0];
                const caseSuffix = parts[1] ? ` (+${parts[1].charAt(0).toUpperCase() + parts[1].slice(1)})` : '';
                newTags.push(`Präposition: ${prep}${caseSuffix}`);
            }
        });

        // Preserve clean tags, remove duplicates
        data.case_tags = [...new Set(newTags)];

        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        updatedCount++;

    } catch (e) {
        console.error(`Error processing ${file}:`, e.message);
    }
});

console.log(`Standardization Complete. Updated ${updatedCount} files.`);
