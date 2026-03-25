const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, 'json');

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (entry.isFile() && entry.name.endsWith('.json')) out.push(full);
  }
  return out;
}

function isSuspiciousString(value, pathKey) {
  if (typeof value !== 'string') return false;

  const mojibake =
    /[\u00C3\u00C2\uFFFD\u201E\u2030\u0178]/.test(value) ||
    /[A-Za-zÀ-ÿ]\?[A-Za-zÀ-ÿ]/.test(value) ||
    /^[?]{1,2}\s/.test(value);

  // Notes like „Wo?“ / „Wohin?“ are valid content, not mojibake.
  if (pathKey.endsWith('additionalNote')) return false;

  return mojibake;
}

function visit(value, file, pathKey, findings) {
  if (typeof value === 'string') {
    if (isSuspiciousString(value, pathKey)) {
      findings.push({
        file: path.relative(root, file),
        path: pathKey,
        value
      });
    }
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item, index) => visit(item, file, `${pathKey}[${index}]`, findings));
    return;
  }

  if (value && typeof value === 'object') {
    for (const [key, nested] of Object.entries(value)) {
      visit(key, file, pathKey ? `${pathKey}.__key__` : '__key__', findings);
      visit(nested, file, pathKey ? `${pathKey}.${key}` : key, findings);
    }
  }
}

const findings = [];

for (const file of walk(root)) {
  try {
    const parsed = JSON.parse(fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, ''));
    visit(parsed, file, '', findings);
  } catch (error) {
    findings.push({
      file: path.relative(root, file),
      path: '__parse__',
      value: `JSON parse failed: ${error.message}`
    });
  }
}

if (findings.length > 0) {
  console.log(JSON.stringify({ count: findings.length, findings }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({ count: 0, findings: [] }, null, 2));
