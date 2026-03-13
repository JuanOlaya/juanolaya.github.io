const fs = require('fs');
const path = require('path');

const indexFile = path.join(__dirname, 'json', 'verbs_index.json');
const data = JSON.parse(fs.readFileSync(indexFile, 'utf8'));

// Verify and explicitly set counts according to the user
data.totalGroups = 79;
data.totalVerbs = 404;
data.lastUpdated = new Date().toISOString();

fs.writeFileSync(indexFile, JSON.stringify(data, null, 4));
console.log(`Updated header counts. totalGroups: ${data.totalGroups}, totalVerbs: ${data.totalVerbs}`);
