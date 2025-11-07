document.addEventListener('DOMContentLoaded', () => {
    // --- GLOBAL STATE ---
    const allVerbsData = {};
    let verbGroupsData = [];
    const totalGroups = 24;
    const germanOrdinals = ["Erste", "Zweite", "Dritte", "Vierte", "Fünfte", "Sechste", "Siebte", "Achte", "Neunte", "Zehnte", "Elfte", "Zwölfte", "Dreizehnte", "Vierzehnte", "Fünfzehnte", "Sechzehnte", "Siebzehnte", "Achtzehnte", "Neunzehnte", "Zwanzigste", "Einundzwanzigste", "Zweiundzwanzigste", "Dreiundzwanzigste", "Vierundzwanzigste"];
    const germanExampleOrdinals = ["Erstes", "Zweites", "Drittes", "Viertes", "Fünftes", "Sechstes", "Siebtes", "Achtes"];
    const savedStories = [
        `<p>Gestern <span class="highlighted-word">bin ich</span> in Berlin <span class="highlighted-word">gewesen</span>. Ich <span class="highlighted-word">bin</span> mit dem Zug <span class="highlighted-word">gefahren</span>. In der Stadt <span class="highlighted-word">habe ich</span> eine Freundin <span class="highlighted-word">gesehen</span>. Wir <span class="highlighted-word">haben</span> in einem Café <span class="highlighted-word">gesprochen</span> und einen Kaffee <span class="highlighted-word">getrunken</span>. Danach <span class="highlighted-word">habe ich</span> ein Buch <span class="highlighted-word">gekauft</span> und mit Karte <span class="highlighted-word">bezahlt</span>. Es <span class="highlighted-word">hat</span> viel Spaß <span class="highlighted-word">gemacht</span>!</p>`,
        `<p>Heute Morgen <span class="highlighted-word">habe ich</span> lange <span class="highlighted-word">geschlafen</span>. Zum Frühstück <span class="highlighted-word">habe ich</span> ein Brötchen <span class="highlighted-word">gegessen</span>. Dann <span class="highlighted-word">habe ich</span> eine E-Mail an meine Familie <span class="highlighted-word">geschrieben</span>. Ich <span class="highlighted-word">habe</span> ihnen <span class="highlighted-word">gesagt</span>, dass ich bald nach Hause <span class="highlighted-word">komme</span>. Später <span class="highlighted-word">habe ich</span> die Zeitung <span class="highlighted-word">gelesen</span>.</p>`,
        `<p>Am Wochenende <span class="highlighted-word">habe ich</span> zu Hause <span class="highlighted-word">gearbeitet</span>. Ich <span class="highlighted-word">habe</span> für eine Prüfung <span class="highlighted-word">gelernt</span>. Ich <span class="highlighted-word">habe</span> eine Frage nicht <span class="highlighted-word">gewusst</span>, also <span class="highlighted-word">habe ich</span> meinen Lehrer <span class="highlighted-word">gefragt</span>. Er <span class="highlighted-word">hat</span> mir alles gut erklärt. Ich <span class="highlighted-word">habe</span> die Antwort schnell <span class="highlighted-word">gefunden</span>.</p>`
    ];

    let currentGroupIndex = 0;
    let currentVerbInModal = '';
    let currentIndexInModal = 0;
    let storyClickCounter = 0;

    // --- DOM ELEMENTS ---
    const mainContainer = document.getElementById('main-container');
    const cardsContainer = document.getElementById('cards-container');
    const levelIndicator = document.getElementById('level-indicator');
    const groupIndicator = document.getElementById('group-indicator');
    const progressBar = document.getElementById('progress-bar');
    const prevGroupBtn = document.getElementById('prev-group-btn');
    const nextGroupBtn = document.getElementById('next-group-btn');
    const navigationWrapper = document.querySelector('.navigation-wrapper');
    const storyButton = document.getElementById('story-button');
    const storyContainer = document.getElementById('story-container');
    const storyContent = document.getElementById('story-content');
    const verbModal = document.getElementById('verb-modal');
    const infoModal = document.getElementById('info-modal');
    const closeVerbModalButton = document.getElementById('close-verb-modal');
    const infoButton = document.getElementById('info-button');
    const closeInfoModalButton = document.getElementById('close-info-modal');

    // --- NEW LOADING FUNCTION ---
    function loadAppData() {
        const groupPromises = [];
        for (let i = 1; i <= totalGroups; i++) {
            groupPromises.push(
                fetch(`json/groups/group_${i}.json`)
                    .then(res => {
                        if (!res.ok) {
                            throw new Error(`HTTP error! status: ${res.status} for group_${i}.json`);
                        }
                        return res.json();
                    })
            );
        }

        return Promise.all(groupPromises).then(groups => {
            verbGroupsData = groups;

            const allVerbNames = new Set();
            groups.forEach(group => {
                if (group.verbs) {
                    group.verbs.forEach(verbName => allVerbNames.add(verbName));
                }
            });

            const verbDataPromises = Array.from(allVerbNames).map(verbName => {
                const cardPromise = fetch(`json/cards/${verbName}.json`).then(res => res.ok ? res.json() : {}).catch(() => ({}));

                return cardPromise.then(cardData => {
                    allVerbsData[verbName] = cardData;
                });
            });

            return Promise.all(verbDataPromises);
        });
    }

    // --- UPDATED RENDER FUNCTION ---
    function renderVerbGroup(index) {
        const group = verbGroupsData[index];
        if (!group || !group.verbs) {
            console.error(`Group data for index ${index} is not loaded or invalid.`);
            cardsContainer.innerHTML = '<p>Fehler beim Laden der Verben.</p>';
            return;
        }

        cardsContainer.innerHTML = '';
        group.verbs.forEach(verbName => {
            const verbData = allVerbsData[verbName];
            if (!verbData) return;
            const irregularMark = verbData.irregularPraesens ? '<span class="irregular-indicator">*</span>' : '';
            const cardHTML = `
                <div class="word-item" onclick="openModalForVerb('${verbName}')">
                    <div class="word-item-content">
                        <span class="emoji">${verbData.emoji || '❓'}</span>
                        <div class="text-container">
                            <span class="german-word">${verbName}${irregularMark}</span>
                            <span class="spanish-translation" data-form="translation">${verbData.es || ''}</span>
                            <span class="german-past" data-form="perfekt">${verbData.perfekt || '---'}</span>
                            <span class="spanish-perfekt" data-form="translation perfekt">${verbData.es_perfekt || ''}</span>
                        </div>
                    </div>
                </div>`;
            cardsContainer.innerHTML += cardHTML;
        });

        levelIndicator.textContent = group.level;
        levelIndicator.className = 'level-indicator'; // Reset classes
        if (group.level === 'A1.1') levelIndicator.classList.add('level-a1-1');
        else if (group.level === 'A1.2') levelIndicator.classList.add('level-a1-2');
        else if (group.level === 'A2.1') levelIndicator.classList.add('level-a2-1');
        else if (group.level === 'A2.2') levelIndicator.classList.add('level-a2-2');

        groupIndicator.textContent = `${germanOrdinals[index]} Gruppe von ${totalGroups}`;
        prevGroupBtn.disabled = index === 0;
        nextGroupBtn.disabled = index === totalGroups - 1;
        updateProgressBar(index);
    }

    function setupProgressBar() {
        progressBar.innerHTML = '';
        for (let i = 0; i < totalGroups; i++) {
            const step = document.createElement('div');
            step.classList.add('progress-step');
            progressBar.appendChild(step);
        }
    }

    function updateProgressBar(index) {
        const steps = progressBar.querySelectorAll('.progress-step');
        steps.forEach((step, i) => {
            step.classList.toggle('active', i <= index);
        });
    }
    
    function initializeApp() {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('level') === 'A1.2') {
            currentGroupIndex = 5;
        }

        setupProgressBar();
        
        loadAppData()
            .then(() => {
                renderVerbGroup(currentGroupIndex);
                
                prevGroupBtn.addEventListener('click', () => {
                    if (currentGroupIndex > 0) {
                        currentGroupIndex--;
                        renderVerbGroup(currentGroupIndex);
                    }
                });

                nextGroupBtn.addEventListener('click', () => {
                    if (currentGroupIndex < totalGroups - 1) {
                        currentGroupIndex++;
                        renderVerbGroup(currentGroupIndex);
                    }
                });
            })
            .catch(error => {
                console.error("Failed to load verb data:", error);
                cardsContainer.innerHTML = '<p>Ein Fehler ist beim Laden der Verben aufgetreten. Bitte versuchen Sie es später erneut.</p>';
            });

        const toggles = document.querySelectorAll('.visibility-toggle');
        const verbModalContent = document.querySelector('#verb-modal .modal-content');
        toggles.forEach(toggle => {
            const toggleClass = toggle.dataset.toggleClass;
            mainContainer.classList.toggle(toggleClass, !toggle.checked);
            verbModalContent.classList.toggle(toggleClass, !toggle.checked);
            toggle.addEventListener('change', (event) => {
                mainContainer.classList.toggle(toggleClass, !event.currentTarget.checked);
                verbModalContent.classList.toggle(toggleClass, !event.currentTarget.checked);
            });
        });

        storyButton.addEventListener('click', () => {
            storyContainer.style.display = 'block';
            storyContent.innerHTML = savedStories[storyClickCounter];
            storyClickCounter = (storyClickCounter + 1) % savedStories.length;
        });
        
        infoButton.addEventListener('click', () => infoModal.classList.add('visible'));
        closeInfoModalButton.addEventListener('click', () => infoModal.classList.remove('visible'));
        infoModal.addEventListener('click', (e) => { if (e.target === infoModal) infoModal.classList.remove('visible'); });
        
        closeVerbModalButton.addEventListener('click', () => verbModal.classList.remove('visible'));
        verbModal.addEventListener('click', (e) => { if (e.target === verbModal) verbModal.classList.remove('visible'); });
    }
    
    // --- UPDATED MODAL FUNCTION WITH LAZY LOADING ---
    window.openModalForVerb = async function(verb) {
        const data = allVerbsData[verb];
        if (!data) return;

        // Lazy load praesens and perfekt data if not already loaded
        if (!data.praesens || !data.examples) {
            try {
                const praesensPromise = fetch(`json/praesens/${verb}.json`).then(res => res.ok ? res.json() : {}).catch(() => ({}));
                const perfektPromise = fetch(`json/perfekt/${verb}.json`).then(res => res.ok ? res.json() : []).catch(() => []);

                const [praesensData, perfektData] = await Promise.all([praesensPromise, perfektPromise]);

                // Merge the loaded data into allVerbsData
                allVerbsData[verb] = {
                    ...data,
                    ...praesensData,
                    examples: perfektData
                };
            } catch (error) {
                console.error(`Failed to load modal data for ${verb}:`, error);
            }
        }

        // Get the updated data reference
        const updatedData = allVerbsData[verb];

        document.getElementById('modal-verb-infinitive').textContent = verb;
        document.getElementById('modal-verb-perfekt').textContent = updatedData.perfekt || '---';
        document.getElementById('modal-emoji').textContent = updatedData.emoji || '❓';
        document.getElementById('modal-verb-infinitive-es').textContent = updatedData.es ? `🇪🇸 ${updatedData.es}` : '';
        document.getElementById('modal-verb-perfekt-es').textContent = updatedData.es_perfekt ? `🇪🇸 ${updatedData.es_perfekt}` : '';
        document.getElementById('modal-verb-english-infinitive').textContent = updatedData.en_verb ? `🇬🇧 ${updatedData.en_verb}` : '';
        document.getElementById('modal-verb-english-perfekt').textContent = updatedData.en_perfekt ? `🇬🇧 ${updatedData.en_perfekt}` : '';
        
        const praesensTableContainer = document.getElementById('modal-praesens-table');
        if (updatedData.praesens) {
            // Define the desired pronoun order
            const pronounOrder = [
                { key: 'ich', display: 'ich' },
                { key: 'du', display: 'du' },
                { key: 'er', display: 'er' },
                { key: 'sie', display: 'sie' },
                { key: 'es', display: 'es' },
                { key: 'wir', display: 'wir' },
                { key: 'ihr', display: 'ihr' },
                { key: 'sie (plural)', display: 'sie' },
                { key: 'Sie (formal)', display: 'Sie' }
            ];

            let tableHTML = '<table>';
            tableHTML += '<tr><th>Pronomen</th><th>Konjugation</th><th>Beispiel</th></tr>';

            for (const { key, display } of pronounOrder) {
                const conjugation = updatedData.praesens[key];
                if (conjugation) {
                    const example = updatedData.praesens_examples && updatedData.praesens_examples[key];
                    let exampleCell = '';

                    if (example) {
                        exampleCell = `<div class="example-cell">`;
                        if (example.de) exampleCell += `<div class="example-de">${example.de}</div>`;
                        if (example.en) exampleCell += `<div class="example-en">${example.en}</div>`;
                        if (example.es) exampleCell += `<div class="example-es">${example.es}</div>`;
                        exampleCell += `</div>`;
                    }

                    tableHTML += `<tr><td>${display}</td><td>${conjugation}</td><td>${exampleCell}</td></tr>`;
                }
            }

            tableHTML += '</table>';
            praesensTableContainer.innerHTML = tableHTML;
        } else {
            praesensTableContainer.innerHTML = '';
        }

        const praesensExamplesContainer = document.getElementById('praesens-examples-container');
        if(praesensExamplesContainer) praesensExamplesContainer.style.display = 'none';

        const verbModalContent = document.querySelector('#verb-modal .modal-content');
        verbModalContent.classList.remove('hide-perfekt', 'hide-translation');
        document.getElementById('praesens-details-container').open = true;

        verbModal.classList.add('visible');
    }

    // --- START THE APP ---
    initializeApp();
});
