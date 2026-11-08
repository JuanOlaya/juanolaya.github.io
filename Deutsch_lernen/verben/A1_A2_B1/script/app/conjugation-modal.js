/** Conjugation sub-modal and the Sätze section. Moved verbatim from script.js. */
import { state } from './state.js';


  // === REDESIGNED MODAL HELPERS ===

  export function restoreConjugationTables() {

    const praesensTable = document.getElementById('modal-praesens-table');

    const perfektTable = document.getElementById('modal-perfekt-examples-table');

    const praeteritumTable = document.getElementById('modal-praeteritum-konjugation-table');

    const konjunktivTable = document.getElementById('modal-konjunktiv-konjugation-table-tab');

    const praesensContainer = document.getElementById('praesens-details-container');

    const perfektContainer = document.getElementById('perfekt-examples-container');

    const praeteritumContainer = document.getElementById('praeteritum-konjugation-container');

    const konjunktivContainer = document.getElementById('konjunktiv-konjugation-container-tab');

    if (praesensTable && praesensContainer) {

      praesensContainer.appendChild(praesensTable);

    }

    if (perfektTable && perfektContainer) {

      perfektContainer.appendChild(perfektTable);

    }

    if (praeteritumTable && praeteritumContainer) {

      praeteritumContainer.appendChild(praeteritumTable);

    }

    if (konjunktivTable && konjunktivContainer) {

      konjunktivContainer.appendChild(konjunktivTable);

    }

  }

  export function closeConjugationSubModal() {

    const subModal = document.getElementById('conjugation-sub-modal');

    if (subModal) {

      subModal.classList.remove('visible');

    }

    restoreConjugationTables();

    // Deactivate active tab btn in footer

    document.querySelectorAll('.modal-tab-btn').forEach(btn => btn.classList.remove('active'));

  }

  export function openConjugationSubModal(tabId) {

    const subModal = document.getElementById('conjugation-sub-modal');

    const subModalTitle = document.getElementById('sub-modal-title');

    const subModalTableContainer = document.getElementById('sub-modal-table-container');

    const subModalNote = document.getElementById('sub-modal-note');

    if (!subModal || !subModalTitle || !subModalTableContainer || !subModalNote) return;

    // First restore any tables that were previously moved to the sub-modal

    restoreConjugationTables();

    subModalTableContainer.innerHTML = '';

    subModalNote.style.display = 'none';

    subModalNote.innerHTML = '';

    let titleText = '';

    let sourceTableId = '';

    let sourceNoteId = '';

    if (tabId === 'praesens') {

      titleText = `${state.currentVerbInModal} - Präsens`;

      sourceTableId = 'modal-praesens-table';

      sourceNoteId = 'modal-praesens-note';

    } else if (tabId === 'perfekt') {

      titleText = `${state.currentVerbInModal} - Perfekt`;

      sourceTableId = 'modal-perfekt-examples-table';

      sourceNoteId = 'modal-perfekt-note';

    } else if (tabId === 'praeteritum') {

      titleText = `${state.currentVerbInModal} - Präteritum`;

      sourceTableId = 'modal-praeteritum-konjugation-table';

      sourceNoteId = 'modal-praeteritum-note';

    } else if (tabId === 'konjunktiv') {

      titleText = `${state.currentVerbInModal} - Konjunktiv II`;

      sourceTableId = 'modal-konjunktiv-konjugation-table-tab';

    }

    const sourceTable = document.getElementById(sourceTableId);

    if (sourceTable) {

      subModalTableContainer.appendChild(sourceTable);

    }

    const sourceNote = document.getElementById(sourceNoteId);

    if (sourceNote && sourceNote.innerHTML.trim() !== '') {

      subModalNote.innerHTML = sourceNote.innerHTML;

      subModalNote.style.display = 'block';

    }

    subModalTitle.textContent = titleText;

    subModal.classList.add('visible');

  }

  export const renderSaetzeSection = (verbData) => {

    const container = document.getElementById('saetze-container');

    const contentEl = document.getElementById('saetze-content');

    if (!container || !contentEl) return;

    const hasSaetze = verbData.saetze && Object.keys(verbData.saetze).length > 0;

    const hasNote = !!(verbData.note || verbData.note_es);

    if (!hasSaetze && !hasNote) {

      container.style.display = 'none';

      return;

    }

    container.style.display = 'block';

    let contentHTML = '';

    // Render note if present

    if (hasNote) {

      let noteText = verbData.note_es || verbData.note;

      const a1testTag = verbData.case_tags ? verbData.case_tags.find(t => t.startsWith('A1')) : null;

      if (a1testTag) {

        const badgeHTML = `<span class="a1test-badge case-tag-${a1testTag}" style="display: inline-block; padding: 1.5px 5px; font-size: 0.74rem; border-radius: 4px; font-weight: 800; margin-right: 5px;">${a1testTag}</span>`;

        if (noteText.includes('<br>')) {

          noteText = noteText.replace('<br>', `<br>${badgeHTML} `);

        } else {

          noteText = badgeHTML + ' ' + noteText;

        }

      }

      contentHTML += `<div class="note-highlight-card">${noteText}</div>`;

    }

    // Render level-classified sentences/expressions

    if (hasSaetze) {

      const levels = ['A1', 'A2', 'B1'];

      levels.forEach(level => {

        const items = verbData.saetze[level];

        if (items && items.length > 0) {

          const levelCircle = level === 'A1' ? '🟢' : level === 'A2' ? '🟡' : '🟠';

          let levelName = '';

          if (level === 'A1') levelName = 'Acciones básicas';

          else if (level === 'A2') levelName = 'Vida cotidiana y estados';

          else if (level === 'B1') levelName = 'Expresiones idiomáticas y abstractas';

          contentHTML += `<div class="saetze-level-section">`;

          contentHTML += `<div class="saetze-level-header level-${level.toLowerCase()}">`;

          contentHTML += `<span>${levelCircle}</span> Nivel ${level} (${levelName})`;

          contentHTML += `</div>`;

          items.forEach(item => {

            contentHTML += `<div class="saetze-item">`;

            contentHTML += `<div class="saetze-expression-line">`;

            const safeExpr = item.expression.replace(/'/g, "\\'");

            contentHTML += `• <span class="saetze-expression-de" onclick="speak('${safeExpr}')" title="Aussprache hören">${item.expression}</span>: `;

            contentHTML += `<span class="saetze-expression-translation">${item.translation}</span>`;

            contentHTML += `</div>`;

            if (item.example) {

              contentHTML += `<div class="saetze-example-box">`;

              const safeEx = item.example.replace(/'/g, "\\'");

              contentHTML += `Ejemplo: "<span class="saetze-example-de" onclick="speak('${safeEx}')" title="Aussprache hören">${item.example}</span>"`;

              if (item.example_es) {

                contentHTML += ` <span class="saetze-example-translation">(${item.example_es})</span>`;

              }

              contentHTML += `</div>`;

            }

            contentHTML += `</div>`;

          });

          contentHTML += `</div>`;

        }

      });

    }

    contentEl.innerHTML = contentHTML;

  };

  // Bind close events for conjugation sub-modal

  export const subModal = document.getElementById('conjugation-sub-modal');

  export const closeSubModalX = document.getElementById('close-conjugation-modal-x');

/** Start-up listeners of this part of the page, attached in the original order by script.js. */
export function wireConjugationSubModal() {

  if (closeSubModalX && subModal) {

    closeSubModalX.addEventListener('click', closeConjugationSubModal);

    subModal.addEventListener('click', (e) => {

      if (e.target === subModal) closeConjugationSubModal();

    });

  }
}
