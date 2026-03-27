document.addEventListener('DOMContentLoaded', () => {
    // --- GLOBAL STATE ---
    let allVerbsData = {}; // Global Data Containers
    let verbGroupsByLevel = {}; // Global Data Containers
    let verbTypesData = {}; // Verb types and notes data
    let allGroupsIndex = []; // Full groups index from verbs_index.json for reliable theme search
    let fileIndexData = null; // Existing JSON files by folder to avoid noisy 404 fetches
    let searchScope = 'verbs'; // 'verbs' or 'wortfamilie'
    let wortfamilieIndex = null; // Lazy-loaded index for Wortfamilie search
    const germanOrdinals = ["Erste", "Zweite", "Dritte", "Vierte", "Fünfte", "Sechste", "Siebte", "Achte", "Neunte", "Zehnte", "Elfte", "Zwölfte", "Dreizehnte"];
    const germanExampleOrdinals = ["Erstes", "Zweites", "Drittes", "Viertes", "Fünftes", "Sechstes", "Siebtes", "Achtes"];
    const savedStories = [
        `<p>Gestern <span class="highlighted-word">bin ich</span> in Berlin <span class="highlighted-word">gewesen</span>. Ich <span class="highlighted-word">bin</span> mit dem Zug <span class="highlighted-word">gefahren</span>. In der Stadt <span class="highlighted-word">habe ich</span> eine Freundin <span class="highlighted-word">gesehen</span>. Wir <span class="highlighted-word">haben</span> in einem Café <span class="highlighted-word">gesprochen</span> und einen Kaffee <span class="highlighted-word">getrunken</span>. Danach <span class="highlighted-word">habe ich</span> ein Buch <span class="highlighted-word">gekauft</span> und mit Karte <span class="highlighted-word">bezahlt</span>. Es <span class="highlighted-word">hat</span> viel Spaß <span class="highlighted-word">gemacht</span>!</p>`,
        `<p>Heute Morgen <span class="highlighted-word">habe ich</span> lange <span class="highlighted-word">geschlafen</span>. Zum Frühstück <span class="highlighted-word">habe ich</span> ein Brötchen <span class="highlighted-word">gegessen</span>. Dann <span class="highlighted-word">habe ich</span> eine E-Mail an meine Familie <span class="highlighted-word">geschrieben</span>. Ich <span class="highlighted-word">habe</span> ihnen <span class="highlighted-word">gesagt</span>, dass ich bald nach Hause <span class="highlighted-word">komme</span>. Später <span class="highlighted-word">habe ich</span> die Zeitung <span class="highlighted-word">gelesen</span>.</p>`,
        `<p>Am Wochenende <span class="highlighted-word">habe ich</span> zu Hause <span class="highlighted-word">gearbeitet</span>. Ich <span class="highlighted-word">habe</span> für eine Prüfung <span class="highlighted-word">gelernt</span>. Ich <span class="highlighted-word">habe</span> eine Frage nicht <span class="highlighted-word">gewusst</span>, also <span class="highlighted-word">habe ich</span> meinen Lehrer <span class="highlighted-word">gefragt</span>. Er <span class="highlighted-word">hat</span> mir alles gut erklärt. Ich <span class="highlighted-word">habe</span> die Antwort schnell <span class="highlighted-word">gefunden</span>.</p>`
    ];

    const physicalLevelMap = {
        'A1': [
            { key: 'A1_1', count: 14, fileNumbers: [1, 2, 3, 4, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15] },
            { key: 'A1_2', count: 13, fileNumbers: [1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14] }
        ],
        'A2': [
            { key: 'A2_1', count: 13 },
            { key: 'A2_2', count: 14 }
        ],
        'B1': [{ key: 'B1_1', count: 20 }],
        'B2': [{ key: 'B2_1', count: 13 }]
    };
    const standardColors = ['#8b5cf6', '#ec4899', '#f59e0b', '#ea580c', '#22C55E', '#3b82f6'];

    function getPhysicalGroupData(macroLevel, globalIndex) {
        const layers = physicalLevelMap[macroLevel] || [];
        let offset = 0;
        for (let i = 0; i < layers.length; i++) {
            let layer = layers[i];
            if (globalIndex < offset + layer.count) {
                const localIndex = globalIndex - offset;
                const fileNumber = Array.isArray(layer.fileNumbers)
                    ? layer.fileNumbers[localIndex]
                    : localIndex + 1;
                return { physicalKey: layer.key, localIndex, fileNumber };
            }
            offset += layer.count;
        }
        return null;
    }

    function getThemeColorForVerbData(verbData) {
        if (!verbData || !verbData.level || !verbData.group) {
            return '#4682B4';
        }

        const macroLevel = verbData.level.split('.')[0];
        const physicalKey = verbData.level.replace('.', '_');
        const layers = physicalLevelMap[macroLevel] || [];
        let globalGroupIndex = Number(verbData.group) - 1;

        for (let i = 0; i < layers.length; i++) {
            const layer = layers[i];
            if (layer.key === physicalKey) {
                break;
            }
            globalGroupIndex += layer.count;
        }

        return standardColors[((globalGroupIndex % standardColors.length) + standardColors.length) % standardColors.length];
    }

    function hexToRgb(hex) {
        if (!hex) return null;
        const normalized = hex.replace('#', '').trim();
        const full = normalized.length === 3
            ? normalized.split('').map(ch => ch + ch).join('')
            : normalized;
        const int = parseInt(full, 16);
        if (Number.isNaN(int) || full.length !== 6) return null;
        return {
            r: (int >> 16) & 255,
            g: (int >> 8) & 255,
            b: int & 255
        };
    }

    function rgbToHex({ r, g, b }) {
        const toHex = (value) => Math.max(0, Math.min(255, Math.round(value))).toString(16).padStart(2, '0');
        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    }

    function mixHexColors(colorA, colorB, weight = 0.5) {
        const a = hexToRgb(colorA);
        const b = hexToRgb(colorB);
        if (!a) return colorB;
        if (!b) return colorA;
        return rgbToHex({
            r: a.r * (1 - weight) + b.r * weight,
            g: a.g * (1 - weight) + b.g * weight,
            b: a.b * (1 - weight) + b.b * weight
        });
    }

    function applyModalThemePalette(verbData) {
        const modalContentEl = document.querySelector('#verb-modal .modal-content');
        const modalHeaderEl = document.querySelector('#verb-modal .modal-header');
        if (!modalContentEl) return;

        const themeColor = getThemeColorForVerbData(verbData);
        const softColor = mixHexColors(themeColor, '#ffffff', 0.78);
        const paleColor = mixHexColors(themeColor, '#ffffff', 0.9);
        const strongColor = mixHexColors(themeColor, '#0f172a', 0.22);
        const borderColor = mixHexColors(themeColor, '#cbd5e1', 0.55);

        modalContentEl.style.setProperty('--modal-theme', themeColor);
        modalContentEl.style.setProperty('--modal-theme-soft', softColor);
        modalContentEl.style.setProperty('--modal-theme-pale', paleColor);
        modalContentEl.style.setProperty('--modal-theme-strong', strongColor);
        modalContentEl.style.setProperty('--modal-theme-border', borderColor);

        if (modalHeaderEl) {
            modalHeaderEl.style.backgroundColor = themeColor;
        }
    }

    const levelConfig = {
        'A1': { groupCount: 27, displayName: 'A1' },
        'A2': { groupCount: 27, displayName: 'A2' },
        'B1': { groupCount: 20, displayName: 'B1' },
        'B2': { groupCount: 13, displayName: 'B2' }
    };
    const levelOrder = ['A1', 'A2', 'B1', 'B2'];

    // Verbs that support Konjunktiv II
    const konjunktivVerbs = ['sein', 'haben', 'werden', 'dürfen', 'müssen', 'wollen', 'sollen', 'mögen', 'können'];

    let currentLevel = 'A1';
    let currentGroupInLevel = 0; // 0-indexed position within current level
    let currentVerbInModal = '';
    let currentIndexInModal = 0;
    let storyClickCounter = 0;
    let currentViewMode = 'compact'; // Tracks active view: 'normal', 'compact', 'niedlich', 'light'
    const CACHE_KEY = 'verbAppCache_v38_theme_search_index';
    const SETTINGS_MIGRATION_KEY = 'verbenSettingsMigration_v1_show_ik_lid';
    let cachePersistTimeout = null;

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
    const searchInput = document.getElementById('verb-search');
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

    const reflexiveButtonContainer = document.getElementById('reflexive-button-container');
    const reflexiveButton = document.getElementById('reflexive-button');
    const reflexiveModal = document.getElementById('reflexive-modal');
    const reflexiveCloseBtn = document.getElementById('reflexive-close-btn');
    const reflexiveCloseFooterBtn = document.getElementById('reflexive-close-footer-btn');

    // Theme modal elements
    const themeModal = document.getElementById('theme-modal');
    const closeThemeModalX = document.getElementById('close-theme-modal-x');
    const closeThemeModalBtn = document.getElementById('close-theme-modal-btn');

    function setupModalHeaderLayout() {
        const modalHeader = document.querySelector('#verb-modal .modal-header');
        const spanishTranslation = document.getElementById('modal-verb-infinitive-es');
        const tagsToggle = document.getElementById('modal-tags-toggle');
        if (!modalHeader || !spanishTranslation || !tagsToggle) return;

        let translationRow = modalHeader.querySelector('.modal-translation-row');
        if (!translationRow) {
            translationRow = document.createElement('div');
            translationRow.className = 'modal-translation-row';
            modalHeader.insertBefore(translationRow, spanishTranslation);
        }

        translationRow.appendChild(spanishTranslation);
        translationRow.appendChild(tagsToggle);
    }

    setupModalHeaderLayout();

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
    let appVersion = '1.6_static'; // Stable version; replaced by verbs_index.lastUpdated when available

    function persistCacheSnapshot() {
        const buildCompactCachePayload = () => {
            const compactGroups = {};
            const compactVerbsData = {};
            const groups = verbGroupsByLevel[currentLevel] || [];
            compactGroups[currentLevel] = groups;
            groups.forEach(group => {
                if (!group || !Array.isArray(group.verbs)) return;
                group.verbs.forEach(verbName => {
                    if (allVerbsData[verbName]) {
                        compactVerbsData[verbName] = allVerbsData[verbName];
                    }
                });
            });
            return {
                allVerbsData: compactVerbsData,
                verbGroupsByLevel: compactGroups,
                allGroupsIndex,
                fileIndexData,
                lastUpdated: appVersion || new Date().toISOString(),
                timestamp: Date.now(),
                cacheMode: 'compact'
            };
        };

        try {
            const cachePayload = {
                allVerbsData,
                verbGroupsByLevel,
                allGroupsIndex,
                fileIndexData,
                lastUpdated: appVersion || new Date().toISOString(),
                timestamp: Date.now()
            };
            localStorage.setItem(CACHE_KEY, JSON.stringify(cachePayload));
        } catch (e) {
            try {
                localStorage.setItem(CACHE_KEY, JSON.stringify(buildCompactCachePayload()));
                console.warn("Saved compact cache snapshot after quota warning.");
            } catch (compactError) {
                console.warn("Failed to save cache snapshot", compactError);
            }
        }
    }

    function scheduleCachePersist() {
        clearTimeout(cachePersistTimeout);
        cachePersistTimeout = setTimeout(() => {
            persistCacheSnapshot();
        }, 250);
    }

    function hydrateFromLocalCache() {
        try {
            const cached = localStorage.getItem(CACHE_KEY);
            if (!cached) return false;

            const data = JSON.parse(cached);
            if (!data || !data.allVerbsData || !data.verbGroupsByLevel) return false;

            allVerbsData = data.allVerbsData;
            verbGroupsByLevel = data.verbGroupsByLevel;
            allGroupsIndex = Array.isArray(data.allGroupsIndex) ? data.allGroupsIndex : [];
            fileIndexData = data.fileIndexData || null;
            if (data.lastUpdated) {
                appVersion = data.lastUpdated;
            }
            return true;
        } catch (e) {
            console.warn("Failed to hydrate from local cache", e);
            return false;
        }
    }

    function hasCachedGroup(levelKey, groupIndex) {
        const group = verbGroupsByLevel[levelKey] && verbGroupsByLevel[levelKey][groupIndex];
        if (!group || !Array.isArray(group.verbs)) return false;
        return group.verbs.every(verbName => !!allVerbsData[verbName]);
    }

    function hasCachedLevel(levelKey) {
        const config = levelConfig[levelKey];
        if (!config || !verbGroupsByLevel[levelKey]) return false;
        for (let i = 0; i < config.groupCount; i++) {
            if (!hasCachedGroup(levelKey, i)) return false;
        }
        return true;
    }

    // --- BACKGROUND LOADING & PROGRESS ---
    let isBackgroundLoading = false;

    function updateLoadingProgress(percentage) {
        if (!searchInput) return;

        if (percentage < 100) {
            // Light blue progress bar background
            const progressColor = 'rgba(70, 130, 180, 0.2)'; // Light SteelBlue
            const remainingColor = '#ffffff';

            searchInput.style.background = `linear-gradient(to right, ${progressColor} ${percentage}%, ${remainingColor} ${percentage}%)`;
            searchInput.placeholder = `${Math.round(percentage)}%`;
            searchInput.classList.add('loading-active');
        } else {
            // Reset background and placeholder
            searchInput.style.background = '';
            searchInput.placeholder = "Suchen... (buscar)";
            searchInput.classList.remove('loading-active');
        }
    }

    async function loadBackgroundData() {
        let remoteVersion = null;

        // 1. Check for updates (Version Check)
        try {
            const vRes = await fetch('json/verbs_index.json', { cache: 'no-cache' });
                if (vRes.ok) {
                const vData = await vRes.json();
                remoteVersion = vData.lastUpdated;
                allGroupsIndex = Array.isArray(vData.groups) ? vData.groups : allGroupsIndex;
                if (remoteVersion) {
                    appVersion = remoteVersion;
                }
                console.log("Remote version:", remoteVersion);
            }
        } catch (e) {
            console.warn("Version check failed (offline?)", e);
        }

        // 2. Try to load from LocalStorage
        try {
            const cached = localStorage.getItem(CACHE_KEY);
            if (cached) {
                const data = JSON.parse(cached);

                // Cache is valid IF:
                // a) We failed to get remote version (assume offline/safe), OR
                // b) Remote version matches cached version
                const isCacheValid = !remoteVersion || (data.lastUpdated === remoteVersion);

                if (isCacheValid && data.allVerbsData && data.verbGroupsByLevel) {
                    console.log("Loaded data from LocalStorage cache (Version match).");
                    allVerbsData = data.allVerbsData;
                    verbGroupsByLevel = data.verbGroupsByLevel;
                    if ((!Array.isArray(allGroupsIndex) || allGroupsIndex.length === 0) && Array.isArray(data.allGroupsIndex)) {
                        allGroupsIndex = data.allGroupsIndex;
                    }
                    if (!fileIndexData && data.fileIndexData) {
                        fileIndexData = data.fileIndexData;
                    }
                    if (data.lastUpdated) {
                        appVersion = data.lastUpdated;
                    }
                    updateLoadingProgress(100);
                    isBackgroundLoading = false;
                    generateTagFilters();

                    if (searchInput && searchInput.value.trim() !== '') {
                        searchInput.dispatchEvent(new Event('input'));
                    }
                    return; // SKIP NETWORK LOADING
                } else {
                    console.log("Cache outdated or invalid. Reloading from network.");
                }
            }
        } catch (e) {
            console.warn("Failed to load/parse cache", e);
        }

        if (isBackgroundLoading) return;
        isBackgroundLoading = true;
        console.log("Starting background data load...");

        // Collect all tasks EXCEPT current one (already loading/loaded)
        const loadTasks = [];
        let totalTasks = 0;

        levelOrder.forEach(levelKey => {
            const config = levelConfig[levelKey];
            for (let i = 1; i <= config.groupCount; i++) {
                loadTasks.push({ levelKey, i });
            }
        });
        totalTasks = loadTasks.length;
        let loadedTasks = 0;

        const BATCH_SIZE = 10;
        const DELAY_MS = 20;

        for (let i = 0; i < loadTasks.length; i += BATCH_SIZE) {
            const batch = loadTasks.slice(i, i + BATCH_SIZE);

            const batchPromises = batch.map(async task => {
                const levelKey = task.levelKey;
                const groupIndex = task.i - 1;

                // 1. Check if already loaded
                if (hasCachedGroup(levelKey, groupIndex)) {
                    return;
                }

                const physData = getPhysicalGroupData(levelKey, groupIndex);
                if (!physData) return;
                const fileNumber = physData.fileNumber;

                // 2. Fetch Group Data
                try {
                    const groupUrl = `json/groups/${physData.physicalKey}/${physData.physicalKey}_group_${fileNumber}.json${appVersion ? '?v=' + appVersion : ''}`;
                    const res = await fetch(groupUrl);
                    if (!res.ok) return;
                    const groupData = await res.json();

                    if (!verbGroupsByLevel[levelKey]) verbGroupsByLevel[levelKey] = [];
                    verbGroupsByLevel[levelKey][groupIndex] = groupData;

                    // 3. Fetch Verbs that are NEW
                    const verbsToLoad = groupData.verbs || [];
                    const newVerbs = verbsToLoad.filter(v => !allVerbsData[v]);

                    if (newVerbs.length > 0) {
                        const cardPromises = newVerbs.map(verbName =>
                            fetch(`json/cards/${verbName}.json${appVersion ? '?v=' + appVersion : ''}`)
                                .then(res => res.ok ? res.json() : {})
                                .then(data => { allVerbsData[verbName] = data; })
                                .catch(() => { allVerbsData[verbName] = {}; })
                        );
                        await Promise.all(cardPromises);

                        // 4. Fetch Conjugations
                        await loadConjugations(new Set(newVerbs));
                    }
                } catch (e) {
                    console.warn(`Background load failed for ${levelKey} group ${task.i}`, e);
                }
            });

            await Promise.all(batchPromises);

            loadedTasks += batch.length;
            const percent = Math.min(100, (loadedTasks / totalTasks) * 100);
            updateLoadingProgress(percent);

            // Yield
            if (i + BATCH_SIZE < loadTasks.length) {
                await new Promise(r => setTimeout(r, DELAY_MS));
            }
        }

        console.log("Background loading complete.");
        updateLoadingProgress(100);
        isBackgroundLoading = false;
        generateTagFilters();

        // Save to LocalStorage
        try {
            const cachePayload = {
                allVerbsData,
                verbGroupsByLevel,
                allGroupsIndex,
                fileIndexData,
                lastUpdated: remoteVersion || new Date().toISOString(),
                timestamp: Date.now()
            };
            localStorage.setItem(CACHE_KEY, JSON.stringify(cachePayload));
            console.log("Saved data to LocalStorage cache");
        } catch (e) {
            try {
                persistCacheSnapshot();
            } catch (nestedError) {
                console.warn("Failed to save to cache", nestedError);
            }
        }

        // If the UI started from stale cache, repaint the current view once
        // fresh background data is ready so moved verbs/groups appear immediately.
        if (searchInput && searchInput.value.trim() === '') {
            clearSearchAndRender();
        }

        // Re-run search if user typed something while loading
        if (searchInput && searchInput.value.trim() !== '') {
            searchInput.dispatchEvent(new Event('input'));
        }
    }

    // --- OPTIMIZED LAZY LOADING ---
    async function loadGroupData(levelKey, groupIndex, options = {}) {
        const { silent = false } = options;
        // Validate inputs
        if (!levelConfig[levelKey]) return;

        // 1. Check if group is already loaded in memory
        if (hasCachedGroup(levelKey, groupIndex)) {
            return; // Data active
        }

        const physData = getPhysicalGroupData(levelKey, groupIndex);
        if (!physData) return;
        const fileNumber = physData.fileNumber;

        // Show loading state
        if (!silent) {
            cardsContainer.innerHTML = '<div class="loading-spinner">Daten werden geladen...</div>';
        }

        const groupUrl = `json/groups/${physData.physicalKey}/${physData.physicalKey}_group_${fileNumber}.json${appVersion ? '?v=' + appVersion : ''}`;

        try {
            const res = await fetch(groupUrl);
            if (!res.ok) throw new Error(`Group not found: ${groupUrl}`);
            const groupData = await res.json();

            // Initialize level array if needed
            if (!verbGroupsByLevel[levelKey]) {
                verbGroupsByLevel[levelKey] = [];
            }
            verbGroupsByLevel[levelKey][groupIndex] = groupData;

            // 2. Identify new verbs to load
            const verbsToLoad = groupData.verbs || [];
            // Filter out verbs we already have data for
            const newVerbs = verbsToLoad.filter(v => !allVerbsData[v]);

            if (newVerbs.length > 0) {
                // 3. Fetch Card Data for new verbs
                const cardPromises = newVerbs.map(verbName =>
                    fetch(`json/cards/${verbName}.json${appVersion ? '?v=' + appVersion : ''}`)
                        .then(res => res.ok ? res.json() : {})
                        .then(data => { allVerbsData[verbName] = data; })
                        .catch(() => { allVerbsData[verbName] = {}; })
                );
                await Promise.all(cardPromises);

                // 4. Fetch Conjugations for new verbs
                await loadConjugations(new Set(newVerbs));
            }

            scheduleCachePersist();

        } catch (error) {
            console.error(`Failed to load group data (${levelKey} / ${groupIndex + 1}):`, error);
            if (!silent) {
                cardsContainer.innerHTML = '<p>Fehler beim Laden der Gruppe. Bitte Seite neu laden.</p>';
            }
        }
    }

    async function loadAllGroupsForLevel(levelKey) {
        const config = levelConfig[levelKey];
        if (!config) return;

        const loadPromises = [];
        for (let groupIndex = 0; groupIndex < config.groupCount; groupIndex++) {
            loadPromises.push(loadGroupData(levelKey, groupIndex));
        }
        await Promise.all(loadPromises);
    }

    async function loadFileIndex() {
        if (fileIndexData) return fileIndexData;
        try {
            const query = appVersion ? `?v=${encodeURIComponent(appVersion)}` : '';
            const response = await fetch(`json/file_index.json${query}`, { cache: 'no-cache' });
            if (!response.ok) throw new Error(`Failed to load file index: ${response.status}`);
            fileIndexData = await response.json();
        } catch (error) {
            console.warn('Failed to load file index, falling back to direct fetches.', error);
            fileIndexData = {};
        }
        return fileIndexData;
    }

    function fileExistsInIndex(folder, verbName) {
        if (!fileIndexData || !fileIndexData[folder]) return true;
        return fileIndexData[folder].includes(verbName);
    }

    function loadConjugations(allVerbNames) {
        return loadFileIndex().then(() => Promise.all(Array.from(allVerbNames).map(async verbName => {
            try {
                const query = appVersion ? `?v=${appVersion}` : '';
                const maybeFetchJson = (folder) =>
                    fileExistsInIndex(folder, verbName)
                        ? fetch(`json/${folder}/${verbName}.json${query}`).then(res => res.ok ? res.json() : {}).catch(() => ({}))
                        : Promise.resolve({});

                const fetchPromises = [
                    maybeFetchJson('praesens'),
                    maybeFetchJson('praeteritum_konjugation'),
                    maybeFetchJson('perfekt_konjugation'),
                    maybeFetchJson('praesens_fragen')
                ];

                // Add Konjunktiv II data for specific verbs
                if (konjunktivVerbs.includes(verbName) && fileExistsInIndex('konjunktiv_ii', verbName)) {
                    fetchPromises.push(
                        fetch(`json/konjunktiv_ii/${verbName}.json${query}`).then(res => res.ok ? res.json() : {}).catch(() => ({}))
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
        }))).then(() => {
            // Conjugations loaded
        });
    }

    // --- LAZY LOAD WORTFAMILIE INDEX ---
    async function loadWortfamilieIndex() {
        if (wortfamilieIndex !== null) return; // Already loaded

        console.log('Lazy loading Wortfamilie index...');
        const cardsContainer = document.getElementById('cards-container');
        cardsContainer.innerHTML = '<div class="loading-spinner">Wortfamilie wird geladen...</div>';

        const index = [];
        const verbs = Object.keys(allVerbsData);
        const BATCH_SIZE = 20;

        for (let i = 0; i < verbs.length; i += BATCH_SIZE) {
            const batch = verbs.slice(i, i + BATCH_SIZE);
            const promises = batch.map(verb =>
                fetch(`json/wortfamilie/${verb}.json${appVersion ? '?v=' + appVersion : ''}`)
                    .then(res => res.ok ? res.json() : null)
                    .then(data => {
                        if (data && data.wortfamilie) {
                            data.wortfamilie.forEach(item => {
                                if (item && (item.word || item.es)) {
                                    index.push({
                                        word: item.word || '',
                                        type: item.type || '',
                                        es: item.es || '',
                                        en: item.en || '',
                                        verb: verb, // Parent verb
                                        level: item.level || ''
                                    });
                                }
                            });
                        }
                    })
                    .catch(() => { }) // Ignore missing files
            );
            await Promise.all(promises);
        }

        wortfamilieIndex = index;
        console.log(`Wortfamilie index loaded with ${index.length} entries.`);

        // Only clear loading message if we are NOT about to search immediately
        // Actually, performSearch will handle clearing or showing results.

        // If we are still in wortfamilie scope, re-run search
        if (searchScope === 'wortfamilie') {
            performSearch();
        } else {
            cardsContainer.innerHTML = ''; // Clear loading message if user switched away
        }
    }

    function findMatchingTextEntry(entries, searchTerm, extractor = null) {
        if (!entries) return '';

        for (const entry of entries) {
            const text = extractor ? extractor(entry) : entry;
            if (typeof text === 'string' && findMatchingWordInText(text, searchTerm)) {
                return text;
            }
        }

        return '';
    }

    function findMatchingWordInText(text, searchTerm) {
        if (!text || typeof text !== 'string') return '';
        const normalized = text.replace(/[()]/g, '');
        const words = normalized.split(/[\s,/]+/).filter(Boolean);
        return words.find(word => word.toLowerCase().startsWith(searchTerm)) || '';
    }

    function getAllSearchGroupEntries() {
        const groupedMap = new Map();

        if (Array.isArray(allGroupsIndex)) {
            allGroupsIndex.forEach(group => {
                if (!group || !group.level || !Array.isArray(group.verbs)) return;
                const levelKey = group.level.split('.')[0];
                const groupIndexInLevel = Number(group.groupNumberPerLevel) - 1;
                if (!levelKey || !Number.isInteger(groupIndexInLevel) || groupIndexInLevel < 0) return;
                groupedMap.set(`${levelKey}-${groupIndexInLevel}`, {
                    levelKey,
                    groupIndexInLevel,
                    group
                });
            });
        }

        Object.keys(verbGroupsByLevel).forEach(levelKey => {
            const levelGroups = verbGroupsByLevel[levelKey] || [];
            levelGroups.forEach((group, groupIndexInLevel) => {
                if (!group || !Array.isArray(group.verbs)) return;
                groupedMap.set(`${levelKey}-${groupIndexInLevel}`, {
                    levelKey,
                    groupIndexInLevel,
                    group
                });
            });
        });

        return Array.from(groupedMap.values());
    }

    // Helper function to dynamically parse and strip parentheses from translations
    function removeParentheses(text) {
        if (!text) return text;

        // Strip starting parenthesis block: ^\(([^)]+)\)\s*
        let parsed = text.replace(/^\(([^)]+)\)\s*/, (match, innerWord) => {
            // Discard (sich) completely
            if (innerWord.toLowerCase() === 'sich') {
                return '';
            }
            // Strip parentheses but keep the word for anything else
            return innerWord + ' ';
        });

        // Standardize explicit " o " strings into localized slashes
        parsed = parsed.replace(/ o /g, ' / ');

        return parsed.trim();
    }

    function getPrimaryTranslation(text) {
        const cleaned = removeParentheses(text || '');
        if (!cleaned) return cleaned;
        return cleaned.split('/')[0].trim();
    }

    // Helper function to extract clean Perfekt (remove auxiliary verb)
    function getCleanPerfekt(perfekt) {
        if (!perfekt || perfekt === '---') return '---';
        // Remove any conjugated auxiliary of haben/sein from the beginning
        const cleaned = perfekt.replace(/^(habe|hast|hat|haben|habt|bin|bist|ist|sind|seid|sein)\s+/i, '');
        return cleaned;
    }

    // Helper function to extract clean Präteritum (remove pronouns)
    function getCleanPraeteritum(praeteritum) {
        if (!praeteritum || praeteritum === '---') return '---';
        // Remove "er/sie/es " from the beginning
        const cleaned = praeteritum.replace(/^(er\/sie\/es)\s+/, '');
        return cleaned;
    }

    // --- KOMPAKT VERSION RENDER FUNCTION (Adverb Port / Slate-Mint) ---
    function renderCompactVersion() {
        cardsContainer.innerHTML = '';
        document.body.classList.add('compact-view');
        document.body.classList.remove('light-version-global-dark');

        const deSwitch = document.getElementById('de-switch');
        const esSwitch = document.getElementById('es-switch');
        const enSwitch = document.getElementById('en-switch');
        const showGerman = deSwitch ? deSwitch.checked : true;
        const showSpanish = esSwitch ? esSwitch.checked : true;
        const showEnglish = enSwitch ? enSwitch.checked : false;

        // Disable group arrows because we show ALL groups for the current level at once
        if (navigationWrapper) {
            const groupNav = navigationWrapper.querySelector('.group-navigation');
            if (groupNav) groupNav.style.display = 'none';
        }

        const levelGroups = verbGroupsByLevel[currentLevel];
        if (!levelGroups) return;

        // Create the main grid container matching the adverbs layout
        const grid = document.createElement('div');
        grid.className = 'kompakt-grid';

        // Standard palette logic (fallback sequence if theme colors are missing)

        levelGroups.forEach((group, groupIndex) => {
            if (!group || !group.verbs) return;

            const groupName = group.theme || group.groupNameGerman || `Gruppe ${groupIndex + 1}`;
            const themeColor = standardColors[groupIndex % standardColors.length]; // Fallback rotation

            // Chunk verbs into strict maximums of 7 per card
            const chunkSize = 7;
            const chunks = [];
            for (let i = 0; i < group.verbs.length; i += chunkSize) {
                chunks.push(group.verbs.slice(i, i + chunkSize));
            }

            chunks.forEach((chunk, chunkIndex) => {
                // Formatting Card Title (add pagination if >1 chunk exists for this group)
                let cardTitleHTML = groupName;
                if (chunks.length > 1) {
                    cardTitleHTML += ` <span class="kompakt-pagination">(${chunkIndex + 1}/${chunks.length})</span>`;
                }

                // Build Semantic Card
                const card = document.createElement('div');
                card.className = 'kompakt-level-card';

                // Header (Clickable Theme Title)
                const header = document.createElement('div');
                header.className = 'kompakt-level-header';
                header.style.backgroundColor = themeColor;
                header.style.cursor = 'default';

                // German side (left)
                const germanSpan = document.createElement('span');
                germanSpan.className = 'kompakt-header-de';
                germanSpan.innerHTML = cardTitleHTML;
                germanSpan.style.display = showGerman ? '' : 'none';
                germanSpan.style.cursor = 'pointer';
                germanSpan.title = 'Aussprache h??ren';
                germanSpan.onclick = (event) => {
                    event.stopPropagation();
                    window.speak(groupName);
                };

                // Spanish side (right)
                const spanishSpan = document.createElement('span');
                spanishSpan.className = 'kompakt-header-es';
                spanishSpan.textContent = group.spanishName || group.groupNameSpanish || '';
                spanishSpan.style.display = showSpanish ? '' : 'none';
                spanishSpan.style.cursor = 'pointer';
                spanishSpan.title = 'Themeninfos anzeigen';
                spanishSpan.onclick = (event) => {
                    event.stopPropagation();
                    openThemeModal(currentLevel, groupIndex);
                };

                header.appendChild(germanSpan);
                header.appendChild(spanishSpan);
                card.appendChild(header);

                // Content Area containing rows
                const content = document.createElement('div');
                content.className = 'kompakt-level-content';

                chunk.forEach(verbName => {
                    const verbData = allVerbsData[verbName];
                    if (!verbData) return;

                    const row = document.createElement('div');
                    row.className = 'kompakt-row';

                    const isReflexive = verbData.case_tags && verbData.case_tags.includes('Reflexiv');
                    const reflBadge = isReflexive ? `<span class="reflexiv-badge" style="margin-left: 8px;">refl</span>` : '';
                    const isDativ = verbData.case_tags && verbData.case_tags.includes('DAT');
                    const datBadge = isDativ ? `<span class="dativ-badge" style="margin-left: 8px;">dat</span>` : '';
                    const isIntransitive = verbData.case_tags && verbData.case_tags.includes('INTR');
                    const intrBadge = isIntransitive ? `<span class="intr-badge" style="margin-left: 8px;">intr</span>` : '';
                    const isIK = verbData.case_tags && verbData.case_tags.includes('IK');
                    const ikBadge = isIK ? `<span class="ik-badge" style="margin-left: 8px;">IK</span>` : '';
                    const isLiD = verbData.case_tags && verbData.case_tags.includes('LiD');
                    const lidBadge = isLiD ? `<span class="lid-badge" style="margin-left: 8px;">LiD</span>` : '';

                    const germanWord = document.createElement('div');
                    germanWord.className = 'kompakt-german';
                    germanWord.innerHTML = `${verbName}${reflBadge}${datBadge}${intrBadge}${ikBadge}${lidBadge}`;
                    germanWord.style.display = showGerman ? '' : 'none';
                    germanWord.style.cursor = 'pointer';
                    germanWord.title = 'Aussprache hören';
                    germanWord.onclick = (e) => { e.stopPropagation(); window.speak(verbName); };

                    const translations = document.createElement('div');
                    translations.className = 'kompakt-translations';

                    const spanishWord = document.createElement('div');
                    spanishWord.className = 'kompakt-spanish';
                    spanishWord.textContent = getPrimaryTranslation(verbData.es || '');
                    spanishWord.style.display = showSpanish ? '' : 'none';
                    spanishWord.style.cursor = 'pointer';
                    spanishWord.title = 'Details anzeigen';
                    spanishWord.onclick = (e) => { e.stopPropagation(); openModalForVerb(verbName); };

                    const englishWord = document.createElement('div');
                    englishWord.className = 'kompakt-english';
                    englishWord.textContent = (verbData.en_verb || '').replace(/^\(?(to\s+)?|\)$/gi, '').trim();
                    englishWord.style.display = showEnglish && englishWord.textContent ? '' : 'none';
                    englishWord.style.cursor = 'pointer';
                    englishWord.title = 'Details anzeigen';
                    englishWord.onclick = (e) => { e.stopPropagation(); openModalForVerb(verbName); };

                    row.appendChild(germanWord);
                    translations.appendChild(spanishWord);
                    translations.appendChild(englishWord);
                    row.appendChild(translations);
                    content.appendChild(row);
                });

                card.appendChild(content);
                grid.appendChild(card);
            });
        });

        cardsContainer.appendChild(grid);

        updateIndicatorsForView(levelGroups[currentGroupInLevel] || levelGroups[0]);
    }

    // Helper to update indicators (shared between Light and Compact)
    function updateIndicatorsForView(group) {
        const displayLevel = levelConfig[currentLevel].displayName;
        levelIndicator.textContent = displayLevel;
        levelIndicator.className = 'level-indicator';
        if (displayLevel === 'A1.1') levelIndicator.classList.add('level-a1-1');
        else if (displayLevel === 'A1.2') levelIndicator.classList.add('level-a1-2');
        else if (displayLevel === 'A2.1') levelIndicator.classList.add('level-a2-1');
        else if (displayLevel === 'A2.2') levelIndicator.classList.add('level-a2-2');
        else if (displayLevel === 'B1.1') levelIndicator.classList.add('level-b1-1');

        const themeName = group.theme || group.groupNameGerman || 'Gruppe';
        groupThemeIndicator.textContent = themeName;

        const totalGroupsInLevel = levelConfig[currentLevel].groupCount;
        const activeTheme = group.theme || group.groupNameGerman;
        const themeNameForGroupIndicator = activeTheme ? ` - ${activeTheme}` : '';
        groupIndicator.textContent = `${germanOrdinals[currentGroupInLevel]} Gruppe von ${totalGroupsInLevel}${themeNameForGroupIndicator}`;
        prevGroupBtn.disabled = currentGroupInLevel === 0 && currentLevel === levelOrder[0];
        nextGroupBtn.disabled = currentGroupInLevel === totalGroupsInLevel - 1 && currentLevel === levelOrder[levelOrder.length - 1];
    }

    // --- NIEDLICH (CUTE) VERSION RENDER FUNCTION ---
    function renderNiedlichVersion(group) {
        cardsContainer.innerHTML = '';
        document.body.classList.remove('compact-view');
        document.body.classList.remove('light-version-global-dark');

        // Restore group arrows because Niedlich is paginated by group
        if (navigationWrapper) {
            const groupNav = navigationWrapper.querySelector('.group-navigation');
            if (groupNav) groupNav.style.display = 'flex';
        }

        // Check English toggle state
        const enSwitch = document.getElementById('en-switch');
        const showEnglish = enSwitch ? enSwitch.checked : false;

        const cardsHTML = group.verbs.map(verbName => {
            const verbData = allVerbsData[verbName];
            if (!verbData) return '';

            // Header info: Verb + Translation (No Emoji)
            const irregularMark = verbData.irregularPraesens ? '<span class="irregular-indicator">*</span>' : '';
            const esTranslation = getPrimaryTranslation(verbData.es || '');
            const enTranslation = (verbData.en_verb || '').replace(/^\(?(to\s+)?|\)$/gi, '').trim();

            // Tag Logic (Moved to Body)
            let tagsHTML = '';
            // Only keeping critical tags for header if desired, or all tags
            if (verbData.case_tags) {
                const visibleTags = verbData.case_tags.filter(t => !t.startsWith('Präposition:'));
                tagsHTML = visibleTags.map(tag => `<span class="verb-tag">${tag}</span>`).join('');
            }

            const isReflexive = verbData.case_tags && verbData.case_tags.includes('Reflexiv');
            const reflBadge = isReflexive ? ` <span class="reflexiv-badge" style="vertical-align: super; font-size: 0.55rem; padding: 1px 4px; margin-left: 6px;">refl</span>` : '';
            const isDativ = verbData.case_tags && verbData.case_tags.includes('DAT');
            const datBadge = isDativ ? ` <span class="dativ-badge" style="vertical-align: super; font-size: 0.55rem; padding: 1px 4px; margin-left: 6px;">dat</span>` : '';
            const isIntransitive = verbData.case_tags && verbData.case_tags.includes('INTR');
            const intrBadge = isIntransitive ? ` <span class="intr-badge" style="vertical-align: super; font-size: 0.55rem; padding: 1px 4px; margin-left: 6px;">intr</span>` : '';
            const isIK = verbData.case_tags && verbData.case_tags.includes('IK');
            const ikBadge = isIK ? ` <span class="ik-badge" style="vertical-align: super; font-size: 0.55rem; padding: 1px 4px; margin-left: 6px;">IK</span>` : '';
            const isLiD = verbData.case_tags && verbData.case_tags.includes('LiD');
            const lidBadge = isLiD ? ` <span class="lid-badge" style="vertical-align: super; font-size: 0.55rem; padding: 1px 4px; margin-left: 6px;">LiD</span>` : '';

            // New Structure: Header (Word + Translation), Body (Tags Centered), No Emoji
            return `
            <div class="word-item">
                <div class="card-header" onclick="event.stopPropagation(); window.speak('${verbName}')" title="Aussprache hören" style="cursor: pointer; flex-direction: column; gap: 5px;">
                    <span class="german-word" style="font-size: 1.5rem;">${verbName} ${irregularMark}${reflBadge}${datBadge}${intrBadge}${ikBadge}${lidBadge}</span>
                    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px;">
                        <span class="spanish-translation" style="font-size: 1.1rem; color: white; font-style: italic;" onclick="event.stopPropagation(); openModalForVerb('${verbName}')" title="Details anzeigen">${esTranslation}</span>
                        ${showEnglish ? `<span class="english-translation" style="font-size: 1.1rem; color: white; font-weight: 600;" onclick="event.stopPropagation(); openModalForVerb('${verbName}')" title="Details anzeigen">${enTranslation}</span>` : ''}
                    </div>
                </div>
                <div class="card-body niedlich-card-body" onclick="event.stopPropagation(); openModalForVerb('${verbName}')" style="cursor: pointer;">
                    <div class="german-word-container" style="justify-content:center; width: 100%; flex-wrap: wrap; gap: 8px;">
                        ${tagsHTML}
                    </div>
                </div>
            </div>`;
        }).join('');

        cardsContainer.innerHTML = cardsHTML;
        updateIndicatorsForView(group);
        // No hover listeners needed for this simplified view as text is removed
    }

    // --- NORMAL VERSION RENDER FUNCTION ---
    function renderNormalVersion(group) {
        cardsContainer.innerHTML = '';
        document.body.classList.remove('compact-view');
        document.body.classList.remove('light-version-global-dark');

        // Restore group arrows because Normal is paginated by group
        if (navigationWrapper) {
            const groupNav = navigationWrapper.querySelector('.group-navigation');
            if (groupNav) groupNav.style.display = 'flex';
        }

        const cardsHTML = group.verbs.map(verbName => {
            const verbData = allVerbsData[verbName];
            if (!verbData) return '';

            const translation = getPrimaryTranslation(verbData.es || '');
            const irregular = verbData.irregularPraesens ? '*' : '';
            const isReflexive = verbData.case_tags && verbData.case_tags.includes('Reflexiv');
            const reflBadge = isReflexive ? `<span class="reflexiv-badge" style="margin-top: 4px; margin-left: 8px;">refl</span>` : '';
            const isDativ = verbData.case_tags && verbData.case_tags.includes('DAT');
            const datBadge = isDativ ? `<span class="dativ-badge" style="margin-top: 4px; margin-left: 8px;">dat</span>` : '';
            const isIntransitive = verbData.case_tags && verbData.case_tags.includes('INTR');
            const intrBadge = isIntransitive ? `<span class="intr-badge" style="margin-top: 4px; margin-left: 8px;">intr</span>` : '';
            const isIK = verbData.case_tags && verbData.case_tags.includes('IK');
            const ikBadge = isIK ? `<span class="ik-badge" style="margin-top: 4px; margin-left: 8px;">IK</span>` : '';
            const isLiD = verbData.case_tags && verbData.case_tags.includes('LiD');
            const lidBadge = isLiD ? `<span class="lid-badge" style="margin-top: 4px; margin-left: 8px;">LiD</span>` : '';

            const emoji = verbData.emoji || '📝';

            // Cleaner, simpler card with header and emoji
            return `
            <div class="card normal-card">
                <div class="normal-card-header" onclick="event.stopPropagation(); window.speak('${verbName}')" title="Aussprache hören" style="cursor: pointer;">
                     <span class="normal-emoji">${emoji}</span>
                     <h3 class="normal-german">${verbName}${irregular}</h3>
                     ${reflBadge}${datBadge}${intrBadge}${ikBadge}${lidBadge}
                </div>
                <div class="normal-card-content" onclick="event.stopPropagation(); openModalForVerb('${verbName}')" title="Details anzeigen" style="cursor: pointer;">
                     <p class="normal-spanish">${translation}</p>
                </div>
            </div>`;
        }).join('');

        cardsContainer.innerHTML = cardsHTML;
        updateIndicatorsForView(group);
    }

    // --- LIGHT VERSION RENDER FUNCTION ---
    function renderLightVersion(group) {
        cardsContainer.innerHTML = '';
        document.body.classList.remove('compact-view');

        // Restore group arrows because Light is paginated by group
        if (navigationWrapper) {
            const groupNav = navigationWrapper.querySelector('.group-navigation');
            if (groupNav) groupNav.style.display = 'flex';
        }

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
            <div class="light-version-header-cell">Übersetzung</div>
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
            const translation = getPrimaryTranslation(verbData.es || '');
            const isReflexive = verbData.case_tags && verbData.case_tags.includes('Reflexiv');
            const reflBadge = isReflexive ? ` <span class="reflexiv-badge" style="padding: 1px 4px; font-size: 0.6rem; margin-left: 8px;">refl</span>` : '';
            const isDativ = verbData.case_tags && verbData.case_tags.includes('DAT');
            const datBadge = isDativ ? ` <span class="dativ-badge" style="padding: 1px 4px; font-size: 0.6rem; margin-left: 8px;">dat</span>` : '';
            const isIntransitive = verbData.case_tags && verbData.case_tags.includes('INTR');
            const intrBadge = isIntransitive ? ` <span class="intr-badge" style="padding: 1px 4px; font-size: 0.6rem; margin-left: 8px;">intr</span>` : '';
            const isIK = verbData.case_tags && verbData.case_tags.includes('IK');
            const ikBadge = isIK ? ` <span class="ik-badge" style="padding: 1px 4px; font-size: 0.6rem; margin-left: 8px;">IK</span>` : '';
            const isLiD = verbData.case_tags && verbData.case_tags.includes('LiD');
            const lidBadge = isLiD ? ` <span class="lid-badge" style="padding: 1px 4px; font-size: 0.6rem; margin-left: 8px;">LiD</span>` : '';

            // Create row
            const row = document.createElement('div');
            row.className = 'light-version-row';
            row.innerHTML = `
                <div class="light-version-cell infinitiv" onclick="event.stopPropagation(); window.speak('${verbName}')" title="Aussprache hören" style="cursor: pointer;">${infinitiv}${reflBadge}${datBadge}${intrBadge}${ikBadge}${lidBadge}</div>
                <div class="light-version-cell perfekt" onclick="event.stopPropagation(); openModalForVerb('${verbName}')" title="Details anzeigen" style="cursor: pointer;">${perfekt}</div>
                <div class="light-version-cell praeteritum" onclick="event.stopPropagation(); openModalForVerb('${verbName}')" title="Details anzeigen" style="cursor: pointer;">${praeteritum}</div>
                <div class="light-version-cell translation" onclick="event.stopPropagation(); openModalForVerb('${verbName}')" title="Details anzeigen" style="cursor: pointer;">${translation}</div>
            `;
            lightContainer.appendChild(row);
        });

        cardsContainer.appendChild(lightContainer);
        updateIndicatorsForView(group);
    }

    // --- UPDATED RENDER FUNCTION ---
    function renderVerbGroup() {
        const levelGroups = verbGroupsByLevel[currentLevel];

        // Auto-correct out-of-bounds index
        if (levelGroups && currentGroupInLevel >= levelGroups.length) {
            console.warn(`Group index ${currentGroupInLevel} out of bounds for level ${currentLevel} (Max: ${levelGroups.length}). Resetting to 0.`);
            currentGroupInLevel = 0;
            saveProgress();
        }

        if (!levelGroups || !levelGroups[currentGroupInLevel]) {
            console.error(`Group data error: Level=${currentLevel}, GroupIndex=${currentGroupInLevel}, LoadedGroups=${levelGroups ? levelGroups.length : 'undefined'}`);
            cardsContainer.innerHTML = '<p>Fehler beim Laden der Verben. (Daten fehlen)</p>';
            return;
        }

        const group = levelGroups[currentGroupInLevel];
        console.log(`[DEBUG] Rendering group ${currentGroupInLevel} for level ${currentLevel}:`, group);

        if (!group.verbs) {
            console.error(`No verbs found in group`);
            cardsContainer.innerHTML = '<p>Fehler beim Laden der Verben.</p>';
            return;
        }
        console.log(`[DEBUG] Verbs in group:`, group.verbs);
        group.verbs.forEach(v => {
            console.log(`[DEBUG] Data for ${v}:`, allVerbsData[v]);
        });

        // Check which version is active
        const selectedVersionRadio = document.querySelector('input[name="card-version"]:checked');
        const activeVersion = selectedVersionRadio ? selectedVersionRadio.value : 'compact';

        if (activeVersion === 'compact') {
            renderCompactVersion(group);
        } else if (activeVersion === 'niedlich') {
            renderNiedlichVersion(group);
        } else if (activeVersion === 'normal') {
            renderNormalVersion(group);
        } else if (activeVersion === 'light') {
            document.body.classList.add('light-version-global-dark');
            renderLightVersion(group);
        } else {
            // Default to Kompakt if match fails, or Niedlich? User said Default Kompakt.
            renderCompactVersion(group);
        }

        // Common post-render steps
        updateProgressBar();
        updateLevelNavigationButtons();
        saveProgress();
        return; // Important to return to avoid running the old default code below
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
        if (currentLevel === 'A1' && currentGroupInLevel === 8) {
            if (gustarButtonContainer) gustarButtonContainer.style.display = 'block';
            if (reflexiveButtonContainer) reflexiveButtonContainer.style.display = 'none';
        } else {
            if (gustarButtonContainer) gustarButtonContainer.style.display = 'none';
            if (reflexiveButtonContainer) reflexiveButtonContainer.style.display = 'none';
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
        // Load saved progress
        const savedLevel = localStorage.getItem('currentLevel');

        // Retrieve group using level-specific key first (legacy), or generic (new)
        // Actually, previous code used `progress_${currentLevel}`. We should stick to that or migrate.
        // Let's rely on `progress_${level}` to allow independent progress per level.

        if (savedLevel && levelConfig[savedLevel]) {
            currentLevel = savedLevel;
        } else {
            // Fallback/Correction
            currentLevel = 'A1';
        }

        const savedGroup = parseInt(localStorage.getItem(`progress_${currentLevel}`));
        const maxGroups = levelConfig[currentLevel].groupCount;

        if (!isNaN(savedGroup) && savedGroup >= 0 && savedGroup < maxGroups) {
            currentGroupInLevel = savedGroup;
        } else {
            console.warn(`Resetting invalid/missing saved group for level ${currentLevel}`);
            currentGroupInLevel = 0;
        }
    }

    function getSavedGroupForLevel(levelKey) {
        const maxGroups = levelConfig[levelKey] ? levelConfig[levelKey].groupCount : 0;
        const savedGroup = parseInt(localStorage.getItem(`progress_${levelKey}`));
        if (!isNaN(savedGroup) && savedGroup >= 0 && savedGroup < maxGroups) {
            return savedGroup;
        }
        return 0;
    }

    function clearSearchAndRender() {
        if (searchInput) {
            searchInput.value = '';
        }
        const clearSearchBtn = document.getElementById('clear-search');
        const searchCounter = document.getElementById('search-counter');
        if (clearSearchBtn) clearSearchBtn.classList.remove('visible');
        if (searchCounter) searchCounter.textContent = '';
        if (levelIndicator) {
            levelIndicator.style.opacity = '1';
            levelIndicator.style.pointerEvents = 'auto';
        }
        cardsContainer.style.transform = 'translateX(0) scale(1)';
        renderVerbGroup();
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

        let initialViewMode = localStorage.getItem('verben-card-version') || 'compact';
        if (!document.querySelector(`input[name="card-version"][value="${initialViewMode}"]`)) {
            initialViewMode = 'compact';
        }

        // Load Verb Types global data
        fetch('json/verb_types.json')
            .then(res => res.ok ? res.json() : {})
            .then(data => { verbTypesData = data || {}; })
            .catch(() => { verbTypesData = {}; });

        // Hydrate from cache first so returning to the app feels instant on mobile.
        const hydratedFromCache = hydrateFromLocalCache();
        const hasInitialDataInCache = hydratedFromCache && (
            initialViewMode === 'compact'
                ? hasCachedLevel(currentLevel)
                : hasCachedGroup(currentLevel, currentGroupInLevel)
        );

        // Load enough data for the initial view only if cache cannot already render it.
        const initialLoadPromise = hasInitialDataInCache
            ? Promise.resolve()
            : (initialViewMode === 'compact'
                ? loadAllGroupsForLevel(currentLevel)
                : loadGroupData(currentLevel, currentGroupInLevel));

        initialLoadPromise
            .then(() => {
                renderVerbGroup();
                // Start background loading after initial render
                loadBackgroundData();
                loadWortfamilieIndex().catch(e => console.warn("WF Index lazy load failed", e));

                prevGroupBtn.addEventListener('click', async () => {
                    let newLevel = currentLevel;
                    let newGroupIndex = currentGroupInLevel;

                    if (currentGroupInLevel > 0) {
                        // Previous group in current level
                        newGroupIndex--;
                    } else {
                        // Go to previous level's last group
                        const currentLevelIndex = levelOrder.indexOf(currentLevel);
                        if (currentLevelIndex > 0) {
                            newLevel = levelOrder[currentLevelIndex - 1];
                            newGroupIndex = levelConfig[newLevel].groupCount - 1;
                        } else {
                            return; // Start of content
                        }
                    }

                    // Load new data BEFORE switching
                    await loadGroupData(newLevel, newGroupIndex);

                    // Update state and render
                    currentLevel = newLevel;
                    currentGroupInLevel = newGroupIndex;
                    clearSearchAndRender();
                });

                nextGroupBtn.addEventListener('click', async () => {
                    let newLevel = currentLevel;
                    let newGroupIndex = currentGroupInLevel;
                    const totalGroupsInLevel = levelConfig[currentLevel].groupCount;

                    if (currentGroupInLevel < totalGroupsInLevel - 1) {
                        // Next group in current level
                        newGroupIndex++;
                    } else {
                        // Go to next level's first group
                        const currentLevelIndex = levelOrder.indexOf(currentLevel);
                        if (currentLevelIndex < levelOrder.length - 1) {
                            newLevel = levelOrder[currentLevelIndex + 1];
                            newGroupIndex = 0;
                        } else {
                            return; // End of content
                        }
                    }

                    // Load new data BEFORE switching
                    await loadGroupData(newLevel, newGroupIndex);

                    // Update state and render
                    currentLevel = newLevel;
                    currentGroupInLevel = newGroupIndex;
                    clearSearchAndRender();
                });

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
                    cardsContainer.style.transform = '';
                    cardsContainer.style.transition = '';
                    renderVerbGroup();
                }

                // Level navigation arrow handlers
                const prevLevelBtn = document.getElementById('prev-level-btn');
                const nextLevelBtn = document.getElementById('next-level-btn');

                prevLevelBtn.addEventListener('click', async () => {
                    const currentLevelIndex = levelOrder.indexOf(currentLevel);

                    if (currentLevelIndex > 0) {
                        const targetLevel = levelOrder[currentLevelIndex - 1];
                        const targetGroup = getSavedGroupForLevel(targetLevel);
                        await loadGroupData(targetLevel, targetGroup);
                        currentLevel = targetLevel;
                        currentGroupInLevel = targetGroup;
                        clearSearchAndRender();
                    }
                });

                nextLevelBtn.addEventListener('click', async () => {
                    const currentLevelIndex = levelOrder.indexOf(currentLevel);

                    if (currentLevelIndex < levelOrder.length - 1) {
                        const targetLevel = levelOrder[currentLevelIndex + 1];
                        const targetGroup = getSavedGroupForLevel(targetLevel);
                        await loadGroupData(targetLevel, targetGroup);
                        currentLevel = targetLevel;
                        currentGroupInLevel = targetGroup;
                        clearSearchAndRender();
                    }
                });

                // Keyboard navigation for levels (Up/Down arrows)
                document.addEventListener('keydown', async (e) => {
                    // Only handle if not typing in search input
                    if (document.activeElement.tagName === 'INPUT') return;

                    const currentLevelIndex = levelOrder.indexOf(currentLevel);

                    if (e.key === 'ArrowUp') {
                        e.preventDefault();
                        if (currentLevelIndex > 0) {
                            const targetLevel = levelOrder[currentLevelIndex - 1];
                            const targetGroup = getSavedGroupForLevel(targetLevel);
                            await loadGroupData(targetLevel, targetGroup);
                            currentLevel = targetLevel;
                            currentGroupInLevel = targetGroup;
                            clearSearchAndRender();
                        }
                    } else if (e.key === 'ArrowDown') {
                        e.preventDefault();
                        if (currentLevelIndex < levelOrder.length - 1) {
                            const targetLevel = levelOrder[currentLevelIndex + 1];
                            const targetGroup = getSavedGroupForLevel(targetLevel);
                            await loadGroupData(targetLevel, targetGroup);
                            currentLevel = targetLevel;
                            currentGroupInLevel = targetGroup;
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

        // Newer visibility tags should default to visible even for users carrying older localStorage.
        // We migrate once so stale hidden states do not keep IK/LiD invisible forever in the app.
        if (!localStorage.getItem(SETTINGS_MIGRATION_KEY)) {
            localStorage.setItem('toggle-ik-switch', 'true');
            localStorage.setItem('toggle-lid-switch', 'true');
            localStorage.setItem(SETTINGS_MIGRATION_KEY, 'true');
        }

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

                if (currentViewMode === 'compact' || currentViewMode === 'kompakt') {
                    if (searchInput && searchInput.value.trim() !== '') {
                        performSearch();
                    } else {
                        renderVerbGroup();
                    }
                }
            });
        });

        // Kompakt Light Mode Selector
        const kompaktLightSwitch = document.getElementById('kompakt-light-switch');
        if (kompaktLightSwitch) {
            const savedLightState = localStorage.getItem('toggle-kompakt-light');
            kompaktLightSwitch.checked = (savedLightState === 'true');
            document.body.classList.toggle('compact-light-mode', kompaktLightSwitch.checked);

            kompaktLightSwitch.addEventListener('change', (e) => {
                const isChecked = e.currentTarget.checked;
                document.body.classList.toggle('compact-light-mode', isChecked);
                localStorage.setItem('toggle-kompakt-light', isChecked);
            });
        }

        // Version selector (Normal, Leichte, Niedliche)
        const versionRadios = document.querySelectorAll('input[name="card-version"]');

        // Load saved state from localStorage (default to 'compact')
        let savedVersion = localStorage.getItem('verben-card-version') || 'compact';

        // Validate against available options
        if (!document.querySelector(`input[name="card-version"][value="${savedVersion}"]`)) {
            savedVersion = 'compact'; // Fallback if invalid
        }

        currentViewMode = savedVersion; // Initialize global state

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
                currentViewMode = selectedVersion; // Update global state

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
                    // Convert display level (e.g., "A1.1") to unified macro level ("A1")
                    const macroLevel = targetLevel.split('.')[0];
                    const levelKey = targetLevel.replace('.', '_');

                    // Calculate the unified global index
                    let newGroupIndex = targetGroup - 1; // 0-indexed local
                    const layers = physicalLevelMap[macroLevel] || [];
                    for (let layer of layers) {
                        if (layer.key === levelKey) break;
                        newGroupIndex += layer.count;
                    }

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
                    currentLevel = macroLevel;
                    currentGroupInLevel = newGroupIndex;

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

        // Reflexive modal event listeners
        if (reflexiveButton) {
            reflexiveButton.addEventListener('click', () => reflexiveModal.classList.add('visible'));
        }
        if (reflexiveCloseBtn) {
            reflexiveCloseBtn.addEventListener('click', () => reflexiveModal.classList.remove('visible'));
        }
        if (reflexiveCloseFooterBtn) {
            reflexiveCloseFooterBtn.addEventListener('click', () => reflexiveModal.classList.remove('visible'));
        }
        if (reflexiveModal) {
            reflexiveModal.addEventListener('click', (e) => { if (e.target === reflexiveModal) reflexiveModal.classList.remove('visible'); });
        }

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
    async function openThemeModal(optLevelKey, optGroupIndex) {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }

        // Read explicitly passed variables or fallback to the global UI state
        const levelKey = (typeof optLevelKey === 'string') ? optLevelKey : currentLevel;
        const groupIndex = (typeof optGroupIndex === 'number') ? optGroupIndex : currentGroupInLevel;
        const groupNum = groupIndex + 1; // 1-indexed

        console.log(`[DEBUG] Opening Theme Modal for Level: ${levelKey}, Group: ${groupNum}`);

        // Use pre-loaded group data from memory
        const groupData = verbGroupsByLevel[levelKey][groupIndex];

        if (!groupData) {
            console.error(`Group data not found for ${levelKey} group index ${groupIndex}`);
            return;
        }

        currentThemeData = groupData;
        const themeData = groupData;
        const themeColor = standardColors[groupIndex % standardColors.length];

        const themeModalContent = themeModal.querySelector('.theme-modal-content');
        if (themeModalContent) {
            themeModalContent.style.setProperty('--theme-modal-accent', themeColor);
        }

        // Populate modal with theme data
        document.getElementById('theme-modal-german-name').textContent = themeData.theme || themeData.germanName;
        document.getElementById('theme-modal-spanish-name').textContent = themeData.spanishName || themeData.groupNameSpanish;

        const englishObj = document.getElementById('theme-modal-english-name');
        if (englishObj && themeData.groupNameEnglish) {
            englishObj.textContent = themeData.groupNameEnglish;
            englishObj.style.display = 'block';
        } else if (englishObj) {
            englishObj.style.display = 'none';
        }
        document.getElementById('theme-modal-level').textContent = themeData.level;
        const defaultDescription = [themeData.group ? `Grupo ${themeData.group}` : '', themeData.shortName || ''].filter(Boolean).join(' · ');
        const customDescription = (themeData.theme === 'Schicksal' || themeData.germanName === 'Schicksal')
            ? 'circunstancias inevitables de la vida'
            : defaultDescription;
        document.getElementById('theme-modal-description').textContent = customDescription;
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

    window.openThemeModal = openThemeModal;

    // --- TTS FUNCTION ---
    window.speak = function (text, lang = 'de-DE', rate = 0.9) {
        if ('speechSynthesis' in window) {
            // Cancel any previous speech
            window.speechSynthesis.cancel();

            const voices = window.speechSynthesis.getVoices();

            // Helper to get best voice
            const getVoice = () => {
                return voices.find(voice => voice.lang === lang && voice.name.includes('Google')) ||
                    voices.find(voice => voice.lang === lang && voice.name.includes('Microsoft')) ||
                    voices.find(voice => voice.lang === lang) ||
                    voices.find(voice => voice.lang === lang.replace('-', '_')) ||
                    voices.find(voice => voice.lang.startsWith(lang.substring(0, 2)));
            };

            const targetVoice = getVoice();

            // Helper to create and speak utterance
            const speakUtterance = (txt, pitchVal, rateVal) => {
                const u = new SpeechSynthesisUtterance(txt);
                u.rate = rateVal;
                u.pitch = pitchVal;
                if (targetVoice) {
                    u.voice = targetVoice;
                    u.lang = targetVoice.lang;
                } else {
                    u.lang = lang;
                }
                window.speechSynthesis.speak(u);
            };

            const isQuestion = text.trim().endsWith('?');

            // Experimental: For questions, split the last word to force pitch rise
            if (isQuestion && text.trim().includes(' ')) {
                const parts = text.trim().lastIndexOf(' ');
                const firstPart = text.substring(0, parts); // e.g. "Stimmt"
                const lastPart = text.substring(parts + 1); // e.g. "das?"

                // Speak first part normal
                speakUtterance(firstPart, 1.0, rate);

                // Speak last part higher
                // Using 1.3 pitch for noticeable rise
                speakUtterance(lastPart, 1.3, rate);
            } else if (isQuestion) {
                // Single word question, just pitch up
                speakUtterance(text, 1.2, rate);
            } else {
                // Normal Statement
                speakUtterance(text, 1.0, rate);
            }

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
                const query = appVersion ? `?v=${appVersion}` : '';
                const praesensPromise = fetch(`json/praesens/${verb}.json${query}`).then(res => res.ok ? res.json() : {}).catch(() => ({}));
                const perfektPromise = fetch(`json/perfekt/${verb}.json${query}`).then(res => res.ok ? res.json() : []).catch(() => []);
                const fragenPromise = fetch(`json/praesens_fragen/${verb}.json${query}`).then(res => res.ok ? res.json() : {}).catch(() => ({}));
                const perfektKonjugationPromise = fetch(`json/perfekt_konjugation/${verb}.json${query}`).then(res => res.ok ? res.json() : {}).catch(() => ({}));
                const praeteritumKonjugationPromise = fetch(`json/praeteritum_konjugation/${verb}.json${query}`).then(res => res.ok ? res.json() : {}).catch(() => ({}));

                const wortfamiliePromise = fetch(`json/wortfamilie/${verb}.json${query}`).then(res => res.ok ? res.json() : { wortfamilie: [] }).catch(() => ({ wortfamilie: [] }));

                // Add Konjunktiv II data fetch for specific verbs
                const konjunktivPromise = konjunktivVerbs.includes(verb)
                    ? fetch(`json/konjunktiv_ii/${verb}.json${query}`).then(res => res.ok ? res.json() : {}).catch(() => ({}))
                    : Promise.resolve({});

                const [praesensData, perfektData, fragenData, perfektKonjugationData, praeteritumKonjugationData, konjunktivData, wortfamilieData] = await Promise.all([praesensPromise, perfektPromise, fragenPromise, perfektKonjugationPromise, praeteritumKonjugationPromise, konjunktivPromise, wortfamiliePromise]);

                // Rename praeteritum from konjugation data to avoid conflict with card praeteritum string
                if (praeteritumKonjugationData.praeteritum) {
                    praeteritumKonjugationData.praeteritum_conjugations = praeteritumKonjugationData.praeteritum;
                    delete praeteritumKonjugationData.praeteritum;
                }

                // Merge the loaded data into allVerbsData
                // IMPORTANT: merged "wortfamilie" into data.wortfamilie property
                allVerbsData[verb] = {
                    ...data,
                    ...praesensData,
                    ...fragenData,
                    ...perfektKonjugationData,
                    ...praeteritumKonjugationData,
                    ...konjunktivData,
                    examples: perfektData,
                    wortfamilie: wortfamilieData.wortfamilie || [] // Ensure it's the array
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

        // ROW 2: Case tags (Dativ, Akkusativ, Intrans, Prep, etc.) AND New Classification Tags
        const allTags = [
            ...(updatedData.case_tags || []),
            ...(updatedData.tags || [])
        ];

        if (allTags.length > 0) {
            const tagsContainer = document.createElement('div');
            tagsContainer.className = 'modal-tags-container';

            const groups = {
                'Hilfsverb': [],
                'Kasus': [],
                'Reflexivität': [],
                'Struktur': [],
                'Präpositionen': []
            };

            // Remove duplicates just in case
            const uniqueTags = [...new Set(allTags)];

            uniqueTags.forEach(tag => {
                if (['Akkusativ', 'Dativ', 'Nominativ', 'Genitiv', 'Intransitive', 'intrans'].includes(tag)) groups['Kasus'].push(tag);
                else if (tag === 'Reflexive') groups['Reflexivität'].push(tag);
                else if (['Separable', 'Regular', 'Irregular'].includes(tag)) groups['Struktur'].push(tag);
                else if (tag.startsWith('Präposition:')) groups['Präpositionen'].push(tag.replace('Präposition: ', ''));
                else if (tag.includes('Movimiento') || tag.includes('Estático') || tag.includes('🚀') || tag.includes('🏠')) groups['Hilfsverb'].push(tag);
                else groups['Struktur'].push(tag); // Fallback
            });

            Object.keys(groups).forEach(category => {
                if (groups[category].length === 0) return;

                const row = document.createElement('div');
                row.className = 'tag-row';

                const label = document.createElement('span');
                label.className = 'tag-category-label';
                label.textContent = category + ':';

                const tagGroup = document.createElement('div');
                tagGroup.className = 'tag-group';

                groups[category].forEach(tag => {
                    const tagSpan = document.createElement('span');
                    // Create specific class based on tag name, remove special chars
                    // For emojis like 🚀, it might result in empty or invalid class if not careful, 
                    // but usually only affects CSS selector matching. 
                    // Let's make it robust:
                    const safeTagClass = tag.toLowerCase().replace(/[^a-z0-9]/g, '');
                    tagSpan.className = `modal-tag tag-${safeTagClass}`;
                    tagSpan.textContent = tag;

                    // Add Click-to-Search logic
                    tagSpan.addEventListener('click', (e) => {
                        e.stopPropagation();
                        const verbModal = document.getElementById('verb-modal');
                        if (verbModal) verbModal.classList.remove('visible');
                        if (searchInput) {
                            searchInput.value = `tag:${tag}`;
                            performSearch();
                        }
                    });

                    tagGroup.appendChild(tagSpan);
                });

                row.appendChild(label);
                row.appendChild(tagGroup);
                tagsContainer.appendChild(row);
            });

            caseTagsContainer.appendChild(tagsContainer);
        }

        // ROW 3: Verb type and notes (Separable/Non-Separable + Notes)


        // Render Usage Note (Custom rich text note)
        const usageNoteContainer = document.getElementById('modal-usage-note-container');
        if (usageNoteContainer) {
            usageNoteContainer.innerHTML = ''; // Clear previous
            if (updatedData.usage_note) {
                const noteDiv = document.createElement('div');
                noteDiv.className = 'verb-usage-note';
                noteDiv.style.marginBottom = '15px'; // Spacing bottom
                noteDiv.style.padding = '12px';
                noteDiv.style.backgroundColor = '#f0f4f8';
                noteDiv.style.borderLeft = '4px solid #4682B4';
                noteDiv.style.fontSize = '0.95rem';
                noteDiv.style.color = '#333';
                noteDiv.style.textAlign = 'left';
                noteDiv.style.borderRadius = '4px';
                noteDiv.style.lineHeight = '1.5';
                noteDiv.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
                noteDiv.innerHTML = updatedData.usage_note;
                usageNoteContainer.appendChild(noteDiv);
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

        applyModalThemePalette(updatedData);

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

        // 3. Perfekt Note (displayed below Perfekt conjugation table)
        const perfektNote = updatedData.note_perfekt;
        const perfektNoteElement = document.getElementById('modal-perfekt-note');
        if (perfektNoteElement) {
            if (perfektNote) {
                perfektNoteElement.innerHTML = perfektNote;
                perfektNoteElement.style.display = 'block';
            } else {
                perfektNoteElement.style.display = 'none';
            }
        }

        // 4. Präteritum Note (displayed below Präteritum conjugation table)
        const praeteritumNote = updatedData.praeteritum_note;
        const praeteritumNoteElement = document.getElementById('modal-praeteritum-note');
        if (praeteritumNoteElement) {
            if (praeteritumNote) {
                praeteritumNoteElement.innerHTML = praeteritumNote;
                praeteritumNoteElement.style.display = 'block';
            } else {
                praeteritumNoteElement.style.display = 'none';
            }
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

        // Helper to toggle Mental Trick visibility
        window.toggleTrick = function (btn) {
            const content = btn.parentElement.nextElementSibling;
            if (content && content.classList.contains('truco-content')) {
                const isHidden = content.style.display === 'none';
                content.style.display = isHidden ? 'block' : 'none';
                btn.textContent = isHidden ? '▼' : '▶';
            }
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
                        // Safe stringify for onclick
                        const safeWord = wordData.word.replace(/'/g, "\\'");
                        contentHTML += `• <span class="wf-word-german" onclick="speak('${safeWord}')" title="Aussprache hören">${wordData.word}</span>`;
                        if (abbrev) contentHTML += ` <span class="wf-word-type">${abbrev}</span>`;
                        contentHTML += `</div>`;

                        // Translation + Toggle Button
                        contentHTML += `<div class="wf-word-translation">`;
                        contentHTML += `${wordData.es}`;
                        if (wordData.truco) {
                            contentHTML += ` <span class="truco-toggle-btn" onclick="toggleTrick(this)" style="cursor: pointer; margin-left: 5px; user-select: none;">▶</span>`;
                        }
                        // Optional Example
                        if (wordData.example) {
                            contentHTML += `<div style="font-size: 0.9em; color: #666; font-style: italic; margin-top: 2px;">${wordData.example}</div>`;
                        }
                        contentHTML += `</div>`;

                        // Hidden Truco Content
                        if (wordData.truco) {
                            contentHTML += `<div class="truco-content" style="display: none; margin-left: 15px; font-style: italic; color: #555; background-color: #f9f9f9; padding: 5px; border-left: 3px solid #ffd700; margin-top: 5px; border-radius: 4px;">`;
                            contentHTML += `💡 <strong>Truco:</strong> ${wordData.truco}`;
                            contentHTML += `</div>`;
                        }

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
                        // Safe stringify for onclick
                        const safeWord = wordData.word.replace(/'/g, "\\'");
                        contentHTML += `• <span class="wf-word-german" onclick="speak('${safeWord}')" title="Aussprache hören">${wordData.word}</span>`;
                        if (abbrev) contentHTML += ` <span class="wf-word-type">${abbrev}</span>`;
                        contentHTML += `</div>`;

                        // Translation + Toggle Button
                        contentHTML += `<div class="wf-word-translation">`;
                        contentHTML += `${wordData.es}`;
                        if (wordData.truco) {
                            contentHTML += ` <span class="truco-toggle-btn" onclick="toggleTrick(this)" style="cursor: pointer; margin-left: 5px; user-select: none;">▶</span>`;
                        }
                        // Optional Example
                        if (wordData.example) {
                            contentHTML += `<div style="font-size: 0.9em; color: #666; font-style: italic; margin-top: 2px;">${wordData.example}</div>`;
                        }
                        contentHTML += `</div>`;

                        // Hidden Truco Content
                        if (wordData.truco) {
                            contentHTML += `<div class="truco-content" style="display: none; margin-left: 15px; font-style: italic; color: #555; background-color: #f9f9f9; padding: 5px; border-left: 3px solid #ffd700; margin-top: 5px; border-radius: 4px;">`;
                            contentHTML += `💡 <strong>Truco:</strong> ${wordData.truco}`;
                            contentHTML += `</div>`;
                        }

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
            wortfamilieItems = updatedData.wortfamilie.map(item => {
                if (typeof item === 'string') {
                    return parseWordString(item);
                }
                return item;
            });
        }
        renderStandardWordList(wortfamilieContainer, wortfamilieContent, wortfamilieItems);

        // Populate Wortfeld section
        const wortfeldContainer = document.getElementById('wortfeld-container');
        const wortfeldContent = document.getElementById('wortfeld-content');

        let wortfeldItems = [];
        if (updatedData.wortfeld && Array.isArray(updatedData.wortfeld) && updatedData.wortfeld.length > 0) {
            wortfeldItems = updatedData.wortfeld.map(item => {
                if (typeof item === 'string') {
                    return parseWordString(item);
                }
                return item;
            });
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

            const hasAussageExamples = !!(updatedData.praesens_examples && Object.keys(updatedData.praesens_examples).length);
            const hasFrageExamples = !!(updatedData.praesens_fragen && Object.keys(updatedData.praesens_fragen).length);
            const hasDativExamples = !!(updatedData.praesens_dativ && Object.keys(updatedData.praesens_dativ).length);
            const beispielModes = [
                hasAussageExamples ? { key: 'aussage', label: 'Aussage' } : null,
                hasFrageExamples ? { key: 'frage', label: 'Frage' } : null,
                hasDativExamples ? { key: 'dativ', label: 'Dativ' } : null
            ].filter(Boolean);

            let tableHTML = '<table>';
            tableHTML += `<tr><th>Pronomen</th><th>Konjugation</th><th>Beispiel <span id="beispiel-mode-tag" class="beispiel-mode-tag">${beispielModes[0]?.label || 'Aussage'}</span><button id="toggle-beispiel-type" class="toggle-beispiel-btn" title="Beispielmodus wechseln">⇄</button></th></tr>`;

            for (const { key, display, spanish } of pronounOrder) {
                const conjugation = updatedData.praesens[key];
                if (conjugation) {
                    const example = updatedData.praesens_examples && updatedData.praesens_examples[key];
                    const frage = updatedData.praesens_fragen && updatedData.praesens_fragen[key];
                    const dativ = updatedData.praesens_dativ && updatedData.praesens_dativ[key];
                    let exampleCell = '';

                    if (example || frage || dativ) {
                        exampleCell = `<div class="example-cell">`;

                        // Aussage (statement) examples
                        if (example) {
                            exampleCell += `<div class="example-aussage" style="display: block;">`;
                            if (example.de) exampleCell += `<div class="example-de">${example.de}</div>`;
                            if (example.en) exampleCell += `<div class="example-translation example-en">${example.en}</div>`;
                            if (example.es) exampleCell += `<div class="example-translation example-es">${example.es}</div>`;
                            exampleCell += `</div>`;
                        }

                        // Frage (question) examples
                        if (frage) {
                            exampleCell += `<div class="example-frage" style="display: none;">`;
                            if (frage.de) exampleCell += `<div class="example-de">${frage.de}</div>`;
                            if (frage.en) exampleCell += `<div class="example-translation example-en">${frage.en}</div>`;
                            if (frage.es) exampleCell += `<div class="example-translation example-es">${frage.es}</div>`;
                            exampleCell += `</div>`;
                        }

                        if (dativ) {
                            exampleCell += `<div class="example-dativ" style="display: none;">`;
                            if (dativ.de) exampleCell += `<div class="example-de">${dativ.de}</div>`;
                            if (dativ.en) exampleCell += `<div class="example-translation example-en">${dativ.en}</div>`;
                            if (dativ.es) exampleCell += `<div class="example-translation example-es">${dativ.es}</div>`;
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
                let currentModeIndex = 0;
                const modeTag = document.getElementById('beispiel-mode-tag');
                const updateExampleMode = () => {
                    const currentMode = beispielModes[currentModeIndex] || { key: 'aussage', label: 'Aussage' };
                    const aussageExamples = document.querySelectorAll('.example-aussage');
                    const frageExamples = document.querySelectorAll('.example-frage');
                    const dativExamples = document.querySelectorAll('.example-dativ');

                    aussageExamples.forEach(el => {
                        el.style.display = currentMode.key === 'aussage' ? 'block' : 'none';
                    });

                    frageExamples.forEach(el => {
                        el.style.display = currentMode.key === 'frage' ? 'block' : 'none';
                    });

                    dativExamples.forEach(el => {
                        el.style.display = currentMode.key === 'dativ' ? 'block' : 'none';
                    });

                    if (modeTag) {
                        modeTag.textContent = currentMode.label;
                    }
                    toggleBtn.title = `Beispielmodus: ${currentMode.label}`;
                };

                updateExampleMode();
                toggleBtn.addEventListener('click', () => {
                    if (beispielModes.length <= 1) return;
                    currentModeIndex = (currentModeIndex + 1) % beispielModes.length;
                    updateExampleMode();
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
                        if (example.en) exampleCell += `<div class="example-translation example-en">${example.en}</div>`;
                        if (example.es) exampleCell += `<div class="example-translation example-es">${example.es}</div>`;
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
                        if (example.en) exampleCell += `<div class="example-translation example-en">${example.en}</div>`;
                        if (example.es) exampleCell += `<div class="example-translation example-es">${example.es}</div>`;
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
                        if (example.en) exampleCell += `<div class="example-translation example-en">${example.en}</div>`;
                        if (example.es) exampleCell += `<div class="example-translation example-es">${example.es}</div>`;
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
    // searchInput moved to top
    const clearSearchBtn = document.getElementById('clear-search');
    const searchCounter = document.getElementById('search-counter');

    // --- UNIFIED SEARCH LOGIC ---
    // wortfamilieIndex is defined globally
    let isLoadingWortfamilie = false;

    async function loadWortfamilieIndex() {
        if (wortfamilieIndex) return wortfamilieIndex;
        if (isLoadingWortfamilie) return null; // Prevent double loading

        isLoadingWortfamilie = true;

        try {
            const url = appVersion
                ? `json/wortfamilie_index.json?v=${encodeURIComponent(appVersion)}`
                : 'json/wortfamilie_index.json';
            console.log("Fetching Wortfamilie Index from:", url);
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status} ${response.statusText}`);
            }
            wortfamilieIndex = await response.json();
            console.log("Wortfamilie Index loaded successfully.");
            return wortfamilieIndex;
        } catch (error) {
            console.error("Failed to load Wortfamilie index:", error);
            console.error("Error details:", error.message, error.name);
            // Fallback or retry logic could go here
            return null;
        } finally {
            isLoadingWortfamilie = false;
        }
    }

    async function performSearch() {
        if (!searchInput) return;

        const searchTerm = searchInput.value.trim().toLowerCase();

        // Unified Search: We now search both Verbs and Wortfamilie

        // 1. Wortfamilie Search (start async)
        const wortfamiliePromise = loadWortfamilieIndex()
            .then(() => performWortfamilieSearch(searchTerm, true)) // true = return results only, don't render yet
            .catch(err => {
                console.error("Wortfamilie search failed", err);
                return [];
            });

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

        const searchPromises = [];
        const groupEntries = getAllSearchGroupEntries();

        for (const entry of groupEntries) {
            const levelKey = entry.levelKey;
            const groupIndexInLevel = entry.groupIndexInLevel;
            let group = entry.group;
            if (!group || !Array.isArray(group.verbs)) continue;

            // Check if group name matches search term (German, Spanish, or English)
            const groupNameMatch = (group.theme && group.theme.toLowerCase().includes(searchTerm)) ||
                (group.germanName && group.germanName.toLowerCase().includes(searchTerm)) ||
                (group.spanishName && group.spanishName.toLowerCase().includes(searchTerm)) ||
                (group.englishName && group.englishName.toLowerCase().includes(searchTerm)) ||
                (group.groupNameGerman && group.groupNameGerman.toLowerCase().includes(searchTerm)) ||
                (group.groupNameSpanish && group.groupNameSpanish.toLowerCase().includes(searchTerm)) ||
                (group.groupNameEnglish && group.groupNameEnglish.toLowerCase().includes(searchTerm));

            if (groupNameMatch && !hasCachedGroup(levelKey, groupIndexInLevel)) {
                try {
                    await loadGroupData(levelKey, groupIndexInLevel, { silent: true });
                    const hydratedGroup = verbGroupsByLevel[levelKey] && verbGroupsByLevel[levelKey][groupIndexInLevel];
                    if (hydratedGroup && Array.isArray(hydratedGroup.verbs)) {
                        group = hydratedGroup;
                    }
                } catch (e) {
                    console.warn(`Failed to silently hydrate search group ${levelKey}/${groupIndexInLevel + 1}`, e);
                }
            }

            if (groupNameMatch) {
                console.log(`MATCH FOUND! Group: ${group.theme || group.groupNameGerman} matches term: "${searchTerm}"`);
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
                                const containsWord = (text, term) => Boolean(findMatchingWordInText(text, term));

                                let matchedPraesensForm = '';
                                let matchedPerfektForm = '';
                                let matchedPraeteritumForm = '';
                                let matchedKonjunktivForm = '';

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
                                if (verbData.perfekt && typeof verbData.perfekt === 'string') {
                                    const perfektWords = verbData.perfekt.toLowerCase().split(' ');
                                    // Exclude auxiliary verbs "hat" and "ist" from search
                                    const filteredPerfektWords = perfektWords.filter(word => word !== 'hat' && word !== 'ist');
                                    perfektMatch = filteredPerfektWords.some(word => word.startsWith(searchTerm));
                                    if (perfektMatch) {
                                        matchedPerfektForm = filteredPerfektWords.find(word => word.startsWith(searchTerm)) || '';
                                    }
                                }

                                if (!perfektMatch && allVerbsData[verbName].perfekt_examples) {
                                    const perfektEntries = Object.values(allVerbsData[verbName].perfekt_examples);
                                    matchedPerfektForm = findMatchingTextEntry(perfektEntries, searchTerm, (entry) => entry && entry.de);
                                    perfektMatch = Boolean(matchedPerfektForm);
                                }

                                // Search in Spanish Perfekt forms (he dado, ha dado, etc.)
                                if (!perfektMatch && verbData.es_perfekt) {
                                    perfektMatch = containsWord(verbData.es_perfekt, searchTerm);
                                }

                                if (!perfektMatch && verbData.es_perfekt_searchable) {
                                    perfektMatch = verbData.es_perfekt_searchable.some(variant =>
                                        containsWord(variant, searchTerm)
                                    );
                                }

                                // TAG SEARCH LOGIC
                                let tagMatch = false;
                                if (searchTerm.startsWith('tag:')) {
                                    const tagTerm = searchTerm.replace('tag:', '').toLowerCase();
                                    const caseTagsMatch = verbData.case_tags && verbData.case_tags.some(tag => tag.toLowerCase() === tagTerm);
                                    const generalTagsMatch = verbData.tags && verbData.tags.some(tag => tag.toLowerCase() === tagTerm);
                                    if (caseTagsMatch || generalTagsMatch) {
                                        tagMatch = true;
                                    }
                                } else {
                                    // General search includes filtering by tag naming too
                                    const caseTagsMatch = verbData.case_tags && verbData.case_tags.some(tag => tag.toLowerCase().includes(searchTerm));
                                    const generalTagsMatch = verbData.tags && verbData.tags.some(tag => tag.toLowerCase().includes(searchTerm));
                                    if (caseTagsMatch || generalTagsMatch) {
                                        tagMatch = true;
                                    }
                                }
                                // Search in Präsens conjugations (pre-loaded!)
                                let praesensMatch = false;
                                if (allVerbsData[verbName].praesens) {
                                    const conjugations = Object.values(allVerbsData[verbName].praesens);
                                    matchedPraesensForm = findMatchingTextEntry(conjugations, searchTerm);
                                    praesensMatch = Boolean(matchedPraesensForm);
                                }

                                // Search in Präteritum conjugations (pre-loaded!)
                                let praeteritumMatch = false;
                                if (allVerbsData[verbName].praeteritum_conjugations) {
                                    const conjugations = Object.values(allVerbsData[verbName].praeteritum_conjugations);
                                    matchedPraeteritumForm = findMatchingTextEntry(conjugations, searchTerm, (conj) => {
                                        if (typeof conj === 'string') return conj;
                                        return conj && conj.de ? conj.de : '';
                                    });
                                    praeteritumMatch = Boolean(matchedPraeteritumForm);
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
                                    matchedKonjunktivForm = findMatchingTextEntry(conjugations, searchTerm);
                                    konjunktivMatch = Boolean(matchedKonjunktivForm);
                                }

                                if (germanMatch || spanishMatch || perfektMatch || praesensMatch || praeteritumMatch || konjunktivMatch || tagMatch) {
                                    return {
                                        verb: verbName,
                                        data: verbData,
                                        levelKey: levelKey,
                                        groupIndexInLevel: groupIndexInLevel,
                                        matchedPraesensForm,
                                        matchedPerfektForm,
                                        matchedPraeteritumForm,
                                        matchedKonjunktivForm
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
        }

        // Wait for both searches to complete
        const [verbResults, wfResults] = await Promise.all([
            Promise.all(searchPromises).then(results => results.filter(r => r !== null)),
            wortfamiliePromise
        ]);

        // Flatten verb results
        let finalVerbResults = verbResults.flat();

        // Merge logic:
        const uniqueVerbsMap = new Map();

        // Add direct verb matches
        finalVerbResults.forEach(res => {
            uniqueVerbsMap.set(res.verb, res);
        });

        // Add Wortfamilie matches
        // Add Wortfamilie matches
        const wfPromises = wfResults.map(async wfRes => {
            if (!uniqueVerbsMap.has(wfRes.verb)) {
                // We need to fetch the verb data for this result
                const levelData = findVerbLevelAndGroup(wfRes.verb);
                if (levelData) {
                    // Check if data is loaded
                    if (!allVerbsData[wfRes.verb]) {
                        try {
                            const res = await fetch(`json/cards/${wfRes.verb}.json?v=${appVersion || '1'}`);
                            if (res.ok) {
                                allVerbsData[wfRes.verb] = await res.json();
                            }
                        } catch (e) {
                            console.warn("Failed to load verb data for search result", wfRes.verb);
                        }
                    }

                    if (allVerbsData[wfRes.verb]) {
                        uniqueVerbsMap.set(wfRes.verb, {
                            verb: wfRes.verb,
                            data: allVerbsData[wfRes.verb],
                            levelKey: levelData.levelKey,
                            groupIndexInLevel: levelData.groupIndex,
                            matchedRelatedForm: wfRes.matchedWord || ''
                        });
                    }
                }
            } else {
                const existing = uniqueVerbsMap.get(wfRes.verb);
                if (existing && !existing.matchedRelatedForm) {
                    existing.matchedRelatedForm = wfRes.matchedWord || '';
                    uniqueVerbsMap.set(wfRes.verb, existing);
                }
            }
        });

        await Promise.all(wfPromises);

        const matchingVerbs = Array.from(uniqueVerbsMap.values());

        // SORTING LOGIC: Level Priority (A1.1 -> B2.1) then Alphabetical
        matchingVerbs.sort((a, b) => {
            const levelIndexA = levelOrder.indexOf(a.levelKey);
            const levelIndexB = levelOrder.indexOf(b.levelKey);

            // 1. Primary Sort: Level
            if (levelIndexA !== levelIndexB) {
                // If one level is unknown (-1), put it last
                if (levelIndexA === -1) return 1;
                if (levelIndexB === -1) return -1;
                return levelIndexA - levelIndexB;
            }

            // 2. Secondary Sort: Alphabetical
            return a.verb.localeCompare(b.verb);
        });

        // Clear current cards and display matching verbs
        cardsContainer.innerHTML = '';

        // Show count
        if (searchCounter) searchCounter.textContent = matchingVerbs.length.toString();
        const countEl = document.getElementById('search-results-count');
        if (matchingVerbs.length > 0) {
            countEl.textContent = `${matchingVerbs.length} Ergebnis${matchingVerbs.length !== 1 ? 'se' : ''}`;
            countEl.style.display = 'block';
        } else {
            countEl.style.display = 'none';
            cardsContainer.innerHTML = '<div class="no-results">Keine Ergebnisse gefunden / No results found</div>';
        }

        const verbsToShow = matchingVerbs; // Show all results, or slice if pagination needed


        const htmlFragments = [];

        // --- Whole-Word Regex Highlighter ---
        function highlightMatch(text, query) {
            if (!query || !text) return text;
            const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            // Matches any whole word (\b...\b) containing the query sequence including trailing/leading German characters
            const regex = new RegExp(`([\\wäöüÄÖÜß]*${escapedQuery}[\\wäöüÄÖÜß]*)`, 'gi');
            return text.replace(regex, (match) =>
                `<span style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); color: #6e4e00; padding: 0;">${match}</span>`
            );
        }

        function highlightBaseVerb(text) {
            if (!text) return text;
            return `<span style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); color: #6e4e00; padding: 0;">${text}</span>`;
        }

        function getMatchHint(match) {
            return match.matchedPraesensForm ||
                match.matchedPerfektForm ||
                match.matchedPraeteritumForm ||
                match.matchedKonjunktivForm ||
                match.matchedRelatedForm ||
                '';
        }

        const renderFullSearchCards = false;

        if (!renderFullSearchCards && (currentViewMode === 'compact' || currentViewMode === 'kompakt')) {
            const deSwitch = document.getElementById('de-switch');
            const esSwitch = document.getElementById('es-switch');
            const enSwitch = document.getElementById('en-switch');
            const showGerman = deSwitch ? deSwitch.checked : true;
            const showSpanish = esSwitch ? esSwitch.checked : true;
            const showEnglish = enSwitch ? enSwitch.checked : false;
            const groupedMatches = {};
            verbsToShow.forEach(match => {
                const verbData = match.data;
                const level = match.levelKey || (verbData.level ? verbData.level.split('.')[0] : 'A1');
                const groupIndex = Number.isInteger(match.groupIndexInLevel)
                    ? match.groupIndexInLevel
                    : (verbData.group ? verbData.group - 1 : 0);
                const resolvedGroup = verbGroupsByLevel[level] && verbGroupsByLevel[level][groupIndex]
                    ? verbGroupsByLevel[level][groupIndex]
                    : null;
                let theme = resolvedGroup
                    ? (resolvedGroup.theme || resolvedGroup.germanName || resolvedGroup.groupNameGerman || 'Gruppe')
                    : (verbData.theme || 'Gruppe');

                const groupKey = `${level}-${theme}`;
                if (!groupedMatches[groupKey]) {
                    const spanishName = resolvedGroup
                        ? (resolvedGroup.spanishName || resolvedGroup.groupNameSpanish || '')
                        : '';
                    const fullGroupVerbs = resolvedGroup && Array.isArray(resolvedGroup.verbs)
                        ? resolvedGroup.verbs.map(groupVerbName => ({
                            verb: groupVerbName,
                            data: allVerbsData[groupVerbName] || {},
                            levelKey: level,
                            groupIndexInLevel: groupIndex
                        }))
                        : [];

                    groupedMatches[groupKey] = {
                        level: level,
                        theme: theme,
                        spanishName: spanishName,
                        groupIndex: groupIndex,
                        verbs: fullGroupVerbs.length > 0 ? fullGroupVerbs : [match]
                    };
                }
            });

            htmlFragments.push('<div class="kompakt-grid">');

            Object.values(groupedMatches).forEach((group) => {
                const themeColor = standardColors[group.groupIndex % standardColors.length];
                const chunkSize = 7;
                const chunks = [];
                for (let i = 0; i < group.verbs.length; i += chunkSize) {
                    chunks.push(group.verbs.slice(i, i + chunkSize));
                }

                chunks.forEach((chunk, chunkIndex) => {
                    let cardTitleHTML = group.theme || group.groupNameGerman || 'Gruppe';
                    if (chunks.length > 1) {
                        cardTitleHTML += ` <span class="kompakt-pagination">(${chunkIndex + 1}/${chunks.length})</span>`;
                    }

                    let cardHTML = `
            <div class="kompakt-level-card">
                <div class="kompakt-level-header" style="background-color: ${themeColor}; cursor: default;">
                    <span class="kompakt-header-de" onclick="event.stopPropagation(); window.speak('${group.theme || group.groupNameGerman || 'Gruppe'}')" title="Aussprache h??ren" style="cursor: pointer; display: ${showGerman ? 'inline' : 'none'};">${cardTitleHTML}</span>
                    <span class="kompakt-header-es" onclick="event.stopPropagation(); openThemeModal('${group.level}', ${group.groupIndex})" title="Themeninfos anzeigen" style="cursor: pointer; display: ${showSpanish ? 'inline' : 'none'};">${group.spanishName || group.groupNameSpanish || ''}</span>
                </div>
                <div class="kompakt-level-content">
            `;

                    chunk.forEach(match => {
                        const verbName = match.verb;
                        const verbData = match.data;
                        const matchHint = getMatchHint(match);
                        let displayVerbName = highlightMatch(verbName, searchTerm);
                        if (!verbName.toLowerCase().includes(searchTerm) && matchHint) {
                            displayVerbName = `${highlightBaseVerb(verbName)} <span class="search-match-hint" style="font-size: 0.78em; opacity: 0.82; margin-left: 6px;">(${highlightMatch(matchHint, searchTerm)})</span>`;
                        }
                        const esTranslationRaw = getPrimaryTranslation(verbData.es || '');
                        const esTranslationDisplay = highlightMatch(esTranslationRaw, searchTerm);
                        const enTranslationRaw = (verbData.en_verb || '').replace(/^\(?(to\s+)?|\)$/gi, '').trim();
                        const enTranslationDisplay = highlightMatch(enTranslationRaw, searchTerm);
                        const isReflexive = verbData.case_tags && verbData.case_tags.includes('Reflexiv');
                        const reflBadge = isReflexive ? `<span class="reflexiv-badge" style="margin-left: 8px;">refl</span>` : '';
                        const isDativ = verbData.case_tags && verbData.case_tags.includes('DAT');
                        const datBadge = isDativ ? `<span class="dativ-badge" style="margin-left: 8px;">dat</span>` : '';
                        const isIntransitive = verbData.case_tags && verbData.case_tags.includes('INTR');
                        const intrBadge = isIntransitive ? `<span class="intr-badge" style="margin-left: 8px;">intr</span>` : '';
                        const isIK = verbData.case_tags && verbData.case_tags.includes('IK');
                        const ikBadge = isIK ? `<span class="ik-badge" style="margin-left: 8px;">IK</span>` : '';
                        const isLiD = verbData.case_tags && verbData.case_tags.includes('LiD');
                        const lidBadge = isLiD ? `<span class="lid-badge" style="margin-left: 8px;">LiD</span>` : '';

                        cardHTML += `
                    <div class="kompakt-row" data-verb="${verbName}" onclick="openModalForVerb('${verbName}')" title="Details anzeigen" style="cursor: pointer;">
                        <div class="kompakt-german" onclick="event.stopPropagation(); window.speak('${verbName}')" title="Aussprache hören" style="cursor: pointer; display: ${showGerman ? 'block' : 'none'};">${displayVerbName}${reflBadge}${datBadge}${intrBadge}${ikBadge}${lidBadge}</div>
                        <div class="kompakt-translations">
                            <div class="kompakt-spanish" onclick="event.stopPropagation(); openModalForVerb('${verbName}')" title="Details anzeigen" style="cursor: pointer; display: ${showSpanish ? 'block' : 'none'};">${esTranslationDisplay}</div>
                            <div class="kompakt-english" onclick="event.stopPropagation(); openModalForVerb('${verbName}')" title="Details anzeigen" style="cursor: pointer; display: ${showEnglish && enTranslationRaw ? 'block' : 'none'};">${enTranslationDisplay}</div>
                        </div>
                    </div>
                `;
                    });

                    cardHTML += `
                </div>
            </div>`;
                    htmlFragments.push(cardHTML);
                });
            });

            htmlFragments.push('</div>');
        } else {
            verbsToShow.forEach(match => {
                try {
                    const verbName = match.verb;
                    const verbData = match.data;
                    const irregularMark = verbData.irregularPraesens ? '<span class="irregular-indicator">*</span>' : '';

                    // Generate highlighted display names dynamically
                    const matchHint = getMatchHint(match);
                    let displayVerbName = highlightMatch(verbName, searchTerm);
                    if (!verbName.toLowerCase().includes(searchTerm) && matchHint) {
                        displayVerbName = `${highlightBaseVerb(verbName)} <span class="search-match-hint" style="font-size: 0.78em; opacity: 0.82; margin-left: 6px;">(${highlightMatch(matchHint, searchTerm)})</span>`;
                    }

                    // Remove parentheses from translations and highlight
                    const esTranslationRaw = getPrimaryTranslation(verbData.es || '');
                    const esTranslation = highlightMatch(esTranslationRaw, searchTerm);

                    const esPerfektTranslationRaw = getPrimaryTranslation(verbData.es_perfekt || '');
                    const esPerfektTranslation = highlightMatch(esPerfektTranslationRaw, searchTerm);

                    const esPraeteritumTranslationRaw = getPrimaryTranslation(verbData.es_praeteritum || '');
                    const esPraeteritumTranslation = highlightMatch(esPraeteritumTranslationRaw, searchTerm);

                    // Prepare German perfekt with short and full versions
                    let germanPerfektShort = verbData.perfekt || '---';
                    let germanPerfektFull = verbData.perfekt || '---';
                    if (verbData.perfekt && typeof verbData.perfekt === 'string' && verbData.perfekt !== '---') {
                        const germanParts = verbData.perfekt.split(' ');
                        if (germanParts.length >= 2) {
                            germanPerfektShort = germanParts.slice(1).join(' ');
                            germanPerfektFull = verbData.perfekt;
                        }
                    }

                    let germanPerfektShortDisplay = highlightMatch(germanPerfektShort, searchTerm);
                    if (match.matchedPerfektForm && !germanPerfektShort.toLowerCase().includes(searchTerm)) {
                        germanPerfektShort = match.matchedPerfektForm;
                        germanPerfektFull = match.matchedPerfektForm;
                        germanPerfektShortDisplay = highlightMatch(match.matchedPerfektForm, searchTerm);
                    }

                    // Prepare Spanish perfekt with short and full versions
                    let spanishPerfektShort = esPerfektTranslation;
                    let spanishPerfektFull = esPerfektTranslation;
                    let spanishPerfektShortDisplay = esPerfektTranslation;
                    if (esPerfektTranslationRaw && typeof esPerfektTranslationRaw === 'string') {
                        const spanishParts = esPerfektTranslationRaw.split(' ');
                        if (spanishParts.length >= 2) {
                            spanishPerfektShort = spanishParts.slice(1).join(' ');
                            spanishPerfektFull = esPerfektTranslationRaw;
                            spanishPerfektShortDisplay = highlightMatch(spanishPerfektShort, searchTerm);
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

                    let germanPraeteritumShortDisplay = highlightMatch(germanPraeteritumShort, searchTerm);
                    if (match.matchedPraeteritumForm && !germanPraeteritumShort.toLowerCase().includes(searchTerm)) {
                        germanPraeteritumShort = match.matchedPraeteritumForm;
                        germanPraeteritumFull = match.matchedPraeteritumForm;
                        germanPraeteritumShortDisplay = highlightMatch(match.matchedPraeteritumForm, searchTerm);
                    }

                    // Prepare Spanish präteritum with short (verb only) and full versions
                    let spanishPraeteritumShort = esPraeteritumTranslation;
                    let spanishPraeteritumFull = esPraeteritumTranslation;
                    let spanishPraeteritumShortDisplay = esPraeteritumTranslation;
                    if (esPraeteritumTranslationRaw) {
                        const spanishPraeteritumParts = esPraeteritumTranslationRaw.split(' ');
                        if (spanishPraeteritumParts.length >= 2) {
                            spanishPraeteritumShort = spanishPraeteritumParts.slice(1).join(' '); // verb only
                            spanishPraeteritumFull = esPraeteritumTranslationRaw; // full: él/ella hizo
                            spanishPraeteritumShortDisplay = highlightMatch(spanishPraeteritumShort, searchTerm);
                        }
                    }

                    // Prepare Konjunktiv II (only for specific verbs)
                    let germanKonjunktivShort = '';
                    let germanKonjunktivFull = '';
                    let spanishKonjunktivShort = '';
                    let spanishKonjunktivFull = '';
                    let germanKonjunktivShortDisplay = '';
                    let spanishKonjunktivShortDisplay = '';
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
                        const spanishKonjunktivFullRaw = konjunktivTranslations[verbName] || '---';
                        const spanishKonjunktivShortRaw = spanishKonjunktivFullRaw.split(' ').slice(1).join(' ');

                        spanishKonjunktivFull = spanishKonjunktivFullRaw;
                        spanishKonjunktivShort = spanishKonjunktivShortRaw;

                        germanKonjunktivShortDisplay = highlightMatch(germanKonjunktivShort, searchTerm);
                        spanishKonjunktivShortDisplay = highlightMatch(spanishKonjunktivShortRaw, searchTerm);

                        if (match.matchedKonjunktivForm && !germanKonjunktivShort.toLowerCase().includes(searchTerm)) {
                            germanKonjunktivShort = match.matchedKonjunktivForm;
                            germanKonjunktivFull = match.matchedKonjunktivForm;
                            germanKonjunktivShortDisplay = highlightMatch(match.matchedKonjunktivForm, searchTerm);
                        }

                        konjunktivHTML = `
                <span class="german-konjunktiv konjunktiv-text" data-form="konjunktiv" data-short="${germanKonjunktivShort}" data-full="${germanKonjunktivFull}">${germanKonjunktivShortDisplay}</span>
                <span class="spanish-konjunktiv konjunktiv-text" data-form="translation konjunktiv" data-short="${spanishKonjunktivShort}" data-full="${spanishKonjunktivFull}">${spanishKonjunktivShortDisplay}</span>
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
                                'intrans': '⚪ [Intrans]',
                                'IK': '🟣 [IK]',
                                'LiD': '🔵 [LiD]'
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

                    if (false && currentViewMode === 'niedlich') {
                        // Niedlich Mode Rendering - DISABLED per user request (User prefers Normal layout even in Cute mode)
                        const showEnglish = document.getElementById('en-switch') ? document.getElementById('en-switch').checked : false;

                        // Construct English translation HTML if toggle is active
                        let englishHTML = '';
                        if (showEnglish && verbData.en_verb) {
                            const cleanEn = verbData.en_verb.replace(/^\(?(to\s+)?|\)$/gi, '').trim();
                            // Match styling: white, font-weight 600, same as applied in renderNiedlichVersion
                            englishHTML = `<span class="english-translation" style="font-size: 1.1rem; color: white; font-weight: 600;">${cleanEn}</span>`;
                        }

                        const cardHTML = `
                <div class="word-item niedlich-card" onclick="openModalForVerb('${verbName}')">
                     <div class="card-header niedlich-card-header">
                        <div class="niedlich-emoji-large">${verbData.emoji}</div>
                    </div>
                    <div class="card-body niedlich-card-body">
                         <div class="niedlich-word-container">
                            <span class="german-word" style="margin-bottom: 5px;">${verbName}</span>
                            <span class="spanish-translation" style="font-size: 1.1rem; color: white; font-style: italic;">${esTranslation}</span>
                            ${englishHTML}
                        </div>
                    </div>
                </div>`;
                        htmlFragments.push(cardHTML);

                    } else {
                        // Normal Mode (Default)
                        const shouldHideEmoji = (currentViewMode === 'niedlich' || currentViewMode === 'cute') || searchTerm.startsWith('tag:') || searchTerm.includes('movimiento') || searchTerm.includes('estático') || searchTerm.includes('estatico');
                        const cardHTML = `
                <div class="word-item">
                    <div class="card-header">
                        <span class="german-word" onclick="event.stopPropagation(); window.speak('${verbName}')" title="Aussprache hören" style="cursor: pointer;">${displayVerbName}</span>
                        <span class="spanish-translation" data-form="translation" onclick="event.stopPropagation(); openModalForVerb('${verbName}')" title="Details anzeigen" style="cursor: pointer;">${esTranslation}</span>
                        ${shouldHideEmoji ? '' : `<div class="icon-floating" onclick="event.stopPropagation(); openModalForVerb('${verbName}')" style="cursor: pointer;">${verbData.emoji || '❓'}</div>`}
                    </div>
                    <div class="card-body" onclick="event.stopPropagation(); openModalForVerb('${verbName}')" style="cursor: pointer;">
                        <div class="text-container perfekt-hover-container">
                            <div class="german-word-container">
                                ${tagsHTML}
                                ${caseTagsHTML}
                            </div>
                            ${shouldHideEmoji ? '' : `
                            <span class="german-past perfekt-text" data-form="perfekt" data-short="${germanPerfektShort}" data-full="${germanPerfektFull}">${germanPerfektShortDisplay}</span>
                            <span class="spanish-perfekt perfekt-text" data-form="translation perfekt" data-short="${spanishPerfektShort}" data-full="${spanishPerfektFull}">${spanishPerfektShortDisplay}</span>
                            <span class="german-praeteritum praeteritum-text" data-form="praeteritum" data-short="${germanPraeteritumShort}" data-full="${germanPraeteritumFull}">${germanPraeteritumShortDisplay}</span>
                            <span class="spanish-praeteritum praeteritum-text" data-form="translation praeteritum" data-short="${spanishPraeteritumShort}" data-full="${spanishPraeteritumFull}">${spanishPraeteritumShortDisplay}</span>
                            ${konjunktivHTML}
                            `}
                        </div>
                        ${shouldHideEmoji ? '' : `
                        <div class="cute-translations">
                            <div class="cute-translation-es">${esTranslation}</div>
                            <div class="cute-translation-en">${(verbData.en_verb || '').replace(/^\(?(to\s+)?|\)$/gi, '').trim()}</div>
                        </div>
                        `}
                    </div>
                </div>`;
                        htmlFragments.push(cardHTML);
                    }
                } catch (renderError) {
                    console.error(`Error rendering card for ${match.verb}:`, renderError);
                }
            });
        }
        cardsContainer.innerHTML = htmlFragments.join('');

        cardsContainer.querySelectorAll('.kompakt-row[data-verb]').forEach((row) => {
            const verbName = row.dataset.verb;
            row.onclick = () => openModalForVerb(verbName);

            const germanWord = row.querySelector('.kompakt-german');
            if (germanWord) {
                germanWord.onclick = (event) => {
                    event.stopPropagation();
                    window.speak(verbName);
                };
            }

            const spanishWord = row.querySelector('.kompakt-spanish');
            if (spanishWord) {
                spanishWord.onclick = (event) => {
                    event.stopPropagation();
                    openModalForVerb(verbName);
                };
            }
        });

        // Re-setup hover listeners for new cards
        setupHoverListeners();

        // Update counter
        if (searchCounter) {
            const maxVisible = 9;
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



    function performWortfamilieSearch(searchTerm) {
        if (!wortfamilieIndex) return;

        if (clearSearchBtn) {
            if (searchTerm.length > 0) {
                clearSearchBtn.classList.add('visible');
            } else {
                clearSearchBtn.classList.remove('visible');
            }
        }

        if (searchTerm.length < 2) {
            cardsContainer.innerHTML = '<div class="cards-placeholder" style="text-align:center; padding: 20px; color: #666;">Geben Sie mindestens 2 Buchstaben ein, um in Wortfamilien zu suchen.</div>';
            if (searchCounter) searchCounter.textContent = '';
            return;
        }

        try {
            const results = wortfamilieIndex.filter(item => {
                const word = item.word || '';
                const es = item.es || '';
                return word.toLowerCase().includes(searchTerm) ||
                    es.toLowerCase().includes(searchTerm);
            });

            cardsContainer.innerHTML = '';

            if (results.length === 0) {
                cardsContainer.innerHTML = '<div class="no-results" style="text-align:center; padding: 20px;">Keine Ergebnisse gefunden.</div>';
                if (searchCounter) searchCounter.textContent = '0 Ergebnisse';
                return;
            }

            const maxResults = 50;
            results.slice(0, maxResults).forEach(item => {
                const card = document.createElement('div');
                card.className = 'wf-result-card';
                card.onclick = () => openModalForVerb(item.verb);

                card.innerHTML = `
                <div class="wf-main-info">
                    <span class="wf-word">${item.word}</span>
                    <span class="wf-translation">${item.es}</span>
                    <div class="wf-relationship">
                        Gehört zu: <strong>${item.verb}</strong> <span class="wf-arrow">➔</span>
                    </div>
                </div>
            `;
                cardsContainer.appendChild(card);
            });

            if (searchCounter) {
                if (results.length > maxResults) {
                    searchCounter.textContent = `${maxResults} von ${results.length} Ergebnisse angezeigt`;
                } else {
                    searchCounter.textContent = `${results.length} Ergebnisse`;
                }
            }
        } catch (error) {
            console.error("Error in Wortfamilie search:", error);
            cardsContainer.innerHTML = '<div class="error-message" style="text-align:center; padding: 20px;">Ein Fehler ist aufgetreten.</div>';
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

    // Helper to find verb location (needed for WF matches that weren't in direct search)
    function findVerbLevelAndGroup(verbName) {
        for (const levelKey in verbGroupsByLevel) {
            const groups = verbGroupsByLevel[levelKey];
            for (let i = 0; i < groups.length; i++) {
                if (groups[i].verbs.includes(verbName)) {
                    return { levelKey: levelKey, groupIndex: i };
                }
            }
        }
        for (const group of allGroupsIndex) {
            if (group && Array.isArray(group.verbs) && group.verbs.includes(verbName)) {
                const levelKey = group.level ? group.level.split('.')[0] : '';
                const groupIndex = Number(group.groupNumberPerLevel) - 1;
                if (levelKey && Number.isInteger(groupIndex) && groupIndex >= 0) {
                    return { levelKey, groupIndex };
                }
            }
        }
        return null;
    }

    // Modified to support returning results instead of rendering
    function performWortfamilieSearch(term, returnOnly = false) {
        if (!wortfamilieIndex) return returnOnly ? [] : null;

        const results = [];
        const termLower = term.toLowerCase();

        for (const [word, data] of Object.entries(wortfamilieIndex)) {
            // Check if the word matches (contains) the search term
            if (word.toLowerCase().includes(termLower)) {
                // Logic: Found a match in Wortfamilie (e.g. "Bewertung")
                // data.verbs is an array of verbs associated with this word (e.g. ["bewerten"])
                data.verbs.forEach(verb => {
                    results.push({
                        verb: verb,
                        matchedWord: word,
                        type: data.type
                    });
                });
            }
        }

        if (returnOnly) return results;
    }

    // --- START THE APP ---
    initializeApp();
    // --- TAG FILTER IMPLEMENTATION ---
    function generateTagFilters() {
        const container = document.getElementById('tag-filters-container');
        if (!container) return;

        container.innerHTML = ''; // Clear existing

        const allTags = new Set();
        const tagCounts = {};

        // Collect tags
        Object.values(allVerbsData).forEach(verb => {
            if (verb.case_tags && Array.isArray(verb.case_tags)) {
                verb.case_tags.forEach(tag => {
                    allTags.add(tag);
                    tagCounts[tag] = (tagCounts[tag] || 0) + 1;
                });
            }
            // Also collect from general 'tags' (for Motion/Static)
            if (verb.tags && Array.isArray(verb.tags)) {
                verb.tags.forEach(tag => {
                    allTags.add(tag);
                    tagCounts[tag] = (tagCounts[tag] || 0) + 1;
                });
            }
        });

        const customOrder = ['Akkusativ', 'Dativ', 'Reflexive', 'Separable', 'Nominativ', 'Genitiv', 'Regular', 'Irregular', '🚀 Movimiento', '🏠 Estático'];
        const whitelistedTags = ['Akkusativ', 'Dativ', 'Reflexive', 'Separable', 'Nominativ', 'Genitiv', 'Regular', 'Irregular', 'Intransitive', '🚀 Movimiento', '🏠 Estático'];
        const sortedTags = Array.from(allTags)
            .filter(tag => whitelistedTags.includes(tag) || tag.startsWith('Präposition:'))
            .sort((a, b) => {
                const indexA = customOrder.indexOf(a);
                const indexB = customOrder.indexOf(b);

                if (indexA !== -1 && indexB !== -1) return indexA - indexB;
                if (indexA !== -1) return -1;
                if (indexB !== -1) return 1;
                return a.localeCompare(b);
            });

        sortedTags.forEach(tag => {
            const pill = document.createElement('div');
            pill.className = 'tag-filter-pill';
            pill.textContent = `${tag} (${tagCounts[tag]})`;

            pill.addEventListener('click', () => {
                const isActive = pill.classList.contains('active');
                document.querySelectorAll('.tag-filter-pill').forEach(p => p.classList.remove('active'));

                if (!isActive) {
                    pill.classList.add('active');
                    if (searchInput) {
                        searchInput.value = `tag:${tag}`;
                        performSearch();
                    }
                } else {
                    if (searchInput) {
                        searchInput.value = '';
                        performSearch();
                    }
                }
            });

            container.appendChild(pill);
        });
    }
    // --- EVENT LISTENERS FOR VIEW SWITCHER ---
    const viewSwitchers = document.querySelectorAll('input[name="card-version"]');
    viewSwitchers.forEach(radio => {
        radio.addEventListener('change', () => {
            renderVerbGroup();
        });
    });



    // --- LISTENER FOR ENGLISH TOGGLE ---
    const enSwitch = document.getElementById('en-switch');
    if (enSwitch) {
        enSwitch.addEventListener('change', () => {
            // Re-render if in Niedlich mode (or generally to update views)
            renderVerbGroup();
        });
    }

});
