// Moved from Deutsch_lernen/ to tools/memodeutsch/ (#14): SITE_DIR is the data folder this script used to live in.
const SITE_DIR = require('../site-dir.cjs')(__dirname);
const fs = require('fs');
const path = require('path');

// Patterns for Triple Mojibake (UTF-8 -> Win1252 -> UTF-8 -> Win1252 -> UTF-8)
const tripleMap = {
    'ÃƒÂ¤': 'ä',
    'ÃƒÂ¶': 'ö',
    'ÃƒÂ¼': 'ü',
    'ÃƒÅ¸': 'ß',
    'ÃƒÂ©': 'é',
    'ÃƒÂ¡': 'á',
    'ÃƒÂ­': 'í',
    'ÃƒÂ³': 'ó',
    'ÃƒÂº': 'ú',
    'ÃƒÂ±': 'ñ',
    'ÃƒÂ³': 'ó',
    'Ãƒâ€“': 'Ö',
    'ÃƒÂ¤': 'ä', // Duplicate intentional
    'Ãƒâ€œ': 'Ó',
    'ÃƒÂ ': 'à',
    'Ãƒâ€˜': 'Ñ',
    'Ã‚Â': '', // Non-breaking space or redundant marker
    'ÃƒÂ²': 'ò',
    'Ãƒâ‚¬': 'À',
    'ÃƒÂ¨': 'è'
};

const doubleMap = {
    'Ã¤': 'ä',
    'Ã¶': 'ö',
    'Ã¼': 'ü',
    'ÃŸ': 'ß',
    'Ã©': 'é',
    'Ã¡': 'á',
    'Ã­': 'í',
    'Ã³': 'ó',
    'Ãº': 'ú',
    'Ã±': 'ñ',
    'Ã': 'í', // Common single-byte marker problem
    'Â¿': '¿',
    'Â¡': '¡',
    'â‚¬': '€'
};

// Emoji corruption fixes
const emojiMap = {
    'ðŸ”\u00B9': '💎',
    'ðŸ ': '🏠',
    'ðŸš€': '🚀',
    'ðŸ’¬': '💬'
};

const targets = [
    path.join(SITE_DIR, 'verben', 'A1_A2_B1', 'json'),
    path.join(SITE_DIR, 'verben', 'A1_A2_B1', 'verben.html'),
    path.join(SITE_DIR, 'verben', 'A1_A2_B1', 'script', 'script.js'),
    path.join(SITE_DIR, 'index.html')
];

function repair(content) {
    let repaired = content;
    
    // 1. Triple Mojibake first (more specific)
    for (const [key, val] of Object.entries(tripleMap)) {
        repaired = repaired.split(key).join(val);
    }
    
    // 2. Double Mojibake
    for (const [key, val] of Object.entries(doubleMap)) {
        repaired = repaired.split(key).join(val);
    }
    
    // 3. Emojis
    for (const [key, val] of Object.entries(emojiMap)) {
        repaired = repaired.split(key).join(val);
    }
    
    return repaired;
}

function processRecursive(target) {
    if (!fs.existsSync(target)) return;
    const stat = fs.statSync(target);
    
    if (stat.isDirectory()) {
        const entries = fs.readdirSync(target);
        entries.forEach(e => processRecursive(path.join(target, e)));
    } else {
        if (target.endsWith('.json') || target.endsWith('.html') || target.endsWith('.js')) {
            const content = fs.readFileSync(target, 'utf8');
            const repaired = repair(content);
            if (content !== repaired) {
                fs.writeFileSync(target, repaired, 'utf8');
                console.log(`Fixed: ${path.relative(SITE_DIR, target)}`);
            }
        }
    }
}

console.log('Starting Triple-Mojibake Rescue Mission...');
targets.forEach(t => processRecursive(t));
console.log('Mission Complete.');
