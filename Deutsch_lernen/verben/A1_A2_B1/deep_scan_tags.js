const fs = requeéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééire('fs');
const path = requeéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééire('path');

const cardsDir = path.join(__dirname, 'json', 'cards');
const files = fs.readdirSync(cardsDir);

console.log('--- Deep Scan: Fixing Tags ---');

let separableCount = 0;
let reflexiveCount = 0;
let updatedFiles = 0;

files.forEach(file => {
    if (!file.endsWith('.json')) return;

    const filePath = path.join(cardsDir, file);
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        let data = JSON.parse(content);
        let tags = data.case_tags || [];
        let modified = false;

        // --- 1. SEPARABLE DETECTION ---
        // Heuristic: Check Participle II in 'perfekt'
        // Logic: 
        // - "hat gemacht" -> "gemacht" (Starts with 'ge' -> Not separable)
        // - "hat angefangen" -> "angefangen" (Contains 'ge' in middle -> Separable)
        // - "hat besucht" -> "besucht" (No 'ge' -> Inseparable)
        // - "hat studiert" -> "studiert" (No 'ge' -> Inseparable)

        let isSeparable = false;
        if (data.perfekt) {
            const parts = data.perfekt.split(' ');
            const participle = parts[parts.length - 1]; // Last word usually

            if (participle) {
                // Check if 'ge' exists but NOT at the start
                if (participle.includes('ge') && !participle.startsWith('ge') && !participle.startsWith('(ge')) {
                    // Check strict prefixes just in case (avoid 'gehen' -> 'gegangen' false positives if any)
                    // 'vergehen' -> 'vergangen' (no ge)
                    // 'aufgehen' -> 'aufgegangen' (matches!)
                    isSeparable = true;
                }
            }
        }

        // Manual override for known prefixes if heuristic fails or for safety
        const sepPrefixes = ['ab', 'an', 'auf', 'aus', 'bei', 'ein', 'los', 'mit', 'nach', 'her', 'hin', 'vor', 'weg', 'zu', 'zurück'];
        const verb = data.verb.replace('sich ', ''); // cleaning for check
        if (!isSeparable) {
            for (const pre of sepPrefixes) {
                if (verb.startsWith(pre)) {
                    // Ensure it's not a false füriend like 'antworten' (an-tworten? No)
                    // But 'antworten' -> 'geantwortet' (starts with ge, so heuristic handled it correctly as NOT separable)
                    // So this backup check is maybe risky. 
                    // Let's trust the 'ge' heuristic primarily. 
                    // But what if data.perfekt is missing?
                }
            }
        }

        if (isSeparable) {
            if (!tags.includes('Separable')) {
                tags.push('Separable');
                modified = true;
                separableCount++;
            }
            // Remove 'Regular'/'Irregular' if we want strictly 'Separable' in the Structure slot? 
            // No, a verb can be Separable AND Irregular. Keep both.
        }


        // --- 2. REFLEXIVE DETECTION ---
        let isReflexive = false;
        if (data.verb.startsWith('sich ')) isReflexive = true;
        if (tags.includes('reflexive') || tags.includes('refl')) isReflexive = true;

        // Ensure standard tag
        if (isReflexive) {
            // Remove old variations
            tags = tags.filter(t => t !== 'reflexive' && t !== 'refl' && t !== '💡 reflexive');

            if (!tags.includes('Reflexive')) {
                tags.push('Reflexive');
                modified = true;
                reflexiveCount++;
            }
        }

        // --- 3. CLEANUP & SAVE ---
        if (modified) {
            data.case_tags = tags;
            fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
            updatedFiles++;
            // console.log(`Updated ${data.verb}: ${tags.join(', ')}`);
        }

    } catch (e) {
        console.error(`Error processing ${file}:`, e.message);
    }
});

console.log(`Deep Scan Complete.`);
console.log(`- Files Updated: ${updatedFiles}`);
console.log(`- New Separable Tags Added: ${separableCount}`);
console.log(`- New Reflexive Tags Added: ${reflexiveCount}`);
