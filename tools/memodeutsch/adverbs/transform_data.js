const fs = require('fs');
const path = require('path');

const filePath = String.raw`c:\Users\juan\Documents\GitHub\juanolaya.github.io\Deutsch_lernen\adverbs\adverbien.html`;
let content = fs.readFileSync(filePath, 'utf8');

// 1. Extract adverbGroups
const startMarker = 'const adverbGroups = [';
const endMarker = '// --- RENDER Logic ---';
const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
    console.error('Could not find data block');
    process.exit(1);
}

const dataBlock = content.substring(startIndex, endIndex);
// Find the end of the array inside the block.
// It likely ends with "];" before the render logic.
// Let's identify the semi-colon.
const arrayEndIndex = dataBlock.lastIndexOf('];');
if (arrayEndIndex === -1) {
    console.error('Could not find end of array');
    process.exit(1);
}

const arrayString = dataBlock.substring(dataBlock.indexOf('['), arrayEndIndex + 1);

// 2. Parse Data
// We can use eval, but we need to make sure the string is clean.
// The file has comments? No, checked the view_file, seems clean object literals.
let groups;
try {
    groups = eval(arrayString);
} catch (e) {
    console.error('Error parsing data:', e);
    process.exit(1);
}

// 3. Transform Data
groups.forEach(group => {
    // Remove level from title (e.g. "Title (A1)")
    group.title = group.title.replace(/\s*\([^)]+\)\s*$/, '');

    // Add level to each adverb
    if (group.adverbs) {
        group.adverbs.forEach(adv => {
            adv.level = group.level;
        });
    }
});

// 4. Serialize Data
// access properties to ensure order if needed, or just stringify
// JSON.stringify will add quotes to keys, which is fine.
const newArrayString = JSON.stringify(groups, null, 4);

// 5. Replace in Content
const newDataBlock = `const adverbGroups = ${newArrayString};\n\n`;
const newContent = content.substring(0, startIndex) + newDataBlock + content.substring(endIndex);

// 6. Write File
fs.writeFileSync(filePath, newContent, 'utf8');
console.log('Successfully updated adverbGroups');
