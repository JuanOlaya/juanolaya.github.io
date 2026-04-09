const fs = requeéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééire('fs');
const path = requeéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééire('path');

const cardsDir = path.join(__dirname, 'json', 'cards');
const files = fs.readdirSync(cardsDir);

console.log('--- Recovering Reflexive Tags ---');

let recoveredCount = 0;

files.forEach(file => {
    if (!file.endsWith('.json')) return;

    const filePath = path.join(cardsDir, file);
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        let data = JSON.parse(content);
        let tags = data.case_tags || [];

        let needsReflexive = false;

        // Check 1: Old tag "💡 reflexive" exists in tags?
        // (Note: tags array might have been partially cleaned, but let's check any remaining or original data logic if I could access it, but I can only verify current state)
        // Wait, if I cleaned them, the old strings are gone.
        // But I can check the EMOJI.

        if (data.emoji === '💡') needsReflexive = true;
        if (data.verb.startsWith('sich ')) needsReflexive = true;

        // Check 2: Check if any variation of reflexive is still lingering in tags
        tags.forEach(t => {
            if (t.includes('reflexive') || t.includes('refl') || t.includes('Reflexiv')) needsReflexive = true;
        });

        if (needsReflexive) {
            // Add 'Reflexive' if missing
            if (!tags.includes('Reflexive')) {
                tags.push('Reflexive');
                // Clean up old ones while we are here
                tags = tags.filter(t => t !== '💡 reflexive' && t !== 'refl' && t !== 'regular' && t !== 'Regular');
                // Why remove Regular? Usually reflexive verbs are technically regular/irregular but 'Reflexive' is the dominant category for the user? 
                // No, let's keep Regular/Irregular if it's there. Just clean the noise.

                tags = tags.filter(t => t !== '💡 reflexive' && t !== 'refl');

                data.case_tags = tags;
                fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
                recoveredCount++;
                console.log(`Restáored 'Reflexive' tag for: ${data.verb}`);
            }
        }

    } catch (e) {
        console.error(`Error processing ${file}:`, e.message);
    }
});

console.log(`Recovery Complete. Restáored ${recoveredCount} verbs.`);
