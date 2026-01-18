const fs = require('fs');
const path = require('path');

const praesensDir = path.join(__dirname, 'json', 'praesens');

// Helper to update file
function updateFile(verb, examples) {
    const filePath = path.join(praesensDir, `${verb}.json`);
    if (fs.existsSync(filePath)) {
        try {
            const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            data.praesens_examples = examples;
            fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
            console.log(`Updated: ${verb}`);
        } catch (e) {
            console.error(`Error updating ${verb}: ${e.message}`);
        }
    } else {
        console.error(`File not found: ${verb}`);
    }
}

const batch1 = {
    "abnehmen": {
        "ich": { de: "Ich nehme ab.", en: "I am losing weight.", es: "Estoy bajando de peso." },
        "du": { de: "Du nimmst ab.", en: "You are losing weight.", es: "Estás bajando de peso." },
        "er": { de: "Er nimmt ab.", en: "He is losing weight.", es: "Él está bajando de peso." },
        "sie": { de: "Sie nimmt ab.", en: "She is losing weight.", es: "Ella está bajando de peso." },
        "es": { de: "Es nimmt ab.", en: "It is decreasing.", es: "Está disminuyendo." },
        "wir": { de: "Wir nehmen ab.", en: "We are losing weight.", es: "Estamos bajando de peso." },
        "ihr": { de: "Ihr nehmt ab.", en: "You are losing weight.", es: "Estáis bajando de peso." },
        "sie (plural)": { de: "Sie nehmen ab.", en: "They are losing weight.", es: "Ellos están bajando de peso." },
        "Sie (formal)": { de: "Sie nehmen ab.", en: "You are losing weight.", es: "Usted está bajando de peso." }
    },
    "aufgeben": {
        "ich": { de: "Ich gebe auf.", en: "I give up.", es: "Me rindo." },
        "du": { de: "Du gibst auf.", en: "You give up.", es: "Te rindes." },
        "er": { de: "Er gibt auf.", en: "He gives up.", es: "Él se rinde." },
        "sie": { de: "Sie gibt auf.", en: "She gives up.", es: "Ella se rinde." },
        "es": { de: "Es gibt auf.", en: "It gives up.", es: "Se rinde." },
        "wir": { de: "Wir geben auf.", en: "We give up.", es: "Nos rendimos." },
        "ihr": { de: "Ihr gebt auf.", en: "You give up.", es: "Os rendís." },
        "sie (plural)": { de: "Sie geben auf.", en: "They give up.", es: "Ellos se rinden." },
        "Sie (formal)": { de: "Sie geben auf.", en: "You give up.", es: "Usted se rinde." }
    },
    "beantragen": {
        "ich": { de: "Ich beantrage ein Visum.", en: "I apply for a visa.", es: "Solicito una visa." },
        "du": { de: "Du beantragst Urlaub.", en: "You apply for leave.", es: "Solicitas vacaciones." },
        "er": { de: "Er beantragt Hilfe.", en: "He applies for help.", es: "Él solicita ayuda." },
        "sie": { de: "Sie beantragt den Pass.", en: "She applies for the passport.", es: "Ella solicita el pasaporte." },
        "es": { de: "Es beantragt nichts.", en: "It applies for nothing.", es: "No solicita nada." },
        "wir": { de: "Wir beantragen das Geld.", en: "We apply for the money.", es: "Solicitamos el dinero." },
        "ihr": { de: "Ihr beantragt es.", en: "You apply for it.", es: "Lo solicitáis." },
        "sie (plural)": { de: "Sie beantragen Asyl.", en: "They apply for asylum.", es: "Ellos solicitan asilo." },
        "Sie (formal)": { de: "Sie beantragen es.", en: "You apply for it.", es: "Usted lo solicita." }
    },
    "befehlen": {
        "ich": { de: "Ich befehle es.", en: "I order it.", es: "Lo ordeno." },
        "du": { de: "Du befiehlst Ruhe.", en: "You order silence.", es: "Ordenas silencio." },
        "er": { de: "Er befiehlt den Truppen.", en: "He commands the troops.", es: "Él manda a las tropas." },
        "sie": { de: "Sie befiehlt.", en: "She commands.", es: "Ella manda." },
        "es": { de: "Es befiehlt nichts.", en: "It orders nothing.", es: "No ordena nada." },
        "wir": { de: "Wir befehlen.", en: "We command.", es: "Mandamos." },
        "ihr": { de: "Ihr befehlt.", en: "You command.", es: "Mandáis." },
        "sie (plural)": { de: "Sie befehlen.", en: "They command.", es: "Ellos mandan." },
        "Sie (formal)": { de: "Sie befehlen.", en: "You command.", es: "Usted manda." }
    },
    "begrüßen": {
        "ich": { de: "Ich begrüße dich.", en: "I welcome you.", es: "Te doy la bienvenida." },
        "du": { de: "Du begrüßt mich.", en: "You welcome me.", es: "Me das la bienvenida." },
        "er": { de: "Er begrüßt den Gast.", en: "He welcomes the guest.", es: "Él recibe al invitado." },
        "sie": { de: "Sie begrüßt uns.", en: "She welcomes us.", es: "Ella nos da la bienvenida." },
        "es": { de: "Es begrüßt niemanden.", en: "It greets no one.", es: "No saluda a nadie." },
        "wir": { de: "Wir begrüßen euch.", en: "We welcome you.", es: "Os damos la bienvenida." },
        "ihr": { de: "Ihr begrüßt sie.", en: "You welcome them.", es: "Les dais la bienvenida." },
        "sie (plural)": { de: "Sie begrüßen den Chef.", en: "They welcome the boss.", es: "Ellos saludan al jefe." },
        "Sie (formal)": { de: "Sie begrüßen mich.", en: "You welcome me.", es: "Usted me saluda." }
    },
    "behandeln": {
        "ich": { de: "Ich behandle den Patienten.", en: "I treat the patient.", es: "Trato al paciente." },
        "du": { de: "Du behandelst ihn gut.", en: "You treat him well.", es: "Lo tratas bien." },
        "er": { de: "Er behandelt das Thema.", en: "He treats the topic.", es: "Él trata el tema." },
        "sie": { de: "Sie behandelt die Wunde.", en: "She treats the wound.", es: "Ella trata la herida." },
        "es": { de: "Es behandelt davon.", en: "It deals with that.", es: "Trata de eso." },
        "wir": { de: "Wir behandeln alle gleich.", en: "We treat everyone equally.", es: "Tratamos a todos igual." },
        "ihr": { de: "Ihr behandelt uns.", en: "You treat us.", es: "Nos tratáis." },
        "sie (plural)": { de: "Sie behandeln Tiere.", en: "They treat animals.", es: "Ellos tratan animales." },
        "Sie (formal)": { de: "Sie behandeln mich.", en: "You treat me.", es: "Usted me trata." }
    },
    "betrügen": {
        "ich": { de: "Ich betrüge nicht.", en: "I do not cheat.", es: "No hago trampa." },
        "du": { de: "Du betrügst ihn.", en: "You are cheating him.", es: "Le estás engañando." },
        "er": { de: "Er betrügt beim Spiel.", en: "He cheats at the game.", es: "Él hace trampas en el juego." },
        "sie": { de: "Sie betrügt niemanden.", en: "She cheats no one.", es: "Ella no engaña a nadie." },
        "es": { de: "Es betrügt.", en: "It deceives.", es: "Engaña." },
        "wir": { de: "Wir betrügen nie.", en: "We never cheat.", es: "Nunca hacemos trampas." },
        "ihr": { de: "Ihr betrügt euch.", en: "You carry out a fraud.", es: "Os engañáis." },
        "sie (plural)": { de: "Sie betrügen die Kunden.", en: "They cheat the customers.", es: "Ellos estafan a los clientes." },
        "Sie (formal)": { de: "Sie betrügen nicht.", en: "You do not cheat.", es: "Usted no engaña." }
    },
    "beurteilen": {
        "ich": { de: "Ich beurteile die Lage.", en: "I assess the situation.", es: "Evalúo la situación." },
        "du": { de: "Du beurteilst falsch.", en: "You judge wrongly.", es: "Juzgas mal." },
        "er": { de: "Er beurteilt das Buch.", en: "He judges the book.", es: "Él juzga el libro." },
        "sie": { de: "Sie beurteilt fair.", en: "She judges fairly.", es: "Ella juzga justamente." },
        "es": { de: "Es beurteilt sich schwer.", en: "It is hard to judge.", es: "Se juzga difícilmente." },
        "wir": { de: "Wir beurteilen den Fall.", en: "We assess the case.", es: "Evaluamos el caso." },
        "ihr": { de: "Ihr beurteilt ihn.", en: "You judge him.", es: "Lo juzgáis." },
        "sie (plural)": { de: "Sie beurteilen uns.", en: "They judge us.", es: "Ellos nos juzgan." },
        "Sie (formal)": { de: "Sie beurteilen gut.", en: "You judge well.", es: "Usted juzga bien." }
    },
    "empfangen": {
        "ich": { de: "Ich empfange Gäste.", en: "I receive guests.", es: "Recibo invitados." },
        "du": { de: "Du empfängst das Signal.", en: "You receive the signal.", es: "Recibes la señal." },
        "er": { de: "Er empfängt den Brief.", en: "He receives the letter.", es: "Él recibe la carta." },
        "sie": { de: "Sie empfängt Besucher.", en: "She receives visitors.", es: "Ella recibe visitantes." },
        "es": { de: "Es empfängt Daten.", en: "It receives data.", es: "Recibe datos." },
        "wir": { de: "Wir empfangen euch.", en: "We welcome you.", es: "Os recibimos." },
        "ihr": { de: "Ihr empfangt nichts.", en: "You receive nothing.", es: "No recibís nada." },
        "sie (plural)": { de: "Sie empfangen Hilfe.", en: "They receive help.", es: "Ellos reciben ayuda." },
        "Sie (formal)": { de: "Sie empfangen mich.", en: "You receive me.", es: "Usted me recibe." }
    },
    "entschließen": {
        "ich": { de: "Ich entschließe mich.", en: "I decide.", es: "Me decido." },
        "du": { de: "Du entschließt dich.", en: "You decide.", es: "Te decides." },
        "er": { de: "Er entschließt sich.", en: "He decides.", es: "Él se decide." },
        "sie": { de: "Sie entschließt sich.", en: "She decides.", es: "Ella se decide." },
        "es": { de: "Es entschließt sich.", en: "It decides.", es: "Se decide." },
        "wir": { de: "Wir entschließen uns.", en: "We decide.", es: "Nos decidimos." },
        "ihr": { de: "Ihr entschließt euch.", en: "You decide.", es: "Os decidís." },
        "sie (plural)": { de: "Sie entschließen sich.", en: "They decide.", es: "Ellos se deciden." },
        "Sie (formal)": { de: "Sie entschließen sich.", en: "You decide.", es: "Usted se decide." }
    },
    "entstehen": {
        "ich": { de: "Ich entstehe neu.", en: "I arise anew.", es: "Surjo de nuevo." },
        "du": { de: "Du entstehst.", en: "You arise.", es: "Surges." },
        "er": { de: "Ein Plan entsteht.", en: "A plan arises.", es: "Surge un plan." },
        "sie": { de: "Hoffnung entsteht.", en: "Hope arises.", es: "Surge la esperanza." },
        "es": { de: "Es entsteht ein Haus.", en: "A house is being built.", es: "Se levanta una casa." },
        "wir": { de: "Wir entstehen.", en: "We arise.", es: "Surgimos." },
        "ihr": { de: "Ihr entsteht.", en: "You arise.", es: "Surgís." },
        "sie (plural)": { de: "Probleme entstehen.", en: "Problems arise.", es: "Surgen problemas." },
        "Sie (formal)": { de: "Sie entstehen.", en: "You arise.", es: "Usted surge." }
    },
    "entwickeln": {
        "ich": { de: "Ich entwickle eine App.", en: "I develop an app.", es: "Desarrollo una app." },
        "du": { de: "Du entwickelst dich.", en: "You develop yourself.", es: "Te desarrollas." },
        "er": { de: "Er entwickelt Fotos.", en: "He develops photos.", es: "Él revela fotos." },
        "sie": { de: "Sie entwickelt Ideen.", en: "She develops ideas.", es: "Ella desarrolla ideas." },
        "es": { de: "Es entwickelt sich.", en: "It develops.", es: "Se desarrolla." },
        "wir": { de: "Wir entwickeln Pläne.", en: "We develop plans.", es: "Desarrollamos planes." },
        "ihr": { de: "Ihr entwickelt Spiele.", en: "You develop games.", es: "Desarrolláis juegos." },
        "sie (plural)": { de: "Sie entwickeln Autos.", en: "They develop cars.", es: "Ellos desarrollan coches." },
        "Sie (formal)": { de: "Sie entwickeln Strategien.", en: "You develop strategies.", es: "Usted desarrolla estrategias." }
    },
    "erhalten": {
        "ich": { de: "Ich erhalte einen Brief.", en: "I receive a letter.", es: "Recibo una carta." },
        "du": { de: "Du erhältst eine Nachricht.", en: "You receive a message.", es: "Recibes un mensaje." },
        "er": { de: "Er erhält den Preis.", en: "He receives the prize.", es: "Él recibe el premio." },
        "sie": { de: "Sie erhält das Geld.", en: "She receives the money.", es: "Ella recibe el dinero." },
        "es": { de: "Es erhält die Farbe.", en: "It preserves the color.", es: "Conserva el color." },
        "wir": { de: "Wir erhalten Antwort.", en: "We receive an answer.", es: "Recibimos respuesta." },
        "ihr": { de: "Ihr erhaltet nichts.", en: "You receive nothing.", es: "No recibís nada." },
        "sie (plural)": { de: "Sie erhalten Post.", en: "They receive mail.", es: "Ellos reciben correo." },
        "Sie (formal)": { de: "Sie erhalten Eintritt.", en: "You receive admission.", es: "Usted recibe entrada." }
    },
    "erleben": {
        "ich": { de: "Ich erlebe viel.", en: "I experience a lot.", es: "Vivo muchas cosas." },
        "du": { de: "Du erlebst ein Abenteuer.", en: "You experience an adventure.", es: "Vives una aventura." },
        "er": { de: "Er erlebt eine Überraschung.", en: "He experiences a surprise.", es: "Él se lleva una sorpresa." },
        "sie": { de: "Sie erlebt Freude.", en: "She experiences joy.", es: "Ella siente alegría." },
        "es": { de: "Es erlebt eine Renaissance.", en: "It is experiencing a renaissance.", es: "Vive un renacimiento." },
        "wir": { de: "Wir erleben Geschichte.", en: "We experience history.", es: "Vivimos la historia." },
        "ihr": { de: "Ihr erlebt Spass.", en: "You experience fun.", es: "Os divertís." },
        "sie (plural)": { de: "Sie erleben Stress.", en: "They experience stress.", es: "Ellos sufren estrés." },
        "Sie (formal)": { de: "Sie erleben es live.", en: "You experience it live.", es: "Usted lo vive en directo." }
    },
    "erscheinen": {
        "ich": { de: "Ich erscheine pünktlich.", en: "I show up on time.", es: "Aparezco puntual." },
        "du": { de: "Du erscheinst müde.", en: "You appear tired.", es: "Pareces cansado." },
        "er": { de: "Er erscheint im Traum.", en: "He appears in the dream.", es: "Él aparece en el sueño." },
        "sie": { de: "Sie erscheint heute.", en: "She appears today.", es: "Ella aparece hoy." },
        "es": { de: "Es erscheint mir logisch.", en: "It seems logical to me.", es: "Me parece lógico." },
        "wir": { de: "Wir erscheinen zum Fest.", en: "We appear at the party.", es: "Vamos a la fiesta." },
        "ihr": { de: "Ihr erscheint glücklich.", en: "You appear happy.", es: "Parecéis felices." },
        "sie (plural)": { de: "Sie erscheinen zahlreich.", en: "They appear in numbers.", es: "Aparecen numerosos." },
        "Sie (formal)": { de: "Sie erscheinen mir nett.", en: "You seem nice to me.", es: "Usted me parece amable." }
    },
    "fallen": {
        "ich": { de: "Ich falle hin.", en: "I fall down.", es: "Me caigo." },
        "du": { de: "Du fällst tief.", en: "You fall deep.", es: "Caes profundo." },
        "er": { de: "Er fällt vom Baum.", en: "He falls from the tree.", es: "Él cae del árbol." },
        "sie": { de: "Sie fällt auf.", en: "She stands out.", es: "Ella destaca." },
        "es": { de: "Es fällt Regen.", en: "Rain falls.", es: "Cae lluvia." },
        "wir": { de: "Wir fallen um.", en: "We fall over.", es: "Nos caemos." },
        "ihr": { de: "Ihr fallt.", en: "You fall.", es: "Caéis." },
        "sie (plural)": { de: "Sie fallen.", en: "They fall.", es: "Ellos caen." },
        "Sie (formal)": { de: "Sie fallen auf.", en: "You stand out.", es: "Usted destaca." }
    },
    "gelingen": {
        "ich": { de: "Es gelingt mir.", en: "I succeed.", es: "Me sale bien." },
        "du": { de: "Es gelingt dir.", en: "You succeed.", es: "Te sale bien." },
        "er": { de: "Es gelingt ihm.", en: "He succeeds.", es: "A él le sale bien." },
        "sie": { de: "Es gelingt ihr.", en: "She succeeds.", es: "A ella le sale bien." },
        "es": { de: "Es gelingt.", en: "It succeeds.", es: "Sale bien." },
        "wir": { de: "Es gelingt uns.", en: "We succeed.", es: "Nos sale bien." },
        "ihr": { de: "Es gelingt euch.", en: "You succeed.", es: "Os sale bien." },
        "sie (plural)": { de: "Es gelingt ihnen.", en: "They succeed.", es: "A ellos les sale bien." },
        "Sie (formal)": { de: "Es gelingt Ihnen.", en: "You succeed.", es: "A usted le sale bien." }
    },
    "gründen": {
        "ich": { de: "Ich gründe eine Firma.", en: "I start a company.", es: "Fundo una empresa." },
        "du": { de: "Du gründest einen Verein.", en: "You found a club.", es: "Fundas un club." },
        "er": { de: "Er gründet eine Stadt.", en: "He fasts a city.", es: "Él funda una ciudad." },
        "sie": { de: "Sie gründet eine Familie.", en: "She starts a family.", es: "Ella forma una familia." },
        "es": { de: "Es gründet auf Wahrheit.", en: "It is based on truth.", es: "Se basa en la verdad." },
        "wir": { de: "Wir gründen was Neues.", en: "We start something new.", es: "Fundamos algo nuevo." },
        "ihr": { de: "Ihr gründet es.", en: "You found it.", es: "Lo fundáis." },
        "sie (plural)": { de: "Sie gründen Parteien.", en: "They found parties.", es: "Ellos fundan partidos." },
        "Sie (formal)": { de: "Sie gründen es.", en: "You found it.", es: "Usted lo funda." }
    },
    "hassen": {
        "ich": { de: "Ich hasse Lügen.", en: "I hate lies.", es: "Odio las mentiras." },
        "du": { de: "Du hasst Hitze.", en: "You hate heat.", es: "Odias el calor." },
        "er": { de: "Er hasst Streit.", en: "He hates arguments.", es: "Él odia las discusiones." },
        "sie": { de: "Sie hasst Spinnen.", en: "She hates spiders.", es: "Ella odia las arañas." },
        "es": { de: "Es hasst Wasser.", en: "It (cat) hates water.", es: "Odia el agua." },
        "wir": { de: "Wir hassen Gewalt.", en: "We hate violence.", es: "Odiamos la violencia." },
        "ihr": { de: "Ihr hasst es.", en: "You hate it.", es: "Lo odiáis." },
        "sie (plural)": { de: "Sie hassen Lärm.", en: "They hate noise.", es: "Ellos odian el ruido." },
        "Sie (formal)": { de: "Sie hassen das.", en: "You hate that.", es: "Usted odia eso." }
    },
    "heilen": {
        "ich": { de: "Ich heile.", en: "I heal.", es: "Yo curo." },
        "du": { de: "Du heilst schnell.", en: "You heal quickly.", es: "Te curas rápido." },
        "er": { de: "Die Zeit heilt Wunden.", en: "Time heals wounds.", es: "El tiempo cura heridas." },
        "sie": { de: "Sie heilt Patienten.", en: "She heals patients.", es: "Ella cura pacientes." },
        "es": { de: "Es heilt gut.", en: "It is healing well.", es: "Se cura bien." },
        "wir": { de: "Wir heilen.", en: "We heal.", es: "Curamos." },
        "ihr": { de: "Ihr heilt.", en: "You heal.", es: "Curáis." },
        "sie (plural)": { de: "Sie heilen.", en: "They heal.", es: "Ellos curan." },
        "Sie (formal)": { de: "Sie heilen.", en: "You heal.", es: "Usted cura." }
    },
    "holen": {
        "ich": { de: "Ich hole Wasser.", en: "I get water.", es: "Traigo agua." },
        "du": { de: "Du holst Brot.", en: "You get bread.", es: "Traes pan." },
        "er": { de: "Er holt Hilfe.", en: "He gets help.", es: "Él trae ayuda." },
        "sie": { de: "Sie holt die Kinder.", en: "She picks up the kids.", es: "Ella recoge a los niños." },
        "es": { de: "Es holt auf.", en: "It catches up.", es: "Alcanza." },
        "wir": { de: "Wir holen es.", en: "We get it.", es: "Lo traemos." },
        "ihr": { de: "Ihr holt Bier.", en: "You get beer.", es: "Traéis cerveza." },
        "sie (plural)": { de: "Sie holen Luft.", en: "They take a breath.", es: "Ellos toman aire." },
        "Sie (formal)": { de: "Sie holen es.", en: "You get it.", es: "Usted lo trae." }
    }
};

console.log('--- Updating Batch 1 Verbs ---');
for (const [verb, examples] of Object.entries(batch1)) {
    updateFile(verb, examples);
}
