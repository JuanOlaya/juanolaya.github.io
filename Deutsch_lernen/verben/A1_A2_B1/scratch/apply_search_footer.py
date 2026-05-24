import os

def main():
    script_path = r"c:\Users\juan\Documents\GitHub\juanolaya.github.io\Deutsch_lernen\verben\A1_A2_B1\script\script.js"
    with open(script_path, "r", encoding="utf-8") as f:
        content = f.read().replace('\r\n', '\n')

    target = """ cardHTML += `
 <div class="kompakt-row" data-verb="${verbName}" onclick="openModalForVerb('${verbName}')" title="Details anzeigen" style="cursor: pointer;">
 <div class="kompakt-german" onclick="event.stopPropagation(); window.speak('${verbName === 'geboren werden' ? 'geboren' : verbName}')" title="Aussprache hören" style="cursor: pointer; display: ${showGerman ? 'block' : 'none'};">${displayVerbName}${reflBadge}${datBadge}${intrBadge}${ikBadge}${lidBadge}${a1testBadge}</div>
 <div class="kompakt-translations">
 <div class="kompakt-spanish${isLong ? ' long-translation' : ''}" onclick="event.stopPropagation(); openModalForVerb('${verbName}')" title="Details anzeigen" style="cursor: pointer; display: ${showSpanish ? 'block' : 'none'};">${esTranslationDisplay}</div>
 <div class="kompakt-english" onclick="event.stopPropagation(); openModalForVerb('${verbName}')" title="Details anzeigen" style="cursor: pointer; display: ${showEnglish && enTranslationRaw ? 'block' : 'none'};">${enTranslationDisplay}</div>
 </div>
 </div>
 `;
 });

 cardHTML += `
 </div>
 </div>`;
 htmlFragments.push(cardHTML);"""

    replacement = """ cardHTML += `
 <div class="kompakt-row" data-verb="${verbName}" onclick="openModalForVerb('${verbName}')" title="Details anzeigen" style="cursor: pointer;">
 <div class="kompakt-german" onclick="event.stopPropagation(); window.speak('${verbName === 'geboren werden' ? 'geboren' : verbName}')" title="Aussprache hören" style="cursor: pointer; display: ${showGerman ? 'block' : 'none'};">${displayVerbName}${reflBadge}${datBadge}${intrBadge}${ikBadge}${lidBadge}${a1testBadge}</div>
 <div class="kompakt-translations">
 <div class="kompakt-spanish${isLong ? ' long-translation' : ''}" onclick="event.stopPropagation(); openModalForVerb('${verbName}')" title="Details anzeigen" style="cursor: pointer; display: ${showSpanish ? 'block' : 'none'};">${esTranslationDisplay}</div>
 <div class="kompakt-english" onclick="event.stopPropagation(); openModalForVerb('${verbName}')" title="Details anzeigen" style="cursor: pointer; display: ${showEnglish && enTranslationRaw ? 'block' : 'none'};">${enTranslationDisplay}</div>
 </div>
 </div>
 `;
 });

 const rawLevel = group.level || '';
 const formattedLevel = rawLevel.toUpperCase().replace(/([A-Z])(\\d).*/, '$1$2');
 const verbsLabelText = showEnglish ? 'verbs' : 'verbos';

 cardHTML += `
 </div>
 <div class="card-footer" style="background-color: ${themeColor};">
 <span class="card-footer-tag card-footer-level" style="border: none;">${formattedLevel}</span>
 <span class="card-footer-tag">${verbsLabelText}</span>
 </div>
 </div>`;
 htmlFragments.push(cardHTML);"""

    # Normalize newlines
    content_norm = content.replace("\r\n", "\n")
    target_norm = target.replace("\r\n", "\n")
    replacement_norm = replacement.replace("\r\n", "\n")

    if target_norm in content_norm:
        content_norm = content_norm.replace(target_norm, replacement_norm)
        with open(script_path, "w", encoding="utf-8", newline="\n") as f:
            f.write(content_norm)
        print("Success: Added footer to search compact mode cards.")
    else:
        print("Fail: Target not found.")

if __name__ == "__main__":
    main()
