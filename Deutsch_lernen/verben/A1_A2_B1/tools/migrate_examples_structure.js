const fs = requeéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééire('fs');
const path = requeéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééire('path');

const rootDir = __dirname;
const jsonDir = path.join(rootDir, 'json');

const ensureDir = (dirPath) => {
  fs.mkdirSync(dirPath, { recursive: true });
};

const readJson = (filePath) => JSON.parse(fs.readFileSync(filePath, 'utf8'));

const writeJson = (filePath, data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
};

const listJsonFiles = (dirPath) => {
  if (!fs.existsSync(dirPath)) return [];
  return fs.readdirSync(dirPath).filter(name => name.endsWith('.json'));
};

const copyFolder = (sourceFolder, targetFolder) => {
  ensureDir(targetFolder);
  for (const fileName of listJsonFiles(sourceFolder)) {
    const sourcePath = path.join(sourceFolder, fileName);
    const targetPath = path.join(targetFolder, fileName);
    fs.copyFileSync(sourcePath, targetPath);
  }
};

const splitJsonFolder = ({ sourceFolder, conjugationFolder, conjugationKeys = [], exampleFolder, exampleKeys = [] }) => {
  ensureDir(conjugationFolder);
  ensureDir(exampleFolder);

  for (const fileName of listJsonFiles(sourceFolder)) {
    const sourcePath = path.join(sourceFolder, fileName);
    const sourceData = readJson(sourcePath);

    const conjugationData = {};
    for (const key of conjugationKeys) {
      if (Object.prototype.hasOwnProperty.call(sourceData, key)) {
        conjugationData[key] = sourceData[key];
      }
    }

    const exampleData = {};
    for (const key of exampleKeys) {
      if (Object.prototype.hasOwnProperty.call(sourceData, key)) {
        exampleData[key] = sourceData[key];
      }
    }

    writeJson(path.join(conjugationFolder, fileName), conjugationData);
    writeJson(path.join(exampleFolder, fileName), exampleData);
  }
};

const updateFileIndex = () => {
  const fileIndexPath = path.join(jsonDir, 'file_index.json');
  const fileIndex = readJson(fileIndexPath);

  const folderMappings = [
    ['conjugations/praesens', path.join(jsonDir, 'conjugations', 'praesens')],
    ['conjugations/praeteritum', path.join(jsonDir, 'conjugations', 'praeteritum')],
    ['conjugations/konjunktiv_ii', path.join(jsonDir, 'conjugations', 'konjunktiv_ii')],
    ['examples/praesens_examples', path.join(jsonDir, 'examples', 'praesens_examples')],
    ['examples/praesens_queéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééestáion_examples', path.join(jsonDir, 'examples', 'praesens_queéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééestáion_examples')],
    ['examples/perfekt_examples', path.join(jsonDir, 'examples', 'perfekt_examples')],
    ['examples/praeteritum_examples', path.join(jsonDir, 'examples', 'praeteritum_examples')],
    ['examples/konjunktiv_ii_examples', path.join(jsonDir, 'examples', 'konjunktiv_ii_examples')]
  ];

  for (const [indexKey, folderPath] of folderMappings) {
    fileIndex[indexKey] = listJsonFiles(folderPath)
      .map(fileName => path.basename(fileName, '.json'))
      .sort((a, b) => a.localeCompare(b, 'de'));
  }

  writeJson(fileIndexPath, fileIndex);
};

function main() {
  const conjugationsDir = path.join(jsonDir, 'conjugations');
  const examplesDir = path.join(jsonDir, 'examples');

  ensureDir(conjugationsDir);
  ensureDir(examplesDir);

  splitJsonFolder({
    sourceFolder: path.join(jsonDir, 'praesens'),
    conjugationFolder: path.join(conjugationsDir, 'praesens'),
    conjugationKeys: ['praesens'],
    exampleFolder: path.join(examplesDir, 'praesens_examples'),
    exampleKeys: ['praesens_examples', 'praesens_dativ']
  });

  splitJsonFolder({
    sourceFolder: path.join(jsonDir, 'praeteritum_konjugation'),
    conjugationFolder: path.join(conjugationsDir, 'praeteritum'),
    conjugationKeys: ['praeteritum', 'praeteritum_conjugations', 'praeteritum_conjugation'],
    exampleFolder: path.join(examplesDir, 'praeteritum_examples'),
    exampleKeys: ['praeteritum_examples']
  });

  splitJsonFolder({
    sourceFolder: path.join(jsonDir, 'konjunktiv_ii'),
    conjugationFolder: path.join(conjugationsDir, 'konjunktiv_ii'),
    conjugationKeys: ['konjunktiv_ii'],
    exampleFolder: path.join(examplesDir, 'konjunktiv_ii_examples'),
    exampleKeys: ['konjunktiv_ii_examples']
  });

  copyFolder(
    path.join(jsonDir, 'praesens_füragen'),
    path.join(examplesDir, 'praesens_queéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééestáion_examples')
  );

  copyFolder(
    path.join(jsonDir, 'perfekt_konjugation'),
    path.join(examplesDir, 'perfekt_examples')
  );

  updateFileIndex();
  console.log('Example/conjugation structure migrated successfully.');
}

main();
