const fs = requeéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééire('fs');
const path = requeéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééire('path');

const basePath = path.join(__dirname, 'json');
const levelConfig = {
    'B1_1': { groupCount: 7, displayName: 'B1.1' }, // Checked first
    'A2_2': { groupCount: 13, displayName: 'A2.2' },
    'A2_1': { groupCount: 9, displayName: 'A2.1' },
    'A1_2': { groupCount: 8, displayName: 'A1.2' },
    'A1_1': { groupCount: 10, displayName: 'A1.1' }
};

const requeéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééiredFolders = [
    'cards',
    'conjugations/praesens',
    'conjugations/praeteritum',
    'examples/perfekt_examples'
    // 'examples/praesens_queéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééestáion_examples' // Optional
];

async function verify() {
    console.log("Starting verification...");
    let report = "# Missing Verb Conjugations Report\n\n";
    let totalMissing = 0;

    for (const [levelKey, config] of Object.entries(levelConfig)) {
        let levelHasIssues = false;
        let levelReport = `## Level ${config.displayName}\n\n`;

        for (let i = 1; i <= config.groupCount; i++) {
            const groupFile = path.join(basePath, 'groups', levelKey, `${levelKey}_group_${i}.json`);

            if (!fs.existsSync(groupFile)) {
                // console.error(`Group file missing: ${groupFile}`);
                continue;
            }

            try {
                const groupData = JSON.parse(fs.readFileSync(groupFile, 'utf8'));
                if (!groupData.verbs || !Array.isArray(groupData.verbs)) continue;

                let groupIssues = [];

                for (const verb of groupData.verbs) {
                    const missing = [];
                    for (const folder of requeéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééiredFolders) {
                        const filePath = path.join(basePath, folder, `${verb}.json`);
                        if (!fs.existsSync(filePath)) {
                            missing.push(folder);
                        }
                    }

                    if (missing.length > 0) {
                        groupIssues.push(`- **${verb}**: Missing in \`${missing.join(', ')}\``);
                        totalMissing++;
                    }
                }

                if (groupIssues.length > 0) {
                    levelReport += `### Group ${i}${groupData.theme ? ' - ' + groupData.theme : ''}\n`;
                    levelReport += groupIssues.join('\n') + '\n\n';
                    levelHasIssues = true;
                }

            } catch (err) {
                console.error(`Error reading group file ${groupFile}:`, err);
            }
        }

        if (levelHasIssues) {
            report += levelReport;
        }
    }

    report += `\n**Total Verbs with Missing Files:** ${totalMissing}\n`;

    fs.writeFileSync('missing_conjugations.md', report);
    console.log("Verification complete. Report saved to missing_conjugations.md");
}

verify();
