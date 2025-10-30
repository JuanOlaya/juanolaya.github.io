const germanOrdinals = ["Erste", "Zweite", "Dritte", "Vierte", "Fünfte", "Sechste", "Siebte", "Achte", "Neunte"];
        const germanExampleOrdinals = ["Erstes", "Zweites", "Drittes", "Viertes", "Fünftes", "Sechstes", "Siebtes", "Achtes"];

        // Stories
        const savedStories = [
             `<p>Gestern <span class="highlighted-word">bin ich</span> in Berlin <span class="highlighted-word">gewesen</span>. Ich <span class="highlighted-word">bin</span> mit dem Zug <span class="highlighted-word">gefahren</span>. In der Stadt <span class="highlighted-word">habe ich</span> eine Freundin <span class="highlighted-word">gesehen</span>. Wir <span class="highlighted-word">haben</span> in einem Café <span class="highlighted-word">gesprochen</span> und einen Kaffee <span class="highlighted-word">getrunken</span>. Danach <span class="highlighted-word">habe ich</span> ein Buch <span class="highlighted-word">gekauft</span> und mit Karte <span class="highlighted-word">bezahlt</span>. Es <span class="highlighted-word">hat</span> viel Spaß <span class="highlighted-word">gemacht</span>!</p>`,
             `<p>Heute Morgen <span class="highlighted-word">habe ich</span> lange <span class="highlighted-word">geschlafen</span>. Zum Frühstück <span class="highlighted-word">habe ich</span> ein Brötchen <span class="highlighted-word">gegessen</span>. Dann <span class="highlighted-word">habe ich</span> eine E-Mail an meine Familie <span class="highlighted-word">geschrieben</span>. Ich <span class="highlighted-word">habe</span> ihnen <span class="highlighted-word">gesagt</span>, dass ich bald nach Hause <span class="highlighted-word">komme</span>. Später <span class="highlighted-word">habe ich</span> die Zeitung <span class="highlighted-word">gelesen</span>.</p>`,
             `<p>Am Wochenende <span class="highlighted-word">habe ich</span> zu Hause <span class="highlighted-word">gearbeitet</span>. Ich <span class="highlighted-word">habe</span> für eine Prüfung <span class="highlighted-word">gelernt</span>. Ich <span class="highlighted-word">habe</span> eine Frage nicht <span class="highlighted-word">gewusst</span>, also <span class="highlighted-word">habe ich</span> meinen Lehrer <span class="highlighted-word">gefragt</span>. Er <span class="highlighted-word">hat</span> mir alles gut erklärt. Ich <span class="highlighted-word">habe</span> die Antwort schnell <span class="highlighted-word">gefunden</span>.</p>`
        ];

        const allVerbs = {};
        const totalGroups = 9; // Updated from 5 to 9

        let currentGroupIndex = 0;
        let currentVerbInModal = '';
        let currentIndexInModal = 0;
        let storyClickCounter = 0;

        document.addEventListener('DOMContentLoaded', () => {
            const urlParams = new URLSearchParams(window.location.search);
            const level = urlParams.get('level');

            if (level === 'A1.2') {
                currentGroupIndex = 5; // Start at group 6 (index 5)
            }

            initializeApp();
        });

        function initializeApp() {
            const mainContainer = document.getElementById('main-container');
            const verbModal = document.getElementById('verb-modal');
            const infoModal = document.getElementById('info-modal');
            const closeVerbModalButton = document.getElementById('close-verb-modal');
            const infoButton = document.getElementById('info-button');
            const closeInfoModalButton = document.getElementById('close-info-modal');
            const prevExampleButton = document.getElementById('prev-example');
            const nextExampleButton = document.getElementById('next-example');
            const prevGroupBtn = document.getElementById('prev-group-btn');
            const nextGroupBtn = document.getElementById('next-group-btn');
            const storyButton = document.getElementById('story-button');
            const levelIndicator = document.getElementById('level-indicator');

            setupProgressBar(document.getElementById('progress-bar'));
            renderVerbGroup(currentGroupIndex);

            const toggles = document.querySelectorAll('.visibility-toggle');
            const verbModalContent = document.querySelector('#verb-modal .modal-content');
          
            toggles.forEach(toggle => {
                // Set initial state
                const toggleClass = toggle.dataset.toggleClass;
                mainContainer.classList.toggle(toggleClass, !toggle.checked);
                verbModalContent.classList.toggle(toggleClass, !toggle.checked);

                // Add event listener
                toggle.addEventListener('change', (event) => {
                    mainContainer.classList.toggle(toggleClass, !event.currentTarget.checked);
                    verbModalContent.classList.toggle(toggleClass, !event.currentTarget.checked);
                });
            });

            closeVerbModalButton.addEventListener('click', hideVerbModal);
            verbModal.addEventListener('click', (event) => {
                if (event.target === verbModal) hideVerbModal();
            });

            infoButton.addEventListener('click', showInfoModal);
            closeInfoModalButton.addEventListener('click', hideInfoModal);
            infoModal.addEventListener('click', (event) => {
                if (event.target === infoModal) hideInfoModal();
            });

            prevExampleButton.addEventListener('click', () => {
                 if (!currentVerbInModal || !allVerbs[currentVerbInModal]) return;
                if (currentIndexInModal > 0) {
                    displayExampleInModal(currentVerbInModal, currentIndexInModal - 1);
                }
            });

            nextExampleButton.addEventListener('click', () => {
                 if (!currentVerbInModal || !allVerbs[currentVerbInModal]) return;
                 const examples = allVerbs[currentVerbInModal].examples || [];
                const maxIndex = examples.length - 1;
                if (currentIndexInModal < maxIndex) {
                     displayExampleInModal(currentVerbInModal, currentIndexInModal + 1);
                }
            });

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

            storyButton.addEventListener('click', showStory);

            // Listener for details/summary arrows
            const detailsElements = document.querySelectorAll('details');
            detailsElements.forEach(details => {
                 const summary = details.querySelector('summary');
                 const arrow = summary?.querySelector('.details-arrow');
                 if(summary && arrow) {
                     arrow.style.transform = details.open ? 'rotate(90deg)' : 'rotate(0deg)';
                     details.addEventListener('toggle', (event) => {
                         arrow.style.transform = event.target.open ? 'rotate(90deg)' : 'rotate(0deg)';
                     });
                 }
                 if(summary) { // Ensure no default marker
                     summary.style.listStyle = 'none';
                     summary.style.setProperty('-webkit-details-marker', 'none', 'important');
                 }
            });
        }

        function speak(text, lang = 'de-DE', rate = 0.7) {
             if ('speechSynthesis' in window && text && text !== '---') {
                window.speechSynthesis.cancel();
                const utterance = new SpeechSynthesisUtterance(text);
                utterance.lang = lang;
                utterance.rate = rate;
                 utterance.onerror = (event) => {
                     console.error("SpeechSynthesisUtterance.onerror", event);
                 };
                window.speechSynthesis.speak(utterance);
            } else if (!text || text === '---') {
                 console.warn("Attempted to speak invalid text:", text);
            }
             else {
                console.error("Speech synthesis not supported in this browser.");
            }
        }

        function displayExampleInModal(verb, index) {
            currentVerbInModal = verb;
            currentIndexInModal = index;

            const data = allVerbs[verb];
            if (!data) { console.error(`Verb data not found for: ${verb}`); hideVerbModal(); return; }

             const examples = data.examples || [];
             const maxExamples = examples.length;

             if (maxExamples === 0) {
                 currentIndexInModal = -1; // No examples
             } else if (index >= maxExamples || index < 0) {
                 console.warn(`Example index ${index} out of bounds for verb ${verb}. Resetting to 0.`);
                 currentIndexInModal = 0;
                 index = 0;
             }
            const sentence = (currentIndexInModal !== -1) ? examples[index] : { de: 'Kein Beispiel verfügbar.', es: '', phonetics: '', explanation: '' };

            // Get Modal Elements
            const modalText = document.getElementById('modal-text');
            const modalPhonetics = document.getElementById('modal-phonetics');
            const modalTranslations = document.getElementById('modal-translations');
            const modalGrammarExplanation = document.getElementById('modal-grammar-explanation');
            const detailsContainer = document.getElementById('details-container'); // "Más Info"
            const exampleCounterSpan = document.getElementById('example-counter');
            const modalVerbNote = document.getElementById('modal-verb-note');
            const praesensDetailsContainer = document.getElementById('praesens-details-container'); // "Präsens"
            const praesensTableDiv = document.getElementById('modal-praesens-table');
            const praesensSummary = document.getElementById('praesens-details-summary');
            const praesensExamplesContainer = document.getElementById('praesens-examples-container'); // Get the new container
            const praesensExamplesSummary = document.getElementById('praesens-examples-summary'); // Get the new summary
            const exampleNavButtons = document.querySelector('.modal-nav-buttons');
            const exampleProgress = document.querySelector('.example-progress-container');
            const speakInfinitiveIcon = document.getElementById('speak-infinitive-icon');
            const speakPerfektIcon = document.getElementById('speak-perfekt-icon');
            const speakSentenceIcon = document.getElementById('speak-sentence-icon');
            const modalVerbPerfekt = document.getElementById('modal-verb-perfekt');

            // --- Fill Basic Verb Info ---
            document.getElementById('modal-emoji').textContent = data.emoji || '❓';
            document.getElementById('modal-verb-infinitive').textContent = verb;
            modalVerbPerfekt.textContent = data.perfekt || '---';
            document.getElementById('modal-verb-infinitive-es').textContent = data.es ? `🇪🇸 ${data.es}` : '';
            document.getElementById('modal-verb-perfekt-es').textContent = data.es_perfekt ? `🇪🇸 ${data.es_perfekt}` : '';
            document.getElementById('modal-verb-english-infinitive').textContent = data.en_verb ? `🇬🇧 ${data.en_verb}` : '';
            document.getElementById('modal-verb-english-perfekt').textContent = data.en_perfekt ? `🇬🇧 ${data.en_perfekt}` : '';

            modalVerbNote.style.display = data.note_es ? 'block' : 'none';
            if(data.note_es) modalVerbNote.innerHTML = data.note_es;

            // --- Generate Präsens Table & Note ---
             praesensDetailsContainer.open = false; // Close by default
            const praesensArrow = praesensSummary?.querySelector('.details-arrow');
            if (praesensArrow) praesensArrow.style.transform = 'rotate(0deg)'; // Reset arrow

            if (data.praesens) {
                let praesensTableHTML = `<h4 style="margin-top: 0; margin-bottom: 10px; text-align: center;">Präsens Konjugation (${verb}) `;
                if (data.irregularPraesens) {
                    praesensTableHTML += `- Unregelmäßig`;
                    if (data.vokalwechsel) { praesensTableHTML += ` (${data.vokalwechsel})`; }
                }
                praesensTableHTML += `</h4>`;
                praesensTableHTML += `
                    <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.9rem;">
                        <thead>
                            <tr style="background-color: #f0f0f0;">
                                <th style="padding: 5px; border: 1px solid #ccc;">🇩🇪 Pronomen</th>
                                <th style="padding: 5px; border: 1px solid #ccc;">🇬🇧 Pronoun</th>
                                <th style="padding: 5px; border: 1px solid #ccc;">🇪🇸 Pronombre</th>
                                <th style="padding: 5px; border: 1px solid #ccc; text-align: center;">✍️ Endung</th>
                                <th style="padding: 5px; border: 1px solid #ccc;">${verb}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr><td style="padding: 5px; border: 1px solid #ccc;">ich</td><td style="padding: 5px; border: 1px solid #ccc;">I</td><td style="padding: 5px; border: 1px solid #ccc;">yo</td><td style="padding: 5px; border: 1px solid #ccc; text-align: center;">-e</td><td style="padding: 5px; border: 1px solid #ccc;">${data.praesens.ich || '?'}</td></tr>
                            <tr><td style="padding: 5px; border: 1px solid #ccc;">du</td><td style="padding: 5px; border: 1px solid #ccc;">you</td><td style="padding: 5px; border: 1px solid #ccc;">tú</td><td style="padding: 5px; border: 1px solid #ccc; text-align: center;">-st</td><td style="padding: 5px; border: 1px solid #ccc;">${data.praesens.du || '?'}</td></tr>
                            <tr><td style="padding: 5px; border: 1px solid #ccc;">er/sie/es</td><td style="padding: 5px; border: 1px solid #ccc;">he/she/it</td><td style="padding: 5px; border: 1px solid #ccc;">él/ella/neutro</td><td style="padding: 5px; border: 1px solid #ccc; text-align: center;">-t</td><td style="padding: 5px; border: 1px solid #ccc;">${data.praesens.erSieEs || '?'}</td></tr>
                            <tr><td style="padding: 5px; border: 1px solid #ccc;">wir</td><td style="padding: 5px; border: 1px solid #ccc;">we</td><td style="padding: 5px; border: 1px solid #ccc;">nosotros/as</td><td style="padding: 5px; border: 1px solid #ccc; text-align: center;">-en</td><td style="padding: 5px; border: 1px solid #ccc;">${data.praesens.wir || '?'}</td></tr>
                            <tr><td style="padding: 5px; border: 1px solid #ccc;">ihr</td><td style="padding: 5px; border: 1px solid #ccc;">you (pl.)</td><td style="padding: 5px; border: 1px solid #ccc;">vosotros/as</td><td style="padding: 5px; border: 1px solid #ccc; text-align: center;">-t</td><td style="padding: 5px; border: 1px solid #ccc;">${data.praesens.ihr || '?'}</td></tr>
                            <tr><td style="padding: 5px; border: 1px solid #ccc;">sie/Sie</td><td style="padding: 5px; border: 1px solid #ccc;">they/You</td><td style="padding: 5px; border: 1px solid #ccc;">ellos/as / Usted(es)</td><td style="padding: 5px; border: 1px solid #ccc; text-align: center;">-en</td><td style="padding: 5px; border: 1px solid #ccc;">${data.praesens.sieSie || '?'}</td></tr>
                        </tbody>
                    </table>`;

                // Add explanatory note for irregular verbs
                if (data.irregularPraesens && data.vokalwechsel) {
                    praesensTableHTML += `
                        <p class="praesens-note">
                            <b>Nota:</b> En muchos verbos irregulares fuertes, el cambio de vocal (como ${data.vokalwechsel.split('(')[0].trim()}) solo afecta a la 2ª persona singular (<b>du</b>) y a la 3ª persona singular (<b>er/sie/es</b>).
                        </p>`;
                } else if (data.irregularPraesens && (verb === 'sein' || verb === 'haben')) {
                     praesensTableHTML += `
                        <p class="praesens-note">
                            <b>Nota:</b> Los verbos '${verb}' son muy irregulares y tienen formas especiales en casi todas las personas.
                        </p>`;
                 } // Add more specific notes for modals if needed

                praesensTableDiv.innerHTML = praesensTableHTML;
                praesensDetailsContainer.style.display = 'block';
            } else {
                praesensTableDiv.innerHTML = '';
                praesensDetailsContainer.style.display = 'none';
            }

            // --- Generate Präsens Examples Table ---
            if (data.praesens_examples) {
                praesensExamplesContainer.open = false; // Close by default
                const praesensExamplesArrow = praesensExamplesSummary?.querySelector('.details-arrow');
                if (praesensExamplesArrow) praesensExamplesArrow.style.transform = 'rotate(0deg)'; // Reset arrow

                let praesensExamplesTableHTML = `<h4 style="margin-top: 0; margin-bottom: 10px; text-align: center;">Präsens Beispiele (${verb})</h4>`;
                praesensExamplesTableHTML += `
                    <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.9rem;">
                        <thead>
                            <tr style="background-color: #f0f0f0;">
                                <th style="padding: 5px; border: 1px solid #ccc;">🇩🇪 Pronomen</th>
                                <th style="padding: 5px; border: 1px solid #ccc;">Satz</th>
                                <th style="padding: 5px; border: 1px solid #ccc;">🇬🇧 Translation</th>
                                <th style="padding: 5px; border: 1px solid #ccc;">🇪🇸 Traducción</th>
                            </tr>
                        </thead>
                        <tbody>`;
                for (const pronoun in data.praesens_examples) {
                    const example = data.praesens_examples[pronoun];
                    praesensExamplesTableHTML += `
                            <tr>
                                <td style="padding: 5px; border: 1px solid #ccc;">${pronoun}</td>
                                <td style="padding: 5px; border: 1px solid #ccc;">${example.de}</td>
                                <td style="padding: 5px; border: 1px solid #ccc;">${example.en}</td>
                                <td style="padding: 5px; border: 1px solid #ccc;">${example.es}</td>
                            </tr>`;
                }
                praesensExamplesTableHTML += `
                        </tbody>
                    </table>`;
                praesensExamplesTableDiv.innerHTML = praesensExamplesTableHTML;
                praesensExamplesContainer.style.display = 'block';
            } else {
                praesensExamplesTableDiv.innerHTML = '';
                praesensExamplesContainer.style.display = 'none';
            }

            // --- Fill Example Info & More Info ---
             detailsContainer.open = false; // Close "Más Info" by default
             const moreInfoArrow = detailsContainer.querySelector('summary .details-arrow');
             if (moreInfoArrow) moreInfoArrow.style.transform = 'rotate(0deg)'; // Reset arrow

             if (currentIndexInModal !== -1) {
                 modalText.textContent = sentence.de;
                 modalPhonetics.innerHTML = sentence.phonetics ? `<b>Pronunciación:</b> ${sentence.phonetics}` : '<b>Pronunciación:</b> -';
                 modalTranslations.innerHTML = sentence.es ? `🇪🇸 ${sentence.es}` : '';
                 modalGrammarExplanation.innerHTML = sentence.explanation ? `<b>Gramática</b><ul>${sentence.explanation}</ul>` : '';
                 detailsContainer.style.display = 'block';
                 exampleNavButtons.style.display = 'flex';
                 exampleProgress.style.display = 'flex';
             } else {
                 modalText.textContent = 'Keine Beispiele verfügbar.';
                 modalPhonetics.innerHTML = '';
                 modalTranslations.innerHTML = '';
                 modalGrammarExplanation.innerHTML = '';
                 detailsContainer.style.display = 'none';
                 exampleNavButtons.style.display = 'none';
                 exampleProgress.style.display = 'none';
             }

            // --- Update Example Navigation ---
             if (currentIndexInModal !== -1) {
                exampleCounterSpan.textContent = `${germanExampleOrdinals[index]} Beispiel von ${maxExamples}`;
                updateExampleProgressBar(index, maxExamples);
                document.getElementById('prev-example').disabled = index === 0;
                document.getElementById('next-example').disabled = index === maxExamples - 1;
             } else {
                 exampleCounterSpan.textContent = '';
                 updateExampleProgressBar(-1, 0);
                 document.getElementById('prev-example').disabled = true;
                 document.getElementById('next-example').disabled = true;
             }

            // --- Assign Speak Functions ---
            speakInfinitiveIcon.onclick = () => speak(verb);

            const perfektText = data.perfekt || '---';
            if (perfektText !== '---') {
                speakPerfektIcon.onclick = () => speak(perfektText);
                speakPerfektIcon.style.display = 'inline-flex';
                speakPerfektIcon.style.cursor = 'pointer';
                 modalVerbPerfekt.style.color = '#4682B4';
            } else {
                speakPerfektIcon.onclick = null;
                speakPerfektIcon.style.display = 'none';
                 modalVerbPerfekt.style.color = '#ccc';
            }

             if (currentIndexInModal !== -1 && sentence.de !== 'Kein Beispiel verfügbar.') {
                speakSentenceIcon.onclick = () => speak(sentence.de);
                speakSentenceIcon.style.display = 'inline-flex';
                speakSentenceIcon.style.cursor = 'pointer';
            } else {
                speakSentenceIcon.onclick = null;
                speakSentenceIcon.style.display = 'none';
            }
        }


        function renderVerbGroup(index) {
            const cardsContainer = document.getElementById('cards-container');
            const groupFile = `json/group_${index + 1}.json`;

            fetch(groupFile)
                .then(response => response.json())
                .then(data => {
                    const levelIndicator = document.getElementById('level-indicator');

                    const groupData = data.verbs;
                    Object.assign(allVerbs, groupData);

                    cardsContainer.innerHTML = ''; // Clear existing cards

                    for (const verb in groupData) {
                        const verbData = groupData[verb];
                        if (!verbData) continue;

                        // Add asterisk if irregularPraesens is true
                        const irregularMark = verbData.irregularPraesens ? '<span class="irregular-indicator">*</span>' : '';

                        const cardHTML = `
                            <div class="word-item" onclick="openModalForVerb('${verb}')">
                                <div class="word-item-content">
                                    <span class="emoji">${verbData.emoji || '❓'}</span>
                                    <div class="text-container">
                                        <span class="german-word">${verb}${irregularMark}</span>
                                        <span class="spanish-translation" data-form="translation">${verbData.es || ''}</span>
                                        <span class="german-past" data-form="perfekt">${verbData.perfekt || '---'}</span>
                                        <span class="spanish-perfekt" data-form="translation perfekt">${verbData.es_perfekt || ''}</span>
                                    </div>
                                </div>
                            </div>
                        `;
                        cardsContainer.innerHTML += cardHTML;
                    }

                    levelIndicator.textContent = data.level; // Update the level indicator
                    levelIndicator.classList.remove('level-a1-1', 'level-a1-2');
                    if (data.level === 'A1.1') {
                        levelIndicator.classList.add('level-a1-1');
                    } else if (data.level === 'A1.2') {
                        levelIndicator.classList.add('level-a1-2');
                    }

                    const groupIndicator = document.getElementById('group-indicator');
                    const prevGroupBtn = document.getElementById('prev-group-btn');
                    const nextGroupBtn = document.getElementById('next-group-btn');

                    groupIndicator.textContent = `${germanOrdinals[index]} Gruppe von ${totalGroups}`;
                    prevGroupBtn.disabled = index === 0;
                    nextGroupBtn.disabled = index === totalGroups - 1;

                    updateProgressBar(index);
                });
        }

        function setupProgressBar(container) {
            container.innerHTML = '';
            for (let i = 0; i < totalGroups; i++) {
                const step = document.createElement('div');
                step.classList.add('progress-step');
                container.appendChild(step);
            }
        }

        function updateProgressBar(currentIndex) {
            const steps = document.querySelectorAll('#progress-bar .progress-step');
            steps.forEach((step, index) => {
                step.classList.toggle('active', index <= currentIndex);
            });
        }

        function openModalForVerb(verb) {
            displayExampleInModal(verb, 0);
            document.getElementById('verb-modal').classList.add('visible');
        }

        function hideVerbModal() {
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
            }
            document.getElementById('verb-modal').classList.remove('visible');
             // Reset details sections when closing
             const praesensDetails = document.getElementById('praesens-details-container');
             const moreInfoDetails = document.getElementById('details-container');
             if (praesensDetails) praesensDetails.open = false;
             if (moreInfoDetails) moreInfoDetails.open = false;
        }

        function showInfoModal() {
            document.getElementById('info-modal').classList.add('visible');
        }

        function hideInfoModal() {
            document.getElementById('info-modal').classList.remove('visible');
        }

        function showStory() {
            const storyContainer = document.getElementById('story-container');
            const storyContent = document.getElementById('story-content');
            storyContainer.style.display = 'block';
            if (typeof savedStories !== 'undefined' && savedStories.length > 0) {
                 storyContent.innerHTML = savedStories[storyClickCounter];
                 storyClickCounter = (storyClickCounter + 1) % savedStories.length;
            } else {
                 storyContent.innerHTML = "<p><em>Keine Geschichten gefunden.</em></p>";
                 console.error("savedStories array is missing or empty!");
            }
        }

        function updateExampleProgressBar(currentIndex, total) {
            const container = document.getElementById('example-progress-bar');
            container.innerHTML = '';
             if (total <= 0) return;
            for (let i = 0; i < total; i++) {
                const step = document.createElement('div');
                step.classList.add('progress-step');
                step.classList.toggle('active', i <= currentIndex);
                container.appendChild(step);
            }
        }