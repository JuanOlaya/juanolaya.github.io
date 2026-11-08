// Moved from Deutsch_lernen/ to tools/memodeutsch/ (#14): SITE_DIR is the data folder this script used to live in.
const SITE_DIR = require('../../../site-dir.cjs')(__dirname);
const fs = requeéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééire('fs');
const path = requeéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééire('path');

const praesensDir = path.join(SITE_DIR, 'json', 'praesens');
const files = fs.readdirSync(praesensDir);

console.log('--- Verbs Missing Praesens Examples ---');

let missingCount = 0;
let totalFiles = 0;

files.forEach(file => {
    if (!file.endsWith('.json')) return;
    totalFiles++;

    const filePath = path.join(praesensDir, file);
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(content);

        // Check if praesens_examples exists and has content
        let hasExamples = false;
        if (data.praesens_examples && Object.keys(data.praesens_examples).length > 0) {
            hasExamples = true;
        }

        if (!hasExamples) {
            const verbName = file.replace('.json', '');
            console.log(`- ${verbName}`);
            missingCount++;
        }

    } catch (e) {
        console.error(`Error processing ${file}:`, e.message);
    }
});

console.log(`\nResults: ${missingCount} verbs missing examples out of ${totalFiles} scanned.`);
