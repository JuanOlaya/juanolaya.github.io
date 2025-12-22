document.addEventListener('DOMContentLoaded', () => {
    // --- GLOBAL STATE ---
    const allVerbsData = {};
    let verbGroupsByLevel = {}; // Groups organized by level
    let wortfamilieData = {}; // Word family data
    let verbTypesData = {}; // Verb types and notes data
    const germanOrdinals = ["Erste", "Zweite", "Dritte", "Vierte", "Fünfte", "Sechste", "Siebte", "Achte", "Neunte", "Zehnte", "Elfte", "Zwölfte", "Dreizehnte"];
    const germanExampleOrdinals = ["Erstes", "Zweites", "Drittes", "Viertes", "Fünftes", "Sechstes", "Siebtes", "Achtes"];
    const savedStories = [
        `<p>Gestern <span class="highlighted-word">bin ich</span> in Berlin <span class="highlighted-word">gewesen</span>. Ich <span class="highlighted-word">bin</span> mit dem Zug <span class="highlighted-word">gefahren</span>. In der Stadt <span class="highlighted-word">habe ich</span> eine Freundin <span class="highlighted-word">gesehen</span>. Wir <span class="highlighted-word">haben</span> in einem Café <span class="highlighted-word">gesprochen</span> und einen Kaffee <span class="highlighted-word">getrunken</span>. Danach <span class="highlighted-word">habe ich</span> ein Buch <span class="highlighted-word">gekauft</span> und mit Karte <span class="highlighted-word">bezahlt</span>. Es <span class="highlighted-word">hat</span> viel Spaß <span class="highlighted-word">gemacht</span>!</p>`,
        `<p>Heute Morgen <span class="highlighted-word">habe ich</span> lange <span class="highlighted-word">geschlafen</span>. Zum Frühstück <span class="highlighted-word">habe ich</span> ein Brötchen <span class="highlighted-word">gegessen</span>. Dann <span class="highlighted-word">habe ich</span> eine E-Mail an meine Familie <span class="highlighted-word">geschrieben</span>. Ich <span class="highlighted-word">habe</span> ihnen <span class="highlighted-word">gesagt</span>, dass ich bald nach Hause <span class="highlighted-word">komme</span>. Später <span class="highlighted-word">habe ich</span> die Zeitung <span class="highlighted-word">gelesen</span>.</p>`,
        `<p>Am Wochenende <span class="highlighted-word">habe ich</span> zu Hause <span class="highlighted-word">gearbeitet</span>. Ich <span class="highlighted-word">habe</span> für eine Prüfung <span class="highlighted-word">gelernt</span>. Ich <span class="highlighted-word">habe</span> eine Frage nicht <span class="highlighted-word">gewusst</span>, also <span class="highlighted-word">habe ich</span> meinen Lehrer <span class="highlighted-word">gefragt</span>. Er <span class="highlighted-word">hat</span> mir alles gut erklärt. Ich <span class="highlighted-word">habe</span> die Antwort schnell <span class="highlighted-word">gefunden</span>.</p>`
    ];

    // Level configuration
    const levelConfig = {
        'A1_1': { groupCount: 10, displayName: 'A1.1' },
        'A1_2': { groupCount: 8, displayName: 'A1.2' },
        'A2_1': { groupCount: 9, displayName: 'A2.1' },
        'A2_2': { groupCount: 13, displayName: 'A2.2' },
        'B1_1': { groupCount: 7, displayName: 'B1.1' },
        'B2_1': { groupCount: 1, displayName: 'B2.1' }
    };
    const levelOrder = ['A1_1', 'A1_2', 'A2_1', 'A2_2', 'B1_1', 'B2_1'];

    // Verbs that support Konjunktiv II
    const konjunktivVerbs = ['sein', 'haben', 'werden', 'dürfen', 'müssen', 'wollen', 'sollen', 'mögen', 'können'];

    let currentLevel = 'A1_1';
    let currentGroupInLevel = 0; // 0-indexed position within current level
    let currentVerbInModal = '';
    let currentIndexInModal = 0;
    let storyClickCounter = 0;

    // --- DOM ELEMENTS ---
    const mainContainer = document.getElementById('main-container');
    const cardsContainer = document.getElementById('cards-container');
    const levelIndicator = document.getElementById('level-indicator');
    const groupThemeIndicator = document.getElementById('group-theme-indicator');
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
    const closeVerbModalXButton = document.getElementById('close-verb-modal-x');
    const infoButton = document.getElementById('info-button');
    const closeInfoModalButton = document.getElementById('close-info-modal');
    const gustarButtonContainer = document.getElementById('gustar-button-container');
    const gustarButton = document.getElementById('gustar-button');
    const gustarModal = document.getElementById('gustar-modal');
    const gustarCloseBtn = document.getElementById('gustar-close-btn');
    const gustarCloseFooterBtn = document.getElementById('gustar-close-footer-btn');

    // Theme modal elements
    const themeModal = document.getElementById('theme-modal');
    const closeThemeModalX = document.getElementById('close-theme-modal-x');
    const closeThemeModalBtn = document.getElementById('close-theme-modal-btn');

    // Header Tags Toggle Listener
    const modalTagsToggle = document.getElementById('modal-tags-toggle');
    if (modalTagsToggle) {
        modalTagsToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const wrapper = document.getElementById('modal-tags-collapsible');
            const dots = modalTagsToggle.querySelector('.dots-icon');
            const chevron = modalTagsToggle.querySelector('.chevron-icon');

            if (wrapper) {
                const isCollapsed = wrapper.classList.toggle('collapsed');
                if (isCollapsed) {
                    dots.style.display = 'inline';
                    chevron.style.display = 'none';
                } else {
                    dots.style.display = 'none';
                    chevron.style.display = 'inline';
                }
            }
        });
    }

    // Theme data storage
    let currentThemeData = null;

    // --- NEW LOADING FUNCTION ---
    function loadAppData() {
        const groupPromises = [];

        // Load groups from each level folder
        levelOrder.forEach(levelKey => {
            const config = levelConfig[levelKey];
            const groups = [];

            for (let i = 1; i <= config.groupCount; i++) {
                const promise = fetch(`json/groups/${levelKey}/${levelKey}_group_${i}.json?t=${new Date().getTime()}`)
                    .then(res => {
                        if (!res.ok) {
                            throw new Error(`HTTP error! status: ${res.status} for ${levelKey}_group_${i}.json`);
                        }
                        return res.json();
                    })
                    .then(groupData => ({ levelKey, groupIndex: i - 1, data: groupData }));

                groupPromises.push(promise);
            }
        });

        return Promise.all(groupPromises).then(groupResults => {
            // Organize groups by level
            groupResults.forEach(result => {
                if (!verbGroupsByLevel[result.levelKey]) {
                    verbGroupsByLevel[result.levelKey] = [];
                }
                verbGroupsByLevel[result.levelKey][result.groupIndex] = result.data;
            });

            // Collect all unique verb names
            const allVerbNames = new Set();
            Object.values(verbGroupsByLevel).forEach(levelGroups => {
                levelGroups.forEach(group => {
                    if (group && group.verbs) {
                        group.verbs.forEach(verbName => allVerbNames.add(verbName));
                    }
                });
            });

            const verbDataPromises = Array.from(allVerbNames).map(verbName => {
                const cardPromise = fetch(`json/cards/${verbName}.json`).then(res => res.ok ? res.json() : {}).catch(() => ({}));

                return cardPromise.then(cardData => {
                    allVerbsData[verbName] = cardData;
                });
            });

            return Promise.all(verbDataPromises).then(() => {
                // Pre-load all conjugation data for fast search
                console.log('Pre-loading conjugation data for fast search...');
                const conjugationPromises = Array.from(allVerbNames).map(async verbName => {
                    try {
                        const fetchPromises = [
                            fetch(`json/praesens/${verbName}.json`).then(res => res.ok ? res.json() : {}).catch(() => ({})),
                            fetch(`json/praeteritum_konjugation/${verbName}.json`).then(res => res.ok ? res.json() : {}).catch(() => ({})),
                            fetch(`json/perfekt_konjugation/${verbName}.json`).then(res => res.ok ? res.json() : {}).catch(() => ({})),
                            fetch(`json/praesens_fragen/${verbName}.json`).then(res => res.ok ? res.json() : {}).catch(() => ({}))
                        ];

                        // Add Konjunktiv II data for specific verbs
                        if (konjunktivVerbs.includes(verbName)) {
                            fetchPromises.push(
                                fetch(`json/konjunktiv_ii/${verbName}.json`).then(res => res.ok ? res.json() : {}).catch(() => ({}))
                            );
                        }

                        const [praesensData, praeteritumData, perfektData, fragenData, konjunktivData] = await Promise.all(fetchPromises);

                        // Rename praeteritum from konjugation data to avoid conflict
                        if (praeteritumData.praeteritum) {
                            praeteritumData.praeteritum_conjugations = praeteritumData.praeteritum;
                            delete praeteritumData.praeteritum;
                        }

                        // Merge conjugation data into allVerbsData
                        allVerbsData[verbName] = {
                            ...allVerbsData[verbName],
                            ...praesensData,
                            ...praeteritumData,
                            ...perfektData,
                            ...fragenData,
                            ...(konjunktivData || {})
                        };
                    } catch (error) {
                        console.warn(`Failed to pre-load conjugations for ${verbName}:`, error);
                    }
                });

                return Promise.all(conjugationPromises).then(() => {
                    console.log('Conjugation data pre-loaded! Search will be fast.');

                    // Load Wortfamilie data and Verb types data
                    const wortfamiliePromise = fetch('json/wortfamilie_kompakt.json')
                        .then(res => res.ok ? res.json() : {})
                        .then(data => {
                            wortfamilieData = data.verbs || {};
                        })
                        .catch(error => {
                            console.warn('Failed to load Wortfamilie data:', error);
                            wortfamilieData = {};
                        });

                    const verbTypesPromise = fetch('json/verb_types.json')
                        .then(res => res.ok ? res.json() : {})
                        .then(data => {
                            verbTypesData = data || {};
                        })
                        .catch(error => {
                            console.warn('Failed to load Verb types data:', error);
                            verbTypesData = {};
                        });

                    return Promise.all([wortfamiliePromise, verbTypesPromise]);
                });
            });
        });
    }

    // Helper function to remove all parentheses from translations
    function removeParentheses(text) {
        if (!text) return text;
        return text; // Return text with parentheses as requested for clarifications
    }

    // Helper function to extract clean Perfekt (remove auxiliary verb)
    function getCleanPerfekt(perfekt) {
        if (!perfekt || perfekt === '---') return '---';
        // Remove "hat " or "ist " from the beginning
        const cleaned = perfekt.replace(/^(hat|ist)\s+/, '');
        return cleaned;
    }

    // Helper function to extract clean Präteritum (remove pronouns)
    function getCleanPraeteritum(praeteritum) {
        if (!praeteritum || praeteritum === '---') return '---';
        // Remove "er/sie/es " from the beginning
        const cleaned = praeteritum.replace(/^(er\/sie\/es)\s+/, '');
        return cleaned;
    }

    // --- LIGHT VERSION RENDER FUNCTION ---
    function renderLightVersion(group) {
        cardsContainer.innerHTML = '';

        // Create light version container
        const lightContainer = document.createElement('div');
        lightContainer.className = 'light-version-container';

        // Create header row
        const headerRow = document.createElement('div');
        headerRow.className = 'light-version-header';
        headerRow.innerHTML = `
            <div class="light-version-header-cell">Infinitiv</div>
            <div class="light-version-header-cell">Perfekt</div>
            <div class="light-version-header-cell">Präteritum</div>
        `;
        lightContainer.appendChild(headerRow);

        // Create data rows
        group.verbs.forEach(verbName => {
            const verbData = allVerbsData[verbName];
            if (!verbData) return;

            // Get clean forms
            const infinitiv = verbName;
            const perfekt = getCleanPerfekt(verbData.perfekt);
            const praeteritum = getCleanPraeteritum(verbData.praeteritum);

            // Create row
            const row = document.createElement('div');
            row.className = 'light-version-row';
            row.onclick = () => openModalForVerb(verbName);
            row.innerHTML = `
                <div class="light-version-cell infinitiv">${infinitiv}</div>
                <div class="light-version-cell perfekt">${perfekt}</div>
                <div class="light-version-cell praeteritum">${praeteritum}</div>
            `;
            lightContainer.appendChild(row);
        });

        cardsContainer.appendChild(lightContainer);

        // Update level and group indicators
        const displayLevel = levelConfig[currentLevel].displayName;
        levelIndicator.textContent = displayLevel;
        levelIndicator.className = 'level-indicator';
        if (displayLevel === 'A1.1') levelIndicator.classList.add('level-a1-1');
        else if (displayLevel === 'A1.2') levelIndicator.classList.add('level-a1-2');
        else if (displayLevel === 'A2.1') levelIndicator.classList.add('level-a2-1');
        else if (displayLevel === 'A2.2') levelIndicator.classList.add('level-a2-2');
        else if (displayLevel === 'B1.1') levelIndicator.classList.add('level-b1-1');

        // Update group theme indicator
        const themeName = group.theme || 'Gruppe';
        groupThemeIndicator.textContent = themeName;

        const totalGroupsInLevel = levelConfig[currentLevel].groupCount;
        const themeNameForGroupIndicator = group.theme ? ` - ${group.theme}` : '';
        groupIndicator.textContent = `${germanOrdinals[currentGroupInLevel]} Gruppe von ${totalGroupsInLevel}${themeNameForGroupIndicator}`;
        prevGroupBtn.disabled = currentGroupInLevel === 0 && currentLevel === levelOrder[0];
        nextGroupBtn.disabled = currentGroupInLevel === totalGroupsInLevel - 1 && currentLevel === levelOrder[levelOrder.length - 1];
    }

    // --- UPDATED RENDER FUNCTION ---
    function renderVerbGroup() {
        const levelGroups = verbGroupsByLevel[currentLevel];
        if (!levelGroups || !levelGroups[currentGroupInLevel]) {
            console.error(`Group data for level ${currentLevel}, group ${currentGroupInLevel} is not loaded or invalid.`);
            cardsContainer.innerHTML = '<p>Fehler beim Laden der Verben.</p>';
            return;
        }

        const group = levelGroups[currentGroupInLevel];
        if (!group.verbs) {
            console.error(`No verbs found in group`);
            cardsContainer.innerHTML = '<p>Fehler beim Laden der Verben.</p>';
            return;
        }

        // Check which version is active
        const selectedVersionRadio = document.querySelector('input[name="card-version"]:checked');
        const activeVersion = selectedVersionRadio ? selectedVersionRadio.value : 'normal';

        if (activeVersion === 'light') {
            renderLightVersion(group);
            updateProgressBar();
            updateLevelNavigationButtons();
            saveProgress();
            return;
        }

        cardsContainer.innerHTML = '';
        const cardsHTML = group.verbs.map(verbName => {
            const verbData = allVerbsData[verbName];
            if (!verbData) return '';
            const irregularMark = verbData.irregularPraesens ? '<span class="irregular-indicator">*</span>' : '';

            // Remove parentheses from translations (except main translation)
            const esTranslation = verbData.es || '';
            const esPerfektTranslation = removeParentheses(verbData.es_perfekt || '');
            const esPraeteritumTranslation = removeParentheses(verbData.es_praeteritum || '');

            // Prepare German perfekt with short (participle only) and full versions
            let germanPerfektShort = verbData.perfekt || '---';
            let germanPerfektFull = verbData.perfekt || '---';
            if (verbData.perfekt && verbData.perfekt !== '---') {
                const germanParts = verbData.perfekt.split(' ');
                if (germanParts.length >= 2) {
                    germanPerfektShort = germanParts.slice(1).join(' '); // participle only
                    germanPerfektFull = verbData.perfekt; // full: ist gegangen
                }
            }

            // Prepare Spanish perfekt with short (participle only) and full versions
            let spanishPerfektShort = esPerfektTranslation;
            let spanishPerfektFull = esPerfektTranslation;
            if (esPerfektTranslation) {
                const spanishParts = esPerfektTranslation.split(' ');
                if (spanishParts.length >= 2) {
                    spanishPerfektShort = spanishParts.slice(1).join(' '); // participle only
                    spanishPerfektFull = esPerfektTranslation; // full: he ido
                }
            }

            // Prepare Präteritum with short (verb only) and full versions
            let germanPraeteritumShort = verbData.praeteritum || '---';
            let germanPraeteritumFull = verbData.praeteritum || '---';
            if (verbData.praeteritum && verbData.praeteritum !== '---') {
                const germanPraeteritumParts = verbData.praeteritum.split(' ');
                if (germanPraeteritumParts.length >= 2) {
                    germanPraeteritumShort = germanPraeteritumParts.slice(1).join(' '); // verb only
                    germanPraeteritumFull = verbData.praeteritum; // full: er/sie/es machte
                }
            }

            // Prepare Spanish präteritum with short (verb only) and full versions
            let spanishPraeteritumShort = esPraeteritumTranslation;
            let spanishPraeteritumFull = esPraeteritumTranslation;
            if (esPraeteritumTranslation) {
                const spanishPraeteritumParts = esPraeteritumTranslation.split(' ');
                if (spanishPraeteritumParts.length >= 2) {
                    spanishPraeteritumShort = spanishPraeteritumParts.slice(1).join(' '); // verb only
                    spanishPraeteritumFull = esPraeteritumTranslation; // full: él/ella hizo
                }
            }

            // Prepare Konjunktiv II (only for specific verbs)
            let germanKonjunktivShort = '';
            let germanKonjunktivFull = '';
            let spanishKonjunktivShort = '';
            let spanishKonjunktivFull = '';
            let konjunktivHTML = '';

            if (konjunktivVerbs.includes(verbName) && verbData.konjunktiv_ii) {
                // Use the "er_sie_es" form for display
                germanKonjunktivShort = verbData.konjunktiv_ii.er_sie_es || '---';
                germanKonjunktivFull = `er/sie/es ${germanKonjunktivShort}`;

                // Spanish translation for Konjunktiv II
                const konjunktivTranslations = {
                    'sein': 'él/ella sería',
                    'haben': 'él/ella tendría',
                    'werden': 'él/ella se convertiría',
                    'dürfen': 'él/ella podría (permiso)',
                    'müssen': 'él/ella debería',
                    'wollen': 'él/ella querría',
                    'sollen': 'él/ella debería',
                    'mögen': 'él/ella gustaría',
                    'können': 'él/ella podría'
                };
                spanishKonjunktivFull = konjunktivTranslations[verbName] || '---';
                spanishKonjunktivShort = spanishKonjunktivFull.split(' ').slice(1).join(' ');

                konjunktivHTML = `
                    <span class="german-konjunktiv konjunktiv-text" data-form="konjunktiv" data-short="${germanKonjunktivShort}" data-full="${germanKonjunktivFull}">${germanKonjunktivShort}</span>
                    <span class="spanish-konjunktiv konjunktiv-text" data-form="translation konjunktiv" data-short="${spanishKonjunktivShort}" data-full="${spanishKonjunktivFull}">${spanishKonjunktivShort}</span>
                `;
            }

            // Generate tags HTML
            let tagsHTML = '';
            if (verbData.tags && verbData.tags.length > 0) {
                tagsHTML = verbData.tags.map(tag => `<span class="verb-tag">${tag}</span>`).join('');
            }

            // Generate case tags HTML
            let caseTagsHTML = '';
            if (verbData.case_tags && verbData.case_tags.length > 0) {
                caseTagsHTML = '<div class="case-tags">' + verbData.case_tags.map(tag => {
                    const tagDisplay = {
                        'dat': '🔴 [+Dat]',
                        'dat_akk': '🔵 [+Dat + Akk]',
                        'akk': '🟢 [+Akk]',
                        'refl': '🟣 [Refl]',
                        'nom': '🟡 [+Nom]',
                        'intrans': '⚪ [Intrans]'
                    };

                    // Handle prep tags with specific prepositions
                    if (tag.startsWith('prep:')) {
                        const prep = tag.substring(5);
                        return `<span class="case-tag case-tag-prep">⚪ [+Prep: ${prep}]</span>`;
                    }

                    const display = tagDisplay[tag] || tag;
                    const className = `case-tag case-tag-${tag.replace('_', '-')}`;
                    return `<span class="${className}">${display}</span>`;
                }).join(' ') + '</div>';
            }

            const cardHTML = `
                <div class="word-item" onclick="openModalForVerb('${verbName}')">
                    <div class="card-header" onclick="event.stopPropagation(); window.speak('${verbName}')" title="Aussprache hören" style="cursor: pointer;">
                        <span class="german-word">${verbName}</span>
                        <span class="spanish-translation" data-form="translation">${esTranslation}</span>
                        <div class="icon-floating">${verbData.emoji || '❓'}</div>
                    </div>
                    <div class="card-body">
                        <div class="text-container perfekt-hover-container">
                            <div class="german-word-container">
                                ${tagsHTML}
                                ${caseTagsHTML}
                            </div>
                            <span class="german-past perfekt-text" data-form="perfekt" data-short="${germanPerfektShort}" data-full="${germanPerfektFull}">${germanPerfektShort}</span>
                            <span class="spanish-perfekt perfekt-text" data-form="translation perfekt" data-short="${spanishPerfektShort}" data-full="${spanishPerfektFull}">${spanishPerfektShort}</span>
                            <span class="german-praeteritum praeteritum-text" data-form="praeteritum" data-short="${germanPraeteritumShort}" data-full="${germanPraeteritumFull}">${germanPraeteritumShort}</span>
                            <span class="spanish-praeteritum praeteritum-text" data-form="translation praeteritum" data-short="${spanishPraeteritumShort}" data-full="${spanishPraeteritumFull}">${spanishPraeteritumShort}</span>
                            ${konjunktivHTML}
                        </div>
                        <div class="cute-translations">
                            <div class="cute-translation-es">${esTranslation}</div>
                            <div class="cute-translation-en">${(verbData.en_verb || '').replace(/^\(?(to\s+)?|\)$/gi, '').trim()}</div>
                        </div>
                    </div>
                </div>`;
            return cardHTML;
        }).join('');

        cardsContainer.innerHTML = cardsHTML;

        const displayLevel = levelConfig[currentLevel].displayName;
        levelIndicator.textContent = displayLevel;
        levelIndicator.className = 'level-indicator'; // Reset classes
        if (displayLevel === 'A1.1') levelIndicator.classList.add('level-a1-1');
        else if (displayLevel === 'A1.2') levelIndicator.classList.add('level-a1-2');
        else if (displayLevel === 'A2.1') levelIndicator.classList.add('level-a2-1');
        else if (displayLevel === 'A2.2') levelIndicator.classList.add('level-a2-2');
        else if (displayLevel === 'B1.1') levelIndicator.classList.add('level-b1-1');
        else if (displayLevel === 'B2.1') levelIndicator.classList.add('level-b2-1');

        // Update group theme indicator
        const themeName = group.theme || 'Gruppe';
        groupThemeIndicator.textContent = themeName;

        const totalGroupsInLevel = levelConfig[currentLevel].groupCount;
        const themeNameForGroupIndicator = group.theme ? ` - ${group.theme}` : '';
        groupIndicator.textContent = `${germanOrdinals[currentGroupInLevel]} Gruppe von ${totalGroupsInLevel}${themeNameForGroupIndicator}`;
        prevGroupBtn.disabled = currentGroupInLevel === 0 && currentLevel === levelOrder[0];
        nextGroupBtn.disabled = currentGroupInLevel === totalGroupsInLevel - 1 && currentLevel === levelOrder[levelOrder.length - 1];
        updateProgressBar();
        updateLevelNavigationButtons();
        saveProgress();

        // Setup hover listeners for perfekt and präteritum forms
        setupHoverListeners();
    }

    function setupHoverListeners() {
        const containers = document.querySelectorAll('.perfekt-hover-container');

        containers.forEach(container => {
            const perfektTexts = container.querySelectorAll('.perfekt-text');
            const praeteritumTexts = container.querySelectorAll('.praeteritum-text');
            const konjunktivTexts = container.querySelectorAll('.konjunktiv-text');

            // Add hover listeners to each perfekt text element
            perfektTexts.forEach(perfektText => {
                perfektText.addEventListener('mouseenter', () => {
                    // Show full version for all perfekt texts in this container
                    container.querySelectorAll('.perfekt-text').forEach(text => {
                        text.textContent = text.getAttribute('data-full');
                    });
                });

                perfektText.addEventListener('mouseleave', () => {
                    // Show short version for all perfekt texts in this container
                    container.querySelectorAll('.perfekt-text').forEach(text => {
                        text.textContent = text.getAttribute('data-short');
                    });
                });
            });

            // Add hover listeners to each präteritum text element
            praeteritumTexts.forEach(praeteritumText => {
                praeteritumText.addEventListener('mouseenter', () => {
                    // Show full version for all präteritum texts in this container
                    container.querySelectorAll('.praeteritum-text').forEach(text => {
                        text.textContent = text.getAttribute('data-full');
                    });
                });

                praeteritumText.addEventListener('mouseleave', () => {
                    // Show short version for all präteritum texts in this container
                    container.querySelectorAll('.praeteritum-text').forEach(text => {
                        text.textContent = text.getAttribute('data-short');
                    });
                });
            });

            // Add hover listeners to each konjunktiv text element
            konjunktivTexts.forEach(konjunktivText => {
                konjunktivText.addEventListener('mouseenter', () => {
                    // Show full version for all konjunktiv texts in this container
                    container.querySelectorAll('.konjunktiv-text').forEach(text => {
                        text.textContent = text.getAttribute('data-full');
                    });
                });

                konjunktivText.addEventListener('mouseleave', () => {
                    // Show short version for all konjunktiv texts in this container
                    container.querySelectorAll('.konjunktiv-text').forEach(text => {
                        text.textContent = text.getAttribute('data-short');
                    });
                });
            });
        });

        // Update gustar button visibility
        updateGustarButtonVisibility();
    }

    function updateGustarButtonVisibility() {
        // Show gustar button only for A1.1 Group 8 (Modalverben - mögen, gefallen, lieben)
        if (currentLevel === 'A1_1' && currentGroupInLevel === 7) { // 7 is index for 8th group (0-indexed)
            gustarButtonContainer.style.display = 'block';
        } else {
            gustarButtonContainer.style.display = 'none';
        }
    }

    function setupProgressBar() {
        progressBar.innerHTML = '';
        const totalGroupsInLevel = levelConfig[currentLevel].groupCount;
        for (let i = 0; i < totalGroupsInLevel; i++) {
            const step = document.createElement('div');
            step.classList.add('progress-step');
            progressBar.appendChild(step);
        }
    }

    function updateProgressBar() {
        setupProgressBar(); // Rebuild for current level
        const steps = progressBar.querySelectorAll('.progress-step');
        steps.forEach((step, i) => {
            step.classList.toggle('active', i <= currentGroupInLevel);
        });
    }

    function updateLevelNavigationButtons() {
        const prevLevelBtn = document.getElementById('prev-level-btn');
        const nextLevelBtn = document.getElementById('next-level-btn');
        const currentLevelIndex = levelOrder.indexOf(currentLevel);

        prevLevelBtn.disabled = currentLevelIndex === 0;
        nextLevelBtn.disabled = currentLevelIndex === levelOrder.length - 1;
    }

    // Helper functions for progress tracking
    function saveProgress() {
        localStorage.setItem(`progress_${currentLevel}`, currentGroupInLevel);
        localStorage.setItem('currentLevel', currentLevel);
    }

    function loadProgress() {
        const savedLevel = localStorage.getItem('currentLevel');
        if (savedLevel && levelConfig[savedLevel]) {
            currentLevel = savedLevel;
            const savedGroup = parseInt(localStorage.getItem(`progress_${currentLevel}`));
            if (!isNaN(savedGroup)) {
                currentGroupInLevel = savedGroup;
            }
        }
    }

    function initializeApp() {
        // Load saved progress from localStorage
        loadProgress();

        // Handle URL parameters (override saved progress)
        const urlParams = new URLSearchParams(window.location.search);
        const urlLevel = urlParams.get('level');
        if (urlLevel) {
            // Convert 'A1.2' format to 'A1_2'
            const levelKey = urlLevel.replace('.', '_');
            if (levelConfig[levelKey]) {
                currentLevel = levelKey;
                currentGroupInLevel = 0;
            }
        }

        setupProgressBar();

        loadAppData()
            .then(() => {
                renderVerbGroup();

                prevGroupBtn.addEventListener('click', () => {
                    if (currentGroupInLevel > 0) {
                        // Previous group in current level
                        currentGroupInLevel--;
                    } else {
                        // Go to previous level's last group (auto-advance)
                        const currentLevelIndex = levelOrder.indexOf(currentLevel);
                        if (currentLevelIndex > 0) {
                            currentLevel = levelOrder[currentLevelIndex - 1];
                            currentGroupInLevel = levelConfig[currentLevel].groupCount - 1;
                        }
                    }
                    clearSearchAndRender();
                });

                nextGroupBtn.addEventListener('click', () => {
                    const totalGroupsInLevel = levelConfig[currentLevel].groupCount;
                    if (currentGroupInLevel < totalGroupsInLevel - 1) {
                        // Next group in current level
                        currentGroupInLevel++;
                    } else {
                        // Go to next level's first group (auto-advance)
                        const currentLevelIndex = levelOrder.indexOf(currentLevel);
                        if (currentLevelIndex < levelOrder.length - 1) {
                            currentLevel = levelOrder[currentLevelIndex + 1];
                            currentGroupInLevel = 0;
                        }
                    }
                    clearSearchAndRender();
                });

                // Swipe/Drag navigation for groups with resistance effect
                let touchStartX = 0;
                let touchStartY = 0;
                let touchEndX = 0;
                let touchEndY = 0;
                let currentX = 0;
                let isDragging = false;
                const swipeThreshold = 80; // minimum distance for swipe
                const resistance = 0.4; // 40% resistance for visual feedback

                // Touch events (mobile)
                cardsContainer.addEventListener('touchstart', (e) => {
                    touchStartX = e.changedTouches[0].screenX;
                    touchStartY = e.changedTouches[0].screenY;
                    isDragging = true;
                    cardsContainer.style.transition = 'none'; // Disable transition during drag
                }, { passive: true });

                cardsContainer.addEventListener('touchmove', (e) => {
                    if (!isDragging) return;

                    currentX = e.changedTouches[0].screenX;
                    const currentY = e.changedTouches[0].screenY;
                    const deltaX = currentX - touchStartX;
                    const deltaY = currentY - touchStartY;

                    // Only apply horizontal drag if movement is more horizontal than vertical
                    if (Math.abs(deltaX) > Math.abs(deltaY)) {
                        e.preventDefault(); // Prevent scrolling when dragging horizontally
                        applyDragEffects(deltaX);
                    }
                }, { passive: false });

                cardsContainer.addEventListener('touchend', (e) => {
                    if (!isDragging) return;

                    touchEndX = e.changedTouches[0].screenX;
                    touchEndY = e.changedTouches[0].screenY;

                    const deltaX = touchEndX - touchStartX;
                    const deltaY = touchEndY - touchStartY;

                    // Only trigger swipe if movement is primarily horizontal
                    if (Math.abs(deltaX) > Math.abs(deltaY)) {
                        handleSwipe(deltaX);
                    } else {
                        // Reset position if it was vertical scroll
                        resetPosition();
                    }

                    isDragging = false;
                }, { passive: true });

                // Mouse events (desktop)
                let mouseStartX = 0;
                let mouseStartY = 0;
                let isMouseDragging = false;

                cardsContainer.addEventListener('mousedown', (e) => {
                    mouseStartX = e.screenX;
                    mouseStartY = e.screenY;
                    isMouseDragging = true;
                    cardsContainer.style.cursor = 'grabbing';
                    cardsContainer.style.transition = 'none';
                });

                cardsContainer.addEventListener('mousemove', (e) => {
                    if (!isMouseDragging) return;

                    const currentMouseX = e.screenX;
                    const currentMouseY = e.screenY;
                    const deltaX = currentMouseX - mouseStartX;
                    const deltaY = currentMouseY - mouseStartY;

                    // Only apply horizontal drag if movement is more horizontal than vertical
                    if (Math.abs(deltaX) > Math.abs(deltaY)) {
                        applyDragEffects(deltaX);
                    }
                });

                cardsContainer.addEventListener('mouseup', (e) => {
                    if (!isMouseDragging) return;

                    const mouseEndX = e.screenX;
                    const mouseEndY = e.screenY;
                    const deltaX = mouseEndX - mouseStartX;
                    const deltaY = mouseEndY - mouseStartY;

                    // Only trigger swipe if movement is primarily horizontal
                    if (Math.abs(deltaX) > Math.abs(deltaY)) {
                        handleSwipe(deltaX);
                    } else {
                        resetPosition();
                    }

                    isMouseDragging = false;
                    cardsContainer.style.cursor = 'grab';
                });

                cardsContainer.addEventListener('mouseleave', () => {
                    if (isMouseDragging) {
                        resetPosition();
                        isMouseDragging = false;
                        cardsContainer.style.cursor = 'grab';
                    }
                });

                // Create peek container for preview cards
                let peekContainer = document.getElementById('peek-container');
                if (!peekContainer) {
                    peekContainer = document.createElement('div');
                    peekContainer.id = 'peek-container';
                    peekContainer.className = 'peek-container';
                    mainContainer.appendChild(peekContainer);
                }

                // Apply drag visual effects (scale + peek)
                function applyDragEffects(deltaX) {
                    const translateX = deltaX * resistance; // Apply resistance

                    // Calculate scale (0.9 to 1.0 based on drag distance)
                    const dragProgress = Math.min(Math.abs(deltaX) / swipeThreshold, 1);
                    const scale = 1 - (dragProgress * 0.1); // Scale down to 0.9

                    // Apply transform with both translate and scale
                    cardsContainer.style.transform = `translateX(${translateX}px) scale(${scale})`;

                    // Show peek effect
                    const totalGroupsInLevel = levelConfig[currentLevel].groupCount;
                    const currentLevelIndex = levelOrder.indexOf(currentLevel);

                    if (deltaX < -20) {
                        // Dragging left, show next group
                        let nextLevel = currentLevel;
                        let nextGroup = currentGroupInLevel + 1;

                        if (nextGroup >= totalGroupsInLevel) {
                            // Next level's first group
                            if (currentLevelIndex < levelOrder.length - 1) {
                                nextLevel = levelOrder[currentLevelIndex + 1];
                                nextGroup = 0;
                            } else {
                                return; // No next group
                            }
                        }

                        showPeek(nextLevel, nextGroup, 'right', Math.abs(deltaX));
                    } else if (deltaX > 20) {
                        // Dragging right, show previous group
                        let prevLevel = currentLevel;
                        let prevGroup = currentGroupInLevel - 1;

                        if (prevGroup < 0) {
                            // Previous level's last group
                            if (currentLevelIndex > 0) {
                                prevLevel = levelOrder[currentLevelIndex - 1];
                                prevGroup = levelConfig[prevLevel].groupCount - 1;
                            } else {
                                return; // No previous group
                            }
                        }

                        showPeek(prevLevel, prevGroup, 'left', Math.abs(deltaX));
                    } else {
                        // Hide peek if drag is too small
                        hidePeek();
                    }
                }

                // Show peek preview of adjacent group
                function showPeek(levelKey, groupIndexInLevel, side, dragDistance) {
                    const levelGroups = verbGroupsByLevel[levelKey];
                    if (!levelGroups || !levelGroups[groupIndexInLevel]) return;
                    const group = levelGroups[groupIndexInLevel];
                    if (!group || !group.verbs) return;

                    peekContainer.innerHTML = '';
                    peekContainer.className = `peek-container peek-${side}`;

                    // Render up to 4 cards as preview
                    const previewCount = Math.min(4, group.verbs.length);
                    for (let i = 0; i < previewCount; i++) {
                        const verbName = group.verbs[i];
                        const verbData = allVerbsData[verbName];
                        if (!verbData) continue;

                        const esTranslation = removeParentheses(verbData.es || '');
                        const cardHTML = `
                            <div class="word-item peek-card">
                                <span class="emoji">${verbData.emoji || '❓'}</span>
                                <div class="text-container">
                                    <span class="german-word">${verbName}</span>
                                    <span class="spanish-translation">${esTranslation}</span>
                                </div>
                            </div>
                        `;
                        peekContainer.innerHTML += cardHTML;
                    }

                    // Calculate peek visibility based on drag distance
                    const peekProgress = Math.min(dragDistance / 100, 1);
                    peekContainer.style.opacity = peekProgress * 0.7;
                    peekContainer.style.display = 'flex';

                    // Position peek container
                    if (side === 'right') {
                        peekContainer.style.right = '0';
                        peekContainer.style.left = 'auto';
                        peekContainer.style.transform = `translateX(${100 - (peekProgress * 100)}%)`;
                    } else {
                        peekContainer.style.left = '0';
                        peekContainer.style.right = 'auto';
                        peekContainer.style.transform = `translateX(-${100 - (peekProgress * 100)}%)`;
                    }
                }

                // Hide peek container
                function hidePeek() {
                    if (peekContainer) {
                        peekContainer.style.display = 'none';
                        peekContainer.innerHTML = '';
                    }
                }

                // Handle swipe/drag logic
                function handleSwipe(deltaX) {
                    hidePeek(); // Hide peek when swipe ends
                    cardsContainer.style.transition = 'transform 0.3s ease, opacity 0.3s ease';

                    const totalGroupsInLevel = levelConfig[currentLevel].groupCount;
                    const currentLevelIndex = levelOrder.indexOf(currentLevel);

                    // Swipe left (next group)
                    if (deltaX < -swipeThreshold) {
                        if (currentGroupInLevel < totalGroupsInLevel - 1) {
                            currentGroupInLevel++;
                        } else if (currentLevelIndex < levelOrder.length - 1) {
                            // Auto-advance to next level
                            currentLevel = levelOrder[currentLevelIndex + 1];
                            currentGroupInLevel = 0;
                        }
                        clearSearchAndRender();
                    }
                    // Swipe right (previous group)
                    else if (deltaX > swipeThreshold) {
                        if (currentGroupInLevel > 0) {
                            currentGroupInLevel--;
                        } else if (currentLevelIndex > 0) {
                            // Auto-advance to previous level
                            currentLevel = levelOrder[currentLevelIndex - 1];
                            currentGroupInLevel = levelConfig[currentLevel].groupCount - 1;
                        }
                        clearSearchAndRender();
                    }
                    // Not enough distance, spring back
                    else {
                        resetPosition();
                    }
                }

                // Reset position with animation
                function resetPosition() {
                    hidePeek(); // Hide peek container
                    cardsContainer.style.transition = 'transform 0.3s ease';
                    cardsContainer.style.transform = 'translateX(0) scale(1)'; // Reset both position and scale
                }

                // Helper function to clear search and render
                function clearSearchAndRender() {
                    const searchInput = document.getElementById('verb-search');
                    const clearSearchBtn = document.getElementById('clear-search');
                    if (searchInput) {
                        searchInput.value = '';
                        clearSearchBtn.classList.remove('visible');
                        document.getElementById('search-counter').textContent = '';
                    }

                    // Reset transform before rendering new group
                    cardsContainer.style.transform = 'translateX(0) scale(1)';
                    renderVerbGroup();
                }

                // Level navigation arrow handlers
                const prevLevelBtn = document.getElementById('prev-level-btn');
                const nextLevelBtn = document.getElementById('next-level-btn');

                prevLevelBtn.addEventListener('click', () => {
                    const currentLevelIndex = levelOrder.indexOf(currentLevel);

                    if (currentLevelIndex > 0) {
                        currentLevel = levelOrder[currentLevelIndex - 1];
                        currentGroupInLevel = 0;
                        clearSearchAndRender();
                    }
                });

                nextLevelBtn.addEventListener('click', () => {
                    const currentLevelIndex = levelOrder.indexOf(currentLevel);

                    if (currentLevelIndex < levelOrder.length - 1) {
                        currentLevel = levelOrder[currentLevelIndex + 1];
                        currentGroupInLevel = 0;
                        clearSearchAndRender();
                    }
                });

                // Keyboard navigation for levels (Up/Down arrows)
                document.addEventListener('keydown', (e) => {
                    // Only handle if not typing in search input
                    if (document.activeElement.tagName === 'INPUT') return;

                    const currentLevelIndex = levelOrder.indexOf(currentLevel);

                    if (e.key === 'ArrowUp') {
                        e.preventDefault();
                        if (currentLevelIndex > 0) {
                            currentLevel = levelOrder[currentLevelIndex - 1];
                            currentGroupInLevel = 0;
                            clearSearchAndRender();
                        }
                    } else if (e.key === 'ArrowDown') {
                        e.preventDefault();
                        if (currentLevelIndex < levelOrder.length - 1) {
                            currentLevel = levelOrder[currentLevelIndex + 1];
                            currentGroupInLevel = 0;
                            clearSearchAndRender();
                        }
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
            const toggleId = toggle.id;

            // Load saved state from localStorage
            const savedState = localStorage.getItem(`toggle-${toggleId}`);
            if (savedState !== null) {
                toggle.checked = savedState === 'true';
            } else {
                // Set default state: Toggles off by default (Active Recall), except Spanish
                if (toggleId === 'en-switch' || toggleId === 'recall-switch') {
                    toggle.checked = false;
                } else if (toggleId === 'es-switch' || toggleId === 'de-switch') {
                    toggle.checked = true;
                }
            }

            // Apply initial state
            mainContainer.classList.toggle(toggleClass, !toggle.checked);
            verbModalContent.classList.toggle(toggleClass, !toggle.checked);

            // Add change event listener
            toggle.addEventListener('change', (event) => {
                const isChecked = event.currentTarget.checked;
                mainContainer.classList.toggle(toggleClass, !isChecked);
                verbModalContent.classList.toggle(toggleClass, !isChecked);

                // Save to localStorage
                localStorage.setItem(`toggle-${toggleId}`, isChecked);
            });
        });

        // Version selector (Normal, Leichte, Niedliche)
        const versionRadios = document.querySelectorAll('input[name="card-version"]');

        // Load saved state from localStorage (default to 'cute')
        const savedVersion = localStorage.getItem('verben-card-version') || 'cute';
        const savedRadio = document.querySelector(`input[name="card-version"][value="${savedVersion}"]`);
        if (savedRadio) {
            savedRadio.checked = true;
            mainContainer.classList.remove('light-version', 'cute-version');
            if (savedVersion === 'light') {
                mainContainer.classList.add('light-version');
            } else if (savedVersion === 'cute') {
                mainContainer.classList.add('cute-version');
            }
        }

        // Event listeners for version changes
        versionRadios.forEach(radio => {
            radio.addEventListener('change', (event) => {
                const selectedVersion = event.target.value;

                // Remove all version classes
                mainContainer.classList.remove('light-version', 'cute-version');

                // Add appropriate class
                if (selectedVersion === 'light') {
                    mainContainer.classList.add('light-version');
                } else if (selectedVersion === 'cute') {
                    mainContainer.classList.add('cute-version');
                }

                // Save to localStorage
                localStorage.setItem('verben-card-version', selectedVersion);

                renderVerbGroup();
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

        if (closeVerbModalButton) {
            closeVerbModalButton.addEventListener('click', () => verbModal.classList.remove('visible'));
        }
        closeVerbModalXButton.addEventListener('click', () => verbModal.classList.remove('visible'));
        verbModal.addEventListener('click', (e) => { if (e.target === verbModal) verbModal.classList.remove('visible'); });

        // Theme badge click handler - using event delegation since badge is created dynamically
        // Note: We attach to header tags container now
        const headerTagsContainer = document.getElementById('modal-header-tags');
        headerTagsContainer.addEventListener('click', (e) => {
            // Check if clicked element is the theme badge
            if (e.target && e.target.id === 'modal-theme-badge') {
                e.stopPropagation(); // Prevent modal header click (TTS)
                const targetLevel = e.target.dataset.level;
                const targetGroup = parseInt(e.target.dataset.group);

                if (targetLevel && targetGroup) {
                    // Convert display level (e.g., "B1.1") to internal key (e.g., "B1_1")
                    const levelKey = targetLevel.replace('.', '_');

                    // Close the verb modal
                    verbModal.classList.remove('visible');

                    // Clear search input and reset UI
                    const searchInput = document.getElementById('verb-search');
                    const clearSearchBtn = document.getElementById('clear-search');
                    const searchCounter = document.getElementById('search-counter');
                    if (searchInput) {
                        searchInput.value = '';
                        if (clearSearchBtn) clearSearchBtn.classList.remove('visible');
                        if (searchCounter) searchCounter.textContent = '';
                    }

                    // Re-enable level indicator
                    if (levelIndicator) {
                        levelIndicator.style.opacity = '1';
                        levelIndicator.style.pointerEvents = 'auto';
                    }

                    // Navigate to the target level and group
                    currentLevel = levelKey;
                    currentGroupInLevel = targetGroup - 1; // Convert to 0-indexed

                    // Reset transform before rendering new group
                    cardsContainer.style.transform = 'translateX(0) scale(1)';

                    // Update UI - render the verb group
                    renderVerbGroup();
                }
            }
        });

        // Gustar modal event listeners
        gustarButton.addEventListener('click', () => gustarModal.classList.add('visible'));
        gustarCloseBtn.addEventListener('click', () => gustarModal.classList.remove('visible'));
        gustarCloseFooterBtn.addEventListener('click', () => gustarModal.classList.remove('visible'));
        gustarModal.addEventListener('click', (e) => { if (e.target === gustarModal) gustarModal.classList.remove('visible'); });

        // Modal event listeners (Removed invalid generic listeners)

        // TTS on Modal Header
        const modalHeader = document.querySelector('.modal-header');
        if (modalHeader) {
            modalHeader.style.cursor = 'pointer';
            modalHeader.title = 'Aussprache hören';
            modalHeader.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const verbText = document.getElementById('modal-verb-infinitive').textContent;
                if (verbText) {
                    speak(verbText);
                }
            });
        }

        // Theme modal event listeners
        groupThemeIndicator.addEventListener('click', openThemeModal);
        closeThemeModalX.addEventListener('click', () => themeModal.classList.remove('visible'));
        closeThemeModalBtn.addEventListener('click', () => themeModal.classList.remove('visible'));
        themeModal.addEventListener('click', (e) => { if (e.target === themeModal) themeModal.classList.remove('visible'); });

        // Setup Tabs
        setupTabs();
    }

    // --- TAB FUNCTIONALITY ---
    function setupTabs() {
        const tabBtns = Array.from(document.querySelectorAll('.modal-tab-btn'));
        const tabContents = document.querySelectorAll('.tab-content');
        const modalTabsNav = document.querySelector('.modal-tabs-nav');

        // Mobile Carousel State
        let currentCarouselIndex = 0;
        const visibleTabCount = 3;

        // Create Arrows if they don't exist
        if (!document.querySelector('.mobile-tab-arrow')) {
            const leftArrow = document.createElement('div');
            leftArrow.className = 'mobile-tab-arrow left';
            leftArrow.innerHTML = '&#10094;'; // <

            const rightArrow = document.createElement('div');
            rightArrow.className = 'mobile-tab-arrow right';
            rightArrow.innerHTML = '&#10095;'; // >

            modalTabsNav.appendChild(leftArrow);
            modalTabsNav.appendChild(rightArrow);

            leftArrow.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent tab click
                navigateCarousel(-1);
            });

            rightArrow.addEventListener('click', (e) => {
                e.stopPropagation();
                navigateCarousel(1);
            });
        }

        // Helper to update visibility
        function updateCarousel() {
            // Filter only currently relevant tabs (e.g. valid Konjunktiv)
            // Note: Konjunktiv tab might be hidden via display:none style if not applicable.
            // We should only consider visible tabs for the carousel.
            // However, the display style is set dynamically in openModalForVerb.
            // We need to re-evaluate this when modal opens.
            // For now, let's just assume we operate on buttons that are not 'display: none' via inline style.

            const visibleButtons = tabBtns.filter(btn => btn.style.display !== 'none');

            // Adjust index if out of bounds
            if (currentCarouselIndex < 0) currentCarouselIndex = 0;
            if (currentCarouselIndex > Math.max(0, visibleButtons.length - visibleTabCount)) {
                currentCarouselIndex = Math.max(0, visibleButtons.length - visibleTabCount);
            }

            // Update classes
            tabBtns.forEach(btn => btn.classList.remove('visible-tab'));

            visibleButtons.forEach((btn, index) => {
                if (index >= currentCarouselIndex && index < currentCarouselIndex + visibleTabCount) {
                    btn.classList.add('visible-tab');
                }
            });

            // Toggle arrows visibility (optional: hide if at ends)
            // For simple carousel, always show if count > visibleTabCount?
            // User requested explicit arrows. 
            const arrows = document.querySelectorAll('.mobile-tab-arrow');
            const shouldShowArrows = visibleButtons.length > visibleTabCount && window.innerWidth <= 600;

            arrows.forEach(arrow => {
                arrow.style.display = shouldShowArrows ? 'flex' : 'none';
            });
        }

        function navigateCarousel(direction) {
            const visibleButtons = tabBtns.filter(btn => btn.style.display !== 'none');
            const maxIndex = Math.max(0, visibleButtons.length - visibleTabCount);

            currentCarouselIndex += direction;
            if (currentCarouselIndex < 0) currentCarouselIndex = 0;
            if (currentCarouselIndex > maxIndex) currentCarouselIndex = maxIndex;

            updateCarousel();
        }

        // Expose update function to be called when modal opens
        window.updateTabCarousel = updateCarousel;

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons and contents
                tabBtns.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));

                // Add active class to clicked button
                btn.classList.add('active');

                // Show corresponding content
                const tabId = btn.getAttribute('data-tab');
                const contentId = `${tabId}-tab-content`;
                const content = document.getElementById(contentId);
                if (content) {
                    content.classList.add('active');
                    content.style.display = 'block';
                }

                // Hide other contents
                tabContents.forEach(c => {
                    if (c.id !== contentId) {
                        c.style.display = 'none';
                    }
                });
            });
        });

        // Initialize
        updateCarousel();
        window.addEventListener('resize', updateCarousel);
    }

    // --- THEME MODAL FUNCTION ---
    async function openThemeModal() {
        const levelKey = currentLevel; // e.g., 'A1_1'
        const groupNum = currentGroupInLevel + 1; // 1-indexed

        console.log(`[DEBUG] Opening Theme Modal for Level: ${levelKey}, Group: ${groupNum}`);
        console.log(`[DEBUG] Opening Theme Modal for Level: ${levelKey}, Group: ${groupNum}`);

        // Use pre-loaded group data from memory
        const groupData = verbGroupsByLevel[levelKey][currentGroupInLevel];

        if (!groupData) {
            console.error(`Group data not found for ${levelKey} group index ${currentGroupInLevel}`);
            return;
        }

        currentThemeData = groupData;
        const themeData = groupData;

        // Populate modal with theme data
        document.getElementById('theme-modal-german-name').textContent = themeData.germanName;
        document.getElementById('theme-modal-spanish-name').textContent = themeData.spanishName;
        document.getElementById('theme-modal-level').textContent = themeData.level;
        document.getElementById('theme-modal-group').textContent = themeData.group;
        document.getElementById('theme-modal-short-name').textContent = themeData.shortName;
        document.getElementById('theme-modal-german-desc').textContent = themeData.germanDescription;
        document.getElementById('theme-modal-spanish-desc').textContent = themeData.spanishDescription;

        // Populate B1 rating and exam context
        const ratingBadge = document.getElementById('theme-modal-rating');
        ratingBadge.textContent = themeData.b1Rating || 'N/A';

        // Add appropriate class based on rating type
        ratingBadge.className = 'theme-rating-badge';
        if (themeData.b1Rating) {
            if (themeData.b1Rating.includes('Critical')) {
                ratingBadge.classList.add('critical');
            } else if (themeData.b1Rating.includes('High')) {
                ratingBadge.classList.add('high');
            } else if (themeData.b1Rating.includes('Medium')) {
                ratingBadge.classList.add('medium');
            }
        }

        document.getElementById('theme-modal-exam-context').textContent = themeData.examContext || 'No exam context available.';
        document.getElementById('theme-modal-exam-context-es').textContent = themeData.examContextEs || '';

        // Show the modal
        themeModal.classList.add('visible');

    }

    // --- TTS FUNCTION ---
    window.speak = function (text, lang = 'de-DE', rate = 0.9) {
        if ('speechSynthesis' in window) {
            // Cancel any previous speech
            window.speechSynthesis.cancel();

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = rate;

            // Robust Voice Selection
            const voices = window.speechSynthesis.getVoices();

            // 1. Try exact match (e.g., 'de-DE')
            // 2. Try alternate format (e.g., 'de_DE')
            // 3. Try any voice starting with the language code (e.g., 'de')
            let targetVoice = voices.find(voice => voice.lang === lang) ||
                voices.find(voice => voice.lang === lang.replace('-', '_')) ||
                voices.find(voice => voice.lang.startsWith(lang.substring(0, 2)));

            if (targetVoice) {
                utterance.voice = targetVoice;
                utterance.lang = targetVoice.lang; // Ensure utterance lang matches voice lang
            } else {
                // Fallback: trust the browser to handle the requested lang
                utterance.lang = lang;
            }

            window.speechSynthesis.speak(utterance);
        } else {
            console.error("Speech synthesis not supported in this browser.");
        }
    };

    // --- UPDATED MODAL FUNCTION WITH LAZY LOADING ---
    window.openModalForVerb = async function (verb) {
        const data = allVerbsData[verb];
        if (!data) return;

        // Lazy load praesens, perfekt, perfekt_konjugation, praeteritum_konjugation, fragen, and konjunktiv_ii data if not already loaded
        if (!data.praesens || !data.examples || !data.praesens_fragen || !data.perfekt_examples || !data.praeteritum_examples || (konjunktivVerbs.includes(verb) && !data.konjunktiv_ii)) {
            try {
                const praesensPromise = fetch(`json/praesens/${verb}.json`).then(res => res.ok ? res.json() : {}).catch(() => ({}));
                const perfektPromise = fetch(`json/perfekt/${verb}.json`).then(res => res.ok ? res.json() : []).catch(() => []);
                const fragenPromise = fetch(`json/praesens_fragen/${verb}.json`).then(res => res.ok ? res.json() : {}).catch(() => ({}));
                const perfektKonjugationPromise = fetch(`json/perfekt_konjugation/${verb}.json`).then(res => res.ok ? res.json() : {}).catch(() => ({}));
                const praeteritumKonjugationPromise = fetch(`json/praeteritum_konjugation/${verb}.json`).then(res => res.ok ? res.json() : {}).catch(() => ({}));

                // Add Konjunktiv II data fetch for specific verbs
                const konjunktivPromise = konjunktivVerbs.includes(verb)
                    ? fetch(`json/konjunktiv_ii/${verb}.json`).then(res => res.ok ? res.json() : {}).catch(() => ({}))
                    : Promise.resolve({});

                const [praesensData, perfektData, fragenData, perfektKonjugationData, praeteritumKonjugationData, konjunktivData] = await Promise.all([praesensPromise, perfektPromise, fragenPromise, perfektKonjugationPromise, praeteritumKonjugationPromise, konjunktivPromise]);

                // Rename praeteritum from konjugation data to avoid conflict with card praeteritum string
                if (praeteritumKonjugationData.praeteritum) {
                    praeteritumKonjugationData.praeteritum_conjugations = praeteritumKonjugationData.praeteritum;
                    delete praeteritumKonjugationData.praeteritum;
                }

                // Merge the loaded data into allVerbsData
                allVerbsData[verb] = {
                    ...data,
                    ...praesensData,
                    ...fragenData,
                    ...perfektKonjugationData,
                    ...praeteritumKonjugationData,
                    ...konjunktivData,
                    examples: perfektData
                };
            } catch (error) {
                console.error(`Failed to load modal data for ${verb}:`, error);
            }
        }

        // Get the updated data reference
        const updatedData = allVerbsData[verb];

        // Set infinitive with case tags
        const infinitiveElement = document.getElementById('modal-verb-infinitive');
        // const irregularMark = updatedData.irregularPraesens ? '<span class="irregular-indicator">*</span>' : '';
        // Removed asterisk as requested
        infinitiveElement.innerHTML = verb;

        // Reset tags collapse state
        const tagsCollapsible = document.getElementById('modal-tags-collapsible');
        const tagsToggle = document.getElementById('modal-tags-toggle');

        if (tagsCollapsible && tagsToggle) {
            tagsCollapsible.classList.add('collapsed');
            tagsToggle.querySelector('.dots-icon').style.display = 'inline';
            tagsToggle.querySelector('.chevron-icon').style.display = 'none';
        }

        // Add case tags below translations
        const caseTagsContainer = document.getElementById('modal-case-tags-container');
        caseTagsContainer.innerHTML = ''; // Clear previous tags

        // ROW 1: Theme badge - MOVED TO HEADER
        const headerTagsContainer = document.getElementById('modal-header-tags');
        headerTagsContainer.innerHTML = ''; // Clear previous header tags

        // Attributes (Separable/Notes) - MOVED OUTSIDE HEADER
        const extraTagsContainer = document.getElementById('modal-extra-tags');
        if (extraTagsContainer) extraTagsContainer.innerHTML = '';

        if (updatedData.theme && updatedData.group) {
            const themeBadge = document.createElement('span');
            themeBadge.id = 'modal-theme-badge';
            themeBadge.className = 'modal-theme-badge case-tag';
            themeBadge.title = 'Zum Thema navigieren (Navigate to theme)';
            themeBadge.textContent = updatedData.theme;
            themeBadge.style.display = 'inline-block';
            themeBadge.dataset.level = updatedData.level;
            themeBadge.dataset.group = updatedData.group;

            // Add refined styles for header context
            themeBadge.style.backgroundColor = 'rgba(255, 255, 255, 0.25)';
            themeBadge.style.border = '1px solid rgba(255, 255, 255, 0.4)';
            themeBadge.style.color = 'white';
            themeBadge.style.backdropFilter = 'blur(4px)';

            headerTagsContainer.appendChild(themeBadge);
        }

        // ROW 2: Case tags (Dativ, Akkusativ, Intrans, Prep, etc.)
        if (updatedData.case_tags && updatedData.case_tags.length > 0) {
            const caseRow = document.createElement('div');
            caseRow.className = 'tags-row case-tags-row';

            const tagDisplay = {
                'dat': '🔴 [+Dat]',
                'dat_akk': '🔵 [+Dat + Akk]',
                'akk': '🟢 [+Akk]',
                'refl': '🟣 [Refl]',
                'nom': '🟡 [+Nom]',
                'intrans': '⚪ [Intrans]'
            };

            updatedData.case_tags.forEach(tag => {
                const tagSpan = document.createElement('span');
                tagSpan.className = `case-tag case-tag-${tag.replace('_', '-')}`;

                if (tag.startsWith('prep:')) {
                    const prep = tag.substring(5);
                    tagSpan.textContent = `⚪ [+Prep: ${prep}]`;
                    tagSpan.className = 'case-tag case-tag-prep';
                } else {
                    tagSpan.textContent = tagDisplay[tag] || tag;
                }

                caseRow.appendChild(tagSpan);
            });

            caseTagsContainer.appendChild(caseRow);
        }

        // ROW 3: Verb type and notes (Separable/Non-Separable + Notes)
        if (verbTypesData[verb]) {
            const typeInfo = verbTypesData[verb];
            const typeRow = document.createElement('div');
            typeRow.className = 'tags-row type-tags-row';

            // Add type tag (Separable/Non-Separable)
            if (typeInfo.type) {
                const typeTag = document.createElement('span');
                typeTag.className = 'verb-type-tag';

                if (typeInfo.type === 'Separable') {
                    typeTag.classList.add('type-separable');
                    typeTag.textContent = '🔹 Separable';
                } else if (typeInfo.type === 'Non-Separable') {
                    typeTag.classList.add('type-non-separable');
                    typeTag.textContent = '🔸 Non-Separable';
                }

                typeRow.appendChild(typeTag);
            }

            // Add notes tag if notes exist
            if (typeInfo.notes && typeInfo.notes.trim() !== '') {
                const notesTag = document.createElement('span');
                notesTag.className = 'verb-notes-tag';
                notesTag.textContent = `💡 ${typeInfo.notes}`;
                typeRow.appendChild(notesTag);
            }

            // Only append the row if it has content
            if (typeRow.children.length > 0) {
                // Determine which container to use.
                // User wants Separable/Notes tags OUTSIDE the header.
                // We reference extraTagsContainer defined in upper scope.
                if (extraTagsContainer) {
                    extraTagsContainer.appendChild(typeRow);
                }
            }
        }

        document.getElementById('modal-verb-perfekt').textContent = updatedData.perfekt || '---';
        document.getElementById('modal-verb-praeteritum').textContent = updatedData.praeteritum || '---';

        // Update Tab Buttons (Dynamic Labels)
        const tabBtnInfinitiv = document.getElementById('tab-btn-infinitiv');
        const tabBtnPerfekt = document.getElementById('tab-btn-perfekt');
        const tabBtnPraeteritum = document.getElementById('tab-btn-praeteritum');

        if (tabBtnInfinitiv) {
            tabBtnInfinitiv.textContent = verb;
            tabBtnInfinitiv.classList.add('active'); // Reset to active
        }

        if (tabBtnPerfekt) {
            tabBtnPerfekt.textContent = getCleanPerfekt(updatedData.perfekt);
            tabBtnPerfekt.classList.remove('active');
        }

        if (tabBtnPraeteritum) {
            tabBtnPraeteritum.textContent = getCleanPraeteritum(updatedData.praeteritum);
            tabBtnPraeteritum.classList.remove('active');
        }

        // Reset Tab Content Visibility
        document.getElementById('praesens-tab-content').classList.add('active');
        document.getElementById('praesens-tab-content').style.display = 'block';

        document.getElementById('perfekt-tab-content').classList.remove('active');
        document.getElementById('perfekt-tab-content').style.display = 'none';

        document.getElementById('praeteritum-tab-content').classList.remove('active');
        document.getElementById('praeteritum-tab-content').style.display = 'none';

        document.getElementById('konjunktiv-tab-content').classList.remove('active');
        document.getElementById('konjunktiv-tab-content').style.display = 'none';

        // Show/Hide Konjunktiv Tab Button and Set Label
        const tabBtnKonjunktiv = document.getElementById('tab-btn-konjunktiv');
        if (tabBtnKonjunktiv) {
            if (konjunktivVerbs.includes(verb) && updatedData.konjunktiv_ii && updatedData.konjunktiv_ii.ich) {
                tabBtnKonjunktiv.style.display = 'inline-block';
                tabBtnKonjunktiv.textContent = updatedData.konjunktiv_ii.ich;
                tabBtnKonjunktiv.classList.remove('active');
            } else {
                tabBtnKonjunktiv.style.display = 'none';
            }
        }

        // Emoji with TTS
        const modalEmojiEl = document.getElementById('modal-emoji');
        modalEmojiEl.textContent = updatedData.emoji || '❓';
        modalEmojiEl.onclick = (e) => {
            e.stopPropagation();
            speak(verb);
        };
        modalEmojiEl.title = "Aussprache hören";

        document.getElementById('modal-verb-infinitive-es').textContent = updatedData.es || '';
        document.getElementById('modal-verb-perfekt-es').textContent = updatedData.es_perfekt || '';
        document.getElementById('modal-verb-praeteritum-es').textContent = updatedData.es_praeteritum || '';
        document.getElementById('modal-verb-english-infinitive').textContent = updatedData.en_verb || '';
        document.getElementById('modal-verb-english-perfekt').textContent = updatedData.en_perfekt || '';
        document.getElementById('modal-verb-english-praeteritum').textContent = updatedData.en_praeteritum || '';
        const levelText = updatedData.level || 'A1';
        let typeText = '';
        if (updatedData.Wortart_type) {
            const capitalizedType = updatedData.Wortart_type.charAt(0).toUpperCase() + updatedData.Wortart_type.slice(1);
            typeText = ` - ${capitalizedType}`;
        }
        document.getElementById('modal-level-badge').textContent = levelText + typeText;

        // --- NEW NOTE LOGIC ---

        // 1. General Card Note (displayed below Wortfamilie)
        // Use 'note' attribute or fallback to 'note_es'
        const generalNote = updatedData.note || updatedData.note_es;
        const generalNoteElement = document.getElementById('modal-general-note');
        if (generalNote) {
            generalNoteElement.innerHTML = generalNote;
            generalNoteElement.style.display = 'block';
        } else {
            generalNoteElement.style.display = 'none';
        }

        // 2. Present Tense Note (displayed below conjugation table)
        const praesensNote = updatedData.praesens_note;
        const praesensNoteElement = document.getElementById('modal-praesens-note');
        if (praesensNote) {
            praesensNoteElement.innerHTML = praesensNote;
            praesensNoteElement.style.display = 'block';
        } else {
            praesensNoteElement.style.display = 'none';
        }

        // Display note_es if it exists (REMOVED/REPLACED by General Note above)
        // keeping the element ref just in case but logic is handled above
        const oldNoteElement = document.getElementById('modal-verb-note');
        if (oldNoteElement) {
            oldNoteElement.style.display = 'none'; // Ensure old element is hidden
        }

        // Helper to parse string format: "word (Level) = translation"
        const parseWordString = (str) => {
            // Match "Word (Level) = Translation" or similar
            // e.g., "verheiratet (A2) = casado/a (adjetivo)"
            // e.g., "der Ehemann / die Ehefrau (A2) = esposo / esposa"
            const match = str.match(/^(.*?)\s*\((\w+)\)\s*=\s*(.*)$/);
            if (match) {
                return {
                    word: match[1].trim(),
                    level: match[2].trim(), // e.g. "A2"
                    type: '', // Type inferred from context or left empty
                    es: match[3].trim()
                };
            }
            // Fallback if format doesn't match
            return {
                word: str,
                level: 'Extras',
                type: '',
                es: ''
            };
        };

        // Helper to render standard Word List UI
        const renderStandardWordList = (container, contentEl, wordObjects) => {
            if (!container || !contentEl) return;

            if (!wordObjects || wordObjects.length === 0) {
                container.style.display = 'none';
                return;
            }

            container.style.display = 'block';

            // Group words by level
            const wordsByLevel = { 'A1': [], 'A2': [], 'B1': [] };
            const extraLevels = {};

            wordObjects.forEach(wordData => {
                const lvl = wordData.level;
                if (wordsByLevel[lvl]) {
                    wordsByLevel[lvl].push(wordData);
                } else {
                    if (!extraLevels[lvl]) extraLevels[lvl] = [];
                    extraLevels[lvl].push(wordData);
                }
            });

            const typeAbbrev = { 'noun': 'n', 'adjective': 'a', 'adverb': 'adv', 'verb': 'v' };
            let contentHTML = '';

            // Render standard levels
            ['A1', 'A2', 'B1'].forEach(level => {
                if (wordsByLevel[level].length > 0) {
                    contentHTML += `<div class="wf-level-section">`;
                    contentHTML += `<div class="wf-level-header">${level}</div>`;
                    wordsByLevel[level].forEach(wordData => {
                        const abbrev = typeAbbrev[wordData.type] || wordData.type || '';
                        contentHTML += `<div class="wf-word-item">`;
                        contentHTML += `<div class="wf-word-line">`;
                        contentHTML += `• <span class="wf-word-german" onclick="speak('${wordData.word}')" title="Aussprache hören">${wordData.word}</span>`;
                        if (abbrev) contentHTML += ` <span class="wf-word-type">${abbrev}</span>`;
                        contentHTML += `</div>`;
                        contentHTML += `<div class="wf-word-translation">${wordData.es}</div>`;
                        contentHTML += `</div>`;
                    });
                    contentHTML += `</div>`;
                }
            });

            // Render extra levels
            Object.keys(extraLevels).forEach(level => {
                if (extraLevels[level].length > 0) {
                    contentHTML += `<div class="wf-level-section">`;
                    contentHTML += `<div class="wf-level-header">${level}</div>`;
                    extraLevels[level].forEach(wordData => {
                        const abbrev = typeAbbrev[wordData.type] || wordData.type || '';
                        contentHTML += `<div class="wf-word-item">`;
                        contentHTML += `<div class="wf-word-line">`;
                        contentHTML += `• <span class="wf-word-german" onclick="speak('${wordData.word}')" title="Aussprache hören">${wordData.word}</span>`;
                        if (abbrev) contentHTML += ` <span class="wf-word-type">${abbrev}</span>`;
                        contentHTML += `</div>`;
                        contentHTML += `<div class="wf-word-translation">${wordData.es}</div>`;
                        contentHTML += `</div>`;
                    });
                    contentHTML += `</div>`;
                }
            });

            contentEl.innerHTML = contentHTML;
        };

        // Populate Wortfamilie section
        const wortfamilieContainer = document.getElementById('wortfamilie-container');
        const wortfamilieContent = document.getElementById('wortfamilie-content');

        let wortfamilieItems = [];
        if (updatedData.wortfamilie && Array.isArray(updatedData.wortfamilie) && updatedData.wortfamilie.length > 0) {
            wortfamilieItems = updatedData.wortfamilie.map(parseWordString);
        } else if (wortfamilieData[verb] && wortfamilieData[verb].length > 0) {
            wortfamilieItems = wortfamilieData[verb];
        }
        renderStandardWordList(wortfamilieContainer, wortfamilieContent, wortfamilieItems);

        // Populate Wortfeld section
        const wortfeldContainer = document.getElementById('wortfeld-container');
        const wortfeldContent = document.getElementById('wortfeld-content');

        let wortfeldItems = [];
        if (updatedData.wortfeld && Array.isArray(updatedData.wortfeld) && updatedData.wortfeld.length > 0) {
            wortfeldItems = updatedData.wortfeld.map(parseWordString);
        }
        renderStandardWordList(wortfeldContainer, wortfeldContent, wortfeldItems);

        const praesensTableContainer = document.getElementById('modal-praesens-table');
        if (updatedData.praesens) {
            // Define the desired pronoun order with Spanish translations
            const pronounOrder = [
                { key: 'ich', display: 'ich', spanish: 'yo' },
                { key: 'du', display: 'du', spanish: 'tú' },
                { key: 'er', display: 'er', spanish: 'él' },
                { key: 'sie', display: 'sie', spanish: 'ella' },
                { key: 'es', display: 'es', spanish: 'neutro' },
                { key: 'wir', display: 'wir', spanish: 'nosotr@s' },
                { key: 'ihr', display: 'ihr', spanish: 'vosotr@s' },
                { key: 'sie (plural)', display: 'sie', spanish: 'ell@s' },
                { key: 'Sie (formal)', display: 'Sie', spanish: 'usted(es)' }
            ];

            let tableHTML = '<table>';
            tableHTML += '<tr><th>Pronomen</th><th>Konjugation</th><th>Beispiel <button id="toggle-beispiel-type" class="toggle-beispiel-btn" title="Zwischen Aussagen und Fragen wechseln">⇄</button></th></tr>';

            for (const { key, display, spanish } of pronounOrder) {
                const conjugation = updatedData.praesens[key];
                if (conjugation) {
                    const example = updatedData.praesens_examples && updatedData.praesens_examples[key];
                    const frage = updatedData.praesens_fragen && updatedData.praesens_fragen[key];
                    let exampleCell = '';

                    if (example || frage) {
                        exampleCell = `<div class="example-cell">`;

                        // Aussage (statement) examples
                        if (example) {
                            exampleCell += `<div class="example-aussage" style="display: block;">`;
                            if (example.de) exampleCell += `<div class="example-de">${example.de}</div>`;
                            if (example.en) exampleCell += `<div class="example-translation example-en">🇬🇧 ${example.en}</div>`;
                            if (example.es) exampleCell += `<div class="example-translation example-es">🇪🇸 ${example.es}</div>`;
                            exampleCell += `</div>`;
                        }

                        // Frage (question) examples
                        if (frage) {
                            exampleCell += `<div class="example-frage" style="display: none;">`;
                            if (frage.de) exampleCell += `<div class="example-de">${frage.de}</div>`;
                            if (frage.en) exampleCell += `<div class="example-translation example-en">🇬🇧 ${frage.en}</div>`;
                            if (frage.es) exampleCell += `<div class="example-translation example-es">🇪🇸 ${frage.es}</div>`;
                            exampleCell += `</div>`;
                        }

                        exampleCell += `</div>`;
                    }

                    // Create pronoun cell with German pronoun and Spanish translation
                    let pronounCell = `<div class="pronoun-de">${display}</div>`;
                    if (spanish) {
                        pronounCell += `<div class="pronoun-es">🇪🇸 ${spanish}</div>`;
                    }

                    // Add special classes for er/sie/es rows and hide conjugation for er and es
                    // Also hide conjugation for sie (plural) since it's same as Sie (formal)
                    let rowClass = '';
                    let conjugationCell = conjugation;

                    if (key === 'er') {
                        rowClass = ' class="pronoun-row-er"';
                        conjugationCell = ''; // Hide conjugation for er
                    } else if (key === 'sie') {
                        rowClass = ' class="pronoun-row-sie"';
                    } else if (key === 'es') {
                        rowClass = ' class="pronoun-row-es"';
                        conjugationCell = ''; // Hide conjugation for es
                    } else if (key === 'sie (plural)') {
                        rowClass = ' class="pronoun-row-sie-plural"';
                        conjugationCell = ''; // Hide conjugation for sie (plural)
                    } else if (key === 'Sie (formal)') {
                        rowClass = ' class="pronoun-row-Sie-formal"';
                    }

                    tableHTML += `<tr${rowClass}><td>${pronounCell}</td><td>${conjugationCell}</td><td>${exampleCell}</td></tr>`;
                }
            }

            tableHTML += '</table>';

            // Add additional grammar note if it exists
            if (updatedData.additionalNote) {
                tableHTML += `<div class="additional-note">${updatedData.additionalNote}</div>`;
            }

            praesensTableContainer.innerHTML = tableHTML;

            // Add event listener for toggle button
            const toggleBtn = document.getElementById('toggle-beispiel-type');
            if (toggleBtn) {
                toggleBtn.addEventListener('click', () => {
                    const aussageExamples = document.querySelectorAll('.example-aussage');
                    const frageExamples = document.querySelectorAll('.example-frage');

                    aussageExamples.forEach(el => {
                        if (el.style.display === 'none') {
                            el.style.display = 'block';
                        } else {
                            el.style.display = 'none';
                        }
                    });

                    frageExamples.forEach(el => {
                        if (el.style.display === 'none') {
                            el.style.display = 'block';
                        } else {
                            el.style.display = 'none';
                        }
                    });
                });
            }
        } else {
            praesensTableContainer.innerHTML = '';
        }

        const praesensExamplesContainer = document.getElementById('praesens-examples-container');
        if (praesensExamplesContainer) praesensExamplesContainer.style.display = 'none';

        // Generate Perfekt examples table
        const perfektExamplesTableContainer = document.getElementById('modal-perfekt-examples-table');
        if (updatedData.perfekt_examples) {
            // Determine if verb uses haben or sein
            const usesHaben = updatedData.perfekt && updatedData.perfekt.startsWith('hat');
            const usesSein = updatedData.perfekt && updatedData.perfekt.startsWith('ist');

            // Auxiliary verb conjugations
            const auxHaben = ['habe', 'hast', 'hat', 'haben', 'habt', 'haben', 'haben'];
            const auxSein = ['bin', 'bist', 'ist', 'sind', 'seid', 'sind', 'sind'];

            const pronounOrder = [
                { key: 'ich', display: 'ich', spanish: 'yo', auxIndex: 0 },
                { key: 'du', display: 'du', spanish: 'tú', auxIndex: 1 },
                { key: 'er', display: 'er', spanish: 'él', auxIndex: 2 },
                { key: 'sie', display: 'sie', spanish: 'ella', auxIndex: 2 },
                { key: 'es', display: 'es', spanish: 'neutro', auxIndex: 2 },
                { key: 'wir', display: 'wir', spanish: 'nosotr@s', auxIndex: 3 },
                { key: 'ihr', display: 'ihr', spanish: 'vosotr@s', auxIndex: 4 },
                { key: 'sie (plural)', display: 'sie', spanish: 'ell@s', auxIndex: 5 },
                { key: 'Sie (formal)', display: 'Sie', spanish: 'usted(es)', auxIndex: 6 }
            ];

            let perfektTableHTML = '<table>';
            perfektTableHTML += '<tr><th>Pronomen</th><th>Aux. Konjug.</th><th>Beispiel</th></tr>';

            for (const { key, display, spanish, auxIndex } of pronounOrder) {
                const example = updatedData.perfekt_examples[key];
                if (example) {
                    let exampleCell = '';

                    if (example) {
                        exampleCell = `<div class="example-cell">`;
                        if (example.de) exampleCell += `<div class="example-de">${example.de}</div>`;
                        if (example.en) exampleCell += `<div class="example-translation example-en">🇬🇧 ${example.en}</div>`;
                        if (example.es) exampleCell += `<div class="example-translation example-es">🇪🇸 ${example.es}</div>`;
                        exampleCell += `</div>`;
                    }

                    // Create pronoun cell with German pronoun and Spanish translation
                    let pronounCell = `<div class="pronoun-de">${display}</div>`;
                    if (spanish) {
                        pronounCell += `<div class="pronoun-es">🇪🇸 ${spanish}</div>`;
                    }

                    // Get auxiliary verb conjugation
                    let auxVerb = '';
                    if (usesSein) {
                        auxVerb = auxSein[auxIndex];
                    } else {
                        auxVerb = auxHaben[auxIndex];
                    }

                    // Add special classes for er/sie/es rows
                    let rowClass = '';
                    if (key === 'er') {
                        rowClass = ' class="pronoun-row-er"';
                    } else if (key === 'sie') {
                        rowClass = ' class="pronoun-row-sie"';
                    } else if (key === 'es') {
                        rowClass = ' class="pronoun-row-es"';
                    } else if (key === 'sie (plural)') {
                        rowClass = ' class="pronoun-row-sie-plural"';
                    } else if (key === 'Sie (formal)') {
                        rowClass = ' class="pronoun-row-Sie-formal"';
                    }

                    perfektTableHTML += `<tr${rowClass}><td>${pronounCell}</td><td class="aux-verb">${auxVerb}</td><td>${exampleCell}</td></tr>`;
                }
            }

            perfektTableHTML += '</table>';
            perfektExamplesTableContainer.innerHTML = perfektTableHTML;
        } else {
            perfektExamplesTableContainer.innerHTML = '';
        }

        // Generate Präteritum conjugation and examples table
        const praeteritumKonjugationTableContainer = document.getElementById('modal-praeteritum-konjugation-table');
        if (updatedData.praeteritum_conjugations && updatedData.praeteritum_examples) {
            const pronounOrder = [
                { key: 'ich', display: 'ich', spanish: 'yo' },
                { key: 'du', display: 'du', spanish: 'tú' },
                { key: 'er', display: 'er', spanish: 'él' },
                { key: 'sie', display: 'sie', spanish: 'ella' },
                { key: 'es', display: 'es', spanish: 'neutro' },
                { key: 'wir', display: 'wir', spanish: 'nosotr@s' },
                { key: 'ihr', display: 'ihr', spanish: 'vosotr@s' },
                { key: 'sie (plural)', display: 'sie', spanish: 'ell@s' },
                { key: 'Sie (formal)', display: 'Sie', spanish: 'usted(es)' }
            ];

            let praeteritumTableHTML = '<table>';
            praeteritumTableHTML += '<tr><th>Pronomen</th><th>Konjugation</th><th>Beispiel</th></tr>';

            for (const { key, display, spanish } of pronounOrder) {
                const conjugation = updatedData.praeteritum_conjugations[key];
                const example = updatedData.praeteritum_examples[key];

                if (conjugation || example) {
                    let exampleCell = '';

                    if (example) {
                        exampleCell = `<div class="example-cell">`;
                        if (example.de) exampleCell += `<div class="example-de">${example.de}</div>`;
                        if (example.en) exampleCell += `<div class="example-translation example-en">🇬🇧 ${example.en}</div>`;
                        if (example.es) exampleCell += `<div class="example-translation example-es">🇪🇸 ${example.es}</div>`;
                        exampleCell += `</div>`;
                    }

                    // Create pronoun cell with German pronoun and Spanish translation
                    let pronounCell = `<div class="pronoun-de">${display}</div>`;
                    if (spanish) {
                        pronounCell += `<div class="pronoun-es">🇪🇸 ${spanish}</div>`;
                    }

                    // Add special classes for er/sie/es rows and hide conjugation for duplicates
                    let rowClass = '';
                    let conjugationCell = conjugation || '';

                    if (key === 'er') {
                        rowClass = ' class="pronoun-row-er"';
                    } else if (key === 'sie') {
                        rowClass = ' class="pronoun-row-sie"';
                    } else if (key === 'es') {
                        rowClass = ' class="pronoun-row-es"';
                        conjugationCell = ''; // Hide if same as er/sie
                    } else if (key === 'sie (plural)') {
                        rowClass = ' class="pronoun-row-sie-plural"';
                        conjugationCell = ''; // Hide if same as Sie (formal)
                    } else if (key === 'Sie (formal)') {
                        rowClass = ' class="pronoun-row-Sie-formal"';
                    }

                    praeteritumTableHTML += `<tr${rowClass}><td>${pronounCell}</td><td>${conjugationCell}</td><td>${exampleCell}</td></tr>`;
                }
            }

            praeteritumTableHTML += '</table>';
            praeteritumKonjugationTableContainer.innerHTML = praeteritumTableHTML;
        } else {
            praeteritumKonjugationTableContainer.innerHTML = '';
        }

        // Generate Konjunktiv II conjugation table (only for specific verbs)
        const konjunktivKonjugationTableContainer = document.getElementById('modal-konjunktiv-konjugation-table-tab');
        const konjunktivKonjugationContainer = document.getElementById('konjunktiv-konjugation-container-tab');

        if (konjunktivVerbs.includes(verb) && updatedData.konjunktiv_ii && updatedData.konjunktiv_ii_examples) {
            // Show the Konjunktiv II container for these verbs
            konjunktivKonjugationContainer.style.display = 'block';

            const pronounOrder = [
                { key: 'ich', display: 'ich', spanish: 'yo' },
                { key: 'du', display: 'du', spanish: 'tú' },
                { key: 'er_sie_es', display: 'er/sie/es', spanish: 'él/ella' },
                { key: 'wir', display: 'wir', spanish: 'nosotr@s' },
                { key: 'ihr', display: 'ihr', spanish: 'vosotr@s' },
                { key: 'sie_Sie', display: 'sie/Sie', spanish: 'ell@s/usted(es)' }
            ];

            let konjunktivTableHTML = '<table>';
            konjunktivTableHTML += '<tr><th>Pronomen</th><th>Konjugation</th><th>Beispiel</th></tr>';

            for (const { key, display, spanish } of pronounOrder) {
                const conjugation = updatedData.konjunktiv_ii[key];
                const example = updatedData.konjunktiv_ii_examples[key];

                if (conjugation || example) {
                    // Create pronoun cell with German pronoun and Spanish translation
                    let pronounCell = `<div class="pronoun-de">${display}</div>`;
                    if (spanish) {
                        pronounCell += `<div class="pronoun-es">🇪🇸 ${spanish}</div>`;
                    }

                    // Create example cell with German, English, and Spanish
                    let exampleCell = '';
                    if (example) {
                        exampleCell = `<div class="example-cell">`;
                        if (example.de) exampleCell += `<div class="example-de">${example.de}</div>`;
                        if (example.en) exampleCell += `<div class="example-translation example-en">🇬🇧 ${example.en}</div>`;
                        if (example.es) exampleCell += `<div class="example-translation example-es">🇪🇸 ${example.es}</div>`;
                        exampleCell += `</div>`;
                    }

                    konjunktivTableHTML += `<tr><td>${pronounCell}</td><td>${conjugation || ''}</td><td>${exampleCell}</td></tr>`;
                }
            }

            konjunktivTableHTML += '</table>';
            konjunktivKonjugationTableContainer.innerHTML = konjunktivTableHTML;
        } else {
            // Hide the Konjunktiv II container for verbs that don't support it
            konjunktivKonjugationContainer.style.display = 'none';
            konjunktivKonjugationTableContainer.innerHTML = '';
        }

        const verbModalContent = document.querySelector('#verb-modal .modal-content');
        verbModalContent.classList.remove('hide-perfekt', 'hide-praeteritum', 'hide-konjunktiv', 'hide-translation');

        // Add hide-konjunktiv class if verb doesn't support Konjunktiv II
        if (!konjunktivVerbs.includes(verb)) {
            verbModalContent.classList.add('hide-konjunktiv');
        }
        document.getElementById('praesens-details-container').open = true;

        document.getElementById('modal-verb-infinitive').onclick = (e) => {
            e.stopPropagation();
            speak(verb);
        };
        document.getElementById('modal-verb-infinitive').style.cursor = 'pointer';
        document.getElementById('modal-verb-infinitive').title = 'Aussprache hören';

        document.getElementById('modal-verb-perfekt').onclick = (e) => {
            e.stopPropagation();
            speak(updatedData.perfekt);
        };
        document.getElementById('modal-verb-perfekt').style.cursor = 'pointer';
        document.getElementById('modal-verb-perfekt').title = 'Aussprache hören';

        document.getElementById('modal-verb-praeteritum').onclick = (e) => {
            e.stopPropagation();
            speak(updatedData.praeteritum);
        };
        document.getElementById('modal-verb-praeteritum').style.cursor = 'pointer';
        document.getElementById('modal-verb-praeteritum').title = 'Aussprache hören';

        // modal-text removed as per user request
        // document.getElementById('modal-text').onclick = ...

        if (window.updateTabCarousel) window.updateTabCarousel();
        verbModal.classList.add('visible');
    }

    // --- SEARCH FUNCTIONALITY ---
    const searchInput = document.getElementById('verb-search');
    const clearSearchBtn = document.getElementById('clear-search');
    const searchCounter = document.getElementById('search-counter');

    async function performSearch() {
        if (!searchInput) return;

        const searchTerm = searchInput.value.trim().toLowerCase();

        // Show/hide clear button
        if (clearSearchBtn) {
            if (searchTerm.length > 0) {
                clearSearchBtn.classList.add('visible');
            } else {
                clearSearchBtn.classList.remove('visible');
            }
        }

        // Only search if 2+ characters
        if (searchTerm.length < 2) {
            // Show all cards in current group
            const allCards = cardsContainer.querySelectorAll('.word-item');
            allCards.forEach(card => {
                card.style.display = '';
            });
            if (searchCounter) searchCounter.textContent = '';
            // Re-enable level indicator
            if (levelIndicator) {
                levelIndicator.style.opacity = '1';
                levelIndicator.style.pointerEvents = 'auto';
            }
            return;
        }

        // Disable level indicator during search
        if (levelIndicator) {
            levelIndicator.style.opacity = '0.3';
            levelIndicator.style.pointerEvents = 'none';
        }

        // Search across ALL groups in all levels
        const matchingVerbs = [];
        const searchPromises = [];

        Object.keys(verbGroupsByLevel).forEach(levelKey => {
            const levelGroups = verbGroupsByLevel[levelKey];
            levelGroups.forEach((group, groupIndexInLevel) => {
                if (!group || !group.verbs) return;

                // Check if group name matches search term (German or Spanish)
                const groupNameMatch = (group.theme && group.theme.toLowerCase().includes(searchTerm)) ||
                    (group.germanName && group.germanName.toLowerCase().includes(searchTerm)) ||
                    (group.spanishName && group.spanishName.toLowerCase().includes(searchTerm));

                if (groupNameMatch) {
                    console.log(`MATCH FOUND! Group: ${group.theme} matches term: "${searchTerm}"`);
                }

                group.verbs.forEach(verbName => {
                    const verbData = allVerbsData[verbName];
                    if (verbData) {
                        // Create a promise for each verb to search (including lazy-loaded praesens)
                        const searchPromise = (async () => {
                            try {
                                // If the group matches, return this verb immediately as a match
                                if (groupNameMatch) {
                                    return {
                                        verb: verbName,
                                        data: verbData,
                                        levelKey: levelKey,
                                        groupIndexInLevel: groupIndexInLevel
                                    };
                                }

                                // Helper function to check if search term is contained as a word in text
                                const containsWord = (text, term) => {
                                    if (!text) return false;
                                    const normalized = text.toLowerCase().replace(/[()]/g, '');
                                    const words = normalized.split(/[\s,/]+/);
                                    return words.some(word => word.startsWith(term));
                                };

                                // Search in German infinitive and Spanish translation
                                const germanMatch = verbName.toLowerCase().includes(searchTerm);
                                let spanishMatch = containsWord(verbData.es, searchTerm);

                                // Also search in searchable Spanish variants
                                if (!spanishMatch && verbData.es_searchable) {
                                    spanishMatch = verbData.es_searchable.some(variant =>
                                        containsWord(variant, searchTerm)
                                    );
                                }

                                // Search in Perfekt (German and Spanish)
                                let perfektMatch = false;
                                if (verbData.perfekt) {
                                    const perfektWords = verbData.perfekt.toLowerCase().split(' ');
                                    // Exclude auxiliary verbs "hat" and "ist" from search
                                    const filteredPerfektWords = perfektWords.filter(word => word !== 'hat' && word !== 'ist');
                                    perfektMatch = filteredPerfektWords.some(word => word.startsWith(searchTerm));
                                }

                                // Search in Spanish Perfekt forms (he dado, ha dado, etc.)
                                if (!perfektMatch && verbData.es_perfekt) {
                                    perfektMatch = containsWord(verbData.es_perfekt, searchTerm);
                                }

                                // Also search in searchable Perfekt variants
                                if (!perfektMatch && verbData.es_perfekt_searchable) {
                                    perfektMatch = verbData.es_perfekt_searchable.some(variant =>
                                        containsWord(variant, searchTerm)
                                    );
                                }

                                // Search in Präsens conjugations (pre-loaded!)
                                let praesensMatch = false;
                                if (allVerbsData[verbName].praesens) {
                                    const conjugations = Object.values(allVerbsData[verbName].praesens);
                                    praesensMatch = conjugations.some(conj => typeof conj === 'string' && conj.toLowerCase().startsWith(searchTerm));
                                }

                                // Search in Präteritum conjugations (pre-loaded!)
                                let praeteritumMatch = false;
                                if (allVerbsData[verbName].praeteritum_conjugations) {
                                    const conjugations = Object.values(allVerbsData[verbName].praeteritum_conjugations);
                                    praeteritumMatch = conjugations.some(conj => {
                                        // Präteritum conjugations are objects with de, en, es properties
                                        if (typeof conj === 'string') {
                                            return conj.toLowerCase().startsWith(searchTerm);
                                        } else if (conj && conj.de) {
                                            return conj.de.toLowerCase().startsWith(searchTerm);
                                        }
                                        return false;
                                    });
                                }

                                // Search in Spanish Präteritum forms (él/ella dio, etc.)
                                if (!praeteritumMatch && verbData.es_praeteritum) {
                                    praeteritumMatch = containsWord(verbData.es_praeteritum, searchTerm);
                                }

                                // Also search in searchable Präteritum variants
                                if (!praeteritumMatch && verbData.es_praeteritum_searchable) {
                                    praeteritumMatch = verbData.es_praeteritum_searchable.some(variant =>
                                        containsWord(variant, searchTerm)
                                    );
                                }

                                // Search in Konjunktiv II conjugations (pre-loaded!)
                                let konjunktivMatch = false;
                                if (allVerbsData[verbName].konjunktiv_ii) {
                                    const conjugations = Object.values(allVerbsData[verbName].konjunktiv_ii);
                                    konjunktivMatch = conjugations.some(conj => {
                                        if (typeof conj === 'string') {
                                            return conj.toLowerCase().startsWith(searchTerm);
                                        }
                                        return false;
                                    });
                                }

                                if (germanMatch || spanishMatch || perfektMatch || praesensMatch || praeteritumMatch || konjunktivMatch) {
                                    return {
                                        verb: verbName,
                                        data: verbData,
                                        levelKey: levelKey,
                                        groupIndexInLevel: groupIndexInLevel
                                    };
                                }
                                return null;
                            } catch (e) {
                                console.error(`Error searching verb ${verbName}:`, e);
                                return null;
                            }
                        })();

                        searchPromises.push(searchPromise);
                    }
                });
            });
        });

        // Wait for all search promises to resolve
        const searchResults = await Promise.all(searchPromises);
        const filteredResults = searchResults.filter(result => result !== null);
        matchingVerbs.push(...filteredResults);

        // Clear current cards and display matching verbs (max 9)
        cardsContainer.innerHTML = '';
        const maxVisible = 9;
        const verbsToShow = matchingVerbs.slice(0, maxVisible);

        verbsToShow.forEach(match => {
            const verbName = match.verb;
            const verbData = match.data;
            const irregularMark = verbData.irregularPraesens ? '<span class="irregular-indicator">*</span>' : '';

            // Remove parentheses from translations
            const esTranslation = removeParentheses(verbData.es || '');
            const esPerfektTranslation = removeParentheses(verbData.es_perfekt || '');
            const esPraeteritumTranslation = removeParentheses(verbData.es_praeteritum || '');

            // Prepare German perfekt with short and full versions
            let germanPerfektShort = verbData.perfekt || '---';
            let germanPerfektFull = verbData.perfekt || '---';
            if (verbData.perfekt && verbData.perfekt !== '---') {
                const germanParts = verbData.perfekt.split(' ');
                if (germanParts.length >= 2) {
                    germanPerfektShort = germanParts.slice(1).join(' ');
                    germanPerfektFull = verbData.perfekt;
                }
            }

            // Prepare Spanish perfekt with short and full versions
            let spanishPerfektShort = esPerfektTranslation;
            let spanishPerfektFull = esPerfektTranslation;
            if (esPerfektTranslation) {
                const spanishParts = esPerfektTranslation.split(' ');
                if (spanishParts.length >= 2) {
                    spanishPerfektShort = spanishParts.slice(1).join(' ');
                    spanishPerfektFull = esPerfektTranslation;
                }
            }

            // Prepare Präteritum with short (verb only) and full versions
            let germanPraeteritumShort = verbData.praeteritum || '---';
            let germanPraeteritumFull = verbData.praeteritum || '---';
            if (verbData.praeteritum && verbData.praeteritum !== '---') {
                const germanPraeteritumParts = verbData.praeteritum.split(' ');
                if (germanPraeteritumParts.length >= 2) {
                    germanPraeteritumShort = germanPraeteritumParts.slice(1).join(' '); // verb only
                    germanPraeteritumFull = verbData.praeteritum; // full: er/sie/es machte
                }
            }

            // Prepare Spanish präteritum with short (verb only) and full versions
            let spanishPraeteritumShort = esPraeteritumTranslation;
            let spanishPraeteritumFull = esPraeteritumTranslation;
            if (esPraeteritumTranslation) {
                const spanishPraeteritumParts = esPraeteritumTranslation.split(' ');
                if (spanishPraeteritumParts.length >= 2) {
                    spanishPraeteritumShort = spanishPraeteritumParts.slice(1).join(' '); // verb only
                    spanishPraeteritumFull = esPraeteritumTranslation; // full: él/ella hizo
                }
            }

            // Prepare Konjunktiv II (only for specific verbs)
            let germanKonjunktivShort = '';
            let germanKonjunktivFull = '';
            let spanishKonjunktivShort = '';
            let spanishKonjunktivFull = '';
            let konjunktivHTML = '';

            if (konjunktivVerbs.includes(verbName) && verbData.konjunktiv_ii) {
                // Use the "er_sie_es" form for display
                germanKonjunktivShort = verbData.konjunktiv_ii.er_sie_es || '---';
                germanKonjunktivFull = `er/sie/es ${germanKonjunktivShort}`;

                // Spanish translation for Konjunktiv II
                const konjunktivTranslations = {
                    'sein': 'él/ella sería',
                    'haben': 'él/ella tendría',
                    'werden': 'él/ella se convertiría',
                    'dürfen': 'él/ella podría (permiso)',
                    'müssen': 'él/ella debería',
                    'wollen': 'él/ella querría',
                    'sollen': 'él/ella debería',
                    'mögen': 'él/ella gustaría',
                    'können': 'él/ella podría'
                };
                spanishKonjunktivFull = konjunktivTranslations[verbName] || '---';
                spanishKonjunktivShort = spanishKonjunktivFull.split(' ').slice(1).join(' ');

                konjunktivHTML = `
                    <span class="german-konjunktiv konjunktiv-text" data-form="konjunktiv" data-short="${germanKonjunktivShort}" data-full="${germanKonjunktivFull}">${germanKonjunktivShort}</span>
                    <span class="spanish-konjunktiv konjunktiv-text" data-form="translation konjunktiv" data-short="${spanishKonjunktivShort}" data-full="${spanishKonjunktivFull}">${spanishKonjunktivShort}</span>
                `;
            }

            // Generate tags HTML
            let tagsHTML = '';
            if (verbData.tags && verbData.tags.length > 0) {
                tagsHTML = verbData.tags.map(tag => `<span class="verb-tag">${tag}</span>`).join('');
            }

            // Generate case tags HTML
            let caseTagsHTML = '';
            if (verbData.case_tags && verbData.case_tags.length > 0) {
                caseTagsHTML = '<div class="case-tags">' + verbData.case_tags.map(tag => {
                    const tagDisplay = {
                        'dat': '🔴 [+Dat]',
                        'dat_akk': '🔵 [+Dat + Akk]',
                        'akk': '🟢 [+Akk]',
                        'refl': '🟣 [Refl]',
                        'nom': '🟡 [+Nom]',
                        'intrans': '⚪ [Intrans]'
                    };

                    // Handle prep tags with specific prepositions
                    if (tag.startsWith('prep:')) {
                        const prep = tag.substring(5);
                        return `<span class="case-tag case-tag-prep">⚪ [+Prep: ${prep}]</span>`;
                    }

                    const display = tagDisplay[tag] || tag;
                    const className = `case-tag case-tag-${tag.replace('_', '-')}`;
                    return `<span class="${className}">${display}</span>`;
                }).join(' ') + '</div>';
            }

            const cardHTML = `
                <div class="word-item" onclick="openModalForVerb('${verbName}')">
                    <div class="card-header">
                        <span class="german-word">${verbName}</span>
                        <span class="spanish-translation" data-form="translation">${esTranslation}</span>
                        <div class="icon-floating">${verbData.emoji || '❓'}</div>
                    </div>
                    <div class="card-body">
                        <div class="text-container perfekt-hover-container">
                            <div class="german-word-container">
                                ${tagsHTML}
                                ${caseTagsHTML}
                            </div>
                            <span class="german-past perfekt-text" data-form="perfekt" data-short="${germanPerfektShort}" data-full="${germanPerfektFull}">${germanPerfektShort}</span>
                            <span class="spanish-perfekt perfekt-text" data-form="translation perfekt" data-short="${spanishPerfektShort}" data-full="${spanishPerfektFull}">${spanishPerfektShort}</span>
                            <span class="german-praeteritum praeteritum-text" data-form="praeteritum" data-short="${germanPraeteritumShort}" data-full="${germanPraeteritumFull}">${germanPraeteritumShort}</span>
                            <span class="spanish-praeteritum praeteritum-text" data-form="translation praeteritum" data-short="${spanishPraeteritumShort}" data-full="${spanishPraeteritumFull}">${spanishPraeteritumShort}</span>
                            ${konjunktivHTML}
                        </div>
                        <div class="cute-translations">
                            <div class="cute-translation-es">${esTranslation}</div>
                            <div class="cute-translation-en">${(verbData.en_verb || '').replace(/^\(?(to\s+)?|\)$/gi, '').trim()}</div>
                        </div>
                    </div>
                </div>`;
            cardsContainer.innerHTML += cardHTML;
        });

        // Re-setup hover listeners for new cards
        setupHoverListeners();

        // Update counter
        if (searchCounter) {
            const totalMatches = matchingVerbs.length;
            if (totalMatches === 0) {
                searchCounter.textContent = 'Keine Verben gefunden (no se encontraron verbos)';
            } else if (totalMatches <= maxVisible) {
                searchCounter.textContent = `${totalMatches} ${totalMatches === 1 ? 'Verb' : 'Verben'} gefunden`;
            } else {
                searchCounter.textContent = `${verbsToShow.length} von ${totalMatches} Verben angezeigt`;
            }
        }
    }

    function clearSearch() {
        if (!searchInput) return;
        searchInput.value = '';
        if (clearSearchBtn) clearSearchBtn.classList.remove('visible');
        if (searchCounter) searchCounter.textContent = '';
        // Re-enable level indicator
        if (levelIndicator) {
            levelIndicator.style.opacity = '1';
            levelIndicator.style.pointerEvents = 'auto';
        }
        // Restore the current group
        renderVerbGroup();
    }

    // Event listeners with debouncing for search
    let searchTimeout;
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => performSearch(), 300); // 300ms debounce
        });
    }
    if (clearSearchBtn) {
        clearSearchBtn.addEventListener('click', clearSearch);
    }

    // --- TTS Function ---
    function speak(text, lang = 'de-DE', rate = 0.9) {
        if ('speechSynthesis' in window) {
            // Cancel any previous speech
            window.speechSynthesis.cancel();

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = lang;
            utterance.rate = rate;

            // Optional: Find a specific German voice
            const voices = window.speechSynthesis.getVoices();
            const germanVoice = voices.find(voice => voice.lang === 'de-DE');
            if (germanVoice) {
                utterance.voice = germanVoice;
            }

            window.speechSynthesis.speak(utterance);
        } else {
            console.error("Speech synthesis not supported in this browser.");
        }
    }
    window.speak = speak;

    // --- START THE APP ---
    initializeApp();
});
