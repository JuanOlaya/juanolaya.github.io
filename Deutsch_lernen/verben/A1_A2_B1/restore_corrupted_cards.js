const fs = require('fs');
const path = require('path');

const cardsDir = path.join(__dirname, 'json', 'cards');
const groupsDir = path.join(__dirname, 'json', 'groups');

// Data for restoration (Best effort based on A1/A2 level)
const restorationData = {
    "abholen": { es: "recoger (personas/cosas)", perfekt: "hat abgeholt", praeteritum: "er/sie/es holte ab", case_tags: ["akk", "tr"] },
    "antworten": { es: "responder / contestar", perfekt: "hat geantwortet", praeteritum: "er/sie/es antwortete", case_tags: ["dat"] },
    "aufhören": { es: "dejar de / parar / terminar", perfekt: "hat aufgehört", praeteritum: "er/sie/es hörte auf", case_tags: ["intrans", "prep:mit"] },
    "auswählen": { es: "seleccionar / elegir", perfekt: "hat ausgewählt", praeteritum: "er/sie/es wählte aus", case_tags: ["akk"] },
    "bedanken": { es: "agradecer / dar las gracias", perfekt: "hat bedankt", praeteritum: "er/sie/es bedankte", case_tags: ["💡 Reflexive", "prep:bei", "prep:für"] },
    "berichten": { es: "informar / reportar", perfekt: "hat berichtet", praeteritum: "er/sie/es berichtete", case_tags: ["intrans", "prep:über"] },
    "bestellen": { es: "pedir / ordenar (comida/algo)", perfekt: "hat bestellt", praeteritum: "er/sie/es bestellte", case_tags: ["akk"] },
    "bezahlen": { es: "pagar", perfekt: "hat bezahlt", praeteritum: "er/sie/es bezahlte", case_tags: ["akk"] },
    "bleiben": { es: "quedarse / permanecer", perfekt: "ist geblieben", praeteritum: "er/sie/es blieb", case_tags: ["nom", "intrans"] },
    "entstehen": { es: "surgir / originarse", perfekt: "ist entstanden", praeteritum: "er/sie/es entstand", case_tags: ["intrans"] },
    "erforschen": { es: "investigar / explorar", perfekt: "hat erforscht", praeteritum: "er/sie/es erforschte", case_tags: ["akk"] },
    "erinnern": { es: "recordar / acordarse", perfekt: "hat erinnert", praeteritum: "er/sie/es erinnerte", case_tags: ["💡 Reflexive", "prep:an"] }, // Reflexive usage is common (sich erinnern an)
    "liefern": { es: "entregar / suministrar", perfekt: "hat geliefert", praeteritum: "er/sie/es lieferte", case_tags: ["akk", "dat"] },
    "retten": { es: "salvar / rescatar", perfekt: "hat gerettet", praeteritum: "er/sie/es rettete", case_tags: ["akk"] },
    "sitzen": { es: "estar sentado", perfekt: "hat gesessen", praeteritum: "er/sie/es saß", case_tags: ["intrans"] },
    "sortieren": { es: "ordenar / clasificar", perfekt: "hat sortiert", praeteritum: "er/sie/es sortierte", case_tags: ["akk"] },
    "spenden": { es: "donar", perfekt: "hat gespendet", praeteritum: "er/sie/es spendete", case_tags: ["akk", "dat"] },
    "teilnehmen": { es: "participar", perfekt: "hat teilgenommen", praeteritum: "er/sie/es nahm teil", case_tags: ["intrans", "prep:an"] },
    "trinken": { es: "beber", perfekt: "hat getrunken", praeteritum: "er/sie/es trank", case_tags: ["akk"] },
    "verbieten": { es: "prohibir", perfekt: "hat verboten", praeteritum: "er/sie/es verbot", case_tags: ["dat", "akk"] },
    "verzichten": { es: "renunciar / desistir", perfekt: "hat verzichtet", praeteritum: "er/sie/es verzichtete", case_tags: ["intrans", "prep:auf"] },
    "wünschen": { es: "desear", perfekt: "hat gewünscht", praeteritum: "er/sie/es wünschte", case_tags: ["dat", "akk"] }, // Sich etwas wünschen
    "ändern": { es: "cambiar / modificar", perfekt: "hat geändert", praeteritum: "er/sie/es änderte", case_tags: ["akk", "💡 Reflexive"] }, // tr or refl
    "üben": { es: "practicar", perfekt: "hat geübt", praeteritum: "er/sie/es übte", case_tags: ["akk"] },
    "überweisen": { es: "transferir (dinero)", perfekt: "hat überwiesen", praeteritum: "er/sie/es überwies", case_tags: ["akk"] }
};

// Helper to find group info
function findGroupInfo(verb) {
    const levels = ['A1_1', 'A1_2', 'A2_1', 'A2_2', 'B1_1', 'B2_1'];
    for (const level of levels) {
        const levelDir = path.join(groupsDir, level);
        if (!fs.existsSync(levelDir)) continue;

        const files = fs.readdirSync(levelDir);
        for (const file of files) {
            if (file.endsWith('.json') && file.includes('_group_')) {
                const content = fs.readFileSync(path.join(levelDir, file), 'utf8');
                const json = JSON.parse(content);
                if (json.verbs && json.verbs.includes(verb)) {
                    // Extract group number from filename or json
                    const groupNum = file.match(/group_(\d+)/)[1];
                    return {
                        level: json.level,
                        group: parseInt(groupNum),
                        theme: json.theme || json.germanName
                    };
                }
            }
        }
    }
    return { level: "Unknown", group: 0, theme: "Restored" };
}

console.log("Starting restoration...");

Object.keys(restorationData).forEach(verb => {
    const fileName = `${verb}.json`;
    const filePath = path.join(cardsDir, fileName);
    const data = restorationData[verb];

    // Find Group Info
    const groupInfo = findGroupInfo(verb);

    const cardContent = {
        verb: verb,
        level: groupInfo.level,
        perfekt: data.perfekt,
        emoji: "📝", // Default emoji for restored
        case_tags: data.case_tags,
        es: data.es,
        es_perfekt: "---", // Placeholder
        en_verb: "(restored)",
        en_perfekt: "(restored)",
        praeteritum: data.praeteritum,
        es_praeteritum: "---",
        en_praeteritum: "---",
        theme: groupInfo.theme,
        group: groupInfo.group,
        wortfamilie: [],
        wortfeld: [],
        Wortart_type: "verb"
    };

    fs.writeFileSync(filePath, JSON.stringify(cardContent, null, 2), 'utf8');
    console.log(`Restored: ${verb} (Level: ${groupInfo.level}, Group: ${groupInfo.group})`);
});

console.log("Restoration complete.");
