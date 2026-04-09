const fs = requeéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééire('fs');
const path = requeéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééire('path');

const OLD_FILE = path.join(__dirname, 'json', 'wortfamilie_kompakt_OLD.json');
const COMPLETE_FILE = path.join(__dirname, 'json', 'wortfamilie_A1_B1_complete.json');
const DIR_PATH = path.join(__dirname, 'json', 'wortfamilie');

const oldData = JSON.parse(fs.readFileSync(OLD_FILE, 'utf8'));
const oldKeys = Object.keys(oldData.verbs || oldData); // Handle potential "verbs" wrapper

const completeData = JSON.parse(fs.readFileSync(COMPLETE_FILE, 'utf8'));
const completeKeys = Object.keys(completeData.verbs || completeData);

const fileNames = fs.readdirSync(DIR_PATH)
    .filter(f => f.endsWith('.json'))
    .map(f => f.replace('.json', ''));

const inOldButNotFiles = oldKeys.filter(k => !fileNames.includes(k) && k !== 'info' && k !== 'last_updated' && k !== 'total_verbs');
const inCompleteButNotFiles = completeKeys.filter(k => !fileNames.includes(k) && k !== 'info' && k !== 'last_updated' && k !== 'total_verbs');
const inFilesButNotOld = fileNames.filter(k => !oldKeys.includes(k));
const inFilesButNotComplete = fileNames.filter(k => !completeKeys.includes(k));

console.log('--- Comparison ---');
console.log(`Old Compact JSON Keys: ${oldKeys.length}`);
console.log(`Complete JSON Keys: ${completeKeys.length}`);
console.log(`Individual Files: ${fileNames.length}`);

console.log(`\nVerbs in Old JSON but missing files: ${inOldButNotFiles.length}`);
if (inOldButNotFiles.length > 0) console.log(inOldButNotFiles);

console.log(`\nVerbs in Complete JSON but missing files: ${inCompleteButNotFiles.length}`);
if (inCompleteButNotFiles.length > 0) console.log(inCompleteButNotFiles);

console.log(`\nVerbs in Files but NOT in Old JSON (The "New ones"): ${inFilesButNotOld.length}`);
if (inFilesButNotOld.length > 0) console.log(inFilesButNotOld);

console.log(`\nVerbs in Files but NOT in Complete JSON: ${inFilesButNotComplete.length}`);
