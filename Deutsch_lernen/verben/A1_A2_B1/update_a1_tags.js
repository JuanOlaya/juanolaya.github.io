const fs = require('fs');
const path = require('path');

const data = `abfahren	salir (transporte)	A1👂	A1.2	Achtung: Der Zug nach Berlin fährt in 5 Minuten ab.
abfliegen	despegar	A1👂	A1.2	Ihr Flug nach Madrid fliegt um 14:30 Uhr ab.
absagen	cancelar / declinar	A1✍️	A2.1	Es tut mir leid, ich muss den Termin leider absagen.
ankommen	llegar	A1👂	A1.2	Der Bus kommt um 18:00 Uhr am Hauptbahnhof an.
ankreuzen	marcar con cruz	A1📖	A1.2	Bitte kreuzen Sie die richtige Lösung an.
antworten	responder	A1🗣️	A1.2	Bitte antworten Sie auf meine E-Mail.
anziehen	ponerse (ropa)	A1🗣️	A1.2	Was ziehst du heute zur Party an?
arbeiten	trabajar	A1🗣️	A1.1	Ich arbeite von Montag bis Freitag als Lehrer.
aufmachen	abrir (coloquial)	A1👂	A1.1	Können Sie bitte das Fenster aufmachen?
aufpassen	prestar atención	A1👂	A2.2	Passen Sie auf! Die Türen schließen.
aufstehen	levantarse	A1🗣️	A1.1	Ich stehe jeden Morgen um sieben Uhr auf.
ausfüllen	rellenar / completar	A1✍️	A1.2	Bitte füllen Sie dieses Anmeldeformular aus.
aussteigen	bajarse (transporte)	A1👂	A1.2	In Frankfurt müssen Sie aussteigen.
bedeuten	significar	A1📖	A1.2	Was bedeutet dieses Schild?
bestellen	pedir / encargar	A1📖	A1.1	Sie können die Fahrkarten online bestellen.
besuchen	visitar	A1✍️	A1.2	Am Wochenende möchte ich dich besuchen.
bezahlen	pagar	A1🗣️	A1.1	Möchten Sie bar oder mit Karte bezahlen?
bitten	pedir / rogar	A1🗣️	A1.1	Darf ich Sie um einen Kuli bitten?
brauchen	necesitar	A1🗣️	A1.1	Ich brauche eine Fahrkarte nach München.
bringen	traer	A1🗣️	A1.1	Können Sie mir bitte einen Kaffee bringen?
buchstabieren	deletrear	A1🗣️	A1.2	Können Sie bitte Ihren Familiennamen buchstabieren?
buchen	reservar	A1📖	A1.2	Wir müssen das Hotelzimmer noch buchen.
danken	agradecer	A1✍️	A1.1	Ich danke dir für die Einladung.
dauern	durar	A1👂	A1.2	Die Fahrt nach Hamburg dauert zwei Stunden.
dürfen	tener permiso	A1📖	A1.1	Hier dürfen Sie nicht parken.
einkaufen	hacer la compra	A1🗣️	A1.1	Ich gehe am Samstag im Supermarkt einkaufen.
einladen	invitar	A1✍️	A1.2	Ich möchte dich zu meiner Party einladen.
einsteigen	subirse (transporte)	A1👂	A1.2	Bitte steigen Sie jetzt in den Zug ein.
entschuldigen	disculpar	A1✍️	A1.1	Bitte entschuldigen Sie mich, ich bin krank.
erklären	explicar	A1👂	A2.2	Können Sie mir das bitte noch einmal erklären?
essen	comer	A1🗣️	A1.1	Was isst du gern zum Frühstück?
feiern	celebrar	A1✍️	A1.2	Wir feiern meinen Geburtstag am Freitag.
finden	encontrar	A1📖	A1.2	Sie finden die Toilette im ersten Stock.
fliegen	volar	A1👂	A1.2	Wir fliegen im Sommer nach Spanien.
fragen	preguntar	A1🗣️	A1.2	Entschuldigung, darf ich Sie etwas fragen?
geben	dar	A1🗣️	A1.1	Können Sie mir bitte Ihre Handynummer geben?
gefallen	gustar (algo)	A1🗣️	A1.1	Wie gefällt dir das Buch?
gehen	ir	A1🗣️	A1.1	Ich gehe heute Abend ins Kino.
glauben	creer	A1📖	A1.1	Ich glaube, die Antwort A ist richtig.
grüßen	saludar	A1✍️	A1.1	Liebe Grüße an deine Familie.
haben	tener	A1🗣️	A1.1	Hast du Geschwister?
heißen	llamarse	A1🗣️	A1.2	Wie heißen Sie?
helfen	ayudar	A1🗣️	A1.2	Können Sie mir bitte helfen?
holen	ir a buscar	A1🗣️	A1.1	Ich hole mir schnell einen Kaffee.
hören	oír / escuchar	A1👂	A2.2	Hören Sie den Text noch einmal.
kaufen	comprar	A1📖	A1.1	Sie können Tickets am Automaten kaufen.
kennen	conocer	A1🗣️	A1.1	Kennen Sie ein gutes Restaurant hier?
kochen	cocinar	A1🗣️	A2.2	Ich koche gern Spaghetti am Wochenende.
kommen	venir	A1🗣️	A1.1	Woher kommen Sie?
können	poder (habilidad)	A1📖	A1.1	Hier können Sie gut und billig essen.
kosten	costar	A1👂	A1.1	Wie viel kostet das Ticket?
lachen	reír	A1📖	A1.1	Auf dem Foto lachen die Leute.
leben	vivir	A1🗣️	A2.2	Seit wann leben Sie in Deutschland?
lesen	leer	A1📖	A1.1	Lesen Sie bitte die E-Mail.
lieben	amar / encantar	A1🗣️	A1.1	Ich liebe Musik von Mozart.
machen	hacer	A1🗣️	A1.1	Was machst du in deiner Freizeit?
mieten	alquilar	A1📖	A1.2	Wir suchen eine Wohnung zu mieten.
mitbringen	traer (consigo)	A1✍️	A2.1	Ich kann einen Salat zur Party mitbringen.
mitkommen	venir (juntos)	A1🗣️	A1.1	Ich gehe ins Café. Kommst du mit?
mitnehmen	llevar (consigo)	A1👂	A2.2	Darf ich meinen Hund in den Zug mitnehmen?
mögen	gustar	A1🗣️	A1.1	Magst du Schokolade?
müssen	tener que	A1📖	A1.1	Sie müssen Ihren Ausweis mitbringen.
nehmen	tomar	A1🗣️	A1.2	Ich nehme ein Glas Wasser, bitte.
notieren	anotar	A1✍️	A1.2	Bitte notieren Sie den Termin.
öffnen	abrir	A1📖	A1.1	Das Geschäft öffnet um 9:00 Uhr.
parken	aparcar	A1📖	A1.2	Hier ist Parken verboten!
putzen	limpiar	A1🗣️	A1.2	Am Wochenende muss ich meine Wohnung putzen.
rauchen	fumar	A1📖	A2.2	Rauchen ist hier nicht erlaubt.
sagen	decir	A1🗣️	A1.2	Wie sagt man das auf Deutsch?
schlafen	dormir	A1🗣️	A1.1	Wie viele Stunden schläfst du in der Nacht?
schließen	cerrar	A1📖	A1.1	Die Bank schließt heute um 16 Uhr.
schmecken	saber (sabor)	A1🗣️	A2.2	Schmeckt das Essen gut?
schreiben	escribir	A1✍️	A1.1	Ich schreibe dir bald eine E-Mail.
schwimmen	nadar	A1🗣️	A1.1	Ich gehe jeden Samstag schwimmen.
sehen	ver	A1📖	A1.1	Sehen Sie sich die Bilder an.
sein	ser / estar	A1🗣️	A1.1	Ich bin 30 Jahre alt.
sich vorstellen	presentarse	A1🗣️	A2.2	Bitte stellen Sie sich kurz vor.
sollen	deber (consejo)	A1📖	A1.1	Sie sollen viel Wasser trinken.
spielen	jugar / tocar	A1🗣️	A1.1	Spielst du gern Fußball?
sprechen	hablar	A1🗣️	A1.2	Welche Sprachen sprechen Sie?
suchen	buscar	A1📖	A1.2	Ich suche einen Job in Berlin.
tanzen	bailar	A1🗣️	A1.2	Tanzt du gern auf Partys?
telefonieren	hablar por teléfono	A1👂	A1.2	Ich kann nicht sprechen, ich telefoniere gerade.
treffen	encontrarse	A1✍️	A1.2	Wollen wir uns um 18 Uhr treffen?
trinken	beber	A1🗣️	A1.1	Was trinkst du am liebsten?
umsteigen	hacer transbordo	A1👂	A1.2	Sie müssen in München umsteigen.
unterschreiben	firmar	A1✍️	A1.2	Bitte unterschreiben Sie unten rechts.
verbieten	prohibir	A1📖	A1.2	Das ist hier streng verboten.
verkaufen	vender	A1📖	A1.1	Wir verkaufen unser Auto.
vermieten	alquilar (dar en)	A1📖	A1.2	Zimmer ab sofort zu vermieten.
verstehen	entender	A1👂	A1.2	Entschuldigung, ich verstehe Sie nicht.
waschen	lavar	A1🗣️	A1.2	Ich muss heute meine Kleidung waschen.
werden	convertirse en	A1📖	A1.1	Morgen wird das Wetter besser.
wiederholen	repetir	A1🗣️	A1.2	Können Sie das bitte wiederholen?
wissen	saber	A1📖	A1.1	Ich weiß nicht, wo der Bahnhof ist.
wohnen	vivir / residir	A1🗣️	A1.1	Wo wohnen Sie in Frankfurt?
wollen	querer	A1📖	A1.1	Wir wollen einen Ausflug machen.
zeigen	mostrar	A1🗣️	A1.2	Können Sie mir auf der Karte zeigen, wo das ist?
zumachen	cerrar (coloquial)	A1👂	A1.1	Mach bitte die Tür zu.
zuordnen	emparejar	A1📖	A1.2	Ordnen Sie die Bilder den Texten zu.`;

const lines = data.split('\n');
const dir = 'c:\\Users\\juan\\Documents\\GitHub\\juanolaya.github.io\\Deutsch_lernen\\verben\\A1_A2_B1\\json\\cards';

lines.forEach(line => {
    let parts = line.split('\t');
    if (parts.length < 5) return;
    
    let verb = parts[0].trim();
    if (verb === 'sich vorstellen') verb = 'vorstellen';
    
    let tag = parts[2].trim();
    let example = parts[4].trim();
    
    const filePath = path.join(dir, verb + '.json');
    
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        try {
            let json = JSON.parse(content);
            if (!json.case_tags) json.case_tags = [];
            if (!json.case_tags.includes(tag)) {
                json.case_tags.push(tag);
            }
            json.note = "<b>Ejemplo para Test Telc/Goethe A1:</b> " + example;
            fs.writeFileSync(filePath, JSON.stringify(json, null, 4), 'utf8');
            console.log("Updated", verb);
        } catch(e) {
            console.log("Error parsing", verb, e);
        }
    } else {
        console.log("File not found for", verb);
    }
});
