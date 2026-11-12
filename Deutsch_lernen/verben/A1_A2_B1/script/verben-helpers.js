// Generated from Deutsch_lernen/src/verben/verben-helpers.ts by `npm run build:legacy-scripts`. Do not edit.
(function() {
	// Deutsch_lernen/src/storage/memo-storage.ts
	var STORAGE_VERSION_KEY = "memodeutsch-storage-version";
	/** Bump the `script.js` cache name here only: migration 2 removes every other `verbAppCache_*` key. */
	var CURRENT_VERB_CACHE_KEY = "verbAppCache_v46_wortfamilie_search_ready";
	var VERB_CACHE_PREFIX = "verbAppCache_";
	var LEGACY_SETTINGS_FLAG = "verbenSettingsMigration_v1_show_ik_lid";
	function showIkAndLidTags(store) {
		if (!store.getItem(LEGACY_SETTINGS_FLAG)) {
			store.setItem("toggle-ik-switch", "true");
			store.setItem("toggle-lid-switch", "true");
		}
		store.removeItem(LEGACY_SETTINGS_FLAG);
	}
	function removeStaleVerbCaches(store) {
		const keys = Array.from({ length: store.length }, (_, index) => store.key(index));
		for (const key of keys) if (key?.startsWith(VERB_CACHE_PREFIX) && key !== "verbAppCache_v46_wortfamilie_search_ready") store.removeItem(key);
	}
	/** Migration `n` (1-based) upgrades a store from schema version `n - 1` to `n`. Append only. */
	var migrations = [showIkAndLidTags, removeStaleVerbCaches];
	var STORAGE_SCHEMA_VERSION = migrations.length;
	function readVersion(store) {
		const version = Number(store.getItem(STORAGE_VERSION_KEY));
		return Number.isInteger(version) && version > 0 ? version : 0;
	}
	/** Brings `store` up to `STORAGE_SCHEMA_VERSION`; a store written by a newer version is left alone. */
	function migrateStorage(store) {
		const from = readVersion(store);
		if (from >= STORAGE_SCHEMA_VERSION) return;
		migrations.slice(from).forEach((migrate) => migrate(store));
		store.setItem(STORAGE_VERSION_KEY, String(STORAGE_SCHEMA_VERSION));
	}
	/** Session-only stand-in used once the browser's storage proves unusable. */
	var MemoryStore = class {
		items = /* @__PURE__ */ new Map();
		get length() {
			return this.items.size;
		}
		key(index) {
			return [...this.items.keys()][index] ?? null;
		}
		getItem(key) {
			return this.items.get(key) ?? null;
		}
		setItem(key, value) {
			this.items.set(key, value);
		}
		removeItem(key) {
			this.items.delete(key);
		}
	};
	function isQuotaError(error) {
		return error instanceof DOMException && (error.name === "QuotaExceededError" || error.code === 22);
	}
	/**
	* A store that keeps the page working when the browser's does not: if opening it or any operation throws
	* (Safari with cookies blocked, sandboxed iframes, locked-down profiles) the rest of the session runs on
	* memory. Quota errors pass through, because `script.js` answers them with a smaller payload.
	*/
	function resilientStore(open) {
		let store;
		try {
			store = open();
		} catch {
			store = new MemoryStore();
		}
		const guarded = (run) => {
			try {
				return run(store);
			} catch (error) {
				if (isQuotaError(error)) throw error;
				store = new MemoryStore();
				return run(store);
			}
		};
		return {
			get length() {
				return guarded((current) => current.length);
			},
			key: (index) => guarded((current) => current.key(index)),
			getItem: (key) => guarded((current) => current.getItem(key)),
			setItem: (key, value) => guarded((current) => current.setItem(key, value)),
			removeItem: (key) => guarded((current) => current.removeItem(key))
		};
	}
	/** `localStorage` itself can throw on access; this never does. */
	function browserStore() {
		return resilientStore(() => globalThis.localStorage);
	}
	function isRecord(value) {
		return typeof value === "object" && value !== null && !Array.isArray(value);
	}
	function parseVerbCache(raw) {
		if (raw === null) return null;
		try {
			const data = JSON.parse(raw);
			if (!isRecord(data) || !isRecord(data.allVerbsData) || !isRecord(data.verbGroupsByLevel)) return null;
			if (data.lastUpdated !== void 0 && typeof data.lastUpdated !== "string") return null;
			return data;
		} catch {
			return null;
		}
	}
	function parseGroupIndex(raw) {
		const group = Number.parseInt(raw ?? "", 10);
		return Number.isNaN(group) ? null : group;
	}
	function createMemoStorage(store) {
		return {
			getCurrentLevel: () => store.getItem("currentLevel"),
			getSavedGroup: (level) => parseGroupIndex(store.getItem(`progress_${level}`)),
			saveProgress(level, groupIndex) {
				store.setItem(`progress_${level}`, String(groupIndex));
				store.setItem("currentLevel", level);
			},
			getToggle(id) {
				const value = store.getItem(`toggle-${id}`);
				return value === null ? null : value === "true";
			},
			setToggle: (id, checked) => store.setItem(`toggle-${id}`, String(checked)),
			getCardVersion: () => store.getItem("verben-card-version"),
			setCardVersion: (version) => store.setItem("verben-card-version", version),
			readVerbCache: () => parseVerbCache(store.getItem(CURRENT_VERB_CACHE_KEY)),
			/** Throws when the payload exceeds the quota, so the caller can retry with a smaller one. */
			writeVerbCache: (payload) => store.setItem(CURRENT_VERB_CACHE_KEY, JSON.stringify(payload))
		};
	}
	// Deutsch_lernen/src/verben/verben-data.ts
	/** Static content and lookup tables of the verben page, moved verbatim out of `script.js`. */
	var germanOrdinals = [
		"Erste",
		"Zweite",
		"Dritte",
		"Vierte",
		"Fünfte",
		"Sechste",
		"Siebte",
		"Achte",
		"Neunte",
		"Zehnte",
		"Elfte",
		"Zwölfte",
		"Dreizehnte"
	];
	var germanExampleOrdinals = [
		"Erstes",
		"Zweites",
		"Drittes",
		"Viertes",
		"Fünftes",
		"Sechstes",
		"Siebtes",
		"Achtes"
	];
	var savedStories = [
		`<p>Gestern <span class="highlighted-word">bin ich</span> in Berlin <span class="highlighted-word">gewesen</span>. Ich <span class="highlighted-word">bin</span> mit dem Zug <span class="highlighted-word">gefahren</span>. In der Stadt <span class="highlighted-word">habe ich</span> eine Freundin <span class="highlighted-word">gesehen</span>. Wir <span class="highlighted-word">haben</span> in einem Café <span class="highlighted-word">gesprochen</span> und einen Kaffee <span class="highlighted-word">getrunken</span>. Danach <span class="highlighted-word">habe ich</span> ein Buch <span class="highlighted-word">gekauft</span> und mit Karte <span class="highlighted-word">bezahlt</span>. Es <span class="highlighted-word">hat</span> viel Spaß <span class="highlighted-word">gemacht</span>!</p>`,
		`<p>Heute Morgen <span class="highlighted-word">habe ich</span> lange <span class="highlighted-word">geschlafen</span>. Zum Frühstück <span class="highlighted-word">habe ich</span> ein Brötchen <span class="highlighted-word">gegessen</span>. Dann <span class="highlighted-word">habe ich</span> eine E-Mail an meine Familie <span class="highlighted-word">geschrieben</span>. Ich <span class="highlighted-word">habe</span> ihnen <span class="highlighted-word">gesagt</span>, dass ich bald nach Hause <span class="highlighted-word">komme</span>. Später <span class="highlighted-word">habe ich</span> die Zeitung <span class="highlighted-word">gelesen</span>.</p>`,
		`<p>Am Wochenende <span class="highlighted-word">habe ich</span> zu Hause <span class="highlighted-word">gearbeitet</span>. Ich <span class="highlighted-word">habe</span> für eine Prüfung <span class="highlighted-word">gelernt</span>. Ich <span class="highlighted-word">habe</span> eine Frage nicht <span class="highlighted-word">gewusst</span>, also <span class="highlighted-word">habe ich</span> meinen Lehrer <span class="highlighted-word">gefüragt</span>. Er <span class="highlighted-word">hat</span> mir alles gut erklärt. Ich <span class="highlighted-word">habe</span> die Antwort schnell <span class="highlighted-word">gefunden</span>.</p>`
	];
	var standardColors = [
		"#8b5cf6",
		"#ec4899",
		"#f59e0b",
		"#3b82f6",
		"#ea580c",
		"#22C55E",
		"#a855f7",
		"#facc15"
	];
	/** Verbs that have a Konjunktiv II tab. */
	var konjunktivVerbs = [
		"sein",
		"haben",
		"werden",
		"dürfen",
		"müssen",
		"wollen",
		"sollen",
		"mögen",
		"können",
		"geben",
		"kommen",
		"gehen",
		"finden"
	];
	// Deutsch_lernen/src/verben/level-layout.ts
	/** Folder, position inside it and file number of the `globalIndex`-th group of `macroLevel`, or null. */
	function physicalGroupData(map, macroLevel, globalIndex) {
		const layers = map[macroLevel] || [];
		let offset = 0;
		for (const layer of layers) {
			if (globalIndex < offset + layer.count) {
				const localIndex = globalIndex - offset;
				const fileNumber = Array.isArray(layer.fileNumbers) ? layer.fileNumbers[localIndex] : globalIndex + 1;
				return {
					physicalKey: layer.key,
					localIndex,
					fileNumber
				};
			}
			offset += layer.count;
		}
		return null;
	}
	/** 0-based index across the whole macro level of group `localGroupNumber` (1-based) of layer `levelStr` (`A1.2`). */
	function globalGroupIndex(map, levelStr, localGroupNumber) {
		if (!levelStr || localGroupNumber === void 0 || localGroupNumber === null) return 0;
		const macroLevel = levelStr.split(".")[0];
		const physicalKey = levelStr.includes(".") ? levelStr.replace(".", "_") : levelStr;
		const layers = map[macroLevel] || [];
		let index = Number(localGroupNumber) - 1;
		for (const layer of layers) {
			if (layer.key === physicalKey) break;
			index += layer.count;
		}
		return Math.max(0, index);
	}
	/** Theme colour of the group a verb belongs to; steel blue when the verb has no level or group. */
	function themeColorForVerb(map, verbData) {
		if (!verbData || !verbData.level || !verbData.group) return "#4682B4";
		return standardColors[(globalGroupIndex(map, verbData.level, verbData.group) % standardColors.length + standardColors.length) % standardColors.length];
	}
	function fileNumbersFor(count, previousLayer) {
		if (!previousLayer || !Array.isArray(previousLayer.fileNumbers)) return Array.from({ length: count }, (_, index) => index + 1);
		const previous = previousLayer.fileNumbers;
		if (count <= previous.length) return previous.slice(0, count);
		const lastNum = previous.length > 0 ? previous[previous.length - 1] : 0;
		const extension = Array.from({ length: count - previous.length }, (_, index) => lastNum + index + 1);
		return [...previous, ...extension];
	}
	/**
	* Level layout derived from the groups index. Known layers keep their file numbers (extended or trimmed to
	* the new count); new layers number their files from 1. Null when there are no groups, so the caller keeps
	* its current layout.
	*/
	function levelsFromGroups(groupsArray, previousMap) {
		if (!Array.isArray(groupsArray) || groupsArray.length === 0) return null;
		const physicalLevelMap = {};
		const levelConfig = {};
		for (const group of groupsArray) {
			if (!group || !group.level) continue;
			const macroLevel = String(group.level).split(".")[0];
			const physicalKey = String(group.level).replace(".", "_");
			physicalLevelMap[macroLevel] ??= [];
			levelConfig[macroLevel] ??= {
				groupCount: 0,
				displayName: macroLevel
			};
			levelConfig[macroLevel].groupCount++;
			let layer = physicalLevelMap[macroLevel].find((l) => l.key === physicalKey);
			if (!layer) {
				layer = {
					key: physicalKey,
					count: 0,
					fileNumbers: []
				};
				physicalLevelMap[macroLevel].push(layer);
			}
			layer.count++;
		}
		for (const layers of Object.values(physicalLevelMap)) for (const layer of layers) {
			const previousLayer = (previousMap[layer.key.split("_")[0]] || []).find((item) => item.key === layer.key);
			layer.fileNumbers = fileNumbersFor(layer.count, previousLayer);
		}
		return {
			physicalLevelMap,
			levelConfig
		};
	}
	/** Width one compact card takes in the carousel: 350px card plus its 10px side margins (`styles.css`). */
	var CARD_SLOT_WIDTH = 370;
	var MAX_CARDS_PER_PAGE = 4;
	/**
	* Cards per page of the compact carousel for a viewport `width`, and the device class it implies. Only as
	* many cards as fit side by side: a wider row is clipped by the container, which cut the first card at 640px.
	*/
	function pageSizeForWidth(width) {
		const pageSize = Math.min(MAX_CARDS_PER_PAGE, Math.max(1, Math.floor(width / CARD_SLOT_WIDTH)));
		if (width < 768) return {
			pageSize,
			isPhone: true,
			isTablet: false,
			isDesktop: false
		};
		if (width <= 1024) return {
			pageSize,
			isPhone: false,
			isTablet: true,
			isDesktop: false
		};
		return {
			pageSize,
			isPhone: false,
			isTablet: false,
			isDesktop: true
		};
	}
	// Deutsch_lernen/src/verben/mojibake.ts
	/**
	* Repairs text that was saved with a wrong encoding (UTF-8 read as Windows-1252, sometimes several times).
	* Each pair is [broken, fixed]; up to three passes undo multiple layers.
	*/
	var REPLACEMENTS = [
		["íÃ†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¾", "Ä"],
		["Ö", "Ö"],
		["íÃ†â€™Ãƒâ€¦Ã¢â‚¬Å“", "Ü"],
		["ä", "ä"],
		["ö", "ö"],
		["ü", "ü"],
		["ß", "ß"],
		["á", "á"],
		["é", "é"],
		["í", "í"],
		["ó", "ó"],
		["ú", "ú"],
		["ñ", "ñ"],
		["íÃ†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â°", "Ãƒâ€°"],
		["íÃ¢â‚¬Å¾", "Ä"],
		["íÃ¢â‚¬â€œ", "Ö"],
		["íÃ…â€œ", "Ü"],
		["ä", "ä"],
		["ö", "ö"],
		["ü", "ü"],
		["ß", "ß"],
		["á", "á"],
		["é", "é"],
		["í", "í"],
		["ó", "ó"],
		["ú", "ú"],
		["ñ", "ñ"],
		["Ã‚Â¿", "Ã‚Â¿"],
		["Ã‚Â¡", "Ã‚Â¡"],
		["ÃƒÂ°Ã…Â¸Ã¢â‚¬Å“Ã…Â¡", "🔵œÅ¡"],
		["🏡", "🏡"],
		["ÃƒÂ°Ã…Â¸Ã¢â‚¬â„¢Ã‚Â¼", "🔵™Â¼"],
		["ÃƒÂ°Ã…Â¸Ã…Â¡Ã‚Â¢", "Ã°Å¸Å¡Â¢"],
		["ÃƒÂ°Ã…Â¸Ã…Â¡Ã¢â€šÂ¬", "🚀"],
		["ÃƒÂ°Ã…Â¸Ã¢â‚¬â„¢Ã‚Â¬", "🔵™Â¬"],
		["ÃƒÂ°Ã…Â¸Ã¢â‚¬Å“Ã¢â‚¬â€œ", "🔵œâ€“"],
		["ÃƒÂ°Ã…Â¸Ã¢â‚¬â„¢Ã‚Â¡", "💡"]
	];
	function normalizeMojibakeString(value) {
		if (typeof value !== "string") return value;
		let normalized = value;
		for (let pass = 0; pass < 3; pass++) {
			let changed = false;
			for (const [broken, fixed] of REPLACEMENTS) if (normalized.includes(broken)) {
				normalized = normalized.split(broken).join(fixed);
				changed = true;
			}
			if (!changed) break;
		}
		return normalized;
	}
	function normalizeMojibakeDeep(value) {
		if (typeof value === "string") return normalizeMojibakeString(value);
		if (Array.isArray(value)) return value.map((item) => normalizeMojibakeDeep(item));
		if (!value || typeof value !== "object") return value;
		const normalizedObject = {};
		Object.entries(value).forEach(([key, entryValue]) => {
			normalizedObject[normalizeMojibakeString(key)] = normalizeMojibakeDeep(entryValue);
		});
		return normalizedObject;
	}
	// Deutsch_lernen/src/verben/verb-prefix.ts
	/** Separable verbs and their prefix, highlighted on the cards. */
	var separablePrefixesMap = {
		abbiegen: "ab",
		abfahren: "ab",
		abfliegen: "ab",
		abgeben: "ab",
		abhalten: "ab",
		abheben: "ab",
		abholen: "ab",
		absagen: "ab",
		abschließen: "ab",
		ablehnen: "ab",
		abnehmen: "ab",
		abschaffen: "ab",
		absichern: "ab",
		abreisen: "ab",
		anbieten: "an",
		anfahren: "an",
		anfangen: "an",
		ankommen: "an",
		ankreuzen: "an",
		anprobieren: "an",
		anrufen: "an",
		ansehen: "an",
		anziehen: "an",
		anklagen: "an",
		anklicken: "an",
		anmachen: "an",
		anmelden: "an",
		anregen: "an",
		anwenden: "an",
		anreisen: "an",
		aufbauen: "auf",
		aufhören: "auf",
		aufmachen: "auf",
		aufpassen: "auf",
		aufräumen: "auf",
		aufstehen: "auf",
		aufwachen: "auf",
		aufwachsen: "auf",
		aufgeben: "auf",
		aufregen: "auf",
		aufsuchen: "auf",
		ausfallen: "aus",
		ausfüllen: "aus",
		ausgehen: "aus",
		ausgeben: "aus",
		auslegen: "aus",
		ausleihen: "aus",
		auspacken: "aus",
		ausruhen: "aus",
		aussehen: "aus",
		aussprechen: "aus",
		aussteigen: "aus",
		aussuchen: "aus",
		auswählen: "aus",
		ausziehen: "aus",
		ausgrenzen: "aus",
		auslösen: "aus",
		ausmachen: "aus",
		ausschalten: "aus",
		beitreten: "bei",
		dabeihaben: "dabei",
		durchstreichen: "durch",
		darlegen: "dar",
		eingreifen: "ein",
		einkaufen: "ein",
		einladen: "ein",
		einmachen: "ein",
		einpacken: "ein",
		einrichten: "ein",
		einschlafen: "ein",
		einsteigen: "ein",
		eintragen: "ein",
		einziehen: "ein",
		einhalten: "ein",
		einlegen: "ein",
		einordnen: "ein",
		einreichen: "ein",
		einschalten: "ein",
		einschränken: "ein",
		einstellen: "ein",
		einwenden: "ein",
		fernsehen: "fern",
		fertigmachen: "fertig",
		herstellen: "her",
		hineingehen: "hinein",
		hinzufügen: "hinzu",
		feststellen: "fest",
		herunterladen: "herunter",
		hochladen: "hoch",
		kennenlernen: "kennen",
		mitbringen: "mit",
		mitkommen: "mit",
		mitmachen: "mit",
		mitnehmen: "mit",
		mitteilen: "mit",
		mitwirken: "mit",
		nachholen: "nach",
		stattfinden: "statt",
		teilnehmen: "teil",
		umsteigen: "um",
		umtauschen: "um",
		umziehen: "um",
		vorbereiten: "vor",
		vorhaben: "vor",
		weiterhelfen: "weiter",
		vorschlagen: "vor",
		vorstellen: "vor",
		wegtun: "weg",
		wegwerfen: "weg",
		wehtun: "weh",
		wohlfühlen: "wohl",
		zuhören: "zu",
		zumachen: "zu",
		zuordnen: "zu",
		zunehmen: "zu",
		zustimmen: "zu",
		zurückbringen: "zurück",
		zurückgeben: "zurück",
		zurückkommen: "zurück"
	};
	/** Infinitive as shown on a card: the separable prefix is wrapped in a span so the CSS can colour it. */
	function formatVerbPrefix(verbName, isModal = false) {
		if (verbName === "geboren werden" && !isModal) return "geboren";
		const prefix = separablePrefixesMap[verbName];
		if (prefix && verbName.startsWith(prefix)) return `<span class="separable-prefix">${prefix}</span>${verbName.slice(prefix.length)}`;
		return verbName;
	}
	// Deutsch_lernen/src/verben/search-highlight.ts
	var HIGHLIGHT_OPEN = "<span style=\"background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); color: #6e4e00; padding: 0;\">";
	function escapeRegExp(query) {
		return query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	}
	/** Every word of `text` containing `query`, wrapped in the search highlight. */
	function highlightMatch(text, query) {
		if (!query || !text) return text;
		const regex = new RegExp(`([\\wäöüÄÖÜß]*${escapeRegExp(query)}[\\wäöüÄÖÜß]*)`, "gi");
		return text.replace(regex, (match) => `${HIGHLIGHT_OPEN}${match}</span>`);
	}
	function highlightBaseVerb(text) {
		if (!text) return text;
		return `${HIGHLIGHT_OPEN}${text}</span>`;
	}
	function separableMarkup(prefix, verbName) {
		return `<span class="separable-prefix">${prefix}</span>${verbName.slice(prefix.length)}`;
	}
	/** The verb as the search results show it: separable prefix marked, highlighted when it matches `query`. */
	function highlightVerbName(verbName, query) {
		if (!verbName) return "";
		if (verbName === "geboren werden") {
			const escapedQuery = query.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&");
			const regex = new RegExp(`([\\wäöüÄÖÜß]*${escapedQuery}[\\wäöüÄÖÜß]*)`, "gi");
			if (query && regex.test("geboren")) return `${HIGHLIGHT_OPEN}geboren</span> werden`;
			return "geboren werden";
		}
		const prefix = separablePrefixesMap[verbName];
		const plain = prefix && verbName.startsWith(prefix) ? separableMarkup(prefix, verbName) : verbName;
		if (!query) return plain;
		if (new RegExp(`([\\wäöüÄÖÜß]*${escapeRegExp(query)}[\\wäöüÄÖÜß]*)`, "gi").test(verbName)) return `${HIGHLIGHT_OPEN}${plain}</span>`;
		return plain;
	}
	/** The conjugated form a search result matched, or `''` when it matched the infinitive. */
	function getMatchHint(match) {
		return match.matchedPraesensForm || match.matchedPerfektForm || match.matchedPraeteritumForm || match.matchedKonjunktivForm || match.matchedRelatedForm || "";
	}
	// Deutsch_lernen/src/verben/search.ts
	/** Lowercase, without diacritics, so "Übung" matches "ubung". */
	function normalizeSearchValue(value) {
		if (value === null || value === void 0) return "";
		return String(value).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
	}
	/** First word of `text` that starts with the (already normalised) search term, or `''`. */
	function findMatchingWordInText(text, searchTerm) {
		if (!text || typeof text !== "string") return "";
		return text.replace(/[()]/g, "").split(/[\s,/]+/).filter(Boolean).find((word) => normalizeSearchValue(word).startsWith(searchTerm)) || "";
	}
	/** First entry whose text contains a matching word, or `''`. */
	function findMatchingTextEntry(entries, searchTerm, extractor = null) {
		if (!entries) return "";
		for (const entry of entries) {
			const text = extractor ? extractor(entry) : entry;
			if (typeof text === "string" && findMatchingWordInText(text, searchTerm)) return text;
		}
		return "";
	}
	// Deutsch_lernen/src/verben/theme-colors.ts
	/** `"r, g, b"` for `rgba(var(--x), alpha)` styles; unknown input falls back to the default blue. */
	function hexToRgb(hex) {
		const full = hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (_match, r, g, b) => r + r + g + g + b + b);
		const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(full);
		return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : "59, 130, 246";
	}
	function rgbToHex({ r, g, b }) {
		const toHex = (value) => Math.max(0, Math.min(255, Math.round(value))).toString(16).padStart(2, "0");
		return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
	}
	/** Channels of a 3- or 6-digit hex colour (`#` optional), or `null` when it is not one. */
	function hexToRgbChannels(hex) {
		if (!hex) return null;
		const normalized = hex.replace("#", "").trim();
		const full = normalized.length === 3 ? normalized.split("").map((ch) => ch + ch).join("") : normalized;
		const int = parseInt(full, 16);
		if (Number.isNaN(int) || full.length !== 6) return null;
		return {
			r: int >> 16 & 255,
			g: int >> 8 & 255,
			b: int & 255
		};
	}
	/**
	* Blends two hex colours (`weight` 0 → `colorA`, 1 → `colorB`) for the modal palette. If one colour is not
	* valid hex, the other is returned unchanged.
	*/
	function mixHexColors(colorA, colorB, weight = .5) {
		const a = hexToRgbChannels(colorA);
		const b = hexToRgbChannels(colorB);
		if (!a) return colorB;
		if (!b) return colorA;
		return rgbToHex({
			r: a.r * (1 - weight) + b.r * weight,
			g: a.g * (1 - weight) + b.g * weight,
			b: a.b * (1 - weight) + b.b * weight
		});
	}
	// Deutsch_lernen/src/verben/translations.ts
	/** Drops a leading "(sich)", unwraps any other leading "(word)" and turns " o " into " / ". */
	function removeParentheses(text) {
		if (!text) return text;
		return text.replace(/^\(([^)]+)\)\s*/, (_match, innerWord) => innerWord.toLowerCase() === "sich" ? "" : innerWord + " ").replace(/ o /g, " / ").trim();
	}
	function getPrimaryTranslation(text) {
		const cleaned = removeParentheses(text || "");
		if (!cleaned) return cleaned;
		return cleaned.split("/")[0].trim();
	}
	function getCardTranslation(verbData) {
		return verbData && verbData.card_es || getPrimaryTranslation(verbData && verbData.es || "");
	}
	/** The card's translation, one line per alternative. */
	function getCardTranslationLines(verbData) {
		if (!verbData) return [];
		const text = verbData.card_es || getCardTranslation(verbData);
		if (!text) return [];
		return text.split(/[,/\n\r]+/).map((part) => part.trim()).filter((part) => part.length > 0);
	}
	// Deutsch_lernen/src/verben/verb-cache.ts
	/** Verb fields too large for the localStorage snapshot; the modal fetches them again when needed. */
	var HEAVY_VERB_DATA_KEYS = [
		"praesens_examples",
		"praeteritum_examples",
		"praesens_fragen",
		"wortfamilie"
	];
	function isVerbObject(value) {
		return Boolean(value) && typeof value === "object" && !Array.isArray(value);
	}
	/** Copies every verb without its heavy fields, so the snapshot fits in the storage quota. */
	function lightweightVerbData(source) {
		const snapshot = {};
		Object.entries(source ?? {}).forEach(([verbName, verbData]) => {
			if (!isVerbObject(verbData)) return;
			const compactVerbData = { ...verbData };
			HEAVY_VERB_DATA_KEYS.forEach((key) => delete compactVerbData[key]);
			snapshot[verbName] = compactVerbData;
		});
		return snapshot;
	}
	/** Narrows a cache payload to one level's groups and their verbs: the retry when the full one is too big. */
	function compactToLevel(payload, level) {
		const groups = payload.verbGroupsByLevel[level] ?? [];
		const verbs = {};
		groups.forEach((group) => {
			if (!group || !Array.isArray(group.verbs)) return;
			group.verbs.forEach((verbName) => {
				if (payload.allVerbsData[verbName]) verbs[verbName] = payload.allVerbsData[verbName];
			});
		});
		return {
			...payload,
			allVerbsData: verbs,
			verbGroupsByLevel: { [level]: groups }
		};
	}
	// Deutsch_lernen/src/verben/verb-data-merge.ts
	/** Root keys that are German pronouns: as objects they come from a rogue JSON structure and are skipped. */
	var PRONOUN_KEYS = [
		"es",
		"wir",
		"ihr",
		"sie"
	];
	var PROTECTED_STRING_KEYS = [
		"es",
		"en_verb",
		"level",
		"theme",
		"group"
	];
	/**
	* Copies `source` into `target` key by key, except objects under `ignoredObjectKeys` and core strings
	* (`es`, `en_verb`, `level`, `theme`, `group`) that `target` already has.
	*/
	function mergeVerbData(target, source, ignoredObjectKeys = PRONOUN_KEYS) {
		if (!source || typeof source !== "object") return;
		for (const [key, value] of Object.entries(source)) {
			if (ignoredObjectKeys.includes(key) && typeof value === "object") continue;
			if (PROTECTED_STRING_KEYS.includes(key) && typeof target[key] === "string" && target[key] !== "") continue;
			target[key] = value;
		}
	}
	/** Response body decoded as UTF-8 JSON, with mojibake repaired. */
	async function parseJsonUtf8(response) {
		const buffer = await response.arrayBuffer();
		const text = new TextDecoder("utf-8").decode(buffer);
		return normalizeMojibakeDeep(JSON.parse(text));
	}
	function getExampleLoadKey(verbName, tabId) {
		return `${verbName}::${tabId}`;
	}
	/** The modal calls the Präsens tab `infinitiv`; no tab means that one too. */
	function normalizeModalTabId(tabId) {
		return tabId === "praesens" ? "infinitiv" : tabId || "infinitiv";
	}
	/** Whether the examples (or conjugations) shown by `tabId` still have to be fetched for this verb. */
	function tabNeedsLazyExamples(verbName, verbData, tabId) {
		const normalizedTab = normalizeModalTabId(tabId);
		if (!verbData) return false;
		if (normalizedTab === "infinitiv") return !verbData.praesens_examples || !verbData.praesens_fragen;
		if (normalizedTab === "perfekt") return !verbData.perfekt_examples;
		if (normalizedTab === "praeteritum") return !verbData.praeteritum_conjugations || !verbData.praeteritum_examples;
		if (normalizedTab === "konjunktiv") return konjunktivVerbs.includes(verbName) && (!verbData.konjunktiv_ii || !verbData.konjunktiv_ii_examples);
		return false;
	}
	// Deutsch_lernen/src/verben/verb-forms.ts
	/** Perfekt without its auxiliary ("hat gemacht" → "gemacht"); `'---'` when missing. */
	function getCleanPerfekt(perfekt) {
		if (!perfekt || perfekt === "---") return "---";
		return perfekt.replace(/^(habe|hast|hat|haben|habt|bin|bist|ist|sind|seid|sein)\s+/i, "");
	}
	/** Präteritum without the "er/sie/es" label; `'---'` when missing. */
	function getCleanPraeteritum(praeteritum) {
		if (!praeteritum || praeteritum === "---") return "---";
		return praeteritum.replace(/^(er\/sie\/es)\s+/, "");
	}
	/** Verb form without personal or reflexive pronouns, for the tense buttons on the card back. */
	function cleanVerbForm(phrase) {
		if (!phrase) return "";
		return phrase.replace(/\b(er\/sie\/es|er|sie|es|ich|du|wir|ihr|Sie)\s+/gi, "").replace(/\b(sich|mich|dich|uns|euch)\s+/gi, "").trim().replace(/\s+/g, " ");
	}
	function withEnding(base, suffix) {
		if (suffix === "st") {
			if (base.endsWith("e")) return base + "st";
			if (base.endsWith("t") || base.endsWith("d")) return base + "est";
			return base + "st";
		}
		if (suffix === "n") {
			if (base.endsWith("en")) return base;
			if (base.endsWith("e")) return base + "n";
			return base + "en";
		}
		if (suffix === "t") {
			if (base.endsWith("t")) return base;
			if (base.endsWith("e")) return base + "t";
			if (base.endsWith("d")) return base + "et";
			return base + "t";
		}
		return base;
	}
	/**
	* Adds a person ending to the first word of a conjugated phrase for the card-back table, keeping a
	* separable prefix after it ("biege ab" + "st" → "biegest ab").
	*/
	function conjugateBaseForm(phrase, suffix) {
		if (!phrase) return "";
		const parts = phrase.replace(/^(ich|du|er\/sie\/es|wir|ihr|sie\/Sie)\s+/, "").split(/\s+/);
		const prefix = parts.slice(1).join(" ");
		const base = withEnding(parts[0], suffix);
		return prefix ? `${base} ${prefix}` : base;
	}
	// Deutsch_lernen/src/verben/legacy-globals.ts
	/** Helpers that `script.js` calls by their bare names, keyed by those names. */
	var legacyGlobals = {
		separablePrefixesMap,
		formatVerbPrefix,
		hexToRgb,
		rgbToHex,
		mixHexColors,
		normalizeMojibakeString,
		normalizeMojibakeDeep,
		normalizeSearchValue,
		findMatchingWordInText,
		findMatchingTextEntry,
		removeParentheses,
		getPrimaryTranslation,
		getCardTranslation,
		getCardTranslationLines,
		getCleanPerfekt,
		getCleanPraeteritum,
		cleanVerbForm,
		conjugateBaseForm,
		lightweightVerbData,
		compactToLevel,
		savedStories,
		germanOrdinals,
		germanExampleOrdinals,
		standardColors,
		konjunktivVerbs,
		physicalGroupData,
		globalGroupIndex,
		themeColorForVerb,
		levelsFromGroups,
		pageSizeForWidth,
		mergeVerbData,
		parseJsonUtf8,
		getExampleLoadKey,
		normalizeModalTabId,
		tabNeedsLazyExamples,
		highlightMatch,
		highlightBaseVerb,
		highlightVerbName,
		getMatchHint
	};
	// Deutsch_lernen/src/verben/verben-helpers.ts
	/**
	* Entry of `verben/A1_A2_B1/script/verben-helpers.js`, the classic script that `verben.html` loads before
	* `script.js`. The legacy script calls these helpers by their bare names, so they are published as globals
	* under exactly those names until the page itself becomes a module.
	*/
	var store = browserStore();
	migrateStorage(store);
	Object.assign(globalThis, legacyGlobals, { memoStorage: createMemoStorage(store) });
})();
