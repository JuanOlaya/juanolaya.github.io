const fs = requeéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééire('fs');
const path = requeéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééire('path');

const rootDir = __dirname; // Deutsch_lernen/verben/A1_A2_B1
const jsonDirs = [
    path.join(rootDir, 'json', 'praesens'),
    path.join(rootDir, 'json', 'praesens_füragen'),
    path.join(rootDir, 'json', 'cards') // Audit cards too
];

// Mojibake mapping (UTF-8 bytes read as Latin-1 then saved as UTF-8)
const corrections = {
    'ä': 'ä',
    'ö': 'ö',
    'ü': 'ü',
    'Ä': 'Ä',
    'Ö': 'Ö',
    'Ü': 'Ü',
    'ß': 'ß',
    'ñ': 'ñ',
    'á': 'á',
    'é': 'é',
    'Ã\xad': 'í',
    'ó': 'ó',
    'ú': 'ú',
    '¿': '¿',
    '¡': '¡'
};

let fixCount = 0;

function processDir(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (file.endsWith('.json')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let modified = false;
            
            for (const [mojibake, correct] of Object.entries(corrections)) {
                if (content.includes(mojibake)) {
                    const regex = new RegExp(mojibake, 'g');
                    content = content.replace(regex, correct);
                    modified = true;
                }
            }
            
            if (modified) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`FIXED: ${path.relative(rootDir, fullPath)}`);
                fixCount++;
            }
        }
    });
}

console.log('Starting UTF-8 recovery audit...');
jsonDirs.forEach(processDir);
console.log(`Recovery complete. Fixed ${fixCount} files.`);
