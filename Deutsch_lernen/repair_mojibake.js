const fs = require('fs');
const path = require('path');

const cp1252Map = {
  0x20AC: 0x80,
  0x201A: 0x82,
  0x0192: 0x83,
  0x201E: 0x84,
  0x2026: 0x85,
  0x2020: 0x86,
  0x2021: 0x87,
  0x02C6: 0x88,
  0x2030: 0x89,
  0x0160: 0x8A,
  0x2039: 0x8B,
  0x0152: 0x8C,
  0x017D: 0x8E,
  0x2018: 0x91,
  0x2019: 0x92,
  0x201C: 0x93,
  0x201D: 0x94,
  0x2022: 0x95,
  0x2013: 0x96,
  0x2014: 0x97,
  0x02DC: 0x98,
  0x2122: 0x99,
  0x0161: 0x9A,
  0x203A: 0x9B,
  0x0153: 0x9C,
  0x017E: 0x9E,
  0x0178: 0x9F
};

const markerRegex = /Ã|Â|â|ðŸ|ï¸|�/g;

const targets = [
  path.join(__dirname, 'adjektive', 'adjektive.html'),
  path.join(__dirname, 'verben', 'A1_A2_B1', 'verben.html'),
  path.join(__dirname, 'verben', 'A1_A2_B1', 'script', 'script.js'),
  path.join(__dirname, 'verben', 'A1_A2_B1', 'style', 'styles.css'),
  path.join(__dirname, 'verben', 'A1_A2_B1', 'json')
];

function countMarkers(text) {
  return (text.match(markerRegex) || []).length;
}

function cp1252ToUtf8(line) {
  const bytes = [];
  for (const ch of line) {
    const code = ch.codePointAt(0);
    if (code <= 0xFF) {
      bytes.push(code);
    } else if (cp1252Map[code] !== undefined) {
      bytes.push(cp1252Map[code]);
    } else {
      return line;
    }
  }
  return Buffer.from(bytes).toString('utf8');
}

function shouldConvert(line, converted) {
  if (line === converted) return false;
  const before = countMarkers(line);
  const after = countMarkers(converted);
  if (after >= before) return false;
  if (converted.includes('�')) return false;
  return true;
}

function processFile(filePath, report) {
  const original = fs.readFileSync(filePath, 'utf8');
  const lines = original.split(/\r?\n/);
  let changedLines = 0;
  const fixedLines = lines.map((line) => {
    const converted = cp1252ToUtf8(line);
    if (shouldConvert(line, converted)) {
      changedLines++;
      return converted;
    }
    return line;
  });

  if (changedLines > 0) {
    fs.writeFileSync(filePath, fixedLines.join('\n'), 'utf8');
    report.push({ filePath, changedLines });
  }
}

function walk(targetPath, report) {
  if (!fs.existsSync(targetPath)) return;
  const stat = fs.statSync(targetPath);
  if (stat.isDirectory()) {
    for (const entry of fs.readdirSync(targetPath)) {
      walk(path.join(targetPath, entry), report);
    }
    return;
  }

  if (!/\.(html|json|js|css)$/i.test(targetPath)) return;
  processFile(targetPath, report);
}

const report = [];
for (const target of targets) {
  walk(target, report);
}

console.log(`Processed ${report.length} files.`);
report.forEach(({ filePath, changedLines }) => {
  console.log(`${changedLines.toString().padStart(4, ' ')} lines fixed: ${path.relative(__dirname, filePath)}`);
});
