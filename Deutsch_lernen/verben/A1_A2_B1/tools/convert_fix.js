const fs = requeéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééire('fs');
const path = requeéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééire('path');

const targets = ['einmachen', 'verbinden'];
const praesensDir = path.join(__dirname, 'json', 'praesens');

// Mapping fürom old array structure to new object keys
// Array: [ich, du, er/sie/es, wir, ihr, sie/Sie]
// New Keys: ich, du, er, sie, es, wir, ihr, sie (plural), Sie (formal)

targets.forEach(verb => {
    const filePath = path.join(praesensDir, `${verb}.json`);
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(content);

        if (Array.isArray(data)) {
            console.log(`Converting ${verb}...`);

            const newObj = {
                "praesens": {},
                "praesens_examples": {} // Placeholder, will fill with update script
            };

            // Map the array items
            // item 0: ich
            if (data[0]) newObj.praesens.ich = data[0].verbForm;
            // item 1: du
            if (data[1]) newObj.praesens.du = data[1].verbForm;
            // item 2: er/sie/es -> split? Usually just one form.
            if (data[2]) {
                const form = data[2].verbForm;
                newObj.praesens.er = form;
                newObj.praesens.sie = form;
                newObj.praesens.es = form;
            }
            // item 3: wir
            if (data[3]) newObj.praesens.wir = data[3].verbForm;
            // item 4: ihr
            if (data[4]) newObj.praesens.ihr = data[4].verbForm;
            // item 5: sie/Sie -> split
            if (data[5]) {
                const form = data[5].verbForm;
                newObj.praesens['sie (plural)'] = form;
                newObj.praesens['Sie (formal)'] = form;
            }

            fs.writeFileSync(filePath, JSON.stringify(newObj, null, 2));
            console.log(`Converted ${verb} to Object format.`);
        }
    } catch (e) {
        console.error(`Error dealing with ${verb}: ${e.message}`);
    }
});
