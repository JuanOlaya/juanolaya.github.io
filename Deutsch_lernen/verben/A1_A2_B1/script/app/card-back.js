/** Compact card back side: verb details, menus, Wortschatz list and card dragging. Moved verbatim from script.js. */
import { loadVerbModalDeferredData, loadVerbPraesensData, maybeLoadExamplesForActiveTab } from './data-loading.js';
import { cardsContainer } from './shared.js';
import { state } from './state.js';


  // --- NEW INLINE CARD FLIP BODY TABS DETAILS CODE ---

  export const showVerbDetailsInCard = async function (verbName, cardEl) {

    const cardFront = cardEl.querySelector('.card-front');

    const cardBack = cardEl.querySelector('.card-back');

    if (!cardFront || !cardBack) return;

    cardFront.style.display = 'none';

    cardBack.style.display = 'flex';

    // Set initial loading layout

    cardBack.innerHTML = `

      <div class="card-back-header">

        <span class="card-back-level-badge">Lade...</span>

        <button class="card-back-close-btn">&times;</button>

        <h2 class="card-back-infinitive">${formatVerbPrefix(verbName)}</h2>

        <p class="card-back-translation"></p>

      </div>

      <div class="card-back-body">

        <p style="text-align: center; color: #94a3b8; font-size: 0.8rem; margin-top: 20px;">Lade Daten...</p>

      </div>

    `;

    cardBack.querySelector('.card-back-close-btn').onclick = (e) => {

      e.stopPropagation();

      cardBack.style.display = 'none';

      cardFront.style.display = 'flex';

    };

    // Load full verb data if not already fully loaded

    let data = state.allVerbsData[verbName];

    if (!data) return;

    // Load Praesens if needed

    if (!data.praesens) {

      try { await loadVerbPraesensData(verbName); } catch(e) {}

    }

    // Load Konjunktiv / Wortfamilie deferred data if needed

    if (!data.konjunktiv_ii || !data.wortfamilie) {

      try { await loadVerbModalDeferredData(verbName); } catch(e) {}

    }

    data = state.allVerbsData[verbName] || data;

    // Setup the card back HTML structure

    cardBack.innerHTML = `

      <div class="card-back-header">

        <span class="card-back-level-badge">${data.level || 'A1'}</span>

        <button class="card-back-close-btn">&times;</button>

        <h2 class="card-back-infinitive">${formatVerbPrefix(verbName)}</h2>

        <p class="card-back-translation">${data.spanishName || data.groupNameSpanish || data.es || ''}</p>

      </div>

      <div class="card-back-body">

        <div class="card-back-content-area" id="card-back-content-area-el"></div>

      </div>

    `;

    // Re-bind close button

    cardBack.querySelector('.card-back-close-btn').onclick = (e) => {

      e.stopPropagation();

      cardBack.style.display = 'none';

      cardFront.style.display = 'flex';

    };

    // Render the initial main card back menu

    window.renderCardBackMenu(verbName, cardEl);

  };

  export const renderCardBackMenu = function (verbName, cardEl) {
    const cardFront = cardEl.querySelector('.card-front');
    const cardBack = cardEl.querySelector('.card-back');
    if (!cardFront || !cardBack) return;
    const contentArea = cardBack.querySelector('#card-back-content-area-el');
    if (!contentArea) return;
    const data = state.allVerbsData[verbName];
    if (!data) return;

    // Configure top-right button as Close button (x)
    const actionBtn = cardBack.querySelector('#card-back-header-action-btn') || cardBack.querySelector('.card-back-close-btn');
    if (actionBtn) {
      actionBtn.innerHTML = `<svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>`;
      actionBtn.onclick = (e) => {
        e.stopPropagation();
        cardBack.style.display = 'none';
        cardFront.style.display = 'flex';
      };
    }

    const wfList = data.wortfamilie || [];
    const wfeldList = data.word_field || [];
    const hasVocab = wfList.length > 0 || wfeldList.length > 0;
    const saetze = data.saetze || {};
    const hasSaetze = Object.values(saetze).some(arr => arr && arr.length > 0);
    const hasNote = !!(data.note || data.note_es);
    const hasSaetzeSection = hasSaetze || hasNote;

    const praesensObj = data.praesens;
    const erPraesensRaw = praesensObj ? (praesensObj["er"] || praesensObj.er || '') : '';
    const erPraesens = cleanVerbForm(erPraesensRaw);

    const praeteritumForm = data.praeteritum || '';
    const erPraeteritum = cleanVerbForm(praeteritumForm);

    // Perfekt: REMOVE the auxiliary (only show the participle form)
    const perfektForm = data.perfekt || '';
    let erPerfekt = '';
    if (perfektForm) {
      const cleanPerf = perfektForm.replace(/^(hat|ist|haben|sein)\s+/gi, '');
      erPerfekt = cleanVerbForm(cleanPerf);
    }

    const konjunktivObj = data.konjunktiv_ii;
    const erKonjunktivRaw = konjunktivObj ? (konjunktivObj["er_sie_es"] || konjunktivObj["er/sie/es"] || konjunktivObj.er_sie_es || konjunktivObj.er || konjunktivObj.sie || konjunktivObj.es || '') : '';
    const erKonjunktiv = cleanVerbForm(erKonjunktivRaw);

    let html = "";

    // 1. Tense buttons container centered in the middle of the top space
    html += `<div style="display: flex; flex-direction: column; justify-content: center; flex-grow: 1;">`;
    html += `<div class="card-back-tenses-row">`;
    if (erPraesens) {
      html += `<button class="tense-menu-btn" data-target="zeit_praesens"><span class="tense-btn-word">${erPraesens}</span><span class="tense-btn-label">präsens</span></button>`;
    }
    if (erPerfekt) {
      html += `<button class="tense-menu-btn" data-target="zeit_perfekt"><span class="tense-btn-word">${erPerfekt}</span><span class="tense-btn-label">perfekt</span></button>`;
    }
    if (erPraeteritum) {
      html += `<button class="tense-menu-btn" data-target="zeit_praeteritum"><span class="tense-btn-word">${erPraeteritum}</span><span class="tense-btn-label">präteritum</span></button>`;
    }
    if (erKonjunktiv) {
      html += `<button class="tense-menu-btn" data-target="zeit_konjunktiv"><span class="tense-btn-word">${erKonjunktiv}</span><span class="tense-btn-label">konj. ii</span></button>`;
    }
    html += `</div></div>`;

    // 2. Wortschatz and Sätze buttons container at the bottom
    html += `<div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 12px; margin-top: auto;">`;

    // Wortschatz button (full width with orange triangle)
    if (hasVocab) {
      html += `
        <button class="card-back-menu-btn" data-target="wortschatz">
          <span class="btn-left">📚 Wortschatz</span>
          <span class="btn-triangle">▶</span>
        </button>
      `;
    }

    // Sätze button (full width with orange triangle)
    if (hasSaetzeSection) {
      html += `
        <button class="card-back-menu-btn" data-target="saetze">
          <span class="btn-left">📝 Sätze</span>
          <span class="btn-triangle">▶</span>
        </button>
      `;
    }

    html += `</div>`;
    contentArea.innerHTML = html;
    setTimeout(() => {
      const cb = document.querySelector(".card-back");
      const cbb = document.querySelector(".card-back-body");
      const cbca = document.querySelector(".card-back-content-area");
      if (cb && cbb && cbca) {
        console.log("DEBUG LAYOUT:", {
          cardBackHeight: cb.offsetHeight,
          bodyHeight: cbb.offsetHeight,
          contentAreaHeight: cbca.offsetHeight,
          bodyComputedStyleDisplay: window.getComputedStyle(cbb).display,
          bodyComputedStyleFlexDirection: window.getComputedStyle(cbb).flexDirection,
          contentAreaComputedStyleHeight: window.getComputedStyle(cbca).height,
          contentAreaComputedStyleDisplay: window.getComputedStyle(cbca).display,
          childrenInfo: Array.from(cbca.children).map((child, idx) => ({
            index: idx,
            tagName: child.tagName,
            offsetHeight: child.offsetHeight,
            marginTop: window.getComputedStyle(child).marginTop,
            marginBottom: window.getComputedStyle(child).marginBottom,
            flexGrow: window.getComputedStyle(child).flexGrow,
            display: window.getComputedStyle(child).display
          }))
        });
      }
    }, 100);

    // Reset scroll to top
    const bodyEl = cardBack.querySelector('.card-back-body');
    if (bodyEl) bodyEl.scrollTop = 0;

    // Bind click events for navigation
    const menuBtns = contentArea.querySelectorAll('.tense-menu-btn, .card-back-menu-btn');
    menuBtns.forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const target = btn.dataset.target;
        window.renderCardBackTabContent(verbName, cardEl, target);
      };
    });
  };

  export const renderCardBackTabContent = function (verbName, cardEl, tabId) {
    const cardBack = cardEl.querySelector('.card-back');
    if (!cardBack) return;
    const contentArea = cardBack.querySelector('#card-back-content-area-el');
    if (!contentArea) return;
    const data = state.allVerbsData[verbName];
    if (!data) return;

    // Configure top-right button as Back button (larr/flip icon)
    const actionBtn = cardBack.querySelector('#card-back-header-action-btn') || cardBack.querySelector('.card-back-close-btn');
    if (actionBtn) {
      actionBtn.innerHTML = `<svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>`;
      actionBtn.onclick = (e) => {
        e.stopPropagation();
        window.renderCardBackMenu(verbName, cardEl);
      };
    }

    // Reset scroll to top of sub-screen
    const bodyEl = cardBack.querySelector('.card-back-body');
    if (bodyEl) bodyEl.scrollTop = 0;

    if (tabId.startsWith('zeit_')) {
      const tenseId = tabId.replace('zeit_', ''); // 'praesens', 'praeteritum', 'perfekt', 'konjunktiv'
      
      // Determine available tenses in order
      const tensesOrder = [];
      if (data.praesens) tensesOrder.push('praesens');
      if (data.perfekt) tensesOrder.push('perfekt');
      if (data.praeteritum) tensesOrder.push('praeteritum');
      
      const konjunktivObj = data.konjunktiv_ii;
      const erKonjunktivRaw = konjunktivObj ? (konjunktivObj["er_sie_es"] || konjunktivObj["er/sie/es"] || konjunktivObj.er_sie_es || konjunktivObj.er || konjunktivObj.sie || konjunktivObj.es || '') : '';
      const erKonjunktiv = cleanVerbForm(erKonjunktivRaw);
      if (erKonjunktiv) tensesOrder.push('konjunktiv');

      const currentIdx = tensesOrder.indexOf(tenseId);
      const prevTense = currentIdx > 0 ? tensesOrder[currentIdx - 1] : null;
      const nextTense = currentIdx < tensesOrder.length - 1 ? tensesOrder[currentIdx + 1] : null;

      let title = '';
      if (tenseId === 'praesens') title = 'Präsens';
      else if (tenseId === 'praeteritum') title = 'Präteritum';
      else if (tenseId === 'perfekt') title = 'Perfekt';
      else if (tenseId === 'konjunktiv') title = 'Konjunktiv II';

      contentArea.innerHTML = `
        <div style="margin-top: 10px; margin-bottom: 15px;">
          <div class="tense-nav-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <button class="tense-nav-arrow-btn prev-tense-btn" style="background: none; border: none; color: #94a3b8; font-size: 1.25rem; cursor: pointer; padding: 4px 12px; transition: color 0.2s; visibility: ${prevTense ? 'visible' : 'hidden'};" title="Vorherige Zeitform">◀</button>
            <h3 style="color: #ffffff; font-size: 1.15rem; font-weight: 700; margin: 0;">${title}</h3>
            <button class="tense-nav-arrow-btn next-tense-btn" style="background: none; border: none; color: #94a3b8; font-size: 1.25rem; cursor: pointer; padding: 4px 12px; transition: color 0.2s; visibility: ${nextTense ? 'visible' : 'hidden'};" title="Nächste Zeitform">▶</button>
          </div>
          <div class="tiempos-full-table-wrapper" id="card-back-subtab-table-el"></div>
        </div>
      `;

      // Bind arrow navigation clicks
      const prevBtn = contentArea.querySelector('.prev-tense-btn');
      if (prevBtn && prevTense) {
        prevBtn.onclick = (e) => {
          e.stopPropagation();
          window.renderCardBackTabContent(verbName, cardEl, 'zeit_' + prevTense);
        };
        prevBtn.onmouseover = () => { prevBtn.style.color = '#ffffff'; };
        prevBtn.onmouseout = () => { prevBtn.style.color = '#94a3b8'; };
      }
      
      const nextBtn = contentArea.querySelector('.next-tense-btn');
      if (nextBtn && nextTense) {
        nextBtn.onclick = (e) => {
          e.stopPropagation();
          window.renderCardBackTabContent(verbName, cardEl, 'zeit_' + nextTense);
        };
        nextBtn.onmouseover = () => { nextBtn.style.color = '#ffffff'; };
        nextBtn.onmouseout = () => { nextBtn.style.color = '#94a3b8'; };
      }

      window.renderCardBackSubTabTable(verbName, cardEl, tenseId);
    } else if (tabId === 'wortschatz') {
      const wfList = data.wortfamilie || [];
      const wfeldList = data.word_field || [];
      let activeVocab = window.activeWortschatzTab?.[verbName] || (wfList.length > 0 ? 'wf' : 'wfeld');
      let togglesHTML = `
        <div class="wortschatz-toggles-container">
          ${wfList.length > 0 ? `<button class="wortschatz-toggle-btn ${activeVocab === 'wf' ? 'active' : ''}" data-vocab="wf">Wortfamilie</button>` : ''}
          ${wfeldList.length > 0 ? `<button class="wortschatz-toggle-btn ${activeVocab === 'wfeld' ? 'active' : ''}" data-vocab="wfeld">Wortfeld</button>` : ''}
        </div>
        <div id="wortschatz-vocab-list-el"></div>
      `;
      contentArea.innerHTML = togglesHTML;
      const toggleBtns = contentArea.querySelectorAll('.wortschatz-toggle-btn');
      toggleBtns.forEach(btn => {
        btn.onclick = (e) => {
          e.stopPropagation();
          toggleBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          const vocabId = btn.dataset.vocab;
          if (!window.activeWortschatzTab) window.activeWortschatzTab = {};
          window.activeWortschatzTab[verbName] = vocabId;
          window.renderWortschatzList(verbName, cardEl, vocabId);
        };
      });
      window.renderWortschatzList(verbName, cardEl, activeVocab);
    } else if (tabId === 'saetze') {
      let html = '<div>';
      let note = data.note_es || data.note || '';
      if (note) {
        const a1testTag = data.case_tags ? data.case_tags.find(t => t.startsWith('A1')) : null;
        if (a1testTag) {
          const badgeHTML = `<span class="a1test-badge case-tag-${a1testTag}" style="display: inline-block; padding: 1.5px 5px; font-size: 0.74rem; border-radius: 4px; font-weight: 800; margin-right: 5px;">${a1testTag}</span>`;
          if (note.includes('<br>')) {
            note = note.replace('<br>', `<br>${badgeHTML} `);
          } else {
            note = badgeHTML + ' ' + note;
          }
        }
        html += `<div style="background: rgba(255,255,255,0.05); padding: 6px; border-radius: 6px; font-size: 0.74rem; margin-bottom: 6px; font-style: italic; color: #cbd5e1;">${note}</div>`;
      }
      const saetze = data.saetze || {};
      ['A1', 'A2', 'B1'].forEach(lvl => {
        const items = saetze[lvl] || [];
        if (items.length > 0) {
          html += `<div style="margin-top: 6px; font-weight: bold; font-size: 0.76rem; color: #38bdf8;">Nivel ${lvl}:</div>`;
          items.forEach(item => {
            html += `
              <div class="card-back-info-text card-back-saetze-item">
                <strong>${item.expression}</strong>: ${item.translation}
                ${item.example ? `<br><span style="color:#cbd5e1;">Ex: "${item.example}"</span>` : ''}
              </div>
            `;
          });
        }
      });
      html += '</div>';
      contentArea.innerHTML = html || '<p style="font-size: 0.76rem; color: #94a3b8; margin-top: 4px;">Keine Sätze vorhanden.</p>';
    }
  };

  export const renderWortschatzList = function (verbName, cardEl, vocabId) {

    const cardBack = cardEl.querySelector('.card-back');

    if (!cardBack) return;

    const vocabListEl = cardBack.querySelector('#wortschatz-vocab-list-el');

    if (!vocabListEl) return;

    const data = state.allVerbsData[verbName];

    if (!data) return;

    if (vocabId === 'wf') {

      const list = data.wortfamilie || [];

      vocabListEl.innerHTML = list.map(item => `

        <div class="card-back-info-text card-back-wf-item">

          <strong>${item.word}</strong> (${item.type}):<br>

          <span style="color: #cbd5e1;">${item.es}</span>

        </div>

      `).join('');

    } else if (vocabId === 'wfeld') {

      const list = data.word_field || [];

      vocabListEl.innerHTML = list.map(item => `

        <div class="card-back-info-text card-back-wfeld-item">

          <strong>${item.word}</strong>:<br>

          <span style="color: #cbd5e1;">${item.meaning}</span>

        </div>

      `).join('');

    }

  };

  export const renderCardBackSubTabTable = async function (verbName, cardEl, subTabId) {

    const cardBack = cardEl.querySelector('.card-back');

    if (!cardBack) return;

    const tableWrapper = cardBack.querySelector('#card-back-subtab-table-el');

    if (!tableWrapper) return;

    const data = state.allVerbsData[verbName];

    if (!data) return;

    let conjObj = null;

    let tenseExamplesKey = subTabId;

    if (subTabId === 'praesens') {

      conjObj = data.praesens || data;

    } else if (subTabId === 'perfekt') {

      let perfForm = data.perfekt || '';

      perfForm = perfForm.replace(/^(hat|ist)\s+/, '');

      const aux = data.auxiliary || 'haben';

      const isSein = aux.includes('sein') || (data.perfekt && data.perfekt.startsWith('ist'));

      const auxIch = isSein ? 'bin' : 'habe';

      const auxDu = isSein ? 'bist' : 'hast';

      const auxEr = isSein ? 'ist' : 'hat';

      const auxWir = isSein ? 'sind' : 'haben';

      const auxIhr = isSein ? 'seid' : 'habt';

      const auxSie = isSein ? 'sind' : 'haben';

      conjObj = data.perfekt_conj || {

        "ich": `${auxIch} ${perfForm}`,

        "du": `${auxDu} ${perfForm}`,

        "er/sie/es": `${auxEr} ${perfForm}`,

        "wir": `${auxWir} ${perfForm}`,

        "ihr": `${auxIhr} ${perfForm}`,

        "sie/Sie": `${auxSie} ${perfForm}`

      };

    } else if (subTabId === 'praeteritum') {

      const praetPhrase = data.praeteritum || '';

      conjObj = data.praeteritum_conj || {

        "ich": conjugateBaseForm(praetPhrase, ''),

        "du": conjugateBaseForm(praetPhrase, 'st'),

        "er/sie/es": conjugateBaseForm(praetPhrase, ''),

        "wir": conjugateBaseForm(praetPhrase, 'n'),

        "ihr": conjugateBaseForm(praetPhrase, 't'),

        "sie/Sie": conjugateBaseForm(praetPhrase, 'n')

      };

    } else if (subTabId === 'konjunktiv') {

      conjObj = data.konjunktiv_ii;

    }

    let conjugationHTML = '';

    if (conjObj) {

      const erSieEsForm = conjObj["er/sie/es"] || conjObj.er_sie_es || conjObj.er || conjObj.sie || conjObj.es || '';

      const sieSieForm = conjObj["sie/Sie"] || conjObj.sie_Sie || conjObj["sie (plural)"] || conjObj["Sie (formal)"] || conjObj.sie || '';

      conjugationHTML = `

        <table>
          <tbody>

            <tr><td><span class="pronoun-de">ich</span></td><td><span class="conj-de-form">${conjObj.ich || ''}</span></td></tr>

            <tr><td><span class="pronoun-de">du</span></td><td><span class="conj-de-form">${conjObj.du || ''}</span></td></tr>

            <tr><td><span class="pronoun-de">er</span></td><td><span class="conj-de-form">${erSieEsForm}</span></td></tr>

            <tr><td><span class="pronoun-de">sie</span></td><td><span class="conj-de-form">${erSieEsForm}</span></td></tr>

            <tr><td><span class="pronoun-de">es</span></td><td><span class="conj-de-form">${erSieEsForm}</span></td></tr>

            <tr><td><span class="pronoun-de">wir</span></td><td><span class="conj-de-form">${conjObj.wir || ''}</span></td></tr>

            <tr><td><span class="pronoun-de">ihr</span></td><td><span class="conj-de-form">${conjObj.ihr || ''}</span></td></tr>

            <tr><td><span class="pronoun-de">sie</span></td><td><span class="conj-de-form">${sieSieForm}</span></td></tr>

            <tr><td><span class="pronoun-de">Sie</span></td><td><span class="conj-de-form">${sieSieForm}</span></td></tr>

          </tbody>

        </table>

      `;

    }

    try {

      await maybeLoadExamplesForActiveTab(verbName, tenseExamplesKey);

    } catch(e) {}

    const examples = state.allVerbsData[verbName]?.examples?.[tenseExamplesKey] || [];

    let exampleHTML = '';

    if (examples && examples.length > 0) {

      const firstEx = examples[0];

      const exDe = firstEx.de || firstEx.example_de || '';

      const exEs = firstEx.es || firstEx.example_es || '';

      if (exDe) {

        exampleHTML = `

          <div style="margin-top: 6px; padding: 6px; background-color: rgba(255,255,255,0.03); border: 1px solid #334155; border-radius: 6px;">

            <p class="example-de" onclick="speak('${exDe.replace(/'/g, "\\'")}')" style="font-size:0.76rem; margin:0;" title="Aussprache hören">${exDe}</p>

            ${exEs ? `<p class="example-translation" style="font-size:0.72rem; margin:0; color:#94a3b8; font-style:italic;">(${exEs})</p>` : ''}

          </div>

        `;

      }

    }

    tableWrapper.innerHTML = conjugationHTML + exampleHTML;

  };

    export function getPageSizeAndDevice() {
    return pageSizeForWidth(window.innerWidth);
  }

export function setupCardDrag(cardElement) {
    const { isDesktop } = getPageSizeAndDevice();
    if (isDesktop) return; // Disable card dragging on desktop!

    if (cardElement.dataset.dragSetup === 'true') return;
    cardElement.dataset.dragSetup = 'true';
    let startX = 0;
    let currentX = 0;
    let isDragging = false;
    let hasMoved = false;
    const threshold = 80;

    // Mouse events disabled on desktop

    // Touch events
    cardElement.addEventListener('touchstart', startDrag, { passive: true });
    window.addEventListener('touchmove', drag, { passive: false });
    window.addEventListener('touchend', endDrag);

    function startDrag(e) {
      if (e.target.closest('button') || e.target.closest('input') || e.target.closest('a') || e.target.closest('.settings-info-btn') || e.target.closest('.kompakt-header-de') || e.target.closest('.kompakt-header-es')) {
        return;
      }
      isDragging = true;
      hasMoved = false;
      startX = e.type.startsWith('touch') ? e.touches[0].clientX : e.clientX;
      currentX = startX;
    }

    function drag(e) {
      if (!isDragging) return;
      currentX = e.type.startsWith('touch') ? e.touches[0].clientX : e.clientX;
      const deltaX = currentX - startX;
      
      if (Math.abs(deltaX) > 8) {
        if (!hasMoved) {
          cardElement.style.transition = 'none';
          hasMoved = true;
        }
        cardElement.style.transform = `translateX(${deltaX}px) rotate(${deltaX * 0.03}deg)`;
        if (e.cancelable) e.preventDefault();
      }
    }

    function endDrag() {
      if (!isDragging) return;
      isDragging = false;
      
      if (!hasMoved) {
        return;
      }
      
      const deltaX = currentX - startX;
      console.log("[endDrag] deltaX:", deltaX, "threshold:", threshold, "currentCompactCardIndex:", window.currentCompactCardIndex);
      cardElement.style.transition = 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';

      const { pageSize } = getPageSizeAndDevice();

      if (deltaX < -threshold) {
        // Next page
        const nextDisabled = window.currentCompactCardIndex + pageSize >= window.allCompactCards.length;
        if (!nextDisabled) {
          cardElement.style.transform = 'translateX(-150%) rotate(-15deg)';
          setTimeout(() => {
            window.currentCompactCardIndex = Math.min(
              window.allCompactCards.length - pageSize,
              window.currentCompactCardIndex + pageSize
            );
            window.updateCompactView();
          }, 150);
        } else {
          cardElement.style.transform = 'translateX(0) rotate(0)';
        }
      } else if (deltaX > threshold) {
        // Previous page
        const prevDisabled = window.currentCompactCardIndex === 0;
        if (!prevDisabled) {
          cardElement.style.transform = 'translateX(150%) rotate(15deg)';
          setTimeout(() => {
            window.currentCompactCardIndex = Math.max(0, window.currentCompactCardIndex - pageSize);
            window.updateCompactView();
          }, 150);
        } else {
          cardElement.style.transform = 'translateX(0) rotate(0)';
        }
      } else {
        cardElement.style.transform = 'translateX(0) rotate(0)';
      }
    }
  }

  export const updateCompactView = function() {
    cardsContainer.innerHTML = '';
    const grid = document.createElement('div');
    grid.className = 'kompakt-grid';
    const { pageSize, isPhone } = getPageSizeAndDevice();

    const maxIndex = Math.max(0, window.allCompactCards.length - pageSize);
    if (window.currentCompactCardIndex < 0) window.currentCompactCardIndex = 0;
    if (window.currentCompactCardIndex > maxIndex) {
      window.currentCompactCardIndex = maxIndex;
    }

    const visibleCards = window.allCompactCards.slice(
      window.currentCompactCardIndex,
      window.currentCompactCardIndex + pageSize
    );

    visibleCards.forEach(card => {
      card.style.transform = 'none';
      card.style.transition = 'none';
      
      // Calculate responsive card width to fit perfectly on different screens
      const margin = 10;
      const containerWidth = window.innerWidth * 0.95;
      const calculatedWidth = Math.floor(containerWidth / pageSize) - (margin * 2);
      const finalWidth = Math.max(280, Math.min(350, calculatedWidth));
      card.style.width = `${finalWidth}px`;
      card.style.maxWidth = '90vw';
      card.style.flexShrink = '0';
      
      grid.appendChild(card);
      setupCardDrag(card); // Enable swipe/drag navigation!
    });

    cardsContainer.appendChild(grid);

    // Create bottom navigation bar
    const navBar = document.createElement('div');
    navBar.className = 'compact-nav-bar';

    const prevBtn = document.createElement('button');
    prevBtn.className = 'compact-nav-btn back-btn';
    prevBtn.innerHTML = 'Back';
    const prevDisabled = window.currentCompactCardIndex === 0;
    if (prevDisabled) prevBtn.disabled = true;

    const nextBtn = document.createElement('button');
    nextBtn.className = 'compact-nav-btn next-btn';
    nextBtn.innerHTML = 'Next';
    const nextDisabled = window.currentCompactCardIndex + pageSize >= window.allCompactCards.length;
    if (nextDisabled) nextBtn.disabled = true;

    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'compact-nav-dots';

    const totalPages = Math.ceil(window.allCompactCards.length / pageSize);
    const currentPage = (maxIndex === 0) ? 0 : Math.round((window.currentCompactCardIndex / maxIndex) * (totalPages - 1));

    if (isPhone) {
      const pageIndicator = document.createElement('span');
      pageIndicator.className = 'compact-nav-pages';
      pageIndicator.textContent = `${currentPage + 1} / ${totalPages}`;
      dotsContainer.appendChild(pageIndicator);
    } else {
      for (let i = 0; i < totalPages; i++) {
        const dot = document.createElement('div');
        dot.className = `compact-dot ${i === currentPage ? 'active' : ''}`;
        dot.onclick = () => {
          window.currentCompactCardIndex = Math.min(maxIndex, i * pageSize);
          window.updateCompactView();
        };
        dotsContainer.appendChild(dot);
      }
    }

    prevBtn.onclick = () => {
      window.currentCompactCardIndex = Math.max(0, window.currentCompactCardIndex - pageSize);
      window.updateCompactView();
    };

    nextBtn.onclick = () => {
      window.currentCompactCardIndex = Math.min(
        window.allCompactCards.length - pageSize,
        window.currentCompactCardIndex + pageSize
      );
      window.updateCompactView();
    };

    navBar.appendChild(prevBtn);
    navBar.appendChild(dotsContainer);
    navBar.appendChild(nextBtn);

    const oldNavBar = document.querySelector('.compact-nav-bar');
    if (oldNavBar) oldNavBar.remove();
    cardsContainer.parentNode.insertBefore(navBar, cardsContainer.nextSibling);
  };
