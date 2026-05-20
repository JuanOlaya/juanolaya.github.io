const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'script', 'script.js');
let code = fs.readFileSync(filePath, 'utf8');

// Replace escaped quotes in template literals
code = code.replace(/\\'geboren werden\\'/g, "'geboren werden'");
code = code.replace(/\\'geboren\\'/g, "'geboren'");

fs.writeFileSync(filePath, code, 'utf8');
console.log('Fixed quotes in script.js successfully!');
