const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const jsonDir = path.join(rootDir, 'json');
const indexPath = path.join(jsonDir, 'verbs_index.json');
const cardsDir = path.join(jsonDir, 'cards');

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, ''));
}

function normalize(value) {
  return String(value ?? '').trim();
}

const indexData = readJson(indexPath);
const expectedByVerb = new Map();

for (const group of indexData.groups) {
  for (const verb of group.verbs || []) {
    expectedByVerb.set(verb, {
      level: normalize(group.level),
      theme: normalize(group.groupNameGerman),
      group: Number(group.groupNumberPerLevel)
    });
  }
}

const findings = [];

for (const entry of fs.readdirSync(cardsDir, { withFileTypes: true })) {
  if (!entry.isFile() || !entry.name.endsWith('.json')) continue;

  const filePath = path.join(cardsDir, entry.name);
  const fileStem = path.basename(entry.name, '.json');
  const card = readJson(filePath);
  const verb = normalize(card.verb || path.basename(entry.name, '.json'));
  const expected = expectedByVerb.get(verb) || expectedByVerb.get(fileStem);

  if (!expected) {
    findings.push({
      verb,
      file: path.relative(rootDir, filePath),
      issue: 'missing_from_index'
    });
    continue;
  }

  const actual = {
    level: normalize(card.level),
    theme: normalize(card.theme),
    group: Number(card.group)
  };

  const mismatches = [];
  if (actual.level !== expected.level) mismatches.push({ field: 'level', expected: expected.level, actual: actual.level });
  if (actual.theme !== expected.theme) mismatches.push({ field: 'theme', expected: expected.theme, actual: actual.theme });
  if (actual.group !== expected.group) mismatches.push({ field: 'group', expected: expected.group, actual: actual.group });

  if (mismatches.length > 0) {
    findings.push({
      verb,
      file: path.relative(rootDir, filePath),
      issue: 'card_mismatch',
      mismatches
    });
  }
}

for (const [verb, expected] of expectedByVerb.entries()) {
  const cardPath = path.join(cardsDir, `${verb}.json`);
  if (!fs.existsSync(cardPath)) {
    findings.push({
      verb,
      file: path.relative(rootDir, cardPath),
      issue: 'missing_card',
      expected
    });
  }
}

if (findings.length > 0) {
  console.log(JSON.stringify({ count: findings.length, findings }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({ count: 0, findings: [] }, null, 2));
