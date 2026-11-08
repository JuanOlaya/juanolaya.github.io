// Generated from Deutsch_lernen/src/verben/verben-helpers.ts by `npm run build:legacy-scripts`. Do not edit.
(function() {
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
	/** Applies {@link normalizeMojibakeString} to every string and object key of parsed JSON. */
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
	// Deutsch_lernen/src/verben/verben-helpers.ts
	/**
	* Entry of `verben/A1_A2_B1/script/verben-helpers.js`, the classic script that `verben.html` loads before
	* `script.js`. The legacy script calls these helpers by their bare names, so they are published as globals
	* under exactly those names until the page itself becomes a module.
	*/
	Object.assign(globalThis, {
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
		conjugateBaseForm
	});
})();
