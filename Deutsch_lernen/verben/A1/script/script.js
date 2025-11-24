document.addEventListener('DOMContentLoaded', () => {
    // --- GLOBAL STATE ---
    const allVerbsData = {};
    let verbGroupsByLevel = {}; // Groups organized by level
    let wortfamilieData = {}; // Word family data
    const germanOrdinals = ["Erste", "Zweite", "Dritte", "Vierte", "Fünfte", "Sechste", "Siebte", "Achte", "Neunte", "Zehnte"];
    const germanExampleOrdinals = ["Erstes", "Zweites", "Drittes", "Viertes", "Fünftes", "Sechstes", "Siebtes", "Achtes"];
    const savedStories = [
        `<p>Gestern <span class="highlighted-word">bin ich</span> in Berlin <span class="highlighted-word">gewesen</span>. Ich <span class="highlighted-word">bin</span> mit dem Zug <span class="highlighted-word">gefahren</span>. In der Stadt <span class="highlighted-word">habe ich</span> eine Freundin <span class="highlighted-word">gesehen</span>. Wir <span class="highlighted-word">haben</span> in einem Café <span class="highlighted-word">gesprochen</span> und einen Kaffee <span class="highlighted-word">getrunken</span>. Danach <span class="highlighted-word">habe ich</span> ein Buch <span class="highlighted-word">gekauft</span> und mit Karte <span class="highlighted-word">bezahlt</span>. Es <span class="highlighted-word">hat</span> viel Spaß <span class="highlighted-word">gemacht</span>!</p>`,
        `<p>Heute Morgen <span class="highlighted-word">habe ich</span> lange <span class="highlighted-word">geschlafen</span>. Zum Frühstück <span class="highlighted-word">habe ich</span> ein Brötchen <span class="highlighted-word">gegessen</span>. Dann <span class="highlighted-word">habe ich</span> eine E-Mail an meine Familie <span class="highlighted-word">geschrieben</span>. Ich <span class="highlighted-word">habe</span> ihnen <span class="highlighted-word">gesagt</span>, dass ich bald nach Hause <span class="highlighted-word">komme</span>. Später <span class="highlighted-word">habe ich</span> die Zeitung <span class="highlighted-word">gelesen</span>.</p>`,
        `<p>Am Wochenende <span class="highlighted-word">habe ich</span> zu Hause <span class="highlighted-word">gearbeitet</span>. Ich <span class="highlighted-word">habe</span> für eine Prüfung <span class="highlighted-word">gelernt</span>. Ich <span class="highlighted-word">habe</span> eine Frage nicht <span class="highlighted-word">gewusst</span>, also <span class="highlighted-word">habe ich</span> meinen Lehrer <span class="highlighted-word">gefragt</span>. Er <span class="highlighted-word">hat</span> mir alles gut erklärt. Ich <span class="highlighted-word">habe</span> die Antwort schnell <span class="highlighted-word">gefunden</span>.</p>`
    ];

    // Level configuration
    const levelConfig = {
        'A1_1': { groupCount: 6, displayName: 'A1.1' },
        'A1_2': { groupCount: 6, displayName: 'A1.2' },
        'A2_1': { groupCount: 7, displayName: 'A2.1' },
        'A2_2': { groupCount: 8, displayName: 'A2.2' },
        'B1_1': { groupCount: 1, displayName: 'B1.1' }
    };
    const levelOrder = ['A1_1', 'A1_2', 'A2_1', 'A2_2', 'B1_1'];

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

    // --- NEW LOADING FUNCTION ---
    function loadAppData() {
        const groupPromises = [];

        // Load groups from each level folder
        levelOrder.forEach(levelKey => {
            const config = levelConfig[levelKey];
            const groups = [];

            for (let i = 1; i <= config.groupCount; i++) {
                const promise = fetch(`json/groups/${levelKey}/${levelKey}_group_${i}.json`)
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
                            fetch(`json/praeteritum_konjugation/${verbName}.json`).then(res => res.ok ? res.json() : {}).catch(() => ({}))
                        ];

                        // Add Konjunktiv II data for specific verbs
                        if (konjunktivVerbs.includes(verbName)) {
                            fetchPromises.push(
                                fetch(`json/konjunktiv_ii/${verbName}.json`).then(res => res.ok ? res.json() : {}).catch(() => ({}))
                            );
                        }

                        const [praesensData, praeteritumData, konjunktivData] = await Promise.all(fetchPromises);

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
                            ...(konjunktivData || {})
                        };
                    } catch (error) {
                        console.warn(`Failed to pre-load conjugations for ${verbName}:`, error);
                    }
                });

                return Promise.all(conjugationPromises).then(() => {
                    console.log('Conjugation data pre-loaded! Search will be fast.');

                    // Load Wortfamilie data
                    return fetch('wortfamilie_kompakt.json')
                        .then(res => res.ok ? res.json() : {})
                        .then(data => {
                            wortfamilieData = data.verbs || {};
                        })
                        .catch(error => {
                            console.warn('Failed to load Wortfamilie data:', error);
                            wortfamilieData = {};
                        });
                });
            });
        });
    }

    // Helper function to remove all parentheses from translations
    function removeParentheses(text) {
        if (!text) return text;
        return text.replace(/[()]/g, '');
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

        cardsContainer.innerHTML = '';
        group.verbs.forEach(verbName => {
            const verbData = allVerbsData[verbName];
            if (!verbData) return;
            const irregularMark = verbData.irregularPraesens ? '<span class="irregular-indicator">*</span>' : '';

            // Remove parentheses from translations
            const esTranslation = removeParentheses(verbData.es || '');
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
                    <div class="word-item-content">
                        <span class="emoji">${verbData.emoji || '❓'}</span>
                        <div class="text-container perfekt-hover-container">
                            <div class="german-word-container">
                                <span class="german-word">${verbName}${irregularMark}</span>
                                ${tagsHTML}
                                ${caseTagsHTML}
                            </div>
                            <span class="spanish-translation" data-form="translation">${esTranslation}</span>
                            <span class="german-past perfekt-text" data-form="perfekt" data-short="${germanPerfektShort}" data-full="${germanPerfektFull}">${germanPerfektShort}</span>
                            <span class="spanish-perfekt perfekt-text" data-form="translation perfekt" data-short="${spanishPerfektShort}" data-full="${spanishPerfektFull}">${spanishPerfektShort}</span>
                            <span class="german-praeteritum praeteritum-text" data-form="praeteritum" data-short="${germanPraeteritumShort}" data-full="${germanPraeteritumFull}">${germanPraeteritumShort}</span>
                            <span class="spanish-praeteritum praeteritum-text" data-form="translation praeteritum" data-short="${spanishPraeteritumShort}" data-full="${spanishPraeteritumFull}">${spanishPraeteritumShort}</span>
                            ${konjunktivHTML}
                        </div>
                    </div>
                </div>`;
            cardsContainer.innerHTML += cardHTML;
        });

        const displayLevel = levelConfig[currentLevel].displayName;
        levelIndicator.textContent = displayLevel;
        levelIndicator.className = 'level-indicator'; // Reset classes
        if (displayLevel === 'A1.1') levelIndicator.classList.add('level-a1-1');
        else if (displayLevel === 'A1.2') levelIndicator.classList.add('level-a1-2');
        else if (displayLevel === 'A2.1') levelIndicator.classList.add('level-a2-1');
        else if (displayLevel === 'A2.2') levelIndicator.classList.add('level-a2-2');
        else if (displayLevel === 'B1.1') levelIndicator.classList.add('level-b1-1');

        const totalGroupsInLevel = levelConfig[currentLevel].groupCount;
        groupIndicator.textContent = `${germanOrdinals[currentGroupInLevel]} Gruppe von ${totalGroupsInLevel}`;
        prevGroupBtn.disabled = currentGroupInLevel === 0 && currentLevel === levelOrder[0];
        nextGroupBtn.disabled = currentGroupInLevel === totalGroupsInLevel - 1 && currentLevel === levelOrder[levelOrder.length - 1];
        updateProgressBar();
        updateLevelProgressDots();
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
        // Show gustar button only for A1.1 Group 6 (Sechste Gruppe)
        if (currentLevel === 'A1_1' && currentGroupInLevel === 5) { // 5 is index for 6th group (0-indexed)
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

    function updateLevelProgressDots() {
        const dots = document.querySelectorAll('.level-dot');
        const lines = document.querySelectorAll('.level-line');

        // Convert currentLevel from 'A1_1' format to 'A1.1' for comparison
        const displayLevel = levelConfig[currentLevel].displayName;
        const displayLevelOrder = levelOrder.map(l => levelConfig[l].displayName);
        const currentLevelIndex = displayLevelOrder.indexOf(displayLevel);

        dots.forEach((dot, index) => {
            // Remove all classes first
            dot.classList.remove('active', 'completed');

            if (index === currentLevelIndex) {
                // Current level - highlighted with glow
                dot.classList.add('active');
            } else if (index < currentLevelIndex) {
                // Completed levels - filled but no glow
                dot.classList.add('completed');
            }
        });

        lines.forEach((line, index) => {
            // Lines are between dots, so line[0] connects dot[0] to dot[1]
            line.classList.remove('completed');

            if (index < currentLevelIndex) {
                // Line is completed if we've passed beyond it
                line.classList.add('completed');
            }
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
        closeVerbModalXButton.addEventListener('click', () => verbModal.classList.remove('visible'));
        verbModal.addEventListener('click', (e) => { if (e.target === verbModal) verbModal.classList.remove('visible'); });

        // Gustar modal event listeners
        gustarButton.addEventListener('click', () => gustarModal.classList.add('visible'));
        gustarCloseBtn.addEventListener('click', () => gustarModal.classList.remove('visible'));
        gustarCloseFooterBtn.addEventListener('click', () => gustarModal.classList.remove('visible'));
        gustarModal.addEventListener('click', (e) => { if (e.target === gustarModal) gustarModal.classList.remove('visible'); });
    }
    
    // --- UPDATED MODAL FUNCTION WITH LAZY LOADING ---
    window.openModalForVerb = async function(verb) {
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
        infinitiveElement.textContent = verb;

        // Add case tags to modal infinitive
        if (updatedData.case_tags && updatedData.case_tags.length > 0) {
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
                    tagSpan.textContent = ` ⚪ [+Prep: ${prep}]`;
                    tagSpan.className = 'case-tag case-tag-prep';
                } else {
                    tagSpan.textContent = ` ${tagDisplay[tag] || tag}`;
                }

                infinitiveElement.appendChild(tagSpan);
            });
        }

        document.getElementById('modal-verb-perfekt').textContent = updatedData.perfekt || '---';
        document.getElementById('modal-verb-praeteritum').textContent = updatedData.praeteritum || '---';
        document.getElementById('modal-emoji').textContent = updatedData.emoji || '❓';
        document.getElementById('modal-verb-infinitive-es').textContent = updatedData.es ? `🇪🇸 ${updatedData.es}` : '';
        document.getElementById('modal-verb-perfekt-es').textContent = updatedData.es_perfekt ? `🇪🇸 ${updatedData.es_perfekt}` : '';
        document.getElementById('modal-verb-praeteritum-es').textContent = updatedData.es_praeteritum ? `🇪🇸 ${updatedData.es_praeteritum}` : '';
        document.getElementById('modal-verb-english-infinitive').textContent = updatedData.en_verb ? `🇬🇧 ${updatedData.en_verb}` : '';
        document.getElementById('modal-verb-english-perfekt').textContent = updatedData.en_perfekt ? `🇬🇧 ${updatedData.en_perfekt}` : '';
        document.getElementById('modal-verb-english-praeteritum').textContent = updatedData.en_praeteritum ? `🇬🇧 ${updatedData.en_praeteritum}` : '';
        document.getElementById('modal-level-badge').textContent = updatedData.level || 'A1';

        // Populate Wortfamilie section
        const wortfamilieContainer = document.getElementById('wortfamilie-container');
        const wortfamilieContent = document.getElementById('wortfamilie-content');

        if (wortfamilieData[verb] && wortfamilieData[verb].length > 0) {
            wortfamilieContainer.style.display = 'block';

            // Group words by level
            const wordsByLevel = {
                'A1': [],
                'A2': [],
                'B1': []
            };

            wortfamilieData[verb].forEach(wordData => {
                if (wordsByLevel[wordData.level]) {
                    wordsByLevel[wordData.level].push(wordData);
                }
            });

            // Type abbreviation mapping
            const typeAbbrev = {
                'noun': 'n',
                'adjective': 'a',
                'adverb': 'adv',
                'verb': 'v'
            };

            let contentHTML = '';

            // Iterate through levels in order (A1, A2, B1)
            ['A1', 'A2', 'B1'].forEach(level => {
                if (wordsByLevel[level].length > 0) {
                    contentHTML += `<div class="wf-level-section">`;
                    contentHTML += `<div class="wf-level-header">${level} Level:</div>`;

                    wordsByLevel[level].forEach(wordData => {
                        const abbrev = typeAbbrev[wordData.type] || wordData.type;
                        contentHTML += `<div class="wf-word-item">`;
                        contentHTML += `<div class="wf-word-line">`;
                        contentHTML += `• <span class="wf-word-german">${wordData.word}</span>`;
                        contentHTML += ` <span class="wf-word-type">${abbrev}</span>`;
                        contentHTML += `</div>`;
                        contentHTML += `<div class="wf-word-translation">${wordData.es}</div>`;
                        contentHTML += `</div>`;
                    });

                    contentHTML += `</div>`;
                }
            });

            wortfamilieContent.innerHTML = contentHTML;
        } else {
            wortfamilieContainer.style.display = 'none';
        }

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
        if(praesensExamplesContainer) praesensExamplesContainer.style.display = 'none';

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
        const konjunktivKonjugationTableContainer = document.getElementById('modal-konjunktiv-konjugation-table');
        const konjunktivKonjugationContainer = document.getElementById('konjunktiv-konjugation-container');

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
                group.verbs.forEach(verbName => {
                    const verbData = allVerbsData[verbName];
                    if (verbData) {
                        // Create a promise for each verb to search (including lazy-loaded praesens)
                        const searchPromise = (async () => {
                        // Helper function to check if search term is contained as a word in text
                        const containsWord = (text, term) => {
                            if (!text) return false;
                            const normalized = text.toLowerCase().replace(/[()]/g, '');
                            const words = normalized.split(/[\s,/]+/);
                            return words.some(word => word.startsWith(term));
                        };

                        // Search in German infinitive and Spanish translation
                        const germanMatch = verbName.toLowerCase().startsWith(searchTerm);
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
                            praesensMatch = conjugations.some(conj => conj.toLowerCase().startsWith(searchTerm));
                        }

                        // Search in Präteritum conjugations (pre-loaded!)
                        let praeteritumMatch = false;
                        if (allVerbsData[verbName].praeteritum_conjugations) {
                            const conjugations = Object.values(allVerbsData[verbName].praeteritum_conjugations);
                            praeteritumMatch = conjugations.some(conj => {
                                // Präteritum conjugations are objects with de, en, es properties
                                if (typeof conj === 'string') {
                                    return conj.toLowerCase().startsWith(searchTerm);
                                } else if (conj.de) {
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

                            if (germanMatch || spanishMatch || perfektMatch || praesensMatch || praeteritumMatch) {
                                return {
                                    verb: verbName,
                                    data: verbData,
                                    levelKey: levelKey,
                                    groupIndexInLevel: groupIndexInLevel
                                };
                            }
                            return null;
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
                    <div class="word-item-content">
                        <span class="emoji">${verbData.emoji || '❓'}</span>
                        <div class="text-container perfekt-hover-container">
                            <div class="german-word-container">
                                <span class="german-word">${verbName}${irregularMark}</span>
                                ${tagsHTML}
                                ${caseTagsHTML}
                            </div>
                            <span class="spanish-translation" data-form="translation">${esTranslation}</span>
                            <span class="german-past perfekt-text" data-form="perfekt" data-short="${germanPerfektShort}" data-full="${germanPerfektFull}">${germanPerfektShort}</span>
                            <span class="spanish-perfekt perfekt-text" data-form="translation perfekt" data-short="${spanishPerfektShort}" data-full="${spanishPerfektFull}">${spanishPerfektShort}</span>
                            <span class="german-praeteritum praeteritum-text" data-form="praeteritum" data-short="${germanPraeteritumShort}" data-full="${germanPraeteritumFull}">${germanPraeteritumShort}</span>
                            <span class="spanish-praeteritum praeteritum-text" data-form="translation praeteritum" data-short="${spanishPraeteritumShort}" data-full="${spanishPraeteritumFull}">${spanishPraeteritumShort}</span>
                            ${konjunktivHTML}
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

    // --- START THE APP ---
    initializeApp();
});
