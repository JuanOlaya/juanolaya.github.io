const fs = require('fs');
let f = fs.readFileSync('mengenpronomen.html', 'utf8');

const regex = /<!-- A2 LEVEL -->[\s\S]*?<tr onclick="openWordModal\('zu viele',/g;
const replacement = `<!-- A2 LEVEL -->
            <div class="level-card">
                <div class="level-header a2">
                    <span>A2 &ndash; Expansi&oacute;n</span>
                </div>
                <div class="level-content">
                    <table>
                        <tbody>
                            <tr onclick="openWordModal('ein paar', 'unos pocos / un par', 'Ich kenne ein paar.', 'Conozco a unos pocos.')">
                                <td>
                                    <div class="german-word" style="text-transform: none;">ein paar</div>
                                </td>
                                <td class="spanish-word">
                                    unos pocos / un par <span class="word-level-tag level-tag-a">A2</span>
                                </td>
                            </tr>
                            <tr onclick="openWordModal('jemand', 'alguien', 'Jemand wartet drau&szlig;en.', 'Alguien espera afuera.')">
                                <td>
                                    <div class="german-word">jemand</div>
                                </td>
                                <td class="spanish-word">
                                    alguien <span class="word-level-tag level-tag-a">A2</span>
                                </td>
                            </tr>
                            <tr onclick="openWordModal('niemand', 'nadie', 'Niemand ist zu Hause.', 'Nadie est&aacute; en casa.')">
                                <td>
                                    <div class="german-word">niemand</div>
                                </td>
                                <td class="spanish-word">
                                    nadie <span class="word-level-tag level-tag-a">A2</span>
                                </td>
                            </tr>
                            <tr onclick="openWordModal('einige', 'algunos', 'Einige fehlen heute.', 'Algunos faltan hoy.')">
                                <td>
                                    <div class="german-word">einige</div>
                                </td>
                                <td class="spanish-word">
                                    algunos <span class="word-level-tag level-tag-a">A2</span>
                                </td>
                            </tr>
                            <tr onclick="openWordModal('manche', 'algunos / unos', 'Manche m&ouml;gen Kaffee.', 'A algunos les gusta el caf&eacute;.')">
                                <td>
                                    <div class="german-word">manche</div>
                                </td>
                                <td class="spanish-word">
                                    algunos / unos <span class="word-level-tag level-tag-a">A2</span>
                                </td>
                            </tr>
                            <tr onclick="openWordModal('beide, beiden, alle beide', 'ambos / los dos', 'Beide sind da. Ich helfe beiden.', 'Ambos est&aacute;n aqu&iacute;. Ayudo a ambos.')">
                                <td>
                                    <div class="german-word" data-speak="beide, beiden, alle beide">beide / beiden / alle beide</div>
                                </td>
                                <td class="spanish-word">
                                    ambos / los dos <span class="word-level-tag level-tag-a">A2</span>
                                </td>
                            </tr>
                            <tr onclick="openWordModal('die meisten', 'la mayor&iacute;a', 'Die meisten arbeiten hier.', 'La mayor&iacute;a trabaja aqu&iacute;.')">
                                <td>
                                    <div class="german-word">die meisten</div>
                                </td>
                                <td class="spanish-word">
                                    la mayor&iacute;a <span class="word-level-tag level-tag-a">A2</span>
                                </td>
                            </tr>
                            <tr onclick="openWordModal('genug', 'suficiente', 'Genug ist genug.', 'Suficiente es suficiente.')">
                                <td>
                                    <div class="german-word">genug</div>
                                </td>
                                <td class="spanish-word">
                                    suficiente <span class="word-level-tag level-tag-a">A2</span>
                                </td>
                            </tr>
                            <tr onclick="openWordModal('meistens', 'la mayor&iacute;a de las veces / generalmente', 'Meistens trinke ich Kaffee.', 'Generalmente bebo caf&eacute;.')">
                                <td>
                                    <div class="german-word">meistens</div>
                                </td>
                                <td class="spanish-word">
                                    la mayor&iacute;a de las veces / generalmente <span class="word-level-tag level-tag-a">A2</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="card-footer a2"><span class="card-footer-tag card-footer-level">A2</span><span class="card-footer-tag">Goethe</span></div>
            </div>
            <!-- B1 LEVEL -->
            <div class="level-card">
                <div class="level-header b1">
                    <span>B1 &ndash; Intermedio</span>
                </div>
                <div class="level-content">
                    <table>
                        <tbody>
                            <tr onclick="openWordModal('mehrere', 'varios', 'Mehrere haben gefragt.', 'Varios han preguntado.')">
                                <td>
                                    <div class="german-word">mehrere</div>
                                </td>
                                <td class="spanish-word">
                                    varios <span class="word-level-tag level-tag-b">B1</span>
                                </td>
                            </tr>
                            <tr onclick="openWordModal('zu viele',`;

f = f.replace(regex, replacement);
fs.writeFileSync('mengenpronomen.html', f);
