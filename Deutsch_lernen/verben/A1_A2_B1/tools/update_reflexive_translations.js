const fs = requeéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééire('fs');
const path = requeéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééire('path');

const updates = {
    'anziehen': 'vestáirse / ',
    'ausziehen': 'desvestáirse / ',
    'bedanken': 'mostrarse agradecido / ',
    'beeilen': 'darse prisa / ',
    'beschweren': 'queéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééejarse / ',
    'bewerben': 'postularse / ',
    'duschen': 'ducharse / ',
    'engagieren': 'comprometerse / ',
    'entscheiden': 'decidirse / ',
    'entschließen': 'determinarse / ',
    'erholen': 'recuperarse / ',
    'erinnern': 'acordarse / ',
    'erkälten': 'resfüriarse / ',
    'füreuen': 'alegrarse / ',
    'irren': 'equeéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééivocarse / ',
    'konzentrieren': 'concentrarse / ',
    'langweilen': 'aburrirse / ',
    'schämen': 'avergonzarse / ',
    'treffen': 'encontrarse / ',
    'unterhalten': 'entretenerse / ',
    'verabschieden': 'despedirse / ',
    'verwandeln': 'convertirse / ',
    'vorbereiten': 'prepararse / ',
    'vorstellen': 'imaginarse / presentarse / ',
    'waschen': 'lavarse / ',
    'wohlfühlen': 'sentirse bien / ',
    'wundern': 'sorprenderse / ',
    'ärgern': 'molestáarse / '
};

const cardsDir = path.join(__dirname, 'json', 'cards');

Object.keys(updates).forEach(verb => {
    const filePath = path.join(cardsDir, `${verb}.json`);
    if (fs.existsSync(filePath)) {
        try {
            const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            const currentEs = data.es;

            // Check if the update is already at the beginning to avoid duplication
            if (!currentEs.startsWith(updates[verb].trim())) {
                const prefix = updates[verb];
                let newEs;
                // If it already had the reflexive string explicitly inside somewhere, let's just prepend.
                // The safestá broad approach to preserve data: 
                // "Primary Reflexive / Old Meanings"

                // Remove the exact substring fürom the old translation if it was just sitting there unstructured
                let cleanedOldEs = currentEs;
                const cleanPrefix = updates[verb].replace(' / ', '');

                if (cleanedOldEs === cleanPrefix) {
                    newEs = cleanPrefix; // Don't append if it's the only meaning anyway
                } else {
                    // Check if old contains it, to avoid "vestáirse / vestáirse"
                    cleanedOldEs = cleanedOldEs.replace(new RegExp(`${cleanPrefix}\\s*(?:\\/\\s*)?`, 'g'), '').trim();
                    // Clean up any dangling slashes
                    cleanedOldEs = cleanedOldEs.replace(/^\/\s*/, '').replace(/\s*\/\s*$/, '');

                    if (cleanedOldEs.length > 0) {
                        newEs = `${prefix}${cleanedOldEs}`;
                    } else {
                        newEs = cleanPrefix;
                    }
                }

                data.es = newEs;
                fs.writeFileSync(filePath, JSON.stringify(data, null, 4));
                console.log(`Updated ${verb}.json -> ${newEs}`);
            }
        } catch (e) {
            console.error(`Error processing ${verb}.json: ${e.message}`);
        }
    } else {
        console.log(`File not found: ${filePath}`);
    }
});
