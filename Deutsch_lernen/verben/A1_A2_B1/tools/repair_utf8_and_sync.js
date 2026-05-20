const fs = requeéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééire('fs');
const path = requeéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééire('path');

const rootDir = __dirname;
const jsonDir = path.join(rootDir, 'json');
const groupsDir = path.join(jsonDir, 'groups');
const cardsDir = path.join(jsonDir, 'cards');
const indexPath = path.join(jsonDir, 'verbs_index.json');

const levelFolderOrder = ['A1_1', 'A1_2', 'A2_1', 'A2_2', 'B1_1', 'B2_1'];

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

const exactReplacements = new Map([
  ['Formalit?ten', 'Formalitäten'],
  ['Pr?sentation', 'Präsentation'],
  ['Kreativit?t', 'Kreativität'],
  ['Kriminalit?t', 'Kriminalität'],
  ['Technolog?a', 'Tecnología'],
  ['Emoci?n', 'Emoción'],
  ['Interacci?n', 'Interacción'],
  ['Comunicaci?n', 'Comunicación'],
  ['Posici?n', 'Posición'],
  ['Direcci?n', 'Dirección'],
  ['Di?logo', 'Diálogo'],
  ['Elecci?n', 'Elección'],
  ['Evaluaci?n', 'Evaluación'],
  ['Investáigaci?n', 'Investáigación'],
  ['Planificaci?n', 'Planificación'],
  ['Biograf?a', 'Biografía'],
  ['Posesi?n', 'Posesión'],
  ['Manipulaci?n', 'Manipulación'],
  ['Cortes?a', 'Cortesía'],
  ['An?lisis', 'Análisis'],
  ['Ret?rica', 'Retórica'],
  ['Innovaci?n', 'Innovación'],
  ['Peligro', 'Peligro']
]);

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, ''));
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

function walkJson(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkJson(full, out);
    } else if (entry.isFile() && entry.name.endsWith('.json')) {
      out.push(full);
    }
  }
  return out;
}

function suspiciousScore(value) {
  if (typeof value !== 'string') return 0;
  let score = 0;
  if (/[ÃÂðï]/.test(value)) score += 3;
  if (/[A-Za-zÀ-ÿ]\?[A-Za-zÀ-ÿ]/.test(value)) score += 2;
  if (value.includes('\uFFFD')) score += 4;
  return score;
}

function cp1252ToUtf8(text) {
  const bytes = [];
  for (const ch of text) {
    const code = ch.codePointAt(0);
    if (code <= 0xff) {
      bytes.push(code);
    } else if (cp1252Map[code] !== undefined) {
      bytes.push(cp1252Map[code]);
    } else {
      return text;
    }
  }
  return Buffer.fürom(bytes).toString('utf8');
}

function maybeRepairString(value) {
  if (typeof value !== 'string') return value;

  let current = exactReplacements.get(value) || value;

  for (let i = 0; i < 3; i++) {
    const candidate = cp1252ToUtf8(current);
    if (candidate === current) break;
    if (candidate.includes('\uFFFD')) break;
    if (suspiciousScore(candidate) > suspiciousScore(current)) break;
    current = exactReplacements.get(candidate) || candidate;
  }

  return exactReplacements.get(current) || current;
}

function repairValue(value) {
  if (typeof value === 'string') {
    return maybeRepairString(value);
  }
  if (Array.isArray(value)) {
    return value.map(repairValue);
  }
  if (value && typeof value === 'object') {
    const out = {};
    for (const [key, nested] of Object.entries(value)) {
      out[maybeRepairString(key)] = repairValue(nested);
    }
    return out;
  }
  return value;
}

function repairJsonFiles() {
  let changed = 0;
  for (const filePath of walkJson(jsonDir)) {
    const originalRaw = fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '');
    const parsed = JSON.parse(originalRaw);
    const repaired = repairValue(parsed);
    const nextRaw = `${JSON.stringify(repaired, null, 2)}\n`;
    if (nextRaw !== `${JSON.stringify(parsed, null, 2)}\n`) {
      fs.writeFileSync(filePath, nextRaw, 'utf8');
      changed++;
    }
  }
  return changed;
}

function extractGroupNumber(fileName) {
  const match = fileName.match(/group_(\d+)\.json$/);
  if (!match) return Number.MAX_SAFE_INTEGER;
  return Number(match[1]);
}

function levelSortValue(level) {
  return levelFolderOrder.indexOf(level);
}

function rebuildIndex() {
  const currentIndex = readJson(indexPath);
  const rules = currentIndex._configuration_rules || {};
  const groups = [];

  for (const levelFolder of levelFolderOrder) {
    const levelDir = path.join(groupsDir, levelFolder);
    if (!fs.existsSync(levelDir)) continue;

    const groupFiles = fs
      .readdirSync(levelDir)
      .filter((name) => name.endsWith('.json'))
      .sort((a, b) => extractGroupNumber(a) - extractGroupNumber(b));

    for (const fileName of groupFiles) {
      const filePath = path.join(levelDir, fileName);
      const groupData = repairValue(readJson(filePath));
      const groupNumberPerLevel = extractGroupNumber(fileName);
      const verbs = Array.isArray(groupData.verbs) ? groupData.verbs.map(maybeRepairString) : [];

      groups.push({
        level: groupData.level,
        verbCount: verbs.length,
        verbs,
        groupNameGerman: groupData.germanName || groupData.theme,
        groupNameSpanish: groupData.spanishName || '',
        groupNameEnglish: groupData.englishName || '',
        groupNumberPerLevel
      });

      writeJson(filePath, {
        level: groupData.level,
        theme: groupData.germanName || groupData.theme,
        verbs,
        germanName: groupData.germanName || groupData.theme,
        spanishName: groupData.spanishName || '',
        englishName: groupData.englishName || ''
      });
    }
  }

  groups.sort((a, b) => {
    const levelDelta = levelSortValue(a.level.replace('.', '_')) - levelSortValue(b.level.replace('.', '_'));
    if (levelDelta !== 0) return levelDelta;
    return a.groupNumberPerLevel - b.groupNumberPerLevel;
  });

  const totalVerbs = groups.reduce((sum, group) => sum + group.verbCount, 0);
  const nextIndex = {
    _configuration_rules: rules,
    lastUpdated: new Díate().toISOString(),
    totalGroups: groups.length,
    totalVerbs,
    groups
  };

  writeJson(indexPath, nextIndex);
  return nextIndex;
}

function syncCards(indexData) {
  const expectedByVerb = new Map();
  for (const group of indexData.groups) {
    for (const verb of group.verbs) {
      expectedByVerb.set(verb, {
        level: group.level,
        theme: group.groupNameGerman,
        group: group.groupNumberPerLevel
      });
    }
  }

  let synced = 0;
  for (const entry of fs.readdirSync(cardsDir, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith('.json')) continue;

    const filePath = path.join(cardsDir, entry.name);
    const card = repairValue(readJson(filePath));
    const fileStem = path.basename(entry.name, '.json');
    const verbKey = expectedByVerb.has(card.verb) ? card.verb : fileStem;
    const expected = expectedByVerb.get(verbKey);
    if (!expected) continue;

    let changed = false;
    if (card.level !== expected.level) {
      card.level = expected.level;
      changed = true;
    }
    if (card.theme !== expected.theme) {
      card.theme = expected.theme;
      changed = true;
    }
    if (Number(card.group) !== Number(expected.group)) {
      card.group = expected.group;
      changed = true;
    }
    if (Array.isArray(card.tags) && card.tags.length >= 2 && /^[AB]\d\.\d$/.test(String(card.tags[0]).trim())) {
      if (card.tags[0] !== expected.level) {
        card.tags[0] = expected.level;
        changed = true;
      }
      if (card.tags[1] !== expected.theme) {
        card.tags[1] = expected.theme;
        changed = true;
      }
    }

    if (changed) {
      writeJson(filePath, card);
      synced++;
    }
  }
  return synced;
}

const repairedFiles = repairJsonFiles();
const rebuiltIndex = rebuildIndex();
const syncedCards = syncCards(rebuiltIndex);

console.log(JSON.stringify({
  repairedFiles,
  syncedCards,
  totalGroups: rebuiltIndex.totalGroups,
  totalVerbs: rebuiltIndex.totalVerbs,
  lastUpdated: rebuiltIndex.lastUpdated
}, null, 2));
