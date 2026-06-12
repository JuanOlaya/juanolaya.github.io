const fs = require('fs');
let content = fs.readFileSync('adverbien.html', 'utf8');

const insertObj = `,
                    {
                        "word": "hiermit",
                        "emoji": "\uD83D\uDCDC",
                        "spanish": "(por la presente / con esto)",
                        "english": "hereby / herewith",
                        "example_de": "Hiermit k\u00FCndige ich meinen Vertrag.",
                        "example_es": "Por la presente cancelo mi contrato.",
                        "level": "B1"
                    }`;

content = content.replace(
    /("word": "dabei",\s*"emoji": "[^"]+",\s*"spanish": "[^"]+",\s*"english": "[^"]+",\s*"example_de": "[^"]+",\s*"example_es": "[^"]+",\s*"level": "[^"]+"\s*})/,
    `$1${insertObj}`
);

content = content.replace(
    /words:\s*\[([^\]]+)'dabei'\]\s*\}\s*,/g,
    `words: [$1'dabei', 'hiermit'] },`
);

fs.writeFileSync('adverbien.html', content);
