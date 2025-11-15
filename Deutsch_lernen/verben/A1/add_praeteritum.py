import json
import os

cards_path = r'json\cards'

# Diccionario con formas de Präteritum conocidas para verbos comunes
praeteritum_forms = {
    'sein': {'de': 'er/sie/es war', 'es': 'él/ella era/estaba', 'en': 'he/she/it was'},
    'haben': {'de': 'er/sie/es hatte', 'es': 'él/ella tenía', 'en': 'he/she/it had'},
    'werden': {'de': 'er/sie/es wurde', 'es': 'él/ella se volvía', 'en': 'he/she/it became'},
    'gehen': {'de': 'er/sie/es ging', 'es': 'él/ella fue/iba', 'en': 'he/she/it went'},
    'kommen': {'de': 'er/sie/es kam', 'es': 'él/ella vino/venía', 'en': 'he/she/it came'},
    'sehen': {'de': 'er/sie/es sah', 'es': 'él/ella vio/veía', 'en': 'he/she/it saw'},
    'geben': {'de': 'er/sie/es gab', 'es': 'él/ella dio/daba', 'en': 'he/she/it gave'},
    'nehmen': {'de': 'er/sie/es nahm', 'es': 'él/ella tomó/tomaba', 'en': 'he/she/it took'},
    'wissen': {'de': 'er/sie/es wusste', 'es': 'él/ella sabía', 'en': 'he/she/it knew'},
    'können': {'de': 'er/sie/es konnte', 'es': 'él/ella podía', 'en': 'he/she/it could'},
    'müssen': {'de': 'er/sie/es musste', 'es': 'él/ella debía', 'en': 'he/she/it had to'},
    'wollen': {'de': 'er/sie/es wollte', 'es': 'él/ella quería', 'en': 'he/she/it wanted'},
    'sollen': {'de': 'er/sie/es sollte', 'es': 'él/ella debería', 'en': 'he/she/it should'},
    'dürfen': {'de': 'er/sie/es durfte', 'es': 'él/ella podía', 'en': 'he/she/it was allowed'},
    'mögen': {'de': 'er/sie/es mochte', 'es': 'él/ella le gustaba', 'en': 'he/she/it liked'},
    'lassen': {'de': 'er/sie/es ließ', 'es': 'él/ella dejaba', 'en': 'he/she/it let'},
    'tun': {'de': 'er/sie/es tat', 'es': 'él/ella hacía', 'en': 'he/she/it did'},
    'fahren': {'de': 'er/sie/es fuhr', 'es': 'él/ella conducía/iba', 'en': 'he/she/it drove/went'},
    'sprechen': {'de': 'er/sie/es sprach', 'es': 'él/ella hablaba', 'en': 'he/she/it spoke'},
    'essen': {'de': 'er/sie/es aß', 'es': 'él/ella comía', 'en': 'he/she/it ate'},
    'trinken': {'de': 'er/sie/es trank', 'es': 'él/ella bebía', 'en': 'he/she/it drank'},
    'lesen': {'de': 'er/sie/es las', 'es': 'él/ella leía', 'en': 'he/she/it read'},
    'schreiben': {'de': 'er/sie/es schrieb', 'es': 'él/ella escribía', 'en': 'he/she/it wrote'},
    'heißen': {'de': 'er/sie/es hieß', 'es': 'él/ella se llamaba', 'en': 'he/she/it was called'},
    'finden': {'de': 'er/sie/es fand', 'es': 'él/ella encontraba', 'en': 'he/she/it found'},
    'schlafen': {'de': 'er/sie/es schlief', 'es': 'él/ella dormía', 'en': 'he/she/it slept'},
    'laufen': {'de': 'er/sie/es lief', 'es': 'él/ella corría', 'en': 'he/she/it ran'},
    'tragen': {'de': 'er/sie/es trug', 'es': 'él/ella llevaba', 'en': 'he/she/it wore/carried'},
    'helfen': {'de': 'er/sie/es half', 'es': 'él/ella ayudaba', 'en': 'he/she/it helped'},
    'treffen': {'de': 'er/sie/es traf', 'es': 'él/ella encontraba', 'en': 'he/she/it met'},
    'denken': {'de': 'er/sie/es dachte', 'es': 'él/ella pensaba', 'en': 'he/she/it thought'},
    'bringen': {'de': 'er/sie/es brachte', 'es': 'él/ella traía', 'en': 'he/she/it brought'},
    'kennen': {'de': 'er/sie/es kannte', 'es': 'él/ella conocía', 'en': 'he/she/it knew'},
    'nennen': {'de': 'er/sie/es nannte', 'es': 'él/ella nombraba', 'en': 'he/she/it named'},
    'stehen': {'de': 'er/sie/es stand', 'es': 'él/ella estaba de pie', 'en': 'he/she/it stood'},
    'verstehen': {'de': 'er/sie/es verstand', 'es': 'él/ella entendía', 'en': 'he/she/it understood'},
    'bekommen': {'de': 'er/sie/es bekam', 'es': 'él/ella recibía', 'en': 'he/she/it received'},
    'beginnen': {'de': 'er/sie/es begann', 'es': 'él/ella comenzaba', 'en': 'he/she/it began'},
    'gewinnen': {'de': 'er/sie/es gewann', 'es': 'él/ella ganaba', 'en': 'he/she/it won'},
    'verlieren': {'de': 'er/sie/es verlor', 'es': 'él/ella perdía', 'en': 'he/she/it lost'},
    'fliegen': {'de': 'er/sie/es flog', 'es': 'él/ella volaba', 'en': 'he/she/it flew'},
    'liegen': {'de': 'er/sie/es lag', 'es': 'él/ella yacía', 'en': 'he/she/it lay'},
    'singen': {'de': 'er/sie/es sang', 'es': 'él/ella cantaba', 'en': 'he/she/it sang'},
    'sitzen': {'de': 'er/sie/es saß', 'es': 'él/ella se sentaba', 'en': 'he/she/it sat'},
    'schließen': {'de': 'er/sie/es schloss', 'es': 'él/ella cerraba', 'en': 'he/she/it closed'},
    'rufen': {'de': 'er/sie/es rief', 'es': 'él/ella llamaba', 'en': 'he/she/it called'},
    'ziehen': {'de': 'er/sie/es zog', 'es': 'él/ella tiraba', 'en': 'he/she/it pulled'},
    'scheinen': {'de': 'er/sie/es schien', 'es': 'él/ella parecía/brillaba', 'en': 'he/she/it seemed/shone'},
    'bleiben': {'de': 'er/sie/es blieb', 'es': 'él/ella quedaba', 'en': 'he/she/it stayed'},
    'steigen': {'de': 'er/sie/es stieg', 'es': 'él/ella subía', 'en': 'he/she/it climbed'},
    'streiten': {'de': 'er/sie/es stritt', 'es': 'él/ella discutía', 'en': 'he/she/it argued'},
    'anziehen': {'de': 'er/sie/es zog an', 'es': 'él/ella se ponía', 'en': 'he/she/it put on'},
    'ausziehen': {'de': 'er/sie/es zog aus', 'es': 'él/ella se quitaba', 'en': 'he/she/it took off'},
    'zeigen': {'de': 'er/sie/es zeigte', 'es': 'él/ella mostraba', 'en': 'he/she/it showed'},
    'folgen': {'de': 'er/sie/es folgte', 'es': 'él/ella seguía', 'en': 'he/she/it followed'},
}

# Función para generar präteritum regular
def generate_regular_praeteritum(verb, es_translation):
    # Verbos regulares forman el präteritum con -te
    base = verb.rstrip('n').rstrip('e')
    praeteritum_de = f'er/sie/es {base}te'

    # Intentar conjugar la traducción al español en pasado imperfecto
    praeteritum_es = f'él/ella {es_translation.split("/")[0]}'
    if praeteritum_es.endswith('r'):
        praeteritum_es = praeteritum_es[:-1] + 'ba'

    praeteritum_en = f'he/she/it {es_translation}'

    return {
        'de': praeteritum_de,
        'es': praeteritum_es,
        'en': praeteritum_en
    }

count_irregular = 0
count_regular = 0
count_skipped = 0

# Procesar todos los verbos
for filename in os.listdir(cards_path):
    if filename.endswith('.json'):
        verb = filename.replace('.json', '')
        filepath = os.path.join(cards_path, filename)

        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)

        # Si el verbo ya tiene präteritum, saltarlo
        if 'praeteritum' in data:
            count_skipped += 1
            continue

        # Si está en el diccionario, usar esa forma
        if verb in praeteritum_forms:
            data['praeteritum'] = praeteritum_forms[verb]['de']
            data['es_praeteritum'] = praeteritum_forms[verb]['es']
            data['en_praeteritum'] = praeteritum_forms[verb]['en']
            count_irregular += 1
        else:
            # Generar forma regular
            es_translation = data.get('es', 'hacer')
            forms = generate_regular_praeteritum(verb, es_translation)
            data['praeteritum'] = forms['de']
            data['es_praeteritum'] = forms['es']
            data['en_praeteritum'] = forms['en']
            count_regular += 1

        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=4)

print(f'Verbos irregulares actualizados: {count_irregular}')
print(f'Verbos regulares generados: {count_regular}')
print(f'Verbos saltados (ya tenían präteritum): {count_skipped}')
print(f'Total: {count_irregular + count_regular + count_skipped}')
