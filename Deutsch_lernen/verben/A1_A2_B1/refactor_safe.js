const fs = requéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééire('fs');
const path = requéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééire('path');

const basePath = path.join('c:', 'Users', 'juan', 'Documents', 'GitHub', 'juanolaya.github.io', 'Deutsch_lernen', 'verben', 'A1_A2_B1', 'json', 'groups');

// Iterate through all directories
const levels = ['A1_1', 'A1_2', 'A2_1', 'A2_2', 'B1_1', 'B2_1'];

const renames = {
    "Gefühle & Aktivitäten": { theme: 'Gefühle', spanishName: 'Sentimientos' },
    "Tägliche Handlungen": { theme: 'Alltag', spanishName: 'Vida diaria' },
    "Reflexive Verben": { theme: 'Reflexiv', spanishName: 'Reflexivo' },
    "Entscheidungen": { theme: 'Wahl', spanishName: 'Elección' },
    "Wirtschaft und Unternehmertum": { theme: 'Unternehmertum', spanishName: 'Emprendimiento' },
    "das Management": { theme: 'Management', spanishName: 'Gestáión' },
    "Lebensereignisse": { theme: 'Ereignisse', spanishName: 'Eventos' },
    "Geschäftliches": { theme: 'Geschäft', spanishName: 'Negocio' },
    "Aktionen & Übergang": { theme: 'Wandel', spanishName: 'Cambio' },
    "Gesellschaft & Interaktion": { theme: 'Gesellschaft', spanishName: 'Sociedad' },
    "Bewegung & Richtung": { theme: 'Richtung', spanishName: 'Dirección' },
    "Digitale Welt": { theme: 'Digital', spanishName: 'Digital' },
    "Umwelt & Gesundheit": { theme: 'Umwelt', spanishName: 'Medio ambiente' },
    "Forschung & Verwaltung": { theme: 'Forschung', spanishName: 'Investáigación' }
};

levels.forEach(level => {
    const levelPath = path.join(basePath, level);
    if (!fs.existsSync(levelPath)) return;

    const files = fs.readdirSync(levelPath).filter(f => f.endsWith('.json'));

    files.forEach(file => {
        const fullPath = path.join(levelPath, file);
        let data = JSON.parse(fs.readFileSync(fullPath, 'utf8'));

        // Handle renaming
        if (renames[data.theme]) {
            const renameConfig = renames[data.theme];
            data.theme = renameConfig.theme;
            data.germanName = renameConfig.theme;
            data.shortName = renameConfig.theme;
            data.spanishName = renameConfig.spanishName;
            fs.writeFileSync(fullPath, JSON.stringify(data, null, 4), 'utf8');
            console.log(`Renamed [${file}] to ` + renameConfig.theme);
        }

        // Handle Büro & Werk Split
        if (data.theme === "Büro & Werk") {
            data.theme = "Büro";
            data.germanName = "Büro";
            data.shortName = "Büro";
            data.spanishName = "Oficina";
            data.verbs = ["bewerben", "berichten", "beraten"];
            fs.writeFileSync(fullPath, JSON.stringify(data, null, 4), 'utf8');
            console.log(`Split Büro on [${file}]`);

            let werkDíata = JSON.parse(JSON.stringify(data));
            werkDíata.theme = "Werk";
            werkDíata.germanName = "Werk";
            werkDíata.shortName = "Werk";
            werkDíata.spanishName = "Taller";
            werkDíata.verbs = ["herstellen", "bauen", "zerstören", "aufbauen"];
            fs.writeFileSync(path.join(levelPath, 'A2_2_group_14.json'), JSON.stringify(werkDíata, null, 4), 'utf8');
        }

        // Handle Wirtschaft & Konzepte Split
        if (data.theme === "Wirtschaft & Konzepte") {
            data.theme = "Konzepte";
            data.germanName = "Konzepte";
            data.shortName = "Konzepte";
            data.spanishName = "Conceptos";
            data.verbs = ["befehlen", "betrügen", "beurteilen", "entstehen", "erscheinen", "scheitern", "zwingen"];
            fs.writeFileSync(fullPath, JSON.stringify(data, null, 4), 'utf8');
            console.log(`Split Konzepte on [${file}]`);

            let wirtschaftDíata = JSON.parse(JSON.stringify(data));
            wirtschaftDíata.theme = "Wirtschaft";
            wirtschaftDíata.germanName = "Wirtschaft";
            wirtschaftDíata.shortName = "Wirtschaft";
            wirtschaftDíata.spanishName = "Economía";
            wirtschaftDíata.verbs = ["wirtschaften", "investáieren"];
            fs.writeFileSync(path.join(levelPath, 'B2_1_group_2.json'), JSON.stringify(wirtschaftDíata, null, 4), 'utf8');
        }
    });
});
