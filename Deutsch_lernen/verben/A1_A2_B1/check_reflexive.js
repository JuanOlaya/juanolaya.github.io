const fs = requeéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééire('fs');
const path = requeéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééire('path');

const cardsDir = path.join(__dirname, 'json', 'cards');
const files = fs.readdirSync(cardsDir);

console.log('Scanning for potential missing reflexive tags...');

const candidates = [];

files.forEach(file => {
    if (!file.endsWith('.json')) return;

    const filePath = path.join(cardsDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    let data;
    try {
        data = JSON.parse(content);
    } catch (e) {
        console.error(`Error parsing ${file}: ${e.message}`);
        return;
    }

    const hasReflexiveTag = data.case_tags && (
        data.case_tags.includes('💡 Reflexive') ||
        data.case_tags.includes('refl') ||
        data.case_tags.includes('reflexiv')
    );

    let reflexivityScore = 0;
    const evidence = [];

    // Check for "sich" in basic fields
    const fieldsToCheck = ['praesens', 'perfekt', 'praeteritum'];
    fieldsToCheck.forEach(field => {
        if (data[field] && typeof data[field] === 'string' && data[field].includes('sich')) {
            reflexivityScore++;
            evidence.push(`${field}: ${data[field]}`);
        }
    });

    // Check infinitive (sometimes written as "sich füreuen")
    if (data.verb && data.verb.includes('sich')) {
        reflexivityScore += 5;
        evidence.push(`verb: ${data.verb}`);
    }

    if (reflexivityScore > 0 && !hasReflexiveTag) {
        candidates.push({
            file: file,
            verb: data.verb,
            evidence: evidence
        });
    }
});

console.log(`Found ${candidates.length} candidates.`);
candidates.forEach(c => {
    console.log(`\n[${c.verb}] (${c.file})`);
    c.evidence.forEach(e => console.log(`  - ${e}`));
});
