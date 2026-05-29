const fs = require('fs');
let content = fs.readFileSync('adverbien.html', 'utf8');

// 1. Add to the JSON array after regelrecht
const insertObj = `,
                    {
                        "word": "grunds\u00E4tzlich",
                        "emoji": "\uD83C\uDFDB\uFE0F",
                        "spanish": "(en principio / fundamentalmente)",
                        "english": "basically / fundamentally",
                        "example_de": "Grunds\u00E4tzlich bin ich einverstanden.",
                        "example_es": "En principio, estoy de acuerdo.",
                        "level": "B1"
                    }`;

content = content.replace(
    /("word": "regelrecht",\s*"emoji": "[^"]+",\s*"spanish": "[^"]+",\s*"english": "[^"]+",\s*"example_de": "[^"]+",\s*"example_es": "[^"]+",\s*"level": "[^"]+"\s*})/,
    `$1${insertObj}`
);

// 2. Add to the Stil group array
content = content.replace(
    /words:\s*\[([^\]]+)'regelrecht'\]\s*\}\s*,/g,
    `words: [$1'regelrecht', 'grunds\u00E4tzlich'] },`
);

// 3. Just in case it's parsed as adjective like
content = content.replace(
    /'regelrecht'\]\)/,
    `'regelrecht', 'grunds\u00E4tzlich'])`
);

fs.writeFileSync('adverbien.html', content);
